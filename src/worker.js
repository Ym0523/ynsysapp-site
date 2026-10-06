// アクセスされたドメインで振り分ける。
// - 会社ホームページ（トップとデモ）の正式な場所は yodakiya.com
// - 学校向け案内・利用規約・プライバシーポリシーは ynsysapp.com のまま
//   （Google の同意画面や学校のフィルタリングにこのURLで登録しているため動かさない）
const HP_HOST = 'yodakiya.com';
const APP_HOST = 'ynsysapp.com';
// yodakiya.com がこのWorkerにつながって表示できるようになるまで false（true にすると ynsysapp.com のトップ・デモを転送する）
const HP_LIVE = false;
const APP_PATHS = ['/school/', '/terms/', '/privacy/', '/shukketsu/'];
// どちらのドメインでもそのまま返すもの（アイコン）
const SHARED = ['/favicon.ico', '/favicon.svg', '/favicon-48.png', '/apple-touch-icon.png'];
// ドメインごとに中身を変えるもの（検索エンジン向け）
const APP_FILES = { '/robots.txt': '/robots-app.txt', '/sitemap.xml': '/sitemap-app.xml' };

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
