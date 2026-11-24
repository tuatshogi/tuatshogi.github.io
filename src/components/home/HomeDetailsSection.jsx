import SectionHeading from "./SectionHeading";
import { siteConfig } from "../../data/siteConfig";

const activityDetails = [
  { icon: "calendar", title: "活動日", description: "毎週金曜日" },
  {
    icon: "shogi",
    title: "活動内容",
    description: "部員同士で対局し、棋譜並べ・詰将棋・変則将棋の研究などを行っています。",
  },
  {
    icon: "place",
    title: "活動場所",
    description: "普段は小金井キャンパス欅寮近くのサークル棟B棟の部室で活動しています。",
  },
  { icon: "fee", title: "部費", description: "部費はありません。" },
];

function ActivityIcon({ name }) {
  const paths = {
    calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M7.5 3v4M16.5 3v4M3.5 10h17M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01" /></>,
    shogi: <><rect x="3.5" y="3.5" width="17" height="17" rx="1" /><path d="M9.17 3.5v17M14.83 3.5v17M3.5 9.17h17M3.5 14.83h17" /><path d="m12 7 2.3 1.6-.7 4.3h-3.2l-.7-4.3L12 7Z" /></>,
    place: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    fee: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 14h4" /><circle cx="17" cy="14" r="1" /></>,
  };

  return (
    <svg className="activity-overview-cube__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function VisitFlowIcon({ kind }) {
  return kind === "x" ? (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="m15 12 35 40M49 12 14 52" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="7" width="50" height="50" />
      <path d="M23.7 7v50M40.3 7v50M7 23.7h50M7 40.3h50" />
      <path d="m32 16 6 4-.9 11h-10.2L26 20l6-4Z" fill="#D99B52" stroke="#D99B52" />
    </svg>
  );
}

export default function HomeDetailsSection() {
  return (
    <>
      <section className="home-screen-section activity-overview-section" aria-labelledby="activity-overview-title" data-stagger-group>
        <div className="activity-overview-layout mx-auto">
          <SectionHeading number="03" label="ACTIVITIES" id="activity-overview-title" className="activity-overview-heading" aside={
            <a className="home-editorial-link" href="/introduce.html">活動紹介をみる<span aria-hidden="true">↗</span></a>
          }>活動概要</SectionHeading>
          <ul className="activity-overview-mosaic" aria-label="活動概要一覧">
            {activityDetails.map((item, index) => (
              <li key={item.title} className="activity-overview-item" data-stagger-item>
                <div className="activity-overview-card-scene">
                  <div className="activity-overview-cube" data-activity-cube>
                    <article className="activity-overview-cube__face activity-overview-cube__face--front">
                      <div className="activity-overview-cube__label">
                        <h3 className="font-mincho font-bold tracking-wide text-[#112840]">{item.title}</h3>
                        <span className="activity-overview-cube__number font-mincho" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <span className="activity-overview-cube__rule" aria-hidden="true" />
                      <span className="activity-overview-cube__art" aria-hidden="true">
                        <ActivityIcon name={item.icon} />
                      </span>
                      <p className={`activity-overview-cube__description font-mincho${index === 0 ? " activity-overview-cube__description--day" : ""}`}>{item.description}</p>
                    </article>
                    <span className="activity-overview-cube__face activity-overview-cube__face--back" aria-hidden="true" />
                    <span className="activity-overview-cube__face activity-overview-cube__face--side activity-overview-cube__face--right" aria-hidden="true" />
                    <span className="activity-overview-cube__face activity-overview-cube__face--side activity-overview-cube__face--left" aria-hidden="true" />
                    <span className="activity-overview-cube__face activity-overview-cube__face--top" aria-hidden="true" />
                    <span className="activity-overview-cube__face activity-overview-cube__face--bottom" aria-hidden="true" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-screen-section visit-flow-section" aria-labelledby="visit-flow-title" data-stagger-group>
        <div className="home-section-inner">
          <SectionHeading number="04" label="VISIT & PLAY" id="visit-flow-title" aside={<p>Process of Joining &amp; Visiting</p>}><span>見学・体験の</span><span>流れ</span></SectionHeading>
          <ol className="visit-flow-steps">
            <li data-stagger-item>
              <article className="visit-flow-card">
                <div className="visit-flow-card__index">
                  <span className="font-mincho">01</span>
                  <span className="font-mincho">Step</span>
                </div>
                <div className="visit-flow-card__content">
                  <h3 className="font-mincho font-bold text-[#112840]">公式XでDM</h3>
                  <p className="font-mincho text-[#657681]">Contact</p>
                  <span className="visit-flow-card__icon visit-flow-card__icon--x"><VisitFlowIcon kind="x" /></span>
                </div>
              </article>
            </li>
            <li className="visit-flow-connector" aria-hidden="true" data-stagger-item>
              <span />
              <svg viewBox="0 0 24 24" fill="none"><path d="M3 12h17m-6-6 6 6-6 6" /></svg>
            </li>
            <li data-stagger-item>
              <article className="visit-flow-card">
                <div className="visit-flow-card__index">
                  <span className="font-mincho">02</span>
                  <span className="font-mincho">Step</span>
                </div>
                <div className="visit-flow-card__content">
                  <h3 className="font-mincho font-bold text-[#112840]">部室見学・対局</h3>
                  <p className="font-mincho text-[#657681]">Visit &amp; Play</p>
                  <span className="visit-flow-card__icon"><VisitFlowIcon kind="board" /></span>
                </div>
              </article>
            </li>
          </ol>
          <div className="visit-flow-actions" data-stagger-item>
            <a className="visit-flow-contact" href={siteConfig.cta.visitDmHref} target="_blank" rel="noopener noreferrer">公式Xで見学・体験を相談<span aria-hidden="true">↗</span><span className="sr-only">（新しいタブで開く）</span></a>
            <a className="home-editorial-link" href="/entry.html">入部案内をみる<span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
    </>
  );
}
