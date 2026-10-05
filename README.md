# ynsysapp.com（ルートページ）

`https://ynsysapp.com/` に置く、運営者とサービスの案内ページ。ビルド不要の静的サイト。

- `public/index.html` — ルートページ＝ynsys の会社ホームページ（2026-10-05〜。お仕事・実績・費用目安・問い合わせ）
- `public/demo/` — 実績カードから開くデモ（salon / pos / qr / genba）。どれも単一HTML・架空の店名・データは閲覧者のブラウザ内だけ・noindex
- `public/school/index.html` — 学校のフィルタリング審査担当・ネットワーク担当向けの案内（旧ルートページ。HPのフッターからリンク）
- `public/sitemap.xml` — 検索エンジンに渡すページ一覧（ページを増やしたらここも足す）
- `public/_redirects` — 旧URL /shukketsu/ を、案内ページ（shukketsu.ynsysapp.com）へ転送する
- `public/robots.txt` — 検索エンジンに読み取りを許可する
- `public/_headers` — Cloudflare 用のセキュリティヘッダーと、更新が届くようにする設定
- `wrangler.toml` — Cloudflare の配信設定（`public/` の中だけを公開する）
- `public/terms/index.html` — 利用規約
- `public/privacy/index.html` — プライバシーポリシー（GoogleのOAuth同意画面にURLを登録している）
- `SEO.md` — 検索への登録（Search Console）と、フィルタリング各社への申請手順

配信するファイルを `public/` に分けているのは、README や設定ファイルが公開されないようにするためです。

## なぜ置くのか

ドメインのルートが何も応答しないと、フィルタリング事業者のカテゴリ登録審査で「未分類のまま」か、悪くすると怪しいドメインとして扱われます。実際に、利用校の FortiGate が未分類のドメインとして通信を検査し、出欠記録アプリが校務用パソコンで開けなくなりました。

審査する人がまず見る場所なので、**何を提供しているか・誰が運営しているか・データをどう扱うか**が一目で分かる作りにしています。学校のネットワーク担当者向けに、許可が必要な通信先の一覧も載せています。相談を受けたときは、このURLを渡すだけで済みます。

## 公開手順（Cloudflare Workers ＋ GitHub）

出欠記録アプリと同じく、GitHub に push すると自動で公開される形にします。

### 1. GitHub に上げる

GitHub Desktop で「Add existing repository」からこのフォルダを追加し、`Publish repository` で GitHub に上げます（リポジトリ名の例：`ynsysapp-site`）。公開範囲は Private でも Public でも構いません。

### 2. Cloudflare につなぐ

1. https://dash.cloudflare.com/ → **Workers & Pages** → 「作成」→ Git からインポート
2. リポジトリ `ynsysapp-site` を選択
3. ビルド設定

| 項目 | 値 |
|---|---|
| **Build command（ビルドコマンド）** | **空欄**（`package.json` が無いので、何か入っていると失敗します） |
| **Deploy command（デプロイコマンド）** | `npx wrangler deploy` ← 既定のまま |

`wrangler.toml` に配信の設定が書いてあるので、デプロイコマンドは既定のままで通ります。

4. 「Deploy」

以降は `main` ブランチに push するたびに自動で公開されます。

### 3. 独自ドメインを割り当てる

プロジェクトの **カスタムドメイン** に次の2つを追加します。

- `ynsysapp.com`
- `www.ynsysapp.com`

DNS は Cloudflare にあるので、追加すればレコードは自動で作られます。

> **注意**：出欠記録アプリ（`shukketsu.ynsysapp.com`）は別のプロジェクトです。**このプロジェクトに `shukketsu.ynsysapp.com` を割り当てないでください。** 割り当てるとアプリが表示されなくなります。

## 有料化にあわせて足すもの

課金を始めるときは、次の記載が必要になります（2027年1月開始の目標）。

- 特定商取引法に基づく表記（氏名・住所・電話番号・販売価格・支払方法・解約条件など）
- 利用規約
- プライバシーポリシー

いまは「所在地はご請求があれば遅滞なく開示します」としています。無償で提供している間はこの書き方で足ります。
