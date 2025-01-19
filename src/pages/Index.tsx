import Chessboard from "@/components/Chessboard/Chessboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          <LanguageSelector />
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Chessboard />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;