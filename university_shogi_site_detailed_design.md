# 大学将棋部公式サイト 詳細設計書

- 対象要件: `university_shogi_site_requirements.md`
- 対象サイト: 東京農工大学将棋部公式Webサイト
- 文書版数: 1.0
- 作成日: 2026-08-03

---

## 1. 本書の目的

本書は、大学将棋部公式サイトのトップページを React と Tailwind CSS で実装するための詳細仕様を定義する。対象は共通ヘッダー、ヒーロー、About、共通フッターであり、コンポーネント構造、表示内容、状態、レスポンシブ動作、アクセシビリティ、テスト条件までを実装可能な粒度で示す。

## 2. 前提・設計判断

### 2.1 現行資産との関係

現行サイトは `index.html`、`act.js`、`act.css` を中心とした静的 JavaScript 構成である。一方、対象要件は React と Tailwind CSS を必須としているため、本設計ではトップページおよび共通レイアウトを React コンポーネントへ移行する。

既存ヘッダー／フッターについて「そのまま使用する」とは、DOMや既存CSSの完全流用ではなく、次の情報・見た目・振る舞いを維持して React で再実装することを意味する。

- `Designer.png` と `logo.png`
- ナビゲーションの文言、URL、順序
- X URL `https://x.com/tuatshogiclub`
- 連絡先 `tuatshogi@gmail.com`
- コピーライト `© 東京農工大学将棋部`
- 紺色背景、デスクトップの横並び、モバイルメニュー

### 2.2 対象範囲

| 区分 | 対象 |
|---|---|
| 対象 | Header、HeroSection、AboutSection、FeatureCard、Footer |
| 対象 | レスポンシブ、キーボード操作、基本的なSEO、表示試験 |
| 対象外 | CMS、認証、予約API、管理画面、アクセス解析、他ページ本文のReact化 |

### 2.3 未確定事項の扱い

| 項目 | 初期値／実装方針 | 確定後の変更箇所 |
|---|---|---|
| 大学名 | `東京農工大学` | `siteConfig.universityName` |
| 見学希望の連絡先 | X（旧Twitter）のDMへ誘導。プロフィールURLは `https://x.com/tuatshogiclub` | `siteConfig.cta.visitDmHref` |
| 活動日程先 | `introduce.html` | `siteConfig.cta.scheduleHref` |
| 内部ページの方式 | 現行URLを維持 | ルーター導入時に `navigationItems` のみ変更 |
| タブレットのカード列数 | 2列 | Tailwindクラス変更 |

## 3. システム構成

### 3.1 採用技術

| 項目 | 仕様 |
|---|---|
| UI | React（関数コンポーネント） |
| 言語 | JavaScript / JSX |
| スタイル | Tailwind CSS |
| 状態管理 | React `useState`（モバイルメニューのみ） |
| データ | ローカル定数。API通信なし |
| 画像 | 既存の `Designer.png`、`logo.png` |
| フォント | Shippori Mincho、Noto Serif JP、Noto Sans JP |

ビルドツールやReactの具体的なバージョンは要件で未指定のため、実装開始時点のプロジェクト標準に合わせる。新規構築の場合は Vite を使用する。

### 3.2 推奨ディレクトリ

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── home/
│       ├── HeroSection.jsx
│       ├── AboutSection.jsx
│       └── FeatureCard.jsx
├── data/
│   └── siteConfig.js
└── assets/
    ├── Designer.png
    └── logo.png
tailwind.config.js
index.html
```

既存画像を公開ディレクトリに残す場合は `/Designer.png`、`/logo.png` として参照してもよい。ただし参照方式はプロジェクト内で統一する。

### 3.3 コンポーネントツリー

```text
App
└── UniversityShogiHome
    ├── Header
    ├── main
    │   ├── HeroSection
    │   └── AboutSection
    │       └── FeatureCard × 3
    └── Footer
