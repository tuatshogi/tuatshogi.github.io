# 東京農工大学将棋部サイト 詳細設計書

最終更新: 2026-07-25
ベース: requirements.md v1.0

---

## 目次

1. [アーキテクチャ設計](#1-アーキテクチャ設計)
2. [コンポーネント設計](#2-コンポーネント設計)
3. [ページ設計](#3-ページ設計)
4. [デザインシステム](#4-デザインシステム)
5. [CSS設計](#5-css設計)
6. [ルーティング設計](#6-ルーティング設計)
7. [データ設計](#7-データ設計)
8. [レスポンシブ設計](#8-レスポンシブ設計)
9. [パフォーマンス最適化](#9-パフォーマンス最適化)
10. [アクセシビリティ](#10-アクセシビリティ)
11. [SEO](#11-seo)
12. [実装手順](#12-実装手順)

---

## 1. アーキテクチャ設計

### 1.1 全体構成

```
index.html          # エントリーポイント (HTML骨架 + CSS/JS読み込み)
  ├── act.css       # グローバルスタイル (全ページ共通)
  ├── act.js        # アプリケーションシェル (ヘッダー/フッター生成 + ルーティング)
  ├── top.js        # トップページ コンテンツ
  ├── entry.js      # 入部案内ページ コンテンツ
  ├── record.js     # 大会記録ページ コンテンツ
  ├── introduce.js  # 活動紹介ページ コンテンツ
  └── assets/       # 画像・フォント等
```

### 1.2 ページ読み込みフロー

```
index.html ロード
  └→ act.js 実行
       ├→ DATA オブジェクトからヘッダー生成 → document.body に挿入
       ├→ content div を生成 → document.body に挿入
       ├→ DATA オブジェクトからフッター生成 → document.body に挿入
       └→ loadPage('top.html') を呼び出し
            └→ top.html を top.js に置換して fetch
                 ├→ 成功: script として DOM に追加 → ページ内容が #content に描画
                 └→ 失敗: 旧 .html を fetch → innerHTML で #content に挿入
```

### 1.3 データフロー

```
DATA (act.js 内のグローバルオブジェクト)
  ├→ navitems → createNav() → ヘッダーナビ / フッターナビ
  ├→ footer   → renderFooter() → フッターの連絡先・著作権
  ├→ img      → ヘッダーの盾エンブレム
  └→ brand    → ヘッダーのロゴ画像

各ページJS (top.js / entry.js / record.js / introduce.js)
  └→ document.getElementById('content') を取得し、DOM構築して子要素として追加
```

---

## 2. コンポーネント設計

### 2.1 ヘッダー (`site-header`)

| 項目 | 仕様 |
|---|---|
| 背景 | `rgba(15, 51, 80, 0.85)` (藍色) |
| 高さ | 可変 (padding: 20px vertical) |
| position | sticky (top: 0, z-index: 50) |
| 配置 | flex: 左に盾エンブレム + ロゴ、右にナビゲーション |
| 子要素 | `.image` (盾エンブレム, クリックでトップへ), `.brand` (ロゴ), `.site-nav`, `.nav-toggle` |

### 2.2 フッター (`site-footer`)

| 項目 | 仕様 |
|---|---|
| 背景 | ヘッダー同様 `rgba(15, 51, 80, 0.85)` |
| 配置 | flex column, 中央寄せ |
| 子要素 | `.footer-nav` (ナビリンク), `.footer-x` (X/Twitter SVG), `.footer-left` (メール + 著作権) |

### 2.3 ナビカード (`body-nav-card`)

| 項目 | 仕様 |
|---|---|
| shape | `clip-path: polygon(50% 0%, 85.6% 18.2%, 100% 100%, 0% 100%, 14.4% 18.2%)` (将棋の駒型) |
| 背景 | ヘッダー同様 `rgba(15, 51, 80, 0.85)` |
| テキスト | 白、1.6rem、太字、中央寄せ |
| ホバー | translateY(-4px) + box-shadow強化 |
| 余白 | gap: 160px → 60~90px に調整予定 |

**変更計画:**
- カード間ギャップ: 160px → 60px (デスクトップ) / 40px (モバイル)
- パディング: 160px 24px 150px → 80px 24px (デスクトップ) / 60px 24px (モバイル)
- カードサイズ: flex: 1 → min-width: 220px / max-width: 320px で上限設定

### 2.4 コンテンツ領域 (`#content`)

| 項目 | 仕様 |
|---|---|
| 背景 | `var(--bg)` = `#F8F4E8` (生成り色、変更なし) |
| パディング | `6vh clamp(16px, 6vw, 80px)` |
| 最大幅 | 960px (読みやすさのため中央寄せ) |

---

## 3. ページ設計

### 3.1 トップページ (`top.js`)

**セクション構成:**

| # | セクション | 内容 | 備考 |
|---|---|---|---|
| 1 | ヒーロー/お知らせ | h1「お知らせ」+ hr + 最新ニュース (2026.05.24 春季団体戦) + 「詳しく見る」リンク | 要約表示し、詳細はトップページ再読み込みで展開 |
| 2 | ナビカード群 | 入部案内・大会記録・活動紹介へのリンクカード | 駒シルエット維持、余白調整 |
| 3 | 部室マップ | h1「部室マップ」+ hr + キャンパスマップ画像 + 説明文 + 引用元リンク | |

**将来的な拡張:**
- ヒーローセクション: 将棋盤モチーフの背景 + 制作中の3D/2D駒アセットをアクセントに配置
- 「詳しく見る」リンクの動作: モーダル/アコーディオン開閉に変更

### 3.2 入部案内ページ (`entry.js` 新規作成)

**セクション構成:**

| # | セクション | ID候補 |
|---|---|---|
| 1 | 入部案内 (h1) | `#section-entry-top` |
| 2 | 新入生の方へ (h2) | `#section-for-newstudents` |
| 3 | 活動場所 (h2) | `#section-location` |
| 4 | 活動内容 (h2) | `#section-activities` |
| 5 | 部費 (h2) | `#section-fee` |
| 6 | 入部方法 (h2) | `#section-join` |
| 7 | その他 (h2) | `#section-other` |

### 3.3 活動紹介ページ (`introduce.js` 新規作成)

**セクション構成:**

| # | セクション | 画像 | 備考 |
|---|---|---|---|
| 1 | 活動紹介 (h1) | — | |
| 2 | 日頃の活動 (h2) | `20260709_180604.jpg` | 部室での活動写真、色紙風フレーム |
| 3 | 大会・部内戦・レーティング (h2) | `20260524_191148.jpg` | 大会風景写真、色紙風フレーム |

**写真の見せ方 (色紙風統一):**
- 薄い枠線: `border: 2px solid var(--line)`
- ドロップシャドウ: `box-shadow: 4px 4px 12px rgba(0,0,0,0.12)`
- 最大幅: 600px (デスクトップ)
- 少し回転: `transform: rotate(0.5deg)` で自然な紙感

### 3.4 大会記録ページ (`record.js` 新規作成)

**セクション構成:**

| # | セクション | 内容 |
|---|---|---|
| 1 | 大会記録 (h1) | — |
| 2 | 2026年度 | 春季団体戦C級2組 準優勝 → C1級へ昇級 |
| 3 | 2024年度 | 秋季B2級5位(残留) / 春季B2級3位(2期連続) |

**表示仕様:**
- 年度ごとにセクション区切り (hr または背景色で区別)
- 年度見出し: h2、右側に年のラベルバッジ
- ハイライト (優勝・準優勝): 控えめな山吹色のラベル/アイコン
- 新年度データ追加時の拡張: 単純にデータ配列に追加する方式

---

## 4. デザインシステム

### 4.1 カラーパレット

| トークン | CSS変数名 | 値 | 用途 |
|---|---|---|---|
| 生成り | `--bg` | `#F8F4E8` | ページ背景 (変更なし) |
| パネル背景 | `--bg-panel` | `#EDE8D8` | カード・セクション背景 (微調整) |
| 藍色(準) | — | `rgba(15, 51, 80, 0.85)` | ヘッダー・フッター・ナビカード背景 (現状維持) |
| 藍色アクセント | `--accent` | `#1A3C5E` | リンク、見出し下線 (現状 `#0b5eef` から変更) |
| 松葉色(差し色) | `--accent-green` | `#2D5A27` | 一部アクセント、盾ロゴの緑と連携 |
| 山吹色(ハイライト) | `--gold` | `#C8A84E` | 優勝/準優勝ラベル、区切り装飾 |
| 墨色(本文) | `--text` | `#2C2C2B` | 本文，現状 `#000000` から変更 |
| 白(明色テキスト) | `--text-light` | `#F0F0F0` | 濃色背景上のテキスト (旧 `--text-dim`) |

### 4.2 タイポグラフィ

| 要素 | フォント | 代替 | ウェイト |
|---|---|---|---|
| 見出し (h1) | Shippori Mincho B | Noto Serif JP | 700 (Bold) |
| 見出し (h2) | Shippori Mincho | Noto Serif JP | 600 (SemiBold) |
| 本文 | Noto Sans JP | Zen Kaku Gothic New | 400 (Regular) |
| ナビリンク | Noto Sans JP | — | 500 (Medium) |
| コード/等幅 | JetBrains Mono | Courier New | — |

**Webフォント読み込み戦略:**
- Google Fonts API から読み込み
- `font-display: swap` でFOUT許容
- サブセット: Google Fonts の日本語サブセット (Japanese または `subset` パラメータ) を使用
- 必要なら unicode-range でさらに絞る

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@600;700&display=swap" rel="stylesheet">
```

### 4.3 モチーフ詳細

| モチーフ | 適用箇所 | 実現方法 |
|---|---|---|
| 将棋駒シルエット | ナビカード | `clip-path: polygon(...)` (維持) |
| 将棋盤格子 | セクション背景 | CSS `background-image: repeating-linear-gradient` で極薄グリッド (透過2%) |
| 麻の葉 | オプション: サイド装飾 | CSS背景パターン (透過5%) |
| 色紙風フレーム | 写真 | `border` + `box-shadow` + `transform: rotate(0.5deg)` + `background: #FFFEF5` |

### 4.4 スペーシング

| トークン | 値 | 適用 |
|---|---|---|
| `--space-xs` | 4px | 微調整 |
| `--space-sm` | 8px | アイコン間 |
| `--space-md` | 16px | テキスト要素間 |
| `--space-lg` | 24px | セクション内区切り |
| `--space-xl` | 48px | セクション間 |
| `--space-2xl` | 80px | 大セクション間 |

---

## 5. CSS設計

### 5.1 カスタムプロパティ (CSS Variables)

`:root` に定義する変数一覧:

```css
:root {
  /* Colors */
  --bg: #F8F4E8;
  --bg-panel: #EDE8D8;
  --bg-dark: rgba(15, 51, 80, 0.85);
  --text: #2C2C2B;
  --text-light: #F0F0F0;
  --accent: #1A3C5E;
  --accent-green: #2D5A27;
  --gold: #C8A84E;
  --line: #D4CFC0;

  /* Typography */
  --font-heading: 'Shippori Mincho', 'Noto Serif JP', serif;
  --font-body: 'Noto Sans JP', 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;
  --space-2xl: 80px;

  /* Layout */
  --content-max-width: 960px;
  --header-padding-y: 20px;
  --header-padding-x: clamp(16px, 6vw, 80px);
}
```

### 5.2 スケルトン構造

```css
/* 1. Reset & Base */
* { box-sizing: border-box; margin: 0; padding: 0; }

/* 2. Layout */
html { background: var(--bg-dark); }
body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
#wrap { display: flex; flex-direction: column; min-height: 100vh; }

/* 3. Header / Footer (現状維持) */
.site-header { /* 現状のスタイル維持 */ }
.site-footer { /* 現状のスタイル維持 */ }

/* 4. Navigation */
.site-nav { display: none; }
.site-nav.open { display: block; }
@media (min-width: 768px) { .site-nav { display: flex; } }

/* 5. Content Area */
#content { flex: 1; padding: 6vh clamp(16px, 6vw, 80px); max-width: var(--content-max-width); margin: 0 auto; width: 100%; }

/* 6. Typography */
#content h1 { font-family: var(--font-heading); font-size: 2rem; border-bottom: 2px solid var(--accent); }
#content h2 { font-family: var(--font-heading); font-size: 1.5rem; }

/* 7. Components */
.body-nav-card { /* clip-path + 調整後パディング */ }
.photo-card { /* 色紙風フレーム */ }
```

### 5.3 色紙風フォトカード (新規)

```css
.photo-card {
  border: 2px solid var(--line);
  border-radius: 2px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
  background: #FFFEF5;
  padding: 8px;
  transform: rotate(0.5deg);
  transition: transform 0.3s ease;
  max-width: 600px;
  width: 100%;
}
.photo-card:hover {
  transform: rotate(0deg) scale(1.01);
}
.photo-card img {
  display: block;
  width: 100%;
  height: auto;
}
```

### 5.4 将棋盤格子背景 (新規)

```css
.bg-grid {
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(26, 60, 94, 0.03) 20px,
      rgba(26, 60, 94, 0.03) 21px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(26, 60, 94, 0.03) 20px,
      rgba(26, 60, 94, 0.03) 21px
    );
}
```

### 5.5 ハイライトラベル (大会記録用, 新規)

```css
.record-label {
  display: inline-block;
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: 0.05em;
}
.record-label--gold {
  background: var(--gold);
  color: #fff;
}
.record-label--default {
  background: var(--bg-panel);
  color: var(--text);
}
```

---

## 6. ルーティング設計

### 6.1 現状の仕組み (変更なし)

```
act.js loadPage(htmlPath)
  ├→ htmlPath の拡張子を .html → .js に置換
  ├→ fetch(jsPath) を試行
  │   ├→ 成功: script タグとして DOM 追加 → 各ページJSが #content を操作
  │   └→ 失敗: fetch(htmlPath) にフォールバック → innerHTML 代入
  └→ グローバルな loadPage 関数として window に生える
```

### 6.2 URLとタイトル更新 (今回の追加)

各ページJSで、DOM構築後に以下を実行:

```js
document.title = 'ページタイトル | 東京農工大学将棋部';
document.querySelector('meta[name="description"]').content = 'ページに応じたdescription';
```

**各ページのタイトル:**

| ページ | title |
|---|---|
| トップ | 東京農工大学将棋部 |
| 入部案内 | 入部案内 | 東京農工大学将棋部 |
| 活動紹介 | 活動紹介 | 東京農工大学将棋部 |
| 大会記録 | 大会記録 | 東京農工大学将棋部 |

### 6.3 ハッシュルーティング (将来対応)

本リニューアルでの実装は未確定 (要件 6.1 確認待ち)。実装する場合:

```
index.html#top        → loadPage('top.html')
index.html#entry      → loadPage('entry.html')
index.html#record     → loadPage('record.html')
index.html#introduce  → loadPage('introduce.html')
```

```js
function handleRoute() {
  const hash = location.hash.slice(1) || 'top';
  const pageMap = { top: 'top.html', entry: 'entry.html', record: 'record.html', introduce: 'introduce.html' };
  if (pageMap[hash]) loadPage(pageMap[hash]);
}
window.addEventListener('hashchange', handleRoute);
```

---

## 7. データ設計

### 7.1 DATA オブジェクト構造

```js
const DATA = {
  img: 'Designer.png',          // 盾エンブレム画像パス
  brand: 'logo.png',            // ブランドロゴ画像パス
  navitems: [
    { label: 'トップ',      href: 'top.html' },
    { label: '入部案内',    href: 'entry.html' },
    { label: '大会記録',    href: 'record.html' },
    { label: '活動紹介',    href: 'introduce.html' },
    { label: 'x(旧twitter)', href: 'https://x.com/tuatshogiclub' }
  ],
  footer: {
    copyright: '東京農工大学将棋部',
    contact: 'tuatshogi@gmail.com',
    x: 'https://x.com/tuatshogiclub'
  }
};
```

### 7.2 大会記録データ構造 (将来のデータ駆動化案)

```js
const RECORDS = [
  {
    year: 2026,
    label: '2026年度',
    entries: [
      { date: '2026.05.24', event: '春季団体戦C級2組', result: '準優勝', detail: '6勝1敗でC1級へ昇級', highlight: 'gold' }
    ]
  },
  {
    year: 2024,
    label: '2024年度',
    entries: [
      { date: '2024.10.20', event: '秋季団体戦B2級', result: '5位', detail: '残留', highlight: null },
      { date: '2024.05.19', event: '春季団体戦B2級', result: '3位', detail: '2期連続', highlight: null }
    ]
  }
];
```

---

## 8. レスポンシブ設計

### 8.1 ブレークポイント

| 名称 | 幅 | 対象 |
|---|---|---|
| モバイル | ~ 767px | スマートフォン |
| タブレット | 768px ~ 1023px | タブレット縦持ち |
| デスクトップ | 1024px ~ | PC / タブレット横持ち |

### 8.2 レイアウト変更点

| コンポーネント | モバイル (~767px) | タブレット (768~1023px) | デスクトップ (1024px~) |
|---|---|---|---|
| ヘッダーナビ | ハンバーガーメニュー (absolute dropdown) | flex表示 | flex表示 |
| ナビカード | flex column, gap 40px | flex row wrap, gap 60px | flex row wrap, gap 60px, min 220px |
| フッターナビ | flex column, gap 12px | flex row, gap 24px | flex row, gap 24px |
| 写真 | 100%幅 | max 500px | max 600px |
| コンテンツパディング | 6vh 16px | 6vh 4vw | 6vh 6vw (max 960px) |

---

## 9. パフォーマンス最適化

### 9.1 Webフォント最適化

- `preconnect` で Google Fonts のオリジンに事前接続
- `font-display: swap` でフォント読み込み中もテキスト表示
- 日本語サブセット使用 (Google Fonts の `subset=japanese`)
- フォント読み込み中は `font-family` のフォールバックでレイアウトシフト防止

### 9.2 画像最適化

| 画像 | 現状 | 対応 |
|---|---|---|
| `Designer.png` | 100x100, PNG | 圧縮済みか確認、WebP提供も検討 |
| `logo.png` | 可変, PNG | 同上 |
| `cumpasmap.jpg` | 600px max, JPEG | 圧縮率確認 |
| `20260524_191148.jpg` | 600px max, JPEG | 適切なサイズにリサイズ・圧縮 |
| `20260709_180604.jpg` | 600px max, JPEG | 同上 |

### 9.3 読み込み戦略

- CSS: 先頭で読み込み済み (レンダリングブロックだが小さなファイル)
- JS: `defer` や `type="module"` は現状未使用だが、act.js は body 終端直前で読み込み済み
- 各ページJS: 動的 fetch + script 挿入でレイジーロード

---

## 10. アクセシビリティ

### 10.1 alt属性 統一対応

| 画像 | 現状のalt | 変更後 |
|---|---|---|
| `Designer.png` (盾エンブレム) | 「表示できませんでした」 | 「東京農工大学将棋部 エンブレム」 |
| `logo.png` | 「東京農工大学将棋部」 | 変更なし (適切) |
| `cumpasmap.jpg` | alt属性なし | 「小金井キャンパスマップ — サークル棟B棟の位置」 |
| `20260709_180604.jpg` | 「alt text」 | 「部室での活動風景 — 盤駒を囲む部員たち」 |
| `20260524_191148.jpg` | 「alt text」 | 「大会参加時の集合写真」 |

### 10.2 コントラスト比

| 組合せ | 現状 | 変更後 | WCAG基準 |
|---|---|---|---|
| 本文 (#2C2C2B) / 背景 (#F8F4E8) | — | 約15:1 | AA/AAH 合格 |
| リンク (#1A3C5E) / 背景 (#F8F4E8) | — | 約8:1 | AA/AAH 合格 |
| 白テキスト / ヘッダー背景 | — | 約9:1 | AA/AAH 合格 |

### 10.3 セマンティックHTML

- 各見出しは h1 / h2 で階層化
- ナビゲーションは `<nav>` 要素
- フッターは `<footer>` 要素
- `aria-label` を適宜付与 (ハンバーガーメニュー等)

---

## 11. SEO

### 11.1 メタタグ (index.html に集約)

```html
<title>東京農工大学将棋部</title>
<meta name="description" content="東京農工大学将棋部の公式Webサイト。活動日時・場所、大会成績、入部案内を掲載。初心者・経験者問わず大歓迎。">
<meta name="keywords" content="東京農工大学,将棋,将棋部,サークル,大学将棋,小金井,府中">
```

### 11.2 OGP (今後追加検討)

```html
<meta property="og:title" content="東京農工大学将棋部">
<meta property="og:description" content="東京農工大学将棋部の公式Webサイトです。">
<meta property="og:type" content="website">
<meta property="og:url" content="https://tuatshogi.github.io/">
<meta property="og:image" content="https://tuatshogi.github.io/Designer.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary">
```

### 11.3 ページ別 title / description

| ページ | title | description |
|---|---|---|
| トップ | 東京農工大学将棋部 | (デフォルト) |
| 入部案内 | 入部案内 | 東京農工大学将棋部 | 新入生・経験者向け入部案内。活動場所・内容、部費無料、入部方法を掲載。 |
| 活動紹介 | 活動紹介 | 東京農工大学将棋部 | 日頃の活動や大会・部内戦の様子を写真とともに紹介。 |
| 大会記録 | 大会記録 | 東京農工大学将棋部 | 年度別の大会成績一覧。春季/秋季団体戦の結果を掲載。 |

---

## 12. 実装手順

### Phase 1: 基盤整備 (CSS変数・デザインシステム導入)

1. `act.css` に `:root` 変数セットを追加 (色・フォント・スペーシング)
2. Webフォント (Google Fonts) の `<link>` を `index.html` に追加
3. 既存のスタイルを変数参照に置き換え (`#000000` → `var(--text)` 等)
4. 新しいスタイル (`.photo-card`, `.bg-grid`, `.record-label`) を追加

### Phase 2: 各ページJSのセマンティック化

1. `entry.js` / `introduce.js` / `record.js` を新規作成 (`.html` の内容をJS化)
2. 各JSに section ID を付与
3. 各JSに `document.title` / `meta description` 更新処理を追加
4. 画像の alt 属性を修正

### Phase 3: デザインリファイン

1. ナビカードの余白調整 (gap: 160px → 60px)
2. `#content` に最大幅 (960px) + 中央寄せ
3. 写真を色紙風フレームで統一 (`.photo-card`)
4. 大会記録にハイライトラベル追加

### Phase 4: 最終調整

1. アクセシビリティ確認 (alt属性、コントラスト、セマンティック構造)
2. レスポンシブ動作確認 (モバイル/タブレット/デスクトップ)
3. パフォーマンス確認 (フォント読み込み、画像サイズ)
4. 不要ファイル削除の判断 (旧 `.html` ファイル)
