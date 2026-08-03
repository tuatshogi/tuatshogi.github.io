# 将棋部サイト UIリニューアル 詳細設計書

作成日: 2026-07-26
ベース: shogi-club-ui-renewal-requirements.md v1.0
対象サイト: 東京農工大学将棋部 公式サイト（tuatshogi.github.io）

---

## 目次

1. [アーキテクチャ設計](#1-アーキテクチャ設計)
2. [コンポーネント設計](#2-コンポーネント設計)
3. [ページ設計](#3-ページ設計)
4. [デザインシステム](#4-デザインシステム)
5. [CSS設計](#5-css設計)
6. [データ設計](#6-データ設計)
7. [レスポンシブ設計](#7-レスポンシブ設計)
8. [新規JSインタラクション設計](#8-新規jsインタラクション設計)
9. [アクセシビリティ](#9-アクセシビリティ)
10. [実装手順](#10-実装手順)

---

## 1. アーキテクチャ設計

### 1.1 ファイル構成

```
index.html                 # エントリーポイント（変更なし）
act.css                    # 全スタイル（既存に追記）
act.js                     # アプリケーションシェル（変更なし）
top.js                     # トップページ（改修）
entry.js                   # 入部案内ページ（現状維持）
introduce.js               # 活動紹介ページ（改修）
record.js                  # 大会実績ページ（改修）
contact.js                 # お問い合わせページ（新規）
```

### 1.2 ページ読み込みフロー（変更なし）

```
act.js loadPage(htmlPath)
  ├→ htmlPath → .js に置換して fetch
  │   ├→ 成功: script タグとして DOM 追加 → 各ページJSが #content を操作
  │   └→ 失敗: fetch(htmlPath) にフォールバック → innerHTML 代入
  └→ グローバル loadPage として稼働
```

### 1.3 ページ一覧と対応

| ページ | ファイル | 区分 | ヘッダーナビ対応 |
|---|---|---|---|---|
| トップ | top.js | 改修 | あり |
| 入部案内 | entry.js | 現状維持 | あり |
| 活動紹介 | introduce.js | 改修（大幅変更） | あり |
| 大会実績 | record.js | 改修 | あり |
| お問い合わせ | contact.js | 新規 | なし（トップカードからのみ） |

### 1.4 ナビゲーション導線図

```
ヘッダーナビ（固定）
  ├ トップ → top.js
  ├ 入部案内 → entry.js
  ├ 大会実績 → record.js
  ├ 活動紹介 → introduce.js
  └ X(Twitter) → 外部リンク

トップページのIconNavCard（2枚）
  ├ 活動紹介 → introduce.js
  └ 大会実績 → record.js
```

---

## 2. コンポーネント設計

### 2.1 Hero（トップページ冒頭）

| 項目 | 仕様 |
|---|---|
| 目的 | サイト訪問者の第一印象を決定づける |
| 構成 | 背景領域 + 見出しコピー + サブコピー + CTAボタン |
| 背景 | `.bg-grid`（将棋盤格子パターン）を敷き、将来的に背景画像を差し込める構造にしておく。初期実装は `.bg-grid` 単体 |
| 見出し | `<h1>` or `<h2>`、`--font-heading`、2.5rem〜3rem |
| CTAボタン | ラベル「新入部員募集中!」、リンク先 `entry.html`、`--accent-green` 背景＋白文字 |
| 実装 | `top.js` 内でDOM構築 |

**構造（仮）:**
```html
<div class="hero">
  <div class="hero-content">
    <h1 class="hero-title">東京農工大学将棋部</h1>
    <p class="hero-subtitle">初心者から有段者まで、将棋を愛する仲間が集う場所</p>
    <a class="hero-cta" href="entry.html">新入部員募集中!</a>
  </div>
</div>
```

**CTAボタンクリック時:** `loadPage('entry.html')` を呼びSPA遷移させる。通常のaタグではページリロードが発生するため、`preventDefault` ＋ `loadPage` のハンドラを必ず付与する。

### 2.2 NewsItem（トップページNews一覧）

| 項目 | 仕様 |
|---|---|
| データ構造 | `{ date, tag, title, href }` の配列 |
| 表示件数 | 直近3件 |
| レイアウト | 1列のリスト。各行が日付・タグバッジ・タイトルの横並び。モバイルでは flex-wrap で折り返し許容 |
| タグバッジ | 小さいラベル（例: 青系 `--accent` 背景＋白文字） |
| 日付 | `--font-mono` または `--font-body` で固定幅 |

**データ例:**
```js
const NEWS = [
  { date: '2026.05.24', tag: 'お知らせ', title: '春季団体戦C級2組で準優勝しました', href: 'record.html' },
  // ...
];
```

### 2.3 IconNavCard（トップページ2枚カード）

| 項目 | 仕様 |
|---|---|
| 既存 | `.body-nav-card`（clip-pathで駒型） |
| 方針 | 角丸カードに作り替え。ただし駒モチーフはアイコン等で残す |
| 新レイアウト | 丸みを帯びたカード（`border-radius: 12px〜16px`） |
| 背景 | `--bg-dark`（現行維持）または `--accent-green` を検討 |
| アイコン | 将棋駒シルエットを簡易SVG内包（変更可能性あり: 後日Blender/Illustrator製アセットに差し替え） |
| ラベル | 活動紹介 / 大会実績 |

**構造（仮）:**
```html
<div class="icon-nav-card">
  <div class="icon-nav-card-icon">
    <svg viewBox="0 0 40 40" width="40" height="40" fill="currentColor" aria-hidden="true">
      <path d="M20 4 L28 14 L24 28 L16 28 L12 14 Z"/>
    </svg>
  </div>
  <span class="icon-nav-card-label">活動紹介</span>
</div>
```

アイコンSVGは汎用的な駒シルエット（五角形近似）を共通で使い、カードラベルで意味を伝える。制作中の本格駒アセットが完成次第、`<svg>` のパスデータを差し替える想定。

### 2.4 InfoRow（活動紹介ページ）

| 項目 | 仕様 |
|---|---|
| 用途 | 活動日・場所・内容・雰囲気をアイコン＋テキストで一覧表示 |
| 構造 | アイコン（絵文字） + ラベル + 値 |
| レイアウト | フレックス横並び。モバイルで縦積み |

**構造（仮）:**
```html
<div class="info-row">
  <span class="info-row-icon" aria-hidden="true">📅</span>
  <span class="info-row-label">活動日</span>
  <span class="info-row-value">毎週 月・水・金 17:00〜20:00</span>
</div>
```

### 2.5 HighlightStatCard（大会実績ページ上部）

| 項目 | 仕様 |
|---|---|
| 表示件数 | 最大3枚（直近の特筆すべき成績） |
| 抽出ロジック | `records` 配列から `highlight === 'gold'` のエントリを優先。なければ直近の結果 |
| 構造 | 大会名 / 結果ラベル（gold色） / 日付・詳細 |
| レイアウト | デスクトップで3枚横並び、モバイルで縦積み |

**構造（仮）:**
```html
<div class="highlight-stat-card">
  <div class="highlight-stat-card-label highlight-stat-card-label--gold">準優勝</div>
  <div class="highlight-stat-card-event">春季団体戦C級2組</div>
  <div class="highlight-stat-card-detail">2026.05.24 / 6勝1敗でC1級へ昇級</div>
</div>
```

### 2.6 ResultsTable（大会実績ページ下部）

| 項目 | 仕様 |
|---|---|
| 現状 | `<p>` 羅列の段落形式 |
| 変更後 | 年度ごとにh3見出し＋`<table>`。既存のデータ構造（year単位のグループ）を反映 |
| 見出し | h3に年度ラベル（「2026年度」） |
| レスポンシブ | モバイルでは各行をカード型に変換して視認性を確保（または `overflow-x: auto`） |

**構造（仮）:**
```html
<section class="results-year">
  <h3>2026年度</h3>
  <table class="results-table">
    <thead>
      <tr><th>大会名</th><th>結果</th><th>詳細</th></tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="大会名">春季団体戦C級2組</td>
        <td data-label="結果"><span class="record-label--gold">準優勝</span></td>
        <td data-label="詳細">6勝1敗でC1級へ昇級</td>
      </tr>
    </tbody>
  </table>
</section>
```

年度カラムはh3に分離することで、テーブルが年度ごとに分割され視認性が向上する。

### 2.7 （削除: 部員紹介ページは対象外）

### 2.8 （削除: ギャラリーページは対象外）

### 2.9 （削除: ギャラリーページは対象外）

### 2.10 ContactForm（お問い合わせページ）

| 項目 | 仕様 |
|---|---|
| フィールド | 氏名（テキスト） / メールアドレス（email） / 学部（学内向け任意） / 学科（学内向け任意） / 学年（学内向け任意） / 件名（テキスト） / メッセージ（textarea） / 送信ボタン |
| 実装方式 | `mailto:` 方式（JSで本文構築、暫定）。状況に応じてFormspree等の外部サービスへの移行を検討 |
| 学内向け追加項目 | 学部・学科・学年の3項目を任意フィールドとして `fieldset` でグループ化 |
| ラベル | 全フィールドに `<label>` 対応付け、必須項目に `*` 表示 |

**構造（仮 / mailto方式、JSで本文構築）:**
```html
<form class="contact-form" id="contact-form">
  <div class="contact-form-field">
    <label for="contact-name">氏名 <span aria-label="必須">*</span></label>
    <input type="text" id="contact-name" name="name" required>
  </div>
  <div class="contact-form-field">
    <label for="contact-email">メールアドレス <span aria-label="必須">*</span></label>
    <input type="email" id="contact-email" name="email" required>
  </div>
  <fieldset class="contact-form-field">
    <legend>学内の方のみ（任意）</legend>
    <div class="contact-form-inline">
      <div>
        <label for="contact-dept">学部</label>
        <input type="text" id="contact-dept" name="department">
      </div>
      <div>
        <label for="contact-major">学科</label>
        <input type="text" id="contact-major" name="major">
      </div>
      <div>
        <label for="contact-grade">学年</label>
        <input type="text" id="contact-grade" name="grade">
      </div>
    </div>
  </fieldset>
  <div class="contact-form-field">
    <label for="contact-subject">件名 <span aria-label="必須">*</span></label>
    <input type="text" id="contact-subject" name="subject" required>
  </div>
  <div class="contact-form-field">
    <label for="contact-message">メッセージ <span aria-label="必須">*</span></label>
    <textarea id="contact-message" name="message" required></textarea>
  </div>
  <button type="submit">送信（メールクライアント起動）</button>
</form>
```

**送信処理（JS）:**
```js
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const f = this.elements;
  let body = `氏名: ${f.name.value}\nメール: ${f.email.value}`;
  if (f.department.value || f.major.value || f.grade.value) {
    body += `\n学部: ${f.department.value}\n学科: ${f.major.value}\n学年: ${f.grade.value}`;
  }
  body += `\n\n${f.message.value}`;
  const mailto = `mailto:tuatshogi@gmail.com?subject=${encodeURIComponent(f.subject.value)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});
```

---

## 3. ページ設計

### 3.1 トップページ（top.js）— 改修

**セクション構成:**

| 順 | セクション | 使用コンポーネント | 備考 |
|---|---|---|---|
| 1 | Hero | `Hero` | 見出しコピー + サブコピー + CTA「新入部員募集中!」 |
| 2 | News | `NewsItem` × 3 | `NEWS` 配列から直近3件表示。データ配列化 |
| 3 | アイコンナビ | `IconNavCard` × 2 | 活動紹介/大会実績 |
| 4 | 部室マップ | 既存セクション維持 | 現行の内容をそのまま下部に維持 |

**既存との差分:**
- Hero追加（見出しh1はサイト名「東京農工大学将棋部」。既存「お知らせ」はNewsセクションのh2見出しとして残す）
- Newsをデータ配列化（1件固定から3件表示へ）
- ナビカードを駒型→角丸＋駒アイコンに変更（入部案内・部員紹介・ギャラリーカードを除外し、活動紹介・大会実績の2枚に）
- 「一覧へ」リンクは今回スコープ外（アーカイブページ未設計のため省略）

**`NEWS` データ構造:**
```js
const NEWS = [
  { date: '2026.05.24', tag: 'お知らせ', title: '春季団体戦C級2組で準優勝しました', href: 'record.html' },
  // 将来的に追加...
];
```

### 3.2 活動紹介ページ（introduce.js）— 改修（構成大幅変更）

**セクション構成:**

| 順 | セクション | 使用コンポーネント | 内容 |
|---|---|---|---|
| 1 | 見出し | `h1` | 「活動紹介」 |
| 2 | リード文 | `p` | 簡潔な概要文（部の雰囲気・初心者歓迎のトーン） |
| 3 | 基本情報 | `InfoRow` × 4 | 活動日 / 活動場所 / 活動内容 / 雰囲気 |
| 4 | フォトギャラリー | `.photo-card` × 2〜 | 既存2枚の写真を色紙風に表示。3枚以上は別途準備 |

**InfoRow データ:**
```js
const INFO = [
  { icon: '📅', label: '活動日', value: '毎週 月・水・金 17:00〜20:00（要確認）' },
  { icon: '📍', label: '活動場所', value: '小金井キャンパス サークル棟B棟' },
  { icon: '📋', label: '活動内容', value: '自由対局・感想戦・詰将棋研究・他大学との交流戦 等' },
  { icon: '👥', label: '雰囲気', value: '初心者から有段者まで大歓迎。兼部自由。' },
];
```

**注意点:**
- 活動日は現行「毎週金曜日」とモックアップ「月・水・金」で異なるため、部内確認後に決定（未決定事項6）
- 大会・部内戦の内容はInfoRowの活動内容に簡潔に統合し、大会実績ページとの重複を避ける

### 3.3 大会実績ページ（record.js）— 改修

**セクション構成:**

| 順 | セクション | 使用コンポーネント | 内容 |
|---|---|---|---|
| 1 | 見出し | `h1` | 「大会実績」（決定済み） |
| 2 | ハイライト | `HighlightStatCard` × 最大3 | 直近の特筆すべき成績 |
| 3 | 全記録 | `ResultsTable` | 年度別の全記録をテーブル形式に |

**ハイライト抽出ロジック（仮）:**
```js
function getHighlights(records, count = 3) {
  const all = records.flatMap(r => r.entries.map(e => ({ year: r.year, ...e })));
  const gold = all.filter(e => e.highlight === 'gold').slice(0, count);
  return gold.length ? gold : all.slice(0, count);
}
```

**既存との差分:**
- 段落形式（`<p>` 羅列）から `<table>` に変更
- 上部にハイライトカードを追加
- データ構造（`records` 配列）はそのまま活用。表示方法のみ変更

### 3.4 お問い合わせページ（contact.js）— 新規

**セクション構成:**

| 順 | セクション | 使用コンポーネント | 内容 |
|---|---|---|---|
| 1 | 見出し | `h1` | 「お問い合わせ」 |
| 2 | リード文 | `p` | 連絡先の案内文（XのDM誘導など） |
| 3 | フォーム | `ContactForm` | 氏名 / メール / 学部（任意）/ 学科（任意）/ 学年（任意）/ 件名 / メッセージ / 送信ボタン |

**実装方式の検討（未決定事項3）:**

| 方式 | メリット | デメリット |
|---|---|---|
| `mailto:` | サーバー不要、即実装可能 | ユーザーのメールクライアント依存、スパム対策なし |
| Formspree 等 | スパム対策あり、フォーム完結 | 外部サービス依存、無料枠の制限 |
| GitHub Issues API | 内部管理と連携 | トークン露出リスク、公開フォームには不向き |

**推奨:** `mailto:` 方式（JSで本文構築）で暫定実装。学内向けに学部・学科・学年の任意フィールドを追加。運用を見ながら外部サービスの導入を検討。

---

## 4. デザインシステム

### 4.1 カラーパレット（既存CSS変数を流用、新色追加なし）

| トークン | CSS変数 | 値 | 用途 |
|---|---|---|---|
| 背景（生成り） | `--bg` | `#F8F4E8` | ページ背景 |
| パネル背景 | `--bg-panel` | `#EDE8D8` | カード・セクション背景 |
| ヘッダー/フッター背景 | `--bg-dark` | `rgba(15, 51, 80, 0.85)` | 藍色（変更なし） |
| 本文（墨色） | `--text` | `#2C2C2B` | 本文 |
| 明色テキスト | `--text-light` | `#F0F0F0` | 濃色背景上 |
| アクセント（藍色） | `--accent` | `#1A3C5E` | リンク、見出し下線 |
| 緑アクセント | `--accent-green` | `#2D5A27` | CTAボタン、タブアクティブ |
| 金/山吹 | `--gold` | `#C8A84E` | ハイライトラベル、トロフィー |
| 罫線 | `--line` | `#D4CFC0` | 区切り線、枠線 |

**インタラクション色の割り当て:**
- CTAボタン背景 → `--accent-green`（`#2D5A27`）
- CTAボタンホバー → `opacity: 0.85`（既存のopacity方式に統一）
- タブアクティブ → `--accent-green` 背景＋白文字
- リンクホバー → `opacity: 0.7`（既存のopacity方式を維持、色変更はしない）
- 実績ハイライト → `--gold`（既存 `.record-label--gold` 流用）

### 4.2 タイポグラフィ（変更なし）

| 要素 | font-family | ウェイト |
|---|---|---|
| 見出し | `--font-heading`（Shippori Mincho / Noto Serif JP） | 600〜700 |
| 本文 | `--font-body`（Noto Sans JP / Segoe UI） | 400 |
| ナビリンク | `--font-body` | 500 |
| 等幅 | `--font-mono`（JetBrains Mono / Courier New） | — |

### 4.3 スペーシング（既存トークン流用）

| トークン | 値 | 用途例 |
|---|---|---|
| `--space-xs` | 4px | 微調整 |
| `--space-sm` | 8px | アイコン間、バッジ内余白 |
| `--space-md` | 16px | テキスト要素間 |
| `--space-lg` | 24px | セクション内区切り |
| `--space-xl` | 48px | セクション間 |
| `--space-2xl` | 80px | 大セクション間 |

---

## 5. CSS設計

### 5.1 新規コンポーネント用CSS（`act.css` に追記）

全て既存 `act.css` に追記する前提。量が増えた場合はコンポーネント単位でファイル分割を検討。

#### Hero

```css
.hero {
  text-align: center;
  padding: var(--space-2xl) var(--space-md);
  margin-bottom: var(--space-xl);
  background: var(--bg-panel);
  border-radius: 12px;
  position: relative;
}
.hero.bg-grid {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(26, 60, 94, 0.03) 20px, rgba(26, 60, 94, 0.03) 21px),
    repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(26, 60, 94, 0.03) 20px, rgba(26, 60, 94, 0.03) 21px);
  background-color: var(--bg-panel);
}
.hero-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}
.hero-subtitle {
  font-size: 1.1rem;
  margin-bottom: var(--space-lg);
  color: var(--text);
}
.hero-cta {
  display: inline-block;
  padding: 12px 32px;
  background: var(--accent-green);
  color: #fff;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
}
.hero-cta:hover {
  opacity: 0.85;
}
```

#### NewsItem

```css
.news-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}
.news-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--line);
}
.news-item-date {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  white-space: nowrap;
  color: var(--accent);
  min-width: 6em;
}
.news-item-tag {
  display: inline-block;
  font-size: 0.7rem;
  padding: 1px 8px;
  border-radius: 3px;
  background: var(--accent);
  color: #fff;
  white-space: nowrap;
}
.news-item-title {
  flex: 1;
}
@media (max-width: 767px) {
  .news-item {
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  .news-item-date {
    min-width: unset;
    font-size: 0.8rem;
  }
}
```

#### IconNavCard

```css
.icon-nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  justify-content: center;
  margin-bottom: var(--space-2xl);
}
.icon-nav-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  flex: 1;
  min-width: 180px;
  max-width: 260px;
  padding: var(--space-xl) var(--space-md);
  background: var(--bg-dark);
  color: #fff;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.icon-nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.icon-nav-card-icon {
  width: 40px;
  height: 40px;
  color: var(--gold);
}
@media (max-width: 767px) {
  .icon-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }
  .icon-nav-card {
    min-width: unset;
    max-width: unset;
    padding: var(--space-lg) var(--space-md);
    font-size: 1rem;
  }
}
@media (max-width: 480px) {
  .icon-nav {
    grid-template-columns: 1fr;
  }
}
```

#### InfoRow

```css
.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-panel);
  border-radius: 8px;
}
.info-row-icon {
  font-size: 1.5rem;
  line-height: 1;
  min-width: 2em;
}
.info-row-label {
  font-weight: 700;
  min-width: 6em;
  color: var(--accent);
}
.info-row-value {
  flex: 1;
}
@media (max-width: 767px) {
  .info-row {
    flex-direction: column;
    gap: var(--space-xs);
  }
  .info-row-icon {
    font-size: 1.3rem;
  }
  .info-row-label {
    min-width: unset;
  }
}
```

#### HighlightStatCard

```css
.highlight-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}
.highlight-stat-card {
  flex: 1;
  min-width: 200px;
  padding: var(--space-lg);
  background: var(--bg-panel);
  border-radius: 12px;
  text-align: center;
}
.highlight-stat-card-label {
  display: inline-block;
  font-size: 0.85rem;
  padding: 4px 14px;
  border-radius: 4px;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}
.highlight-stat-card-label--gold {
  background: var(--gold);
  color: #fff;
}
.highlight-stat-card-event {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: var(--space-xs);
}
.highlight-stat-card-detail {
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.8;
}
@media (max-width: 767px) {
  .highlight-stats {
    flex-direction: column;
  }
  .highlight-stat-card {
    min-width: unset;
  }
}
```

#### ResultsTable

```css
.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-xl);
}
.results-table th,
.results-table td {
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  border-bottom: 1px solid var(--line);
}
.results-table th {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: var(--accent);
  border-bottom-width: 2px;
}
.results-table tr:hover td {
  background: var(--bg-panel);
}
.results-year {
  margin-bottom: var(--space-lg);
}
.results-year h3 {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--accent);
  margin-bottom: var(--space-sm);
}
@media (max-width: 767px) {
  .results-table {
    font-size: 0.85rem;
  }
  .results-table th,
  .results-table td {
    padding: var(--space-xs) var(--space-sm);
  }
  .results-table thead {
    display: none;
  }
  .results-table tr {
    display: block;
    padding: var(--space-sm);
    margin-bottom: var(--space-sm);
    background: var(--bg-panel);
    border-radius: 8px;
  }
  .results-table td {
    display: block;
    border: none;
    padding: 2px 0;
  }
  .results-table td::before {
    content: attr(data-label);
    font-weight: 700;
    display: inline-block;
    min-width: 4em;
    color: var(--accent);
  }
}
```

#### ContactForm

```css
.contact-form {
  max-width: 560px;
  margin: 0 auto;
}
.contact-form-field {
  margin-bottom: var(--space-lg);
  border: none;
  padding: 0;
}
.contact-form-field legend {
  font-weight: 700;
  color: var(--accent);
  margin-bottom: var(--space-sm);
}
.contact-form-inline {
  display: flex;
  gap: var(--space-md);
}
.contact-form-inline > div {
  flex: 1;
}
@media (max-width: 767px) {
  .contact-form-inline {
    flex-direction: column;
    gap: var(--space-md);
  }
}
.contact-form label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: 700;
  color: var(--accent);
}
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--line);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 1rem;
  background: #fff;
}
.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--accent-green);
}
.contact-form textarea {
  min-height: 150px;
  resize: vertical;
}
.contact-form button {
  display: inline-block;
  padding: 12px 32px;
  background: var(--accent-green);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.contact-form button:hover {
  opacity: 0.85;
}
```

---

## 6. データ設計

### 6.1 各ページデータ構造

#### NEWS（top.js）

```js
const NEWS = [
  { date: '2026.05.24', tag: 'お知らせ', title: '春季団体戦C級2組で準優勝しました', href: 'record.html' },
];
```

#### INFO（introduce.js）

```js
const INFO = [
  { icon: '📅', label: '活動日', value: '毎週 月・水・金 17:00〜20:00' },
  { icon: '📍', label: '活動場所', value: '小金井キャンパス サークル棟B棟' },
  { icon: '📋', label: '活動内容', value: '自由対局・感想戦・詰将棋研究・他大学との交流戦 等' },
  { icon: '👥', label: '雰囲気', value: '初心者から有段者まで大歓迎。兼部自由。' },
];
```

#### RECORDS（record.js）— 既存構造維持

```js
const RECORDS = [
  {
    year: 2026,
    label: '2026年度',
    entries: [
      { date: '2026.05.24', event: '春季団体戦C級2組', result: '準優勝', detail: '6勝1敗でC1級へ昇級', highlight: 'gold' }
    ]
  },
  // ...
];
```

### 6.2 拡張性への配慮

Newsは今後増える性質のコンテンツ。将来的なGitHub Contents APIによるMarkdown駆動への移行を見据え、データ構造のフィールド設計はそれを意識する:

- 日付: `YYYY.MM.DD` 形式で統一（ソート可能な文字列形式）
- カテゴリ/タグ: 文字列で保持。将来的にタグ複数対応も視野
- href/src: 相対パスで保持。外部リンクはスキーム付き

---

## 7. レスポンシブ設計

### 7.1 ブレークポイント（既存踏襲）

| 名称 | 幅 | 対象 |
|---|---|---|
| モバイル | ~ 767px | スマートフォン |
| デスクトップ | 768px ~ | PC / タブレット |

### 7.2 コンポーネント別レスポンシブ

| コンポーネント | モバイル（~767px） | デスクトップ（768px~） |
|---|---|---|
| Hero | `padding` 縮小、フォントサイズ調整 | 最大サイズ |
| Newsリスト | flex-wrapで折り返し、日付縮小 | 横並び |
| IconNavCard | 2列グリッド（480px以下で1列） | 横並び（`flex-wrap`、4枚） |
| InfoRow | 縦積み（アイコン＋ラベル＋値を縦に） | 横並び |
| HighlightStatCard | 縦積み | 横並び3枚 |
| ResultsTable | 年度ごとに区切り、各行カード風 or `overflow-x: auto` | h3＋通常テーブル |
| MemberCardGrid | （部員紹介ページは対象外） | （部員紹介ページは対象外） |
| FilterTabs | （ギャラリーページは対象外） | （ギャラリーページは対象外） |
| PhotoGrid | （ギャラリーページは対象外） | （ギャラリーページは対象外） |
| ContactForm | 全幅 `max-width: 100%` | `max-width: 560px` 中央寄せ |

---

## 8. 新規JSインタラクション設計

### 8.1 ページ共通JSパターン（全ページ）

各ページJSは即時関数内で動作。冒頭で `document.title` と `meta description` を設定する慣習を新規ページでも踏襲:

```js
(function() {
  const c = document.getElementById('content');
  if (!c) return;
  document.title = 'ページタイトル | 東京農工大学将棋部';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = 'ページの説明文';

  // 以下DOM構築...
})();
```

---

## 9. アクセシビリティ

### 9.1 alt属性

| 画像 | alt（変更後） |
|---|---|
| 部室写真（`20260709_180604.jpg`） | 「部室での活動風景 — 盤駒を囲む部員たち」 |
| 大会写真（`20260524_191148.jpg`） | 「大会参加時の集合写真」 |
| キャンパスマップ（`cumpasmap.jpg`） | 「小金井キャンパスマップ — サークル棟B棟の位置」 |

### 9.2 フォームアクセシビリティ

- 全入力フィールドに `<label>` 対応付け
- 必須フィールドに `required` 属性
- エラーメッセージ表示対応（mailto方式の場合は省略可）

### 9.3 セマンティック構造

- 見出しは `h1` → `h2` → `h3` の正しい階層で配置
- ナビゲーションは `<nav>` 要素を使用
- 画像には `alt` 属性を必ず設定

---

## 10. 実装手順

### Phase 1: データ準備・CSS追加

1. `act.css` に新規コンポーネントのCSSを追記（5章参照）
2. `top.js` の `NEWS` データ配列化（モックから開始）
3. `record.js` の `RECORDS` 確認・整形
4. `introduce.js` の `INFO` データ設計（活動日は確認後に確定）

### Phase 2: 既存ページ改修

1. **top.js** — Heroセクション追加、Newsデータ配列化、IconNavCard4枚に変更
2. **introduce.js** — InfoRow形式に再構成、既存写真は色紙風で維持
3. **record.js** — HighlightStatCard追加、ResultsTableに変更

### Phase 3: 新規ページ作成

1. **contact.js** — `mailto:` 方式のフォーム（JSで本文構築）。氏名・メール・件名・メッセージに加え、学内向け任意フィールド（学部・学科・学年）を `fieldset` でグループ化

### Phase 4: 調整・確認

1. 全ページの `document.title` / `meta description` 設定確認
2. レスポンシブ動作確認（モバイル/デスクトップ）
3. 既存 `entry.js`（入部案内）が影響を受けていないか確認

---

## 付録: 未決定事項ステータス（要件 7章より）

| # | 項目 | 本設計書での仮定 | 確認先 |
|---|---|---|---|
| 1 | 大会実績 h1 名称 | 「大会実績」に変更済み（決定済み） | — |
| 2 | News「一覧へ」リンク | 今回スコープ外（省略） | — |
| 3 | お問い合わせ実装方式 | `mailto:` 方式（JSで本文構築）で暫定実装。学内向け任意フィールド（学部・学科・学年）を追加（決定済み） | — |
| 4 | 活動日の正確な情報 | 「要確認」で実装、後日修正 | 部内確認 |
| 5 | 入部案内の改修 | 現状維持（今回スコープ外） | — |
