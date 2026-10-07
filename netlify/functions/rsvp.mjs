// Netlify Function: saytdagi RSVP formasini Telegram botga yo'naltiradi.
// Manzil: /.netlify/functions/rsvp
// Netlify > Site settings > Environment variables ichida BOT_TOKEN va CHAT_ID ni kiriting.
// CHAT_ID bir nechta bo'lishi mumkin, vergul bilan: "123456789,987654321".
// Har bir odam avval botda Start bosgan bo'lishi kerak, aks holda unga xabar bormaydi.
// Token faqat shu yerda ishlatiladi, brauzerga chiqmaydi.

const MAX_NAME = 80;
const MAX_NOTE = 300;

const escapeHtml = (value) =>
  value.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]);

const reply = (body, status) => Response.json(body, { status });

export default async (request) => {
  if (request.method !== "POST") {
    return reply({ error: "method_not_allowed" }, 405);
  }

  let data;
  try {
    data = await request.json();
  } catch (_error) {
    return reply({ error: "bad_request" }, 400);
  }

  // Botlar ko'rinmas "website" maydonini to'ldiradi: jimgina qabul qilingandek javob beramiz.
  if (data.website) {
    return reply({ ok: true }, 200);
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const note = typeof data.note === "string" ? data.note.trim().slice(0, MAX_NOTE) : "";
  const attending = data.attending === true;

  if (!name || name.length > MAX_NAME || typeof data.attending !== "boolean") {
    return reply({ error: "invalid" }, 400);
  }

  const { BOT_TOKEN } = process.env;
  const chatIds = (process.env.CHAT_ID || "").split(",").map((id) => id.trim()).filter(Boolean);
  if (!BOT_TOKEN || !chatIds.length) {
    return reply({ error: "not_configured" }, 500);
  }

  const lines = [
    attending ? "✅ <b>Keladi</b>" : "❌ <b>Kela olmaydi</b>",
    `👤 ${escapeHtml(name)}`,
  ];
  if (note) {
    lines.push(`💬 ${escapeHtml(note)}`);
  }

  const text = lines.join("\n");
  const results = await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      })
        .then((telegram) => telegram.ok)
        .catch(() => false)
    )
  );

  // Kamida bitta chatga yetib borgan bo'lsa, mehmonga muvaffaqiyat qaytaramiz.
  if (!results.some(Boolean)) {
    return reply({ error: "telegram_failed" }, 502);
  }

  return reply({ ok: true }, 200);
};
