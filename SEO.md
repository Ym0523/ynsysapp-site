# 検索に載せる・学校で開けるようにする（2026-08-30）

出欠記録アプリの案内ページ（LP）は **https://ynsysapp.com/shukketsu/** です。
アプリ本体（`shukketsu.ynsysapp.com`）は **noindex** にしてあります。ログインの画面なので、
検索から来ても何も分からないためです。検索に出すのは案内ページ1枚に集約します。

## 1. Google 検索への登録（Search Console）

**この作業はGoogleアカウントでの操作なので、ご自身で行ってください。**

1. https://search.google.com/search-console/ を開く
2. 「プロパティを追加」→ **ドメイン**（左側）を選び、`ynsysapp.com` と入力
   - サブドメイン（`shukketsu.` など）もまとめて扱えるので、URLプレフィックスではなくドメインを選びます
3. 表示された **TXTレコード**を、Cloudflare の DNS に追加する
   - Cloudflare → 対象ドメイン → DNS → レコードを追加 → 種類 `TXT` / 名前 `@` / 内容は表示された文字列
   - **プロキシ（オレンジの雲）はTXTには関係ありません**。そのまま保存
4. Search Console に戻って「確認」
5. 左メニューの **サイトマップ** → `sitemap.xml` と入力して送信
6. 上部の検索窓に `https://ynsysapp.com/shukketsu/` を入れて **URL検査** → 「インデックス登録をリクエスト」
   - 同じく `https://ynsysapp.com/` も
7. 数日〜2週間で `site:ynsysapp.com` に出てきます。出てこない場合は URL検査の結果（除外の理由）を確認

> **Bing にも同じ内容で登録できます**（https://www.bing.com/webmasters/）。Search Console から設定をインポートできるので、5分で終わります。学校のPCはEdge＝Bing既定のことがあるので、やっておく価値があります。

## 2. フィルタリング各社への申請

**ドメイン（サブドメイン）ごとに評価されます。** `shukketsu.ynsysapp.com` を登録しても
`ynsysapp.com` は別扱いなので、**両方**申請してください。`/shukketsu/` は `ynsysapp.com` の配下なので、
apex を申請すれば一緒に効きます。

申請する内容（共通で使える文面）：

```
Site: https://ynsysapp.com/
Suggested category: Education
Comment:
This site introduces a free web application for schoolteachers in Japan
("attendance record" / 出欠記録). Teachers record class attendance and export
figures for their school administration system. The site itself is static
information pages. The application is hosted at https://shukketsu.ynsysapp.com/
(already categorized as Education).
```

| 会社 | 製品 | 申請先 |
|---|---|---|
| Fortinet | FortiGate / FortiGuard | https://www.fortiguard.com/faq/wfratingsubmit （`shukketsu.ynsysapp.com` は2026-08-28に申請 → 約1時間半で Education に分類） |
| デジタルアーツ | **i-FILTER**（日本の学校で最も多い） | URLフィルターデータベース登録ご依頼フォーム https://sec2.daj.co.jp/bs/request/if_url/ ／ 現在の分類は「フィルタリング設定確認ページ」で確認できる |
| ALSI | InterSafe WebFilter / CATS | https://www.alsi.co.jp/ のサポート窓口から、URLデータベースへの登録を依頼 |
| トレンドマイクロ | Site Safety Center | https://global.sitesafety.trendmicro.com/ でURLを検査 →「Reclassify Request」 |

> **分類されても、学校で開けるとは限りません。** 学校側のフィルタが Education を許可しているか、
> キャッシュが更新されているか、SSLインスペクションの除外に入っているかは、学校の設定次第です。
> 最終的にはICT担当への依頼（[shukketsu-app/SCHOOL-NETWORK.md](https://github.com/) の依頼文）が確実です。

## 3. このページで気をつけていること

- **タイトルは30字前後**（`出欠記録アプリ｜授業ごとの出欠をタップで記録（無料）`）。検索結果で切れないように
- `canonical` を `https://ynsysapp.com/shukketsu/` に固定
- 構造化データを2つ入れてある：`SoftwareApplication`（何のアプリか・料金）と `FAQPage`（よくある質問）
  - 変更したら https://search.google.com/test/rich-results で確認する
- `sitemap.xml` と `robots.txt` の `Sitemap:` 行は、ページを増やしたら**必ず両方**更新する

## 4. まだやっていないこと

- **OGP画像（`og:image`）**。SNSやLINEで共有したときに出るカード画像です。1200×630のPNGを1枚作って
  `public/ogp.png` に置き、`<meta property="og:image" content="https://ynsysapp.com/ogp.png">` を足せば有効になります
- アクセス解析。Cloudflare Web Analytics を使う場合、この静的サイト側にも同じ設定が要ります
