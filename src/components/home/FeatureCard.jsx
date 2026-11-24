export default function FeatureCard({ title, description, motif, number }) {
  return (
    <article className="recruitment-piece group">
      <div className="recruitment-piece__face">
        <span className="recruitment-piece__number font-mincho" aria-hidden="true">{number}</span>
        <span className="recruitment-piece__motif font-mincho" aria-hidden="true">{motif}</span>
        <div className="recruitment-piece__copy">
          <h3 className="font-mincho text-xl font-bold tracking-[0.04em] text-[#112840] md:text-2xl">
            {title}
          </h3>
          <div className="h-0.5 w-8 bg-[#D99B52]" aria-hidden="true" />
          <p className="font-mincho text-[15px] leading-7 text-[#1E2229]/85 md:text-base">{description}</p>
        </div>
      </div>
    </article>
  );
}
