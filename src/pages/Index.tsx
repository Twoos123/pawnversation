import Chessboard from "@/components/Chessboard/Chessboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="fixed top-4 right-4 flex gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <Chessboard />
      </div>
    </LanguageProvider>
  );
};

export default Index;