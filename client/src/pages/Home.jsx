import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Blog from '../components/sections/Blog';
import Lab from '../components/sections/Lab';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ParticleBackground from '../components/layout/ParticleBackground';
import LiveVisitorCounter from '../components/features/LiveVisitorCounter';
import ScrollToTop from '../components/features/ScrollToTop';
import ChatBot from '../components/features/ChatBot';
import { LanguageProvider } from '../context/LanguageContext';

const Home = () => {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-dark-950 text-white">
        <ParticleBackground />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Blog />
          <Lab />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <LiveVisitorCounter />
        <ScrollToTop />
        <ChatBot />
      </div>
    </LanguageProvider>
  );
};

export default Home;