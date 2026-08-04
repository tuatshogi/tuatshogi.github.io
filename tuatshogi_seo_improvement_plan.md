# 東京農工大学将棋部 公式サイト SEO改善計画

対象サイト: https://tuatshogi.github.io/  
作成日: 2026年8月4日

---

## 1. 改善の目的

本計画では、東京農工大学将棋部の公式サイトについて、次の目標を達成することを目的とする。

- 「東京農工大学 将棋部」などの検索で見つけやすくする
- 入部希望者が活動内容や見学方法を把握しやすくする
- Googleなどの検索エンジンに各ページの内容を正しく伝える
- SNSで共有された際の見え方を改善する
- サイトの表示速度とユーザビリティを向上させる

---

## 2. 現状の主な課題

### 2.1 JavaScript依存が強い

現在のサイトはReactで構築されており、初期HTMLには主に次の要素だけが出力されている。

```html
<body>
  <div id="root"></div>
</body>
```

ページ本文や見出しはJavaScript実行後に表示されるため、検索エンジンやSNSクローラーによっては内容を十分に取得できない可能性がある。

### 2.2 トップページのURLが重複している

次のURLが同じ内容を表示している。

- `https://tuatshogi.github.io/`
- `https://tuatshogi.github.io/top.html`

重複URLがあると、検索評価や被リンクが分散する可能性がある。

### 2.3 sitemap.xmlとrobots.txtが不足している

検索エンジンに主要ページを伝えるためのサイトマップと、クロール方針を示すrobots.txtを用意する必要がある。

### 2.4 ページ説明が短い

一部のページではmeta descriptionが短く、活動日、見学方法、初心者歓迎などの重要な内容が検索結果に伝わりにくい。

### 2.5 OGP設定が不十分

SNSで共有した際に表示される画像やページURLなどの設定が不足している。

### 2.6 入部希望者向けの情報量が少ない

活動曜日、時間、部費、対象学年、初心者の参加可否など、検索されやすく入部判断に必要な情報を充実させる必要がある。

---

## 3. 優先度別の改善項目

## 優先度A：最優先で実施する施策

### 3.1 各ページをプリレンダリングする

Reactで生成するページ本文を、ビルド時にHTMLへ書き出す。

対象ページ:

```text
/
entry.html
introduce.html
record.html
```

#### 期待される効果

- 検索エンジンが本文を読み取りやすくなる
- JavaScriptを十分に実行しないクローラーにも対応できる
- SNSやメッセージアプリでのページ解析が安定する
- 初回表示速度を改善しやすくなる

#### 実装方針

- Viteのビルド時プリレンダリングを導入する
- 各HTMLの`body`内に完成済みの本文を出力する
- Reactのクライアント側動作はそのまま維持する

---

### 3.2 トップページのURLを統一する

サイト内のトップページへのリンクを、すべて次のURLに統一する。

```text
https://tuatshogi.github.io/
```

ヘッダーやフッターでは、次のように記述する。

```jsx
<a href="/" aria-label="東京農工大学将棋部 トップ">
```

トップページにはcanonicalタグを追加する。

```html
<link rel="canonical" href="https://tuatshogi.github.io/">
```

`top.html`を残す場合も、canonicalはトップURLに設定する。

```html
<link rel="canonical" href="https://tuatshogi.github.io/">
```

可能であれば、将来的に`top.html`自体を削除する。

---

### 3.3 sitemap.xmlを追加する

リポジトリ直下に`sitemap.xml`を作成する。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tuatshogi.github.io/</loc>
  </url>
  <url>
    <loc>https://tuatshogi.github.io/entry.html</loc>
  </url>
  <url>
    <loc>https://tuatshogi.github.io/introduce.html</loc>
  </url>
  <url>
    <loc>https://tuatshogi.github.io/record.html</loc>
  </url>
</urlset>
```

重複ページである`top.html`は含めない。

---

### 3.4 robots.txtを追加する

リポジトリ直下に`robots.txt`を作成する。

```text
User-agent: *
Allow: /

Sitemap: https://tuatshogi.github.io/sitemap.xml
```

---

### 3.5 Google Search Consoleを設定する

サイトマップ追加後、Google Search Consoleで次を実施する。

1. `sitemap.xml`を送信する
2. トップページをURL検査する
3. 各下層ページをURL検査する
4. 必要に応じて「インデックス登録をリクエスト」を実行する
5. 「ページ」レポートでインデックス未登録の理由を確認する

対象ページ:

- `https://tuatshogi.github.io/`
- `https://tuatshogi.github.io/entry.html`
- `https://tuatshogi.github.io/introduce.html`
- `https://tuatshogi.github.io/record.html`

