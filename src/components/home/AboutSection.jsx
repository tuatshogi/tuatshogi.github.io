import FeatureCard from "./FeatureCard";
import { features } from "../../data/siteConfig";

export default function AboutSection() {
  return (
    <section className="relative border-t border-line/70 bg-[#f1f4f1] py-20 md:py-28" aria-labelledby="about-title">
      <div className="mx-auto max-w-site px-5 md:px-8 lg:px-12">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-navy"></p>
          <h2 id="about-title" className="mt-4 font-mincho text-3xl font-bold tracking-[0.06em] text-sumi md:text-5xl">
            新入生大募集中!!!
          </h2>
          <p className="mt-6 text-base leading-8 text-ink/70 md:text-lg">
          </p>
        </header>

        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => (
            <li key={feature.id}>
              <FeatureCard {...feature} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
