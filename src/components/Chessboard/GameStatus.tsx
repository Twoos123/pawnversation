import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { playMoveSpeech } from '@/utils/audio';

interface GameStatusProps {
  status: 'initial' | 'playing' | 'checkmate' | 'draw';
  winner?: 'w' | 'b';
}

const GameStatus = ({ status, winner }: GameStatusProps) => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (status === 'initial') {
      setShowBanner(true);
      playMoveSpeech("", "", "Welcome! You play as White. Make your first move to start the game.");
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 4000);

      return () => clearTimeout(timer);
    } else if (status === 'draw') {
      playMoveSpeech("", "", "Game over. It's a draw.");
    }
  }, [status]);

  const renderBanner = () => {
    switch (status) {
      case 'initial':
        return (
          <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground py-4 px-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <InfoIcon className="h-5 w-5" />
              <p className="text-lg font-medium">
                Welcome! You play as White. Make your first move to start the game.
              </p>
            </div>
          </div>
        );
      case 'checkmate':
        return (
          <div className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground py-4 px-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangleIcon className="h-5 w-5" />
              <p className="text-lg font-medium">
                Checkmate! {winner === 'w' ? 'White' : 'Black'} wins!
              </p>
            </div>
          </div>
        );
      case 'draw':
        return (
          <div className="bg-muted/90 backdrop-blur-sm text-muted-foreground py-4 px-6 shadow-lg rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <InfoIcon className="h-5 w-5" />
              <p className="text-lg font-medium">
                Game Over - Draw!
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {(showBanner || status === 'checkmate' || status === 'draw') && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          {renderBanner()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameStatus;