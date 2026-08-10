import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import AboutSection from "./components/home/AboutSection";
import NewsSection from "./components/home/NewsSection";
import ContentPage from "./components/pages/ContentPage";
import NewsPage from "./components/pages/NewsPage";

function PageContent({ page, notices, notice }) {
  if (page === "entry") return <ContentPage page="entry" />;
  if (page === "record") return <ContentPage page="record" />;
  if (page === "introduce") return <ContentPage page="introduce" />;
  if (page === "news") return <NewsPage notices={notices} />;
  if (page === "notice") return <NewsPage notices={notices} notice={notice} />;

  return (
    <>
      <HeroSection />
      <NewsSection notices={notices} />
      <AboutSection />
    </>
  );
}

export default function App({ page = "home", notices = [], notice }) {
  return (
    <div className="flex min-h-screen flex-col bg-warmWhite text-ink">
      <Header currentPage={page} />
      <main className="flex-1 pt-[72px] md:pt-[96px]">
        <PageContent page={page} notices={notices} notice={notice} />
      </main>
      <Footer />
    </div>
  );
}
