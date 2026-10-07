// サービスページ（/homepage/ /line-yoyaku/ /pos/ /faq/）を生成する。
// ヘッダーとフッターは public/index.html から切り出して使うので、トップを直したらこれを実行し直す。
//   node tools/build-pages.cjs
const fs = require('fs');
const path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const index = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
const cut = (a, b) => { const i = index.indexOf(a); const j = index.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found: ' + a); return index.slice(i, j + b.length); };
const HEADER = cut('<header>', '</header>');
const FOOTER = cut('<footer>', '</footer>');
const LINE = 'https://lin.ee/w3bAPYd';
const BUBBLE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.8-3.4 7.9-5.8C21.4 14.4 22 12.8 22 11c0-4.4-4.5-8-10-8z"/></svg>';
const CTA = `<div class="hero-cta">
        <a class="btn btn-line" href="${LINE}" target="_blank" rel="noopener">${BUBBLE}LINEで気軽に相談する</a>
        <a class="btn btn-ghost" href="/#contact">フォームでお問い合わせ</a>
      </div>`;
const CTA_BAND = (title, sub) => `<section>
  <div class="wrap">
    <div class="cta-band reveal">
      <div><h2>${title}</h2><p>${sub}</p></div>
      ${CTA}
    </div>
  </div>
</section>`;

function page({ slug, title, description, crumb, h1, lead, body, ld = [] }) {
  const url = `https://yodakiya.com/${slug}/`;
  const graph = [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'よだき屋', item: 'https://yodakiya.com/' },
      { '@type': 'ListItem', position: 2, name: crumb, item: url } ] },
    ...ld,
  ];
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="https://yodakiya.com/assets/og.png">
<meta property="og:site_name" content="よだき屋">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Inter:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>

${HEADER}

<main>
<section class="page-hero">
  <div class="wrap">
    <p class="breadcrumb"><a href="/">よだき屋</a> ／ ${crumb}</p>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
    ${CTA}
  </div>
</section>

${body}
</main>

${FOOTER}

<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}

const service = (name, url, desc, extra = {}) => ({ '@type': 'Service', name, url, description: desc, serviceType: name,
  provider: { '@type': 'Organization', name: 'よだき屋', url: 'https://yodakiya.com/' },
  areaServed: { '@type': 'AdministrativeArea', name: '宮崎県' }, ...extra });

const pages = [];