```

## 4. データ設計

### 4.1 サイト設定

表示文言とリンクはコンポーネントへ直書きせず、`siteConfig.js` で一元管理する。

```js
export const siteConfig = {
  universityName: "東京農工大学",
  clubName: "東京農工大学将棋部",
  emblemSrc: "/Designer.png",
  logoSrc: "/logo.png",
  contactEmail: "tuatshogi@gmail.com",
  xUrl: "https://x.com/tuatshogiclub",
  cta: {
    visitDmHref: "https://x.com/tuatshogiclub",
    scheduleHref: "introduce.html",
  },
};
```

### 4.2 ナビゲーションデータ

```js
export const navigationItems = [
  { label: "トップ", href: "top.html", external: false },
  { label: "入部案内", href: "entry.html", external: false },
  { label: "大会記録", href: "record.html", external: false },
  { label: "活動紹介", href: "introduce.html", external: false },
  { label: "X（旧Twitter）", href: "https://x.com/tuatshogiclub", external: true },
];
```

フッターでは `external === false` の4件のみをナビゲーションとして描画し、Xは独立リンクとして表示する。

### 4.3 Aboutカードデータ

```js
export const features = [
  {
    id: "beginner-friendly",
    number: "01",
    title: "初心者歓迎",
    description: "将棋を始めたばかりでも大丈夫。部員同士でルールや考え方を学び、経験を問わず気軽に参加できます。",
    motif: "歩",
  },
  {
    id: "flexible-schedule",
    number: "02",
    title: "柔軟な活動頻度",
    description: "授業やアルバイトを優先しながら、自分の予定に合わせて参加できます。無理なく続けられる活動スタイルです。",
    motif: "時",
  },
  {
    id: "playing-environment",
    number: "03",
    title: "充実の対局環境",
    description: "日々の対局に加え、棋譜検討や研究も行えます。初心者から経験者まで、それぞれが成長できる環境です。",
    motif: "研",
  },
];
```

`motif` は装飾文字であり、スクリーンリーダーからは隠す。内容理解に必要な情報は `title` と `description` のみで完結させる。

## 5. 画面設計

### 5.1 ページ共通

| 項目 | 仕様 |
|---|---|
| 言語 | `<html lang="ja">` |
| 背景 | `#F8FAF8` |
| 基本文字色 | `#272A2A` |
| 最小幅 | 320px |
| コンテンツ最大幅 | 1200px |
| 横余白 | SP 20px、TB 32px、PC 48px |
| セクション縦余白 | SP 80px、PC 112px |
| フォーカス | 2px以上の可視アウトライン |

Header固定分の表示領域を確保するため、`main` にヘッダー実測高相当の上余白を設定する。初期設計値はSP 72px、PC 96pxとする。Headerを `sticky` とする場合は追加余白を設けない。

### 5.2 Header

#### 構造

```text
header
└── div（最大幅コンテナ）
    ├── a（トップへのブランドリンク）
    │   ├── img（エンブレム）
    │   └── img（ロゴ）
    ├── nav（PCナビゲーション）
    └── button（モバイルMENU）
nav（モバイルメニュー）
```

#### 表示仕様

| 項目 | PC（768px以上） | SP（767px以下） |
|---|---|---|
| 位置 | 画面上部に固定 | 画面上部に固定 |
| 高さ目安 | 96px | 72px |
| 背景 | `rgba(15, 51, 80, 0.95)` | 同左 |
| ナビ | 横並び | 初期非表示、MENUで展開 |
| エンブレム | 64〜72px | 48px |
| ロゴ | 高さ64px以内 | 幅45vw以内、高さ44px以内 |

#### 状態とイベント

| 操作 | 結果 |
|---|---|
| MENUクリック | `isMenuOpen` を反転し、モバイルナビを開閉 |
| モバイルナビ内リンククリック | メニューを閉じて遷移 |
| Escapeキー | 開いているメニューを閉じ、MENUボタンへフォーカスを戻す |
| 画面幅がPCへ変化 | メニュー状態を閉じる |
| ブランドクリック | `top.html` へ遷移 |

MENUボタンには `aria-expanded`、`aria-controls="mobile-navigation"` を付ける。開閉領域はDOMから除去せず、CSSで高さと可視性を制御する場合も、閉状態では `visibility: hidden` などによりフォーカスを受けないようにする。

外部リンクは `target="_blank" rel="noopener noreferrer"` とし、視覚的または読み上げテキストで「新しいタブで開く」ことを伝える。

### 5.3 HeroSection

#### 目的と構造

```text
section[aria-labelledby="hero-title"]
└── div（2カラム用コンテナ）
    ├── div（テキスト領域）
    │   ├── p（サブコピー）
    │   ├── h1（キャッチコピー）
    │   └── div（CTA群）
    └── div[aria-hidden="true"]（抽象盤面ビジュアル）
```

#### 表示文言

- h1: `盤上に描く、青春の次の一手。`
- サブコピー: `{universityName}将棋部 公式Webサイト`
- 主要CTA: `XのDMで見学を相談する`
- 副CTA: `活動日程を見る`

