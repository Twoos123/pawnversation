import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Chessboard from "@/components/Chessboard/Chessboard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QrCode } from "lucide-react";

const Game = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Chessboard />
        </motion.div>
      </motion.div>

      {/* Floating back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          ← Back to Home
        </Button>
      </motion.div>

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

export default Game;