// ===== ホームページ制作 =====
pages.push(page({
  slug: 'homepage',
  title: '宮崎のホームページ制作｜5万円から・保守月3,000円〜｜よだき屋',
  description: '宮崎県全域対応のホームページ制作。小さなお店・会社向けに、スマホで見やすいホームページを5万円からつくります。保守は月3,000円〜、契約の縛りなし、データは全部お渡しします。',
  crumb: 'ホームページ制作',
  h1: '宮崎のホームページ制作',
  lead: '小さなお店や会社のホームページを、スマホで見やすい形で5万円からつくります。宮崎県内ならどこでも、対面またはオンラインでご相談いただけます。',
  ld: [service('ホームページ制作', 'https://yodakiya.com/homepage/', '宮崎県の小さなお店・会社向けのホームページ制作と保守。', {
    offers: [
      { '@type': 'Offer', name: 'ホームページ作成', price: '50000', priceCurrency: 'JPY', description: '1ページ構成の目安。内容により変わります。' },
      { '@type': 'Offer', name: 'ホームページ保守', price: '3000', priceCurrency: 'JPY', description: '月額。' } ] })],
  body: `<section>
  <div class="wrap">
    <div class="eyebrow reveal">For you</div>
    <h2 class="reveal">こんな方からご相談をいただいています</h2>
    <ul class="checks reveal">
      <li>はじめてホームページを作りたい</li>
      <li>今のホームページが古く、スマホで見にくい</li>
      <li>制作会社に払っている保守費が高い・何をしてもらっているか分からない</li>
      <li>ホームページのデータを渡してもらえない</li>
      <li>Googleマップや検索から、もっとお客様に見つけてほしい</li>
      <li>予約や問い合わせを、電話以外でも受けたい</li>
    </ul>
  </div>
</section>

<section style="background:var(--bg-soft)">
  <div class="wrap">
    <div class="eyebrow reveal">Price</div>
    <h2 class="reveal">料金の目安</h2>
    <table class="price-table reveal">
      <tr><th>ホームページ作成</th><td><b>50,000円〜</b><br>1ページ構成（お店の紹介・メニューや料金・アクセス・お問い合わせ）の目安です。ページ数や内容に合わせてお見積りします。</td></tr>
      <tr><th>保守</th><td><b>月額 3,000円〜</b><br>文章や写真の差し替え、営業時間やメニューの更新など、公開後の更新をお引き受けします。</td></tr>
      <tr><th>ドメイン・サーバー</th><td>実費（お客様名義で取得できます）</td></tr>
    </table>
    <p class="note">※ 契約期間の縛りはありません。保守をやめるときも、サイトのデータは全部お渡しします。</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow reveal">Included</div>
    <h2 class="reveal">標準でおこなうこと</h2>
    <div class="feature-grid">
      <div class="feature reveal"><h3>スマホ・パソコン両対応</h3><p>お客様の多くはスマホで見ています。小さな画面でも読みやすく、電話やLINEにすぐつながる作りにします。</p></div>
      <div class="feature reveal"><h3>検索・Googleマップの基本設定</h3><p>Googleに正しく読み取ってもらうための設定と、Search Console の登録、Googleビジネスプロフィールとのつなぎ込みをおこないます。</p></div>
      <div class="feature reveal"><h3>お問い合わせの導線</h3><p>フォーム・公式LINE・電話など、お店に合った連絡方法を用意します。フォームの内容はメールでお店に届きます。</p></div>
      <div class="feature reveal"><h3>独自ドメインとSSL</h3><p>お店の名前のアドレス（〇〇.com など）で公開し、通信を暗号化します。</p></div>
      <div class="feature reveal"><h3>データは全部お渡し</h3><p>完成したサイトのデータは一式お渡しします。将来ほかの会社に頼むことになっても、そのまま使えます。</p></div>
      <div class="feature reveal"><h3>予約システムとの組み合わせ</h3><p>サロンや飲食店なら、<a href="/line-yoyaku/">LINE予約システム</a>と組み合わせて「見る→予約する」までをひと続きにできます。</p></div>
    </div>
  </div>
</section>

<section style="background:var(--bg-soft)">
  <div class="wrap">
    <div class="eyebrow reveal">Flow</div>
    <h2 class="reveal">制作の流れ</h2>
    <ol class="flow">
      <li class="reveal"><h3>お問い合わせ</h3><p>フォームやLINEで、気軽にご連絡ください。</p></li>
      <li class="reveal"><h3>お話を聞く</h3><p>お店のこと、載せたい内容、お客様の層などを伺います。</p></li>
      <li class="reveal"><h3>ご提案・お見積り</h3><p>ページの構成と費用をお伝えします。納得いただけたら進めます。</p></li>
      <li class="reveal"><h3>制作・公開</h3><p>確認していただきながら仕上げ、公開後の更新もお手伝いします。</p></li>
    </ol>
  </div>
</section>

${CTA_BAND('ホームページのこと、まずは気軽にご相談ください', '「何から決めればいいか分からない」段階でも大丈夫です。')}`,
}));

// ===== LINE予約 =====
pages.push(page({
  slug: 'line-yoyaku',
  title: 'LINE予約システム｜宮崎のサロン・飲食店向け 月3,000円〜｜よだき屋',
  description: 'お客様はLINEから予約、お店はスマホで確認。宮崎のサロン・飲食店向けのLINE予約システムです。初期0円・月額3,000円〜。電話に出られない時間の予約を逃しません。実際に動くデモもご覧いただけます。',
  crumb: 'LINE予約システム',
  h1: 'LINE予約システム<br>（サロン・飲食店向け）',
  lead: 'お客様はいつものLINEから空き状況を見て予約、お店はスマホで予約を確認・承認。施術中や調理中で電話に出られない時間の予約も逃しません。',
  ld: [service('LINE予約システム', 'https://yodakiya.com/line-yoyaku/', 'LINE公式アカウントから予約できる、サロン・飲食店向けの予約システム。', {
    offers: { '@type': 'Offer', name: 'LINE予約システム', price: '3000', priceCurrency: 'JPY', description: '初期0円・月額3,000円〜。内容によりお見積り。' } })],
  body: `<section>
  <div class="wrap">
    <div class="eyebrow reveal">Features</div>
    <h2 class="reveal">できること</h2>
    <div class="feature-grid">
      <div class="feature reveal"><h3>LINEからそのまま予約</h3><p>お店のLINE公式アカウントから、メニューと空いている日時を選んで予約できます。アプリのインストールや会員登録はいりません。</p></div>
      <div class="feature reveal"><h3>二重予約を防ぐ</h3><p>施術時間や片付けの時間も含めて空き枠を計算するので、予約が重なりません。休みや臨時休業もすぐ反映できます。</p></div>
      <div class="feature reveal"><h3>前日のお知らせ</h3><p>予約の前日に、お客様のLINEへ自動でお知らせを送ります。うっかり忘れによるキャンセルを減らせます。</p></div>
      <div class="feature reveal"><h3>電話予約もまとめて管理</h3><p>電話で受けた予約もお店の画面から登録でき、LINEの予約と一つの台帳で見られます。</p></div>
      <div class="feature reveal"><h3>会計・売上・カルテ</h3><p>会計の記録、月ごと・メニューごとの売上、施術メモ（カルテ）まで、必要なものだけ追加できます。</p></div>
      <div class="feature reveal"><h3>ホットペッパー併用にも対応</h3><p>ホットペッパービューティーの予約通知を取り込み、LINE予約とのダブルブッキングを防いだ実績があります。</p></div>
    </div>
    <p class="note reveal">飲食店向けには、席数・人数に合わせた空き管理（複数の卓をまとめて予約するなど）にも対応しています。</p>
  </div>
</section>

<section style="background:var(--bg-soft)">
  <div class="wrap">
    <div class="eyebrow reveal">Demo</div>
    <h2 class="reveal">実際に触って試せます</h2>
    <div class="prose reveal">
      <p>架空のサロン「ひだまり」で、お客様のスマホ画面とお店の管理画面を並べて表示します。左で予約すると、右の予約一覧に届きます。</p>
      <div class="more-links"><a href="/demo/salon/both.html" target="_blank" rel="noopener">▶ LINE予約のデモを開く</a></div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow reveal">Price</div>
    <h2 class="reveal">料金の目安</h2>
    <table class="price-table reveal">
      <tr><th>初期費用</th><td><b>0円〜</b></td></tr>
      <tr><th>月額</th><td><b>3,000円〜</b><br>予約システム・サーバー・保守を含みます。</td></tr>
      <tr><th>追加機能</th><td>会計・売上、カルテ、口コミ受付、飲食店の席管理などは、内容に合わせてお見積りします。</td></tr>
    </table>
    <p class="note">※ LINE公式アカウントはお店のものをそのまま使います（お持ちでなければ作成からお手伝いします）。</p>
  </div>
</section>

${CTA_BAND('予約の電話、取りこぼしていませんか？', '今の予約の受け方を伺って、合う形をご提案します。')}`,
}));