---

## 優先度B：検索結果の見え方を改善する施策

### 3.6 titleとmeta descriptionを改善する

#### トップページ

```html
<title>東京農工大学将棋部｜活動日・見学・大会実績</title>

<meta
  name="description"
  content="東京農工大学将棋部の公式サイトです。小金井キャンパスでの活動、初心者向けの入部・見学案内、大会結果、部室の場所を掲載しています。"
/>
```

#### 入部案内ページ

```html
<title>入部・見学案内｜東京農工大学将棋部</title>

<meta
  name="description"
  content="東京農工大学将棋部の入部・見学案内です。活動場所、活動日、部室への行き方、部費、見学の連絡方法をご案内します。初心者も歓迎しています。"
/>
```

#### 活動紹介ページ

```html
<title>活動内容・活動日｜東京農工大学将棋部</title>

<meta
  name="description"
  content="東京農工大学将棋部の活動を紹介します。毎週の部室での対局、棋譜検討、部内戦、大学間交流、大会参加などの様子を写真付きで掲載しています。"
/>
```

#### 大会記録ページ

```html
<title>大会結果・戦績｜東京農工大学将棋部</title>

<meta
  name="description"
  content="東京農工大学将棋部の大会結果と戦績を年度別に掲載しています。関東大学将棋連盟の春季・秋季団体戦における順位、勝敗、昇級記録を確認できます。"
/>
```

---

### 3.7 トップページのH1を改善する

現在のキャッチコピーは魅力的である一方、検索エンジンから見てサイトの主題が分かりにくい可能性がある。

#### 改善案1

部名をH1内に含める。

```jsx
<h1>
  <span className="block text-base">
    東京農工大学将棋部
  </span>
  <span className="block">詰みは見える。</span>
  <span className="block">将来は見えない。</span>
</h1>
```

#### 改善案2

部名をH1にし、キャッチコピーを別要素にする。

```jsx
<h1>東京農工大学将棋部</h1>

<p className="catch-copy">
  詰みは見える。将来は見えない。
</p>
```

デザインを保ちたい場合は改善案1を推奨する。

---

### 3.8 OGPとTwitter Cardを設定する

各ページにSNS共有用のメタタグを追加する。

```html
<meta property="og:site_name" content="東京農工大学将棋部">
<meta property="og:type" content="website">
<meta property="og:title" content="東京農工大学将棋部｜活動日・見学・大会実績">
<meta property="og:description" content="東京農工大学将棋部の公式サイトです。活動内容や見学方法、大会結果をご紹介します。">
<meta property="og:url" content="https://tuatshogi.github.io/">
<meta property="og:image" content="https://tuatshogi.github.io/og-image.jpg">
<meta property="og:locale" content="ja_JP">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="東京農工大学将棋部">
<meta name="twitter:description" content="活動内容、見学方法、大会結果をご紹介します。">
<meta name="twitter:image" content="https://tuatshogi.github.io/og-image.jpg">
```

#### OGP画像の推奨仕様

- サイズ: 1200 × 630 px
- ファイル名: `og-image.jpg`
- 掲載内容:
  - 東京農工大学将棋部
  - 「詰みは見える。将来は見えない。」
  - 公式Webサイト
  - 将棋駒や盤面を使ったシンプルなデザイン

---

### 3.9 構造化データを追加する

