import FeatureCard from "./FeatureCard";
import { features } from "../../data/siteConfig";
import SectionHeading from "./SectionHeading";

export default function AboutSection() {
  return (
    <section className="home-screen-section recruitment-section" aria-labelledby="about-title" data-stagger-group>
      <div className="home-section-inner">
        <SectionHeading number="02" label="JOIN US" id="about-title" aside={
          <><p>初心者から経験者まで。</p><a className="home-editorial-link" href="/entry.html">入部案内をみる<span aria-hidden="true">↗</span></a></>
        }><span>新入部員</span><span>募集中</span></SectionHeading>

        <ul className="recruitment-piece-grid">
          {features.map((feature, index) => (
            <li key={feature.id} data-stagger-item>
              <FeatureCard {...feature} number={String(index + 1).padStart(2, "0")} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
