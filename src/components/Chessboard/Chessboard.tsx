import { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { default as SquareComponent } from './Square';
import Piece from './Piece';
import MoveHistory from './MoveHistory';
import VoiceInput from './VoiceInput';
import { toast } from 'sonner';
import { playMoveSpeech } from '@/utils/audio';
import { wait } from '@/utils/timeUtils';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";
import { getPieceName } from '@/utils/chessPieceUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/utils/translationUtils';

const Chessboard = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState<'initial' | 'playing' | 'checkmate' | 'draw'>('initial');
  const { currentLanguage } = useLanguage();

  const announceMessage = async (message: string) => {
    const translatedMessage = await translateText(message, currentLanguage);
    playMoveSpeech("", "", translatedMessage);
    return translatedMessage;
  };

  const handleVoiceMove = (from: string, to: string) => {
    console.log("Voice move received:", from, "to", to);
    handleMove(from, to);
  };

  const makeAIMove = () => {
    setIsThinking(true);
    console.log("AI is thinking...");
  
    setTimeout(async () => {
      try {
        const moves = game.moves({ verbose: true });
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          await wait(2000);
          handleMove(move.from, move.to);
        }
      } catch (error) {
        console.error("AI move error:", error);
        const message = await announceMessage("AI encountered an error");
        toast.error(message);
      } finally {
        setIsThinking(false);
      }
    }, 500);
  };

  const handleMove = async (from: string, to: string) => {
    try {
      const move = game.move({
        from: from as Square,
        to: to as Square,
        promotion: 'q',
      });
  
      if (move) {
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setMoveHistory(prev => [...prev, `${from}-${to}`]);
        
        if (gameStatus === 'initial') {
          setGameStatus('playing');
        }

        // Announce the move
        await announceMessage(`${from} to ${to}`);
  
        // Handle captured pieces
        if (move.captured) {
          const capturedPiece = move.captured;
          const capturedColor = move.color === 'w' ? 'b' : 'w';
          setCapturedPieces(prev => ({
            ...prev,
            [capturedColor]: [...prev[capturedColor], capturedPiece],
          }));

          const color = capturedColor === 'w' ? "White" : "Black";
          const pieceName = getPieceName(capturedPiece);
          
          const successMessage = await translateText(`Captured ${color}'s ${pieceName}`, currentLanguage);
          
          // Show toast with piece image
          toast.success(
            <div className="flex items-center gap-2">
              <img 
                src={`/${capturedColor}${capturedPiece}.svg`} 
                alt={`${color} ${pieceName}`}
                className="w-5 h-5"
              />
              <span>{successMessage}</span>
            </div>
          );

          await announceMessage(successMessage);
        }
  
        // Check game status
        if (newGame.isCheckmate()) {
          const message = await translateText(
            `Checkmate! ${move.color === 'w' ? 'White' : 'Black'} wins!`,
            currentLanguage
          );
          await announceMessage(message);
          setGameStatus('checkmate');
          toast.success(message);
        } else if (newGame.isDraw()) {
          const message = await translateText("Game over. It's a draw", currentLanguage);
          await announceMessage(message);
          setGameStatus('draw');
          toast.info(message);
        } else if (newGame.isCheck()) {
          const message = await translateText(
            `Check! ${move.color === 'b' ? 'White' : 'Black'}'s King is threatened!`,
            currentLanguage
          );
          await announceMessage(message);
          toast.warning(message);
        }
  
        // If it was a player move (white), trigger AI move
        if (move.color === 'w' && !newGame.isGameOver()) {
          makeAIMove();
        }
      }
    } catch (error) {
      console.error("Move error:", error);
      const message = await translateText("Invalid move!", currentLanguage);
      await announceMessage(message);
      toast.error(message);
    }
  };

  const renderSquare = (i: number, j: number) => {
    const position = `${String.fromCharCode(97 + i)}${8 - j}` as Square;
    const piece = game.get(position);
    const isBlack = (i + j) % 2 === 1;
    
    return (
      <SquareComponent key={position} black={isBlack} position={position} onDrop={handleMove}>
        {piece ? <Piece type={piece.type} color={piece.color} position={position} /> : null}
      </SquareComponent>
    );
  };
  
  const renderCapturedPieces = (color: 'w' | 'b') => (
    <div className="flex flex-wrap gap-1 p-2">
      {capturedPieces[color].map((piece, i) => (
        <img 
          key={i}
          src={`/${color}${piece}.svg`} 
          alt={`captured ${piece}`}
          className="w-6 h-6 opacity-75"
        />
      ))}
    </div>
  );

  const renderGameStatus = () => {
    switch (gameStatus) {
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
              Game Over - Checkmate! {game.turn() === 'w' ? 'Black' : 'White'} wins!
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row items-start gap-8 p-8">
        <div className="space-y-4">
          {renderGameStatus()}
          
          <div className="flex justify-between items-center mb-4">
            {isThinking && (
              <div className="text-center text-gray-600 animate-pulse">
                {currentLanguage === 'en' ? 'AI is thinking...' : 'AI está pensando...'}
              </div>
            )}
            <VoiceInput 
              onMove={handleVoiceMove} 
              disabled={isThinking || game.turn() !== 'w' || game.isGameOver()}
            />
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm mb-2">
              {currentLanguage === 'en' ? 'Captured by Black:' : 'Capturado por Negro:'}
            </div>
            {renderCapturedPieces('w')}
          </div>
          
          <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-xl">
            {Array(8).fill(null).map((_, j) => (
              Array(8).fill(null).map((_, i) => renderSquare(i, j))
            ))}
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm mb-2">
              {currentLanguage === 'en' ? 'Captured by White:' : 'Capturado por Blanco:'}
            </div>
            {renderCapturedPieces('b')}
          </div>
        </div>
        
        <MoveHistory moves={moveHistory} />
      </div>
    </DndProvider>
  );
};

export default Chessboard;
