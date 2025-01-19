import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import Chessboard from "@/components/Chessboard/Chessboard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Game = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              ← Back to Home
            </Button>
          </motion.div>
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
    </div>
  );
};

export default Game;