import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import AboutSection from "./components/home/AboutSection";
import ContentPage from "./components/pages/ContentPage";

function PageContent({ page }) {
  if (page === "entry") return <ContentPage page="entry" />;
  if (page === "record") return <ContentPage page="record" />;
  if (page === "introduce") return <ContentPage page="introduce" />;

  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  );
}

export default function App({ page = "home" }) {
  return (
    <div className="flex min-h-screen flex-col bg-warmWhite text-ink">
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[96px]">
        <PageContent page={page} />
      </main>
      <Footer />
    </div>
  );
}
