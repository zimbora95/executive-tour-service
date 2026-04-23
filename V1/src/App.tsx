import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Experiences from "./components/Experiences";
import Fleet from "./components/Fleet";
import Destinations from "./components/Destinations";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

export default function App() {
  return (
    <div className="grain relative min-h-screen bg-ink text-bone">
      <Loader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Experiences />
        <Fleet />
        <Destinations />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