主要CTA付近に補足文「見学をご希望の方は、X（旧Twitter）のDMでその旨をお送りください。」を表示する。予約フォームやメール予約への導線は設けない。主要CTAは公式Xプロフィールを新しいタブで開き、利用者が同アカウント宛てにDMを送れるよう誘導する。リンクには `target="_blank" rel="noopener noreferrer"` を設定し、アクセシブル名または補足テキストで新しいタブが開くことを伝える。

#### レイアウト

| ブレークポイント | 仕様 |
|---|---|
| 0〜767px | 1列。テキスト、CTA、ビジュアルの順。CTAは基本縦並び |
| 768〜1023px | 1列または比率を抑えた2列。CTAは横並び可 |
| 1024px以上 | 左55%：右45%の2列。垂直中央揃え |

h1は `clamp(2.5rem, 6vw, 5rem)` 相当とし、行間は1.25前後、1行の最大文字幅は約12〜14文字とする。ファーストビューはヘッダーを除き、PCで最低600px程度を確保する。

#### CTA仕様

主要CTAはアクセント色の塗りつぶし、副CTAは透明背景と枠線を使用する。両方とも最小高さ44pxを確保する。

| 状態 | 主要CTA | 副CTA |
|---|---|---|
| 通常 | 紺背景、白文字 | 透明背景、紺枠・紺文字 |
| hover | 背景を暗くし、`translateY(-2px)`、影を強める | 淡い紺背景 |
| focus-visible | 2pxリング＋オフセット | 同左 |
| active | 移動量を戻す | 同左 |

`prefers-reduced-motion: reduce` の場合は移動アニメーションを停止する。

#### 盤面ビジュアル

画像は追加せず、CSSで9×9の盤面を連想させる格子と駒型を構成する。

- 格子: 1px線、低コントラスト、背景透過
- 駒: `clip-path: polygon(...)` または角丸の抽象図形
- 駒の文字: `王` または `歩` を装飾として1〜3個まで
- ビジュアル全体: `aria-hidden="true"`
- テキスト領域に重なる場合の不透明度: 8%以下

### 5.4 AboutSection

#### 構造

```text
section[aria-labelledby="about-title"]
├── header
│   ├── p「ABOUT」
│   ├── h2「将棋を、もっと自由に。」
│   └── p（導入文）
└── ul（カードグリッド）
    └── li > FeatureCard × 3
```

導入文は「経験や生活スタイルにかかわらず、それぞれのペースで将棋を楽しみ、深められる場所です。」とする。

#### グリッド

| 幅 | 列数 | 間隔 |
|---|---:|---:|
| 0〜767px | 1 | 20px |
| 768〜1023px | 2（3枚目は同じ幅で次行） | 24px |
| 1024px以上 | 3 | 24〜32px |

カードの高さは同一行内で揃える。カード自体はリンクではないため、hoverだけに重要情報を置かない。

### 5.5 FeatureCard

#### Props

| Prop | 型 | 必須 | 用途 |
|---|---|---:|---|
| `number` | string | ○ | `01`〜`03`の装飾番号 |
| `title` | string | ○ | カード見出し |
| `description` | string | ○ | 説明文 |
| `motif` | string | ○ | 将棋を連想させる装飾文字 |

#### 表示仕様

- 背景: 白〜オフホワイト
- 枠線: `#D9DEDA`、1px
- 角丸: 12〜16px
- 内余白: SP 24px、PC 32px
- 影: 通常はごく薄くする
- hover: `translateY(-4px)` と枠線色の変更
- 見出し: 明朝体、24px前後
- 本文: 16px、行間1.9前後
- 装飾文字: 右上などに低い不透明度で配置し `aria-hidden="true"`

## 6. Footer

### 6.1 構造

```text
footer
└── div（最大幅コンテナ）
    ├── nav（内部4リンク）
    ├── a（X）
    ├── a（メール）
    └── small（コピーライト）
```

メールアドレスは表示文字列を維持し、操作性向上のため `mailto:tuatshogi@gmail.com` を設定する。

### 6.2 レイアウト

| 項目 | PC | SP |
|---|---|---|
| ナビ | 横並び | 縦並び |
| 配置 | 中央揃え | 中央揃え |
| 背景 | `rgba(15, 51, 80, 0.95)` | 同左 |
| 文字 | 白または明るいグレー | 同左 |
| 縦余白 | 56〜64px | 48px |

## 7. デザインシステム

### 7.1 カラー

