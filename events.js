(() => {
  "use strict";

  const API = "https://eyjjmacxxcmdzkfqxifo.supabase.co/rest/v1";
  const KEY = "sb_publishable_6ZnjmE7NccV2hrOOZ-FeNQ_OvP3rLlS";
  const grid = document.getElementById("eventsGrid");
  const count = document.getElementById("eventCount");

  function showMessage(message, retry) {
    if (!grid) return;
    grid.replaceChildren();
    const box = document.createElement("div");
    box.className = "service-loading";
    box.setAttribute("role", "status");
    box.textContent = message;
    if (retry) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "primary";
      button.textContent = "إعادة المحاولة";
      button.addEventListener("click", loadEvents);
      box.append(document.createTextNode(" "), button);
    }
    grid.appendChild(box);
  }

  function formatMoney(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return "";
    return amount.toLocaleString("en-US") + " IQD";
  }

  function makeCard(promo, gamesBySlug) {
    const slug = String(promo.game || "");
    const game = gamesBySlug.get(slug);
    const card = document.createElement("a");
    card.className = "neo-game-card";
    card.href = game ? "game.html?game=" + encodeURIComponent(game.slug) : "shop.html";
    card.setAttribute("aria-label", (promo.title || "عرض GameRush") + " — " + (game?.name || "تسوق الآن"));

    if (game?.image_url) {
      const image = document.createElement("img");
      image.src = game.image_url;
      image.alt = game.name || "صورة اللعبة";
      image.loading = "lazy";
      image.decoding = "async";
      image.onerror = () => image.remove();
      card.appendChild(image);
    }

    const details = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = promo.title || "عرض خاص";
    details.appendChild(heading);

    const gameName = document.createElement("small");
    gameName.textContent = game?.name || slug || "عرض GameRush";
    details.appendChild(gameName);

    if (promo.package_name) {
      const pack = document.createElement("p");
      pack.textContent = "الباقة: " + promo.package_name;
      details.appendChild(pack);
    }

    const discount = document.createElement("b");
    discount.textContent = "خصم " + formatMoney(promo.discount_iqd);
    if (Number(promo.discount_iqd) > 0) details.appendChild(discount);

    const action = document.createElement("span");
    action.className = "neo-more";
    action.textContent = game ? "اختار الباقة ↗" : "تصفح المتجر ↗";
    details.appendChild(action);
    card.appendChild(details);
    return card;
  }

  async function loadEvents() {
    if (!grid) return;
    if (count) count.textContent = "…";
    showMessage("جاري تحميل العروض…");
    try {
      const now = new Date().toISOString();
      const headers = { apikey: KEY, Authorization: "Bearer " + KEY };
      const promoUrl = API + "/promotions?select=title,game,package_name,discount_iqd,starts_at,ends_at&active=eq.true&starts_at=lte." + encodeURIComponent(now) + "&ends_at=gt." + encodeURIComponent(now) + "&order=discount_iqd.desc";
      const gamesUrl = API + "/game_catalog?select=slug,name,image_url&active=eq.true";
      const [promoResponse, gamesResponse] = await Promise.all([
        fetch(promoUrl, { headers }),
        fetch(gamesUrl, { headers })
      ]);
      if (!promoResponse.ok || !gamesResponse.ok) throw new Error("تعذر جلب البيانات");
      const [promos, games] = await Promise.all([promoResponse.json(), gamesResponse.json()]);
      const validPromos = Array.isArray(promos) ? promos.filter(p =>
        p && p.active !== false &&
        Number(p.discount_iqd) >= 0 &&
        p.starts_at && p.ends_at &&
        Date.parse(p.starts_at) <= Date.now() &&
        Date.parse(p.ends_at) > Date.now()
      ) : [];
      if (count) count.textContent = String(validPromos.length);
      if (!validPromos.length) {
        showMessage("ماكو عروض فعّالة حالياً. تابع المتجر حتى تشوف الباقات المتاحة.");
        return;
      }
      const gamesBySlug = new Map((Array.isArray(games) ? games : []).map(game => [game.slug, game]));
      grid.replaceChildren(...validPromos.map(promo => makeCard(promo, gamesBySlug)));
    } catch (error) {
      if (count) count.textContent = "—";
      showMessage("تعذر تحميل العروض حالياً. حاول مرة ثانية.", true);
    }
  }

  loadEvents();
})();