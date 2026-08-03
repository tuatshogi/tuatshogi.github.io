import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import AboutSection from "./components/home/AboutSection";
import ContentPage from "./components/pages/ContentPage";

const pageName = window.location.pathname.split("/").pop()?.toLowerCase();

function PageContent() {
  if (pageName === "entry.html") return <ContentPage page="entry" />;
  if (pageName === "record.html") return <ContentPage page="record" />;
  if (pageName === "introduce.html") return <ContentPage page="introduce" />;

  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-warmWhite text-ink">
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[96px]">
        <PageContent />
      </main>
      <Footer />
    </div>
  );
}
