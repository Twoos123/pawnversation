import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface GameStatusProps {
  status: 'initial' | 'playing' | 'checkmate' | 'draw';
  winner?: 'w' | 'b';
}

const GameStatus = ({ status, winner }: GameStatusProps) => {
  const { currentLanguage } = useLanguage();

  switch (status) {
    case 'initial':
      return (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            {currentLanguage === 'en' 
              ? "Welcome! You play as White. Make your first move to start the game."
              : "¡Bienvenido! Juegas con las blancas. Haz tu primer movimiento para comenzar el juego."}
          </AlertDescription>
        </Alert>
      );
    case 'checkmate':
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            {currentLanguage === 'en'
              ? `Game Over - Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins!`
              : `¡Fin del juego - Jaque mate! ¡${winner === 'w' ? 'Blancas' : 'Negras'} ganan!`}
          </AlertDescription>
        </Alert>
      );
    case 'draw':
      return (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            {currentLanguage === 'en' ? "Game Over - Draw!" : "Fin del juego - ¡Empate!"}
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};

export default GameStatus;