import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GAMECORE_BASE = (Deno.env.get("GAMECORE_API_BASE") || "https://api.gamecore-api.tech").replace(/\/$/, "");
const GAMECORE_KEY = (Deno.env.get("GAMECORE_API_KEY") || "").trim();

const db = createClient(SUPABASE_URL, SERVICE_KEY);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function authorized(req: Request) {
  // This function uses the service-role client and can reconcile provider orders.
  // A publishable API key is public, so it must never authorize this privileged action.
  return (req.headers.get("authorization") || "") === `Bearer ${SERVICE_KEY}`;
}

async function readProviderConfig() {
  const { data, error } = await db.from("fulfillment_providers")
    .select("code,enabled,config")
    .eq("code", "gamecore")
    .maybeSingle();
  if (error) throw new Error("provider lookup failed");
  return data;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: true, service: "fulfillment-reconcile" });
  if (!authorized(req)) return json({ error: "Unauthorized" }, 401);
  if (!GAMECORE_KEY) return json({ error: "GameCore key is not configured" }, 503);

  try {
    const provider = await readProviderConfig();
    if (!provider?.enabled) return json({ ok: true, skipped: "provider_disabled" });

    const now = Date.now();
    const cutoff = new Date(now - 2 * 60 * 1000).toISOString();

    const { data: jobs, error: jobsError } = await db.from("fulfillment_jobs")
      .select("id,order_id,external_reference,status,attempts,last_error,updated_at")
      .eq("provider", "gamecore")
      .eq("status", "processing")
      .not("external_reference", "is", null)
      .lt("updated_at", cutoff)
      .order("updated_at", { ascending: true })
      .limit(20);

    if (jobsError) throw new Error("job lookup failed");

    const result = { scanned: jobs?.length || 0, completed: 0, failed: 0, pending: 0, errors: 0 };

    for (const job of jobs || []) {
      const code = String(job.external_reference || "").trim();
      if (!code) continue;

      let response: Response;
      try {
        response = await fetch(`${GAMECORE_BASE}/b2b/orders/${encodeURIComponent(code)}`, {
          method: "GET",
          headers: { "X-Api-Key": GAMECORE_KEY, "Accept": "application/json" },
        });
      } catch {
        result.errors++;
        continue;
      }

      if (response.status === 401 || response.status === 403 || response.status >= 500) {
        result.errors++;
        continue;
      }

      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.success || !body?.data) {
        if (response.status === 404) {
          await db.from("fulfillment_jobs").update({
            last_error: "GameCore order not found during reconciliation",
            locked_at: null,
            updated_at: new Date().toISOString()
          }).eq("id", job.id);
        }
        result.errors++;
        continue;
      }

      const remote = body.data;
      const remoteStatus = String(remote.status || "");
      const items = Array.isArray(remote.items) ? remote.items : [];
      const completedItems = items.filter((x: any) => x?.status === "completed").length;
      const failedItems = items.filter((x: any) => x?.status === "failed").length;

      if (remoteStatus === "completed") {
        const { error: e1 } = await db.from("fulfillment_jobs").update({
          status: "completed",
          completed_at: remote.completedAt || new Date().toISOString(),
          locked_at: null,
          last_error: null,
          updated_at: new Date().toISOString()
        }).eq("id", job.id).eq("status", "processing");

        if (!e1) {
          await db.from("orders").update({
            fulfillment_status: "completed",
            status: "completed"
          }).eq("id", job.order_id).eq("payment_status", "verified");
          result.completed++;
        }
      } else if (remoteStatus === "failed") {
        const failedMessages = items
          .filter((x: any) => x?.status === "failed")
          .map((x: any) => [x?.errorCode, x?.errorMessage].filter(Boolean).join(": "))
          .filter(Boolean);
        const reason = (`GameCore order failed${failedItems ? ` (${failedItems}/${items.length} items failed)` : ""}${failedMessages.length ? ": " + failedMessages.join(" | ") : ""}`).slice(0, 1000);

        const { error: e1 } = await db.from("fulfillment_jobs").update({
          status: "failed",
          locked_at: null,
          last_error: reason,
          updated_at: new Date().toISOString()
        }).eq("id", job.id).eq("status", "processing");

        if (!e1) {
          await db.from("orders").update({
            fulfillment_status: "failed",
            status: "processing",
            notes: reason
          }).eq("id", job.order_id).eq("payment_status", "verified");
          result.failed++;
        }
      } else {
        await db.from("fulfillment_jobs").update({
          locked_at: null,
          last_error: null,
          updated_at: new Date().toISOString()
        }).eq("id", job.id).eq("status", "processing");
        result.pending++;
      }
    }

    return json({ ok: true, ...result });
  } catch (e) {
    console.error("reconciliation failed", e);
    return json({ error: "Reconciliation failed" }, 500);
  }
});