import { Webhook } from "npm:standardwebhooks@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-webhook-id, x-webhook-signature, x-webhook-timestamp",
};

const required = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing configuration: ${name}`);
  return value;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { http_code: 405, message: "Method not allowed" } }), {
      status: 405, headers: { "content-type": "application/json", ...corsHeaders },
    });
  }

  try {
    const rawBody = await req.text();
    const hookSecret = required("SEND_SMS_HOOK_SECRET").replace(/^v1,whsec_/, "");
    new Webhook(hookSecret).verify(rawBody, Object.fromEntries(req.headers.entries()));

    const event = JSON.parse(rawBody);
    const phone = event?.user?.phone;
    const otp = event?.sms?.otp;

    if (!/^\+\d{7,15}$/.test(phone || "") || !/^\d{4,10}$/.test(otp || "")) {
      throw new Error("Invalid SMS hook payload");
    }

    const accountSid = required("TWILIO_ACCOUNT_SID");
    const authToken = required("TWILIO_AUTH_TOKEN");
    const verifyServiceSid = required("TWILIO_VERIFY_SERVICE_SID");

    const form = new URLSearchParams({
      to: phone,
      channel: "sms",
      customCode: otp,
    });

    const twilioResponse = await fetch(
      `https://verify.twilio.com/v2/Services/${encodeURIComponent(verifyServiceSid)}/Verifications`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form,
      },
    );

    if (!twilioResponse.ok) {
      const detail = await twilioResponse.text();
      console.error("Twilio Verify rejected request:", detail);
      return new Response(JSON.stringify({
        error: {
          http_code: twilioResponse.status === 429 ? 429 : 502,
          message: "تعذر إرسال رمز التحقق حالياً. حاول مرة أخرى.",
        },
      }), {
        status: twilioResponse.status === 429 ? 429 : 502,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }

    return new Response(null, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("send-sms-hook:", error);
    return new Response(JSON.stringify({
      error: { http_code: 500, message: "تعذر إرسال رمز التحقق حالياً." },
    }), {
      status: 500, headers: { "content-type": "application/json", ...corsHeaders },
    });
  }
});