トップページにJSON-LD形式で団体情報を記述する。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "東京農工大学将棋部",
  "alternateName": "農工大将棋部",
  "url": "https://tuatshogi.github.io/",
  "logo": "https://tuatshogi.github.io/logo.png",
  "email": "tuatshogi@gmail.com",
  "sameAs": [
    "https://x.com/tuatshogiclub"
  ],
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "東京農工大学",
    "url": "https://www.tuat.ac.jp/"
  }
}
</script>
```

メールアドレス、Xアカウント、ロゴURLは実際の情報に合わせて修正する。

---

## 優先度C：コンテンツを充実させる施策

### 3.10 入部案内ページを充実させる

次の情報を追加する。

| 項目 | 掲載内容 |
|---|---|
| 活動日 | 曜日、開始時刻、終了時刻 |
| 活動場所 | キャンパス名、建物、部屋番号 |
| 参加頻度 | 自由参加か、毎週参加が必要か |
| 部費 | 年額または月額 |
| 対象 | 学部、学年、大学院生、他大学生 |
| 初心者 | 初心者・未経験者の参加可否 |
| 持ち物 | 盤駒を持参する必要があるか |
| 見学方法 | XのDM、メール、フォーム |
| 途中入部 | 年度途中でも入部できるか |
| 大会参加 | 希望制か、参加費の負担方法 |

実際の情報が未確定の場合は、確認後に掲載する。

---

### 3.11 よくある質問を追加する

入部案内ページにFAQを追加する。

#### 質問例

- 将棋初心者でも入部できますか
- 将棋ウォーズや将棋クエストだけの経験でも大丈夫ですか
- 活動には毎回参加する必要がありますか
- 途中入部はできますか
- 兼部や兼サークルはできますか
- 女子部員も参加できますか
- 部費はいくらですか
- 見学に予約は必要ですか
- 大会への参加は必須ですか
- 盤や駒を持参する必要がありますか

回答は、実際の運営方針に合わせて記述する。

---

### 3.12 検索されやすい言葉を自然に含める

想定される検索キーワード:

```text
東京農工大学 将棋部
農工大 将棋部
東京農工大学 将棋部 見学
東京農工大学 将棋部 活動日
東京農工大学 将棋部 部室
東京農工大学 将棋部 初心者
東京農工大学 サークル 将棋
小金井キャンパス 将棋部
大学 将棋サークル 東京
```

キーワードを不自然に羅列せず、ページ本文や見出しの中に自然に含める。

#### 文章例

> 東京農工大学将棋部は、小金井キャンパスを中心に活動しています。将棋初心者から大会経験者まで幅広く参加しており、見学や途中入部も歓迎しています。

---

### 3.13 お知らせ・大会記事を独立ページにする

大会結果、新歓、イベント情報を個別ページとして公開する。

#### URL例

```text
/news/
/news/2026-spring-team-result.html
/news/2026-welcome-event.html
/news/2026-autumn-team-result.html
```

#### 記事に掲載する内容

- 大会名
- 開催日
- 会場
- 所属リーグ
- 順位
- 勝敗
- 出場メンバー
- 対局の振り返り
- 次回への目標
- 活動写真
- 公式結果へのリンク

更新できる範囲で運用し、内容の薄い記事を大量に作らない。

---

## 優先度D：外部評価と認知を高める施策

### 3.14 大学公式ページからリンクを追加してもらう

東京農工大学の公式サークル紹介ページから、将棋部公式サイトへのリンク追加を大学担当部署へ依頼する。

#### 期待される効果

- 入部希望者が公式サイトに移動しやすくなる
- 将棋部サイトの信頼性が高まる
- 大学公式ドメインからの被リンクを得られる

---

### 3.15 各SNSと関連ページにURLを掲載する

次の場所に公式サイトURLを掲載する。

- 将棋部公式Xのプロフィール
- GitHubリポジトリのAbout欄
- 新歓用SNS投稿
- 大学祭の団体紹介ページ
- 新入生向けサークル紹介ページ
- 関連する大学将棋団体のリンク集
- 部員個人のSNSからの紹介投稿

URL表記は、トップページに統一する。

```text
https://tuatshogi.github.io/
```

---

## 優先度E：表示速度と使いやすさを改善する施策

### 3.16 画像にサイズを設定する

画像には`width`と`height`を設定し、読み込み時のレイアウトずれを防止する。

```jsx
<img
  src={section.image}
  alt={section.alt}
  width="1200"
  height="800"
  loading="lazy"
  decoding="async"
/>
```

---

### 3.17 画像をWebPまたはAVIFに変換する

JPEGやPNG画像に加え、WebPまたはAVIF形式を用意する。

```html
<picture>
  <source srcset="activity.avif" type="image/avif">
  <source srcset="activity.webp" type="image/webp">
  <img
    src="activity.jpg"
    alt="東京農工大学将棋部の部室で対局する部員"
    width="1200"
    height="800"
    loading="lazy"
  >
