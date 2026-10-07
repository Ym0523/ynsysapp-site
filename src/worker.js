// アクセスされたドメインで振り分ける。
// - 会社ホームページ（トップとデモ）の正式な場所は yodakiya.com
// - 学校向け案内・利用規約・プライバシーポリシーは ynsysapp.com のまま
//   （Google の同意画面や学校のフィルタリングにこのURLで登録しているため動かさない）
const HP_HOST = 'yodakiya.com';
const APP_HOST = 'ynsysapp.com';
// true＝ynsysapp.com のトップ・デモを yodakiya.com へ転送する（2026-10-06 yodakiya.com 接続確認後に有効化）
const HP_LIVE = true;
const APP_PATHS = ['/school/', '/terms/', '/privacy/', '/shukketsu/'];
// どちらのドメインでもそのまま返すもの（アイコン）
const SHARED = ['/favicon.ico', '/favicon.svg', '/favicon-48.png', '/apple-touch-icon.png'];
// ドメインごとに中身を変えるもの（検索エンジン向け）
const APP_FILES = { '/robots.txt': '/robots-app.txt', '/sitemap.xml': '/sitemap-app.xml' };

// ===== 問い合わせフォーム（POST /api/contact） =====
// 受け取った内容を確かめてから、info@yodakiya.com の Google Apps Script（docs/contact-gas.gs）へ渡してメールにする。
// 渡し先URLと合言葉は Cloudflare の「変数とシークレット」に置く（公開リポジトリには書かない）：
//   CONTACT_GAS_URL … Apps Script のウェブアプリURL
//   CONTACT_SECRET  … Apps Script 側と同じ合言葉
const CONTACT_TYPES = ['業務アプリ開発のご相談', 'ホームページ作成・保守について', 'AI・DX、セミナーのご相談', 'その他'];
const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+$/;

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

async function handleContact(request, env) {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method' });
  const origin = request.headers.get('origin') || '';
  const allowed = ['https://' + HP_HOST, 'http://127.0.0.1:8787', 'http://localhost:8787'];
  if (origin && !allowed.includes(origin)) return json(403, { ok: false, error: 'origin' });
  let d;
  try { d = await request.json(); } catch { return json(400, { ok: false, error: 'json' }); }
  const s = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const name = s(d.name, 100), email = s(d.email, 200), type = s(d.type, 50), body = s(d.body, 4000);
  // ロボット対策：見えない入力欄に何か入っている／画面を開いてから3秒未満で送信 → 受け付けたふりをして捨てる
  if (s(d.website, 200) || !(Number(d.elapsed) >= 3000)) return json(200, { ok: true });
  if (!name || !EMAIL_RE.test(email) || !CONTACT_TYPES.includes(type)) return json(400, { ok: false, error: 'invalid' });
  if (!env.CONTACT_GAS_URL || !env.CONTACT_SECRET) return json(503, { ok: false, error: 'not_configured' });
  try {
    const r = await fetch(env.CONTACT_GAS_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.CONTACT_SECRET, name, email, type, body, ua: request.headers.get('user-agent') || '' }),
      redirect: 'follow',
    });
    const t = await r.text();
    if (!r.ok || !/"ok"\s*:\s*true/.test(t)) return json(502, { ok: false, error: 'relay' });
    return json(200, { ok: true });
  } catch {
    return json(502, { ok: false, error: 'relay' });
  }
}

function moveTo(url, host) {
  url.hostname = host;
  url.protocol = 'https:';
  url.port = '';
  return Response.redirect(url.toString(), 301);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    const isAppPath = APP_PATHS.some((p) => url.pathname === p.slice(0, -1) || url.pathname.startsWith(p));

    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (SHARED.includes(url.pathname)) return env.ASSETS.fetch(request);
    if (host === APP_HOST && APP_FILES[url.pathname]) {
      url.pathname = APP_FILES[url.pathname];
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }
    if (host === 'www.' + HP_HOST) return moveTo(url, HP_HOST);
    if (HP_LIVE && (host === APP_HOST || host === 'www.' + APP_HOST) && !isAppPath) return moveTo(url, HP_HOST);
    if (host === 'www.' + APP_HOST && isAppPath) return moveTo(url, APP_HOST);
    if (host === HP_HOST && isAppPath) return moveTo(url, APP_HOST);
    if (!HP_LIVE && host === 'www.' + APP_HOST) return moveTo(url, APP_HOST);

    return env.ASSETS.fetch(request);
  },
};
