export default function FeatureCard({ number, title, description, motif }) {
  return (
    <article className="relative h-full overflow-hidden border border-line bg-paper p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] md:p-8">
      <span className="text-xs font-bold tracking-[0.2em] text-gold">{number}</span>
      <span
        className="pointer-events-none absolute -right-1 -top-7 font-mincho text-[9rem] leading-none text-navy/[0.045]"
        aria-hidden="true"
      >
        {motif}
      </span>
      <h3 className="relative mt-6 font-mincho text-2xl font-bold tracking-[0.05em] text-sumi">
        {title}
      </h3>
      <div className="my-5 h-px w-10 bg-gold" aria-hidden="true" />
      <p className="relative text-base leading-[1.9] text-ink/75">{description}</p>
    </article>
  );
}
