import Chessboard from "@/components/Chessboard/Chessboard";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-start p-4">
      <ThemeToggle />
      <Chessboard />
    </div>
  );
};

export default Index;