import {
  activityRoomImage,
  activityTournamentImage,
  campusMapImage,
} from "../../data/imageAssets";
import { siteConfig } from "../../data/siteConfig";

function ResponsiveImage({
  image,
  alt,
  className,
  loading,
  fetchPriority,
}) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={image.avifSrcSet}
        sizes={image.sizes}
      />
      <img
        src={image.fallback}
        srcSet={image.webpSrcSet}
        sizes={image.sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  );
}

const entrySections = [
  {
    title: "新入生の方へ",
    body: "新入生の皆さん、入学おめでとうございます。当将棋部には、全国大会を目指す人から趣味として将棋を楽しむ人まで、さまざまな部員がいます。初心者から有段者まで大歓迎です。",
  },
  {
    title: "活動場所",
    body: "普段は小金井キャンパス欅寮近くのサークル棟B棟の部室で活動しています。",
    campusMap: true,
  },
  {
    title: "活動内容",
    body: "毎週金曜日の活動日に部員同士で対局し、棋譜並べ・詰将棋・変則将棋の研究などを行っています。一年を通して大会や部内戦などのイベントもあります。",
  },
  { title: "部費", body: "部費はありません。" },
  {
    title: "入部・見学方法",
    body: "見学や入部をご希望の方は、将棋部の公式Twitter（現X）にDMでその旨をご連絡ください。みなさんの参加をお待ちしています。",
    cta: true,
  },
  {
    title: "その他",
    body: "兼部は自由です。実際にほかの部・サークルと掛け持ちをしている部員も多くいます。",
  },
];

function PageShell({ title, lead, children }) {
  return (
    <div className="bg-grid min-h-[60vh]">
      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-xs font-bold tracking-[0.28em] text-navy">TUAT SHOGI CLUB</p>
        <h1 className="mt-3 border-b border-navy/20 pb-5 font-mincho text-4xl font-bold tracking-[0.08em] text-sumi md:text-5xl">{title}</h1>
        {lead && <p className="mt-6 leading-8 text-ink/70">{lead}</p>}
        <div className="mt-12 space-y-12">{children}</div>
      </div>
    </div>
  );
}

function EntryPage() {
  return (
    <PageShell title="入部案内" lead="初心者・経験者を問わず、将棋を楽しみたい方を歓迎しています。">
      {entrySections.map((section) => (
        <section key={section.title}>
          <h2 className="font-mincho text-2xl font-bold text-sumi md:text-3xl">{section.title}</h2>
          <p className="mt-4 leading-8 text-ink/80">{section.body}</p>
          {section.campusMap && (
            <figure className="mt-6 overflow-hidden rounded-xl border border-line bg-white p-2 shadow-[0_12px_35px_rgba(15,51,80,0.10)] md:p-3">
              <ResponsiveImage
                image={campusMapImage}
                alt="小金井キャンパス内のサークル棟B棟までの案内図"
                loading="lazy"
                className="h-auto w-full rounded-lg"
              />
              <figcaption className="px-2 pb-2 pt-4 text-sm leading-7 text-ink/65 md:px-3">
                赤線で示したサークル棟B棟に部室があります。地図は
                <a
                  href="https://www.tuat.ac.jp/outline/overview/access/koganei/campus_map/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-1 rounded font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                  東京農工大学 小金井キャンパスマップ
                  <span className="sr-only">（新しいタブで開く）</span>
                </a>
                を参照しています。
              </figcaption>
            </figure>
          )}
          {section.cta && (
            <a href={siteConfig.xUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-navy px-6 py-3 font-bold text-white transition hover:bg-sumi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-4">
              XのDMで連絡する<span className="sr-only">（新しいタブで開く）</span>
            </a>
          )}
        </section>
      ))}
    </PageShell>
  );
}

function RecordPage({ records }) {
  return (
    <PageShell title="大会記録">
      <div data-cms-record-list className="space-y-12">
        {records.length === 0 && (
          <p className="rounded-xl border border-dashed border-line bg-white/60 px-5 py-8 text-center text-ink/65">現在、公開中の大会記録はありません。</p>
        )}
        {records.map((record) => (
          <section key={record.year}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-mincho text-2xl font-bold text-sumi md:text-3xl">{record.year}</h2>
            <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy">
              公式結果を見る<span className="sr-only">（新しいタブで開く）</span>
            </a>
          </div>
          <ul className="mt-5 space-y-4">
            {record.items.map((item) => (
              <li key={`${item.date}-${item.event}`} className="rounded-xl border border-line bg-white p-5 md:flex md:items-center md:gap-6 md:p-6">
                <time className="text-sm text-ink/70">{item.date}</time>
                <div className="mt-2 flex-1 md:mt-0">
                  <p className="font-bold text-sumi">{item.event}</p>
                  <p className="mt-1 text-sm text-ink/70">{item.detail}</p>
                </div>
                <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold md:mt-0 ${item.highlight ? "bg-gold text-navy" : "bg-navy/10 text-navy"}`}>{item.result}</span>
              </li>
            ))}
          </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

function IntroducePage() {
  const sections = [
    { title: "日頃の活動", image: activityRoomImage, alt: "部室での活動風景", body: "毎週金曜日に活動しています。部室には棋書・盤駒・チェスクロックなど、将棋のための設備が整っています。", loading: "eager", fetchPriority: "high" },
    { title: "大会・部内戦・レーティング", image: activityTournamentImage, alt: "大会参加時の集合写真", body: "一年を通して、さまざまな大会や部内戦があります。大会への参加だけでなく、大学間交流や数か月かけて行う部内順位戦も楽しめます。", loading: "lazy", fetchPriority: "low" },
  ];
  return (
    <PageShell title="活動紹介" lead="普段の部室での活動や、大会・部内戦の様子をご紹介します。">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="font-mincho text-2xl font-bold text-sumi md:text-3xl">{section.title}</h2>
          <figure className="mt-6 overflow-hidden rounded-sm border-8 border-white bg-white shadow-[5px_8px_30px_rgba(15,23,42,0.14)]">
            <ResponsiveImage
              image={section.image}
              alt={section.alt}
              loading={section.loading}
              fetchPriority={section.fetchPriority}
              className="h-auto w-full object-cover"
            />
          </figure>
          <p className="mt-6 leading-8 text-ink/80">{section.body}</p>
        </section>
      ))}
    </PageShell>
  );
}

export default function ContentPage({ page, records = [] }) {
  if (page === "entry") return <EntryPage />;
  if (page === "record") return <RecordPage records={records} />;
  return <IntroducePage />;
}