</picture>
```

#### 注意点

トップページの最初に表示される重要画像には、`loading="lazy"`を使わないことも検討する。

---

### 3.18 フォント読み込みを最適化する

- 使用していないフォントウェイトを削除する
- Google Fontsを使う場合は`preconnect`を設定する
- 可能であればフォントをセルフホストする
- `font-display: swap`を使用する

---

### 3.19 PageSpeed Insightsで測定する

公開後、モバイル表示を中心に確認する。

#### 主な確認項目

- LCP: メインコンテンツが表示されるまでの時間
- CLS: 読み込み中のレイアウトずれ
- INP: 操作に対する反応速度
- 使用していないJavaScript
- 画像ファイルの容量
- フォント読み込み
- キャッシュ設定

---

## 4. ページ別の改善方針

### 4.1 トップページ

#### 主な役割

- 団体名を明確に伝える
- 入部案内へ誘導する
- 活動内容を短く説明する
- 最新のお知らせを掲載する

#### 追加する要素

- 「東京農工大学将棋部」を含むH1
- 80〜150文字程度の紹介文
- 活動日と活動場所
- 初心者歓迎の記載
- 入部・見学ページへの目立つリンク
- 最新のお知らせ
- Organization構造化データ
- canonical
- OGP

---

### 4.2 入部・見学案内ページ

#### 主な役割

入部を検討している人の疑問を解消し、見学や問い合わせにつなげる。

#### 追加する要素

- 活動曜日と時間
- 活動場所
- 部費
- 初心者歓迎
- 兼部の可否
- 途中入部の可否
- 見学の流れ
- 問い合わせ方法
- よくある質問

---

### 4.3 活動紹介ページ

#### 主な役割

普段の活動の雰囲気を具体的に伝える。

#### 追加する要素

- 通常活動
- 棋譜検討
- 部内戦
- 大学間交流
- 合宿
- 大会参加
- 写真ごとの具体的なalt属性
- 入部案内への内部リンク

---

### 4.4 大会記録ページ

#### 主な役割

将棋部の実績を整理し、活動の継続性や競技性を伝える。

#### 追加する要素

- 年度別の大会結果
- 大会名
- 開催日
- リーグ
- 順位
- 勝敗
- 昇級・降級
- 公式結果へのリンク
- 個別大会記事へのリンク

---

## 5. 推奨するサイト構成

```text
/
├── index.html
├── entry.html
├── introduce.html
├── record.html
├── news/
│   ├── index.html
│   ├── 2026-spring-team-result.html
│   └── 2026-autumn-team-result.html
├── sitemap.xml
├── robots.txt
├── og-image.jpg
├── logo.png
└── assets/
```

---

## 6. 実施スケジュール案

### 第1段階：技術SEO

目安: 最初に実施

- [ ] トップページのURLを`/`に統一
- [ ] canonicalタグを設定
- [ ] sitemap.xmlを追加
- [ ] robots.txtを追加
- [ ] Search Consoleへサイトマップを送信
- [ ] 各ページをプリレンダリング

### 第2段階：検索結果表示の改善

- [ ] 各ページのtitleを変更
- [ ] 各ページのmeta descriptionを変更
- [ ] OGPタグを追加
- [ ] OGP画像を作成
- [ ] Twitter Cardを設定
- [ ] 構造化データを追加

### 第3段階：コンテンツ改善

- [ ] 入部案内の詳細を追加
- [ ] FAQを追加
- [ ] 活動紹介を充実
- [ ] 大会記事を作成
- [ ] ページ間の内部リンクを増やす

### 第4段階：外部SEO

- [ ] 大学公式ページからのリンクを依頼
- [ ] XのプロフィールにURLを掲載
- [ ] GitHubリポジトリにURLを掲載
- [ ] 新歓関連ページにURLを掲載

### 第5段階：速度改善と計測

- [ ] 画像をWebPまたはAVIFに変換
- [ ] 画像にwidthとheightを設定
- [ ] 不要なJavaScriptを削減
- [ ] PageSpeed Insightsで測定
- [ ] Search Consoleで表示回数と順位を確認

---

## 7. 効果測定

SEO施策後は、月1回程度、Google Search Consoleで次を確認する。

### 確認する指標

- Google検索での表示回数
- 検索結果のクリック数
- 平均クリック率
- 平均掲載順位
- インデックス登録済みページ数
- 検索に使われたキーワード
- 各ページへの流入数

### 特に確認する検索語

```text
東京農工大学 将棋部
農工大 将棋部
東京農工大学 将棋部 見学
東京農工大学 将棋部 活動日
東京農工大学 サークル 将棋
```

---

## 8. 最優先タスクまとめ

最初に以下の6項目を実施する。

1. トップページへのリンクをすべて`/`に統一する
2. canonicalタグを設定する
3. sitemap.xmlを追加する
4. robots.txtを追加する
5. 各ページをプリレンダリングする
6. Search Consoleからインデックス登録を確認する

次に、title、meta description、OGP、構造化データ、入部案内の充実を進める。

---

## 9. 完了条件

次の状態になれば、初期SEO改善は完了とする。

- [ ] 全ページの本文が初期HTMLに含まれている
- [ ] トップページの正規URLが`/`に統一されている
- [ ] 全ページにcanonicalが設定されている
- [ ] sitemap.xmlとrobots.txtが公開されている
- [ ] Google Search Consoleで主要ページが認識されている
- [ ] 全ページに固有のtitleとdescriptionがある
- [ ] 全ページにOGPが設定されている
- [ ] トップページに構造化データがある
- [ ] 入部案内に活動日、場所、部費、見学方法が掲載されている
- [ ] PageSpeed Insightsで重大な問題が出ていない