// ===== POS・QR =====
pages.push(page({
  slug: 'pos',
  title: 'レジ（POS）・QRオーダー｜宮崎のお店向け 初期10万円〜｜よだき屋',
  description: '宮崎のお店向けのレジ（POS）とQRオーダー。時間で料金が決まるお店のタブレットレジや、席のQRコードからスマホで注文できるQRオーダー＋ハンディ＋レジをつくります。初期10万円〜。デモあり。',
  crumb: 'レジ（POS）・QRオーダー',
  h1: 'レジ（POS）・QRオーダー',
  lead: 'お店のやり方に合わせたレジをつくります。時間で料金が決まるお店のタブレットレジや、飲食店のQRオーダーなど、既製品では合わなかった部分を形にします。',
  ld: [service('レジ（POS）・QRオーダー', 'https://yodakiya.com/pos/', '店舗向けのタブレットレジ（POS）とQRオーダーの開発・運用。', {
    offers: { '@type': 'Offer', name: 'レジ（POS）', price: '100000', priceCurrency: 'JPY', description: '初期10万円〜・月額5,000円〜。内容によりお見積り。' } })],
  body: `<section>
  <div class="wrap">
    <div class="eyebrow reveal">POS</div>
    <h2 class="reveal">時間で料金が決まるお店のレジ</h2>
    <div class="prose reveal"><p>ビリヤード・ダーツなど、遊んだ時間で料金が決まるお店のために作ったタブレットレジです。実際のお店で毎日使われています。</p></div>
    <div class="feature-grid">
      <div class="feature reveal"><h3>台ごとの時間計算</h3><p>入店から精算まで、台ごと・お客様ごとに時間と料金を自動で計算。台の移動や途中参加にも対応します。</p></div>
      <div class="feature reveal"><h3>会員・料金区分</h3><p>一般・会員・月額会員など、お店の料金ルールに合わせて計算します。月会費の支払い状況も管理できます。</p></div>
      <div class="feature reveal"><h3>日報・月レポート</h3><p>日ごとの売上や客数、曜日別の傾向をグラフで確認でき、CSVで書き出せます。</p></div>
      <div class="feature reveal"><h3>ドリンク・物販の会計</h3><p>時間料金と一緒に、ドリンクや物販もまとめて会計できます。</p></div>
      <div class="feature reveal"><h3>お客様向けの表示</h3><p>店内のモニターに料金表や利用時間を表示できます。英語の併記にも対応しています。</p></div>
      <div class="feature reveal"><h3>レシート・ドロワ</h3><p>レシートプリンタやキャッシュドロワとつないで使えます。</p></div>
    </div>
    <div class="more-links reveal"><a href="/demo/pos/index.html" target="_blank" rel="noopener">▶ レジのデモを開く</a></div>
  </div>
</section>

<section style="background:var(--bg-soft)">
  <div class="wrap">
    <div class="eyebrow reveal">QR Order</div>
    <h2 class="reveal">飲食店のQRオーダー＋ハンディ＋レジ</h2>
    <div class="prose reveal"><p>席のQRコードからお客様のスマホで注文でき、スマホが苦手なお客様にはスタッフがハンディで注文を受けられます。注文は厨房とレジにそのまま届きます。</p></div>
    <div class="feature-grid">
      <div class="feature reveal"><h3>スマホで注文</h3><p>席のQRコードを読むとメニューが開き、そのまま注文できます。注文の聞き間違いや伝票の書き写しがなくなります。</p></div>
      <div class="feature reveal"><h3>ハンディも併用</h3><p>スタッフのスマホを注文端末として使えます。QRとハンディの注文が同じ伝票にまとまります。</p></div>
      <div class="feature reveal"><h3>厨房とレジに直送</h3><p>注文は厨房の伝票とレジの会計にそのまま届き、会計の呼び出しも一目で分かります。</p></div>
    </div>
    <div class="more-links reveal"><a href="/demo/qr/index.html" target="_blank" rel="noopener">▶ QRオーダーのデモを開く</a></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="eyebrow reveal">Price</div>
    <h2 class="reveal">料金の目安</h2>
    <table class="price-table reveal">
      <tr><th>時間料金のレジ（POS）</th><td><b>初期 10万円〜</b>／月額 5,000円〜</td></tr>
      <tr><th>QRオーダー＋ハンディ＋レジ</th><td><b>初期 10万円〜</b>（機器代込み）／月額 6,000円〜</td></tr>
    </table>
    <p class="note">※ 料金のルールや台数・席数、必要な機器によって変わります。今の会計の流れを伺ってお見積りします。</p>
  </div>
</section>

${CTA_BAND('今のレジ、お店のやり方に合っていますか？', '会計の流れを伺って、合う形をご提案します。')}`,
}));

