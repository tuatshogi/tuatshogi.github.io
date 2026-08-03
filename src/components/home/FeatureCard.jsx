export default function FeatureCard({ number, title, description, motif }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-navy/35 hover:shadow-[0_16px_40px_rgba(15,51,80,0.10)] motion-reduce:transform-none motion-reduce:transition-none md:p-8">
      <span className="text-xs font-bold tracking-[0.2em] text-gold">{number}</span>
      <span
        className="pointer-events-none absolute -right-1 -top-7 font-mincho text-[9rem] leading-none text-navy/[0.045] transition-colors group-hover:text-navy/[0.07]"
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
