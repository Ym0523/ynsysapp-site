# 検索に載せる・学校で開けるようにする（2026-08-30）

出欠記録アプリの案内ページ（LP）は **https://shukketsu.ynsysapp.com/** です。アプリ本体は同じサイトの **`/app/`**。

アプリ本体（`/app/`）は **noindex** にしてあります。ログインの画面なので、検索から来ても何も分からないためです。
検索に出すのは案内ページ1枚に集約し、`ynsysapp.com/shukketsu/` は案内ページへ 301 で転送します（`public/_redirects`）。

> **案内をアプリと同じドメインに置いた理由**：フィルタリング事業者の審査担当や、学校のICT担当が
> `shukketsu.ynsysapp.com` を開いたときに、ログイン画面ではなく「何のサイトか」が分かるページが出ます。
> 未分類のドメインが検査で引っかかる問題（[SCHOOL-NETWORK.md](../shukketsu-app/SCHOOL-NETWORK.md)）に効きます。

## 1. Google 検索への登録（Search Console）

**Googleアカウントでの操作なので、ご自身で行ってください。**

1. https://search.google.com/search-console/ を開く
2. 「プロパティを追加」→ **ドメイン**（左側）を選び、`ynsysapp.com` と入力
   - サブドメイン（`shukketsu.`）もまとめて扱えるので、URLプレフィックスではなくドメインを選びます
3. 表示された **TXTレコード**を Cloudflare の DNS に追加する
   - Cloudflare → 対象ドメイン → DNS → レコードを追加 → 種類 `TXT` / 名前 `@` / 内容は表示された文字列
4. Search Console に戻って「確認」
5. 左メニューの **サイトマップ** から、次の2つを送信
   - `https://ynsysapp.com/sitemap.xml`
   - `https://shukketsu.ynsysapp.com/sitemap.xml`
6. 上部の検索窓に `https://shukketsu.ynsysapp.com/` を入れて **URL検査** → 「インデックス登録をリクエスト」
   - 同じく `https://ynsysapp.com/` も
7. 数日〜2週間で `site:ynsysapp.com` に出てきます。出てこない場合は URL検査の結果（除外の理由）を確認

> **Bing にも同じ内容で登録できます**（https://www.bing.com/webmasters/）。Search Console から設定をインポートできるので5分で終わります。校務PCは Edge＝Bing 既定のことがあるので、やっておく価値があります。

## 2. フィルタリング各社への申請

**ドメイン（サブドメイン）ごとに評価されます。** `shukketsu.ynsysapp.com` を登録しても
`ynsysapp.com` は別扱いなので、**両方**申請してください。

申請に使える文面：

```
Site: https://ynsysapp.com/  （および https://shukketsu.ynsysapp.com/）
Suggested category: Education
Comment:
This site provides a free web application for schoolteachers in Japan
("attendance record" / 出欠記録). Teachers record class attendance and export
figures for their school administration system. The top page is a static
information page; the application itself is at /app/.
```

| 会社 | 製品 | 申請先 |
|---|---|---|
| Fortinet | FortiGate / FortiGuard | https://www.fortiguard.com/faq/wfratingsubmit （`shukketsu.ynsysapp.com` は2026-08-28に申請 → 約1時間半で Education に分類） |
| デジタルアーツ | **i-FILTER**（日本の学校で最も多い） | URLフィルターデータベース登録ご依頼フォーム https://sec2.daj.co.jp/bs/request/if_url/ |
| ALSI | InterSafe WebFilter / CATS | https://www.alsi.co.jp/ のサポート窓口から、URLデータベースへの登録を依頼 |
| トレンドマイクロ | Site Safety Center | https://global.sitesafety.trendmicro.com/ でURLを検査 →「Reclassify Request」 |

> **分類されても、学校で開けるとは限りません。** 学校側のフィルタが Education を許可しているか、
> キャッシュが更新されているか、SSLインスペクションの除外に入っているかは、学校の設定次第です。
> 最終的にはICT担当への依頼（`shukketsu-app/SCHOOL-NETWORK.md` の依頼文）が確実です。

## 3. 案内ページで気をつけていること

- **タイトルは30字前後**（`出欠記録アプリ｜授業ごとの出欠をタップで記録（無料）`）。検索結果で切れないように
- `canonical` を `https://shukketsu.ynsysapp.com/` に固定
- 構造化データを2つ入れてある：`SoftwareApplication`（何のアプリか・料金）と `FAQPage`（よくある質問）
  - 変更したら https://search.google.com/test/rich-results で確認する
- ページを増やしたら、`sitemap.xml` と `robots.txt` の `Sitemap:` 行を**必ず両方**更新する
  - 案内ページ側は `shukketsu-app` リポジトリの `sitemap.xml` / `robots.txt`

## 4. まだやっていないこと

- **OGP画像（`og:image`）**。SNSやLINEで共有したときに出るカード画像です。1200×630のPNGを1枚作り、
  `shukketsu-app` リポジトリに `ogp.png` として置いて
  `<meta property="og:image" content="https://shukketsu.ynsysapp.com/ogp.png">` を足せば有効になります
