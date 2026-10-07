// Cloudflare Worker: saytdagi RSVP formasini Telegram botga yo'naltiradi.
// Bot tokeni faqat shu yerda (secret sifatida) saqlanadi, brauzerga chiqmaydi.
//
// Sozlash (worker/ papkasida):
//   1. npx wrangler secret put BOT_TOKEN   -> @BotFather bergan token
//   2. npx wrangler secret put CHAT_ID     -> xabar boradigan chat ID (botga /start bosing)
//   3. wrangler.toml ichida ALLOWED_ORIGIN ni sayt manziliga o'zgartiring
//   4. npx wrangler deploy                 -> chiqqan URL ni script.js dagi RSVP_ENDPOINT ga yozing

const MAX_NAME = 80;
const MAX_NOTE = 300;
const MAX_GUESTS = 10;

const escapeHtml = (value) =>
  value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]);

function reply(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };

    const origin = request.headers.get("Origin");
    if (env.ALLOWED_ORIGIN !== "*" && origin !== env.ALLOWED_ORIGIN) {
      return reply({ error: "forbidden" }, 403, cors);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return reply({ error: "method_not_allowed" }, 405, cors);
    }

    let data;
    try {
      data = await request.json();
    } catch (_error) {
      return reply({ error: "bad_request" }, 400, cors);
    }

    // Botlar ko'rinmas "website" maydonini to'ldiradi: jimgina qabul qilgandek javob beramiz.
    if (data.website) {
      return reply({ ok: true }, 200, cors);
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const note = typeof data.note === "string" ? data.note.trim().slice(0, MAX_NOTE) : "";
    const attending = data.attending === true;
    const guests = Number(data.guests);

    if (!name || name.length > MAX_NAME || typeof data.attending !== "boolean") {
      return reply({ error: "invalid" }, 400, cors);
    }
    if (attending && !(Number.isInteger(guests) && guests >= 1 && guests <= MAX_GUESTS)) {
      return reply({ error: "invalid" }, 400, cors);
    }

    const lines = [
      attending ? "✅ <b>Keladi</b>" : "❌ <b>Kela olmaydi</b>",
      `👤 ${escapeHtml(name)}`,
    ];
    if (attending) {
      lines.push(`👥 Mehmonlar soni: ${guests}`);
    }
    if (note) {
      lines.push(`💬 ${escapeHtml(note)}`);
    }

    try {
      const telegram = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: lines.join("\n"), parse_mode: "HTML" }),
      });
      if (!telegram.ok) {
        return reply({ error: "telegram_failed" }, 502, cors);
      }
    } catch (_error) {
      return reply({ error: "telegram_unreachable" }, 502, cors);
    }

    return reply({ ok: true }, 200, cors);
  },
};