| トークン | 値 | 用途 |
|---|---|---|
| `sumi` | `#0F172A` | 見出し、濃い文字 |
| `navy` | `#0F3350` | CTA、リンク、装飾 |
| `navy-overlay` | `rgba(15, 51, 80, 0.95)` | Header、Footer |
| `warm-white` | `#F8FAF8` | ページ背景 |
| `paper` | `#FFFFFF` | カード背景 |
| `ink` | `#272A2A` | 本文 |
| `line` | `#D9DEDA` | 罫線 |
| `gold` | `#B5974C` | 小さなアクセント |

`rgba(...)` はTailwindの静的カラー名ではなく、必要に応じて `navy/95` のopacity記法を使う。本文・操作要素は WCAG 2.2 AA のコントラスト比（通常文字4.5:1以上、大文字・太字等の大きな文字3:1以上）を満たす。

### 7.2 タイポグラフィ

```js
fontFamily: {
  mincho: ["Shippori Mincho", "Noto Serif JP", "serif"],
  sans: ["Noto Sans JP", "sans-serif"],
}
```

- h1、h2、カードタイトル: `font-mincho`
- 本文、ナビ、ボタン: `font-sans`
- 本文最小サイズ: 16px
- 長文行長: 約65文字以内

### 7.3 Tailwind拡張例

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sumi: "#0F172A",
        navy: "#0F3350",
        warmWhite: "#F8FAF8",
        paper: "#FFFFFF",
        ink: "#272A2A",
        line: "#D9DEDA",
        gold: "#B5974C",
      },
      fontFamily: {
        mincho: ["Shippori Mincho", "Noto Serif JP", "serif"],
        sans: ["Noto Sans JP", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
};
```

Tailwindのバージョンによって設定方法が異なる場合は、同一トークンを `@theme` 等の当該バージョン推奨方式で定義する。

## 8. 状態・動作設計

### 8.1 状態一覧

| 状態名 | 型 | 初期値 | 所有者 |
|---|---|---|---|
| `isMenuOpen` | boolean | `false` | Header |

その他の表示は設定データから決まるため、アプリケーション状態として保持しない。

### 8.2 メニュー状態遷移

```text
閉状態 ── MENUクリック ──> 開状態
開状態 ── MENUクリック ──> 閉状態
開状態 ── Escape ───────> 閉状態
開状態 ── リンク選択 ───> 閉状態 → 遷移
開状態 ── PC幅へ変更 ───> 閉状態
```

モバイルメニュー展開中に背景スクロールを禁止するかは、メニューが全画面を覆う場合のみ採用する。Header直下の短いドロップダウンであれば禁止しない。

## 9. アクセシビリティ設計

- ランドマークを `header`、`nav`、`main`、`section`、`footer` で明確化する。
- ページ内のh1はHeroの1つのみとし、Aboutはh2、カードはh3とする。
- Headerの画像altはそれぞれ `東京農工大学将棋部 エンブレム`、`東京農工大学将棋部` とする。両方が同じリンク内で冗長になる場合、ロゴ側altを空にしてリンクのアクセシブル名を1つにする。
- 装飾格子、駒、カード装飾番号は `aria-hidden="true"` とする。
- 全操作要素をキーボードで操作可能にし、フォーカス表示を消さない。
- タップ領域は最低44×44pxを目安とする。
- hoverだけで示す状態は作らない。
- 動きは200〜300ms程度にし、`prefers-reduced-motion` を尊重する。
- 200%ズーム時に横スクロールや情報欠落を発生させない。

## 10. SEO・メタ情報

`index.html` に次を設定する。

| 項目 | 値 |
|---|---|
| title | `東京農工大学将棋部｜公式Webサイト` |
| description | `東京農工大学将棋部の公式Webサイトです。活動内容や大会記録、入部・見学についてご案内します。初心者・経験者を問わず歓迎しています。` |
| OGP title | titleと同等 |
| OGP description | descriptionと同等 |
| OGP type | `website` |
| OGP image | 正式なOGP画像確定後に設定 |

正式な公開URLが未確定のため、canonical、`og:url` は公開環境決定後に設定する。

## 11. 性能設計

- Heroの装飾はCSSを基本とし、大きな背景画像を追加しない。
- `Designer.png` と `logo.png` には表示寸法を指定し、レイアウトシフトを防ぐ。
- Webフォントは必要ウェイト（本文400/500/700、見出し600/700）に限定し、`font-display: swap` を使用する。
- 本ページはAPI通信を行わず、初期表示に必要なデータはJavaScript内に含める。
- 本番ビルド時に未使用Tailwindクラスを除外する。
- 目標: Lighthouse各カテゴリ90以上を目安とする。ただし計測環境とフォント配信状況を記録する。

## 12. エラー・フォールバック設計

| 事象 | 動作 |
|---|---|
| エンブレム／ロゴ読込失敗 | altテキストまたはクラブ名を表示し、ナビ操作は維持 |
| Webフォント読込失敗 | 指定済みserif／sans-serifへフォールバック |
| JavaScript無効 | 最低限の案内を `noscript` で表示 |
| mailto非対応 | 画面内Footerにメールアドレスを平文表示 |
| Xを利用できない | Footerの連絡先メールアドレスを代替の問い合わせ手段として確認できるようにする |

## 13. テスト設計

### 13.1 コンポーネント試験

| ID | 対象 | 確認内容 |
|---|---|---|
| CT-01 | Header | 画像2点とナビ5件が正しい文言・URLで表示される |
| CT-02 | Header | MENU操作で `aria-expanded` と表示状態が同期する |
| CT-03 | Header | Escape、リンク選択、PC幅変更でメニューが閉じる |
| CT-04 | Hero | キャッチコピー、大学名、CTA2件、XのDMを案内する補足文が表示される |
| CT-04A | Hero | 見学CTAが公式Xプロフィールを新しいタブで開き、適切な `rel` を持つ |
| CT-05 | About | `features` 配列の3件が `map` で描画される |
| CT-06 | Footer | 内部リンク4件、X、メール、コピーライトが表示される |
| CT-07 | External link | Xリンクに `_blank` と適切な `rel` がある |

### 13.2 レスポンシブ試験

| ID | ビューポート | 期待結果 |
|---|---|---|
| RT-01 | 320×568 | 横スクロールなし、CTA縦並び、カード1列 |
| RT-02 | 375×667 | MENUでナビ開閉可能 |
| RT-03 | 768×1024 | Aboutカード2列、操作要素の重なりなし |
| RT-04 | 1024×768 | Heroが2列、カード3列 |
| RT-05 | 1440×900 | 最大幅内で中央配置され、余白過多にならない |

### 13.3 アクセシビリティ試験

| ID | 確認内容 |
|---|---|
| AT-01 | Tabキーだけで全リンクとMENUを順序どおり操作できる |
| AT-02 | フォーカスリングがすべて視認できる |
| AT-03 | 見出し階層がh1→h2→h3で連続する |
| AT-04 | axe等の自動検査で重大な違反がない |
| AT-05 | 通常文字と背景のコントラスト比が4.5:1以上 |
| AT-06 | 動きを減らすOS設定で不要な移動アニメーションが停止する |

### 13.4 受入条件

- 要件記載の必須文言、画像、リンク、連絡先がすべて表示される。
- PC、タブレット、スマートフォンで表示崩れと横スクロールがない。
- モバイルナビがタップとキーボードの両方で開閉できる。
- 見学CTAが公式Xプロフィールを新しいタブで開き、DMで見学希望を伝える案内が明記されている。
- 活動日程CTAが設定された宛先へ遷移する。
- Aboutカードが3件表示され、データ配列の変更だけで追加・修正できる。
- HeaderとFooterが既存の情報および紺色のトーンを維持する。
- 主要なアクセシビリティ自動検査に重大なエラーがない。

## 14. 実装順序

1. React／Tailwindの実行環境とフォントを設定する。
2. `siteConfig`、ナビゲーション、Aboutカードのデータを定義する。
3. HeaderとFooterをReact化し、既存表示内容とリンクを照合する。
4. HeroSectionと盤面装飾を実装する。
5. AboutSectionとFeatureCardを実装する。
6. レスポンシブ、フォーカス、縮小モーションを調整する。
7. コンポーネント試験、画面幅別試験、アクセシビリティ試験を行う。
8. 活動日程先、公開URL、OGP画像の確定値を反映する。

## 15. 要件トレーサビリティ

| 要件 | 設計箇所 |
|---|---|
| 和モダン×ミニマル | 5章、7章 |
| 既存Header維持・固定・モバイルMENU | 2.1、5.2、8章 |
| Hero必須文言・CTA・盤面装飾 | 5.3 |
| About 3カード・配列描画 | 4.3、5.4、5.5 |
| 既存Footerのリンク・連絡先維持 | 6章 |
| Reactコンポーネント分割 | 3.2、3.3 |
| Tailwind CSS | 3.1、7.3 |
| PC／TB／SP対応 | 5章、13.2 |
| 再利用性 | 4章、5.5 |

---

以上。
