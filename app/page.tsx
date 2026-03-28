import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Technology from "@/components/Technology";
import Research from "@/components/Research";
import AppDownload from "@/components/AppDownload";
import Team from "@/components/Team";
import ChatbotDemo from "@/components/ChatbotDemo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Technology />
      <Research />
      <ChatbotDemo />
      <AppDownload />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