// ===== FAQ =====
const faqs = [
  ['宮崎県内ならどこでも対応していますか？', 'はい。宮崎市・延岡市・都城市・日向市など、宮崎県全域でお受けしています。打ち合わせは対面・オンライン（ビデオ通話）のどちらでも大丈夫です。'],
  ['相談や見積りに費用はかかりますか？', 'ご相談とお見積りは無料です。内容にご納得いただいてから進めます。'],
  ['パソコンやITに詳しくなくても大丈夫ですか？', '大丈夫です。専門用語はできるだけ使わずにご説明します。「何を頼めばいいか分からない」という段階からご相談ください。'],
  ['契約期間の縛りはありますか？', 'ありません。保守などの月額サービスも、いつでもやめられます。'],
  ['ホームページのデータはもらえますか？', 'はい、完成したデータは一式お渡しします。将来ほかの会社に頼むことになっても、そのまま使えます。'],
  ['今あるホームページの修正や引き継ぎだけでも頼めますか？', 'はい。ほかの会社が作ったホームページの更新や、管理の引き継ぎもお受けしています。まずは今の状態を確認させてください。'],
  ['ホームページの更新は自分でできますか？', '更新は保守（月額3,000円〜）でこちらがお引き受けします。ご自分で更新したい場合は、その前提で作ることもできますので、ご相談ください。'],
  ['今使っているLINE公式アカウントで予約を受けられますか？', 'はい。お店のLINE公式アカウントに予約の画面をつなげます。お持ちでなければ、作成からお手伝いします。'],
  ['ホットペッパーと併用しても大丈夫ですか？', 'はい。ホットペッパービューティーの予約通知を取り込んで、LINE予約とのダブルブッキングを防いだ実績があります。'],
  ['どのくらいの期間でできますか？', '内容によって変わります。お見積りの際に、公開・導入までの目安をお伝えします。'],
];
pages.push(page({
  slug: 'faq',
  title: 'よくある質問｜宮崎のホームページ制作・LINE予約のよだき屋',
  description: 'よだき屋へのよくある質問。対応地域（宮崎県全域）、相談・見積り、契約期間、ホームページのデータ、LINE予約、ホットペッパーとの併用などについてお答えします。',
  crumb: 'よくある質問',
  h1: 'よくある質問',
  lead: 'よくいただくご質問をまとめました。ここにないことも、LINEやフォームから気軽にお尋ねください。',
  ld: [{ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
  body: `<section>
  <div class="wrap">
    <div class="faq">
${faqs.map(([q, a]) => `      <details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
    </div>
  </div>
</section>

${CTA_BAND('ほかにも気になることがあれば', 'LINEなら、写真や画面のスクリーンショットを送りながら相談できます。')}`,
}));

const slugs = ['homepage', 'line-yoyaku', 'pos', 'faq'];
pages.forEach((html, i) => {
  const dir = path.join(PUB, slugs[i]);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', slugs[i]);
});
