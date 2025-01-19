import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GameStatusProps {
  status: 'initial' | 'playing' | 'checkmate' | 'draw';
  winner?: 'w' | 'b';
}

const GameStatus = ({ status, winner }: GameStatusProps) => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (status === 'initial') {
      setShowBanner(true);
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  switch (status) {
    case 'initial':
      return (
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground py-4 px-6 shadow-lg rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  <p className="text-lg font-medium">
                    Welcome! You play as White. Make your first move to start the game.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    case 'checkmate':
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            Game Over - Checkmate! {winner === 'w' ? 'White' : 'Black'} wins!
          </AlertDescription>
        </Alert>
      );
    case 'draw':
      return (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Game Over - Draw!
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};

export default GameStatus;