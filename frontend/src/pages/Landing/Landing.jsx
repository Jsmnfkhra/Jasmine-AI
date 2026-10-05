import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Footer from "../../components/layout/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <Hero />

      <Features />

      <Footer />

    </div>
  );
}

export default Landing;