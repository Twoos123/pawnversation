import { ThemeToggle } from "@/components/ThemeToggle";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import FeaturesGrid from "@/components/FeaturesGrid";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QrCode } from "lucide-react";
import { motion } from "framer-motion";

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

      {/* QR Code Share Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <QrCode className="h-4 w-4" />
              Share Game
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <div className="flex flex-col items-center gap-2">
              <img 
                src="/QR.png" 
                alt="QR Code to share game" 
                className="w-48 h-48"
              />
              <p className="text-sm text-muted-foreground">
                Scan to share this game
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </div>
  );
};

export default Home;