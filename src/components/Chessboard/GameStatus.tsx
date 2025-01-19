import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";

interface GameStatusProps {
  status: 'initial' | 'playing' | 'checkmate' | 'draw';
  winner?: 'w' | 'b';
}

const GameStatus = ({ status, winner }: GameStatusProps) => {
  switch (status) {
    case 'initial':
      return (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Welcome! You play as White. Make your first move to start the game.
          </AlertDescription>
        </Alert>
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