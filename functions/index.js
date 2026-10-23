const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {defineSecret} = require("firebase-functions/params");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();
const TELEGRAM_BOT_TOKEN = defineSecret("TELEGRAM_BOT_TOKEN");
const TELEGRAM_ADMIN_CHAT_ID = defineSecret("TELEGRAM_ADMIN_CHAT_ID");

async function sendTelegram(text, token, chatId) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({chat_id: chatId, text, disable_web_page_preview: true})
  });
  if (!response.ok) throw new Error(`Telegram API returned ${response.status}`);
}
function fmtOrder(o) {
  const items = (o.items || []).map(i => `• ${i.name} ×${i.qty}${i.variant ? ` (${i.variant})` : ""}`).join("\n");
  return `🛒 SMOKE HUB — nowe zapytanie\nNr: ${o.id || "(id dokumentu)"}\nKlient: ${o.name}\nTelefon: ${o.phone}\nDostawa: ${o.deliveryLabel || o.delivery || "-"}\n${items}\nSuma: ${o.total} PLN\nStatus: ${o.status}`;
}
exports.notifyNewOrder = onDocumentCreated({
  document: "orders/{orderId}",
  secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID]
}, async (event) => {
  const o = event.data && event.data.data();
  if (!o) return;
  await sendTelegram(fmtOrder({...o, id: event.params.orderId}), TELEGRAM_BOT_TOKEN.value(), TELEGRAM_ADMIN_CHAT_ID.value());
});
exports.notifyOrderStatus = onDocumentUpdated({
  document: "orders/{orderId}",
  secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID]
}, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  if (!before || !after || before.status === after.status) return;
  await sendTelegram(`🔄 SMOKE HUB — status zamówienia\nNr: ${event.params.orderId}\n${before.status} → ${after.status}\nKlient: ${after.name || "-"}`, TELEGRAM_BOT_TOKEN.value(), TELEGRAM_ADMIN_CHAT_ID.value());
});
