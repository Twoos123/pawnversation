import Chessboard from "@/components/Chessboard/Chessboard";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <ThemeToggle />
      <Chessboard />
    </div>
  );
};

export default Index;