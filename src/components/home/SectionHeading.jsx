export default function SectionHeading({ number, label, id, children, aside, className = "" }) {
  return (
    <header className={`home-section-heading ${className}`} data-stagger-item>
      <div>
        <p className="home-section-kicker" aria-hidden="true"><span>{number}</span><span />{label}</p>
        <h2 id={id}>{children}</h2>
      </div>
      {aside && <div className="home-section-heading__aside">{aside}</div>}
    </header>
  );
}
