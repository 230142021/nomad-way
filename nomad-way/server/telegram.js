'use strict';
// Sends notifications to the site owner's Telegram via a bot.
// Set TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID (your chat id) in the environment.

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function enabled() {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

async function send(html) {
  if (!enabled()) return false;
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error('Telegram API ' + res.status + ': ' + (await res.text()).slice(0, 200));
  return true;
}

function contactMessage(m) {
  return [
    '<b>📩 Новое сообщение с сайта Nomad Way</b>',
    '',
    `<b>Имя:</b> ${esc(m.name)}`,
    `<b>Email:</b> ${esc(m.email)}`,
    m.subject ? `<b>Тема:</b> ${esc(m.subject)}` : null,
    '',
    esc(m.message)
  ].filter(x => x !== null).join('\n');
}

module.exports = { enabled, send, contactMessage };
