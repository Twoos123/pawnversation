import { ThemeToggle } from "@/components/ThemeToggle";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import FeaturesGrid from "@/components/FeaturesGrid";
import Hero from "@/components/Hero";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden relative">
      <FloatingChessPieces />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <Hero />
        <FeaturesGrid />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Home;