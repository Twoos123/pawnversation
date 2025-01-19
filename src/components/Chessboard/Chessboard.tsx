import { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { default as SquareComponent } from './Square';
import Piece from './Piece';
import MoveHistory from './MoveHistory';
import VoiceInput from './VoiceInput';
import GameStatus from './GameStatus';
import CapturedPieces from './CapturedPieces';
import ThinkingIndicator from './ThinkingIndicator';
import { toast } from 'sonner';
import { playMoveSpeech } from '@/utils/audio';
import { wait } from '@/utils/timeUtils';
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

        await announceMessage(`${from} to ${to}`);
  
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row items-start gap-8 p-8">
        <div className="space-y-4">
          <GameStatus status={gameStatus} winner={game.turn()} />
          
          <div className="flex justify-between items-center mb-4">
            <ThinkingIndicator isThinking={isThinking} />
            <VoiceInput 
              onMove={handleVoiceMove} 
              disabled={isThinking || game.turn() !== 'w' || game.isGameOver()}
            />
          </div>
          
          <CapturedPieces pieces={capturedPieces.w} color="b" />
          
          <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-xl">
            {Array(8).fill(null).map((_, j) => (
              Array(8).fill(null).map((_, i) => renderSquare(i, j))
            ))}
          </div>
          
          <CapturedPieces pieces={capturedPieces.b} color="w" />
        </div>
        
        <MoveHistory moves={moveHistory} />
      </div>
    </DndProvider>
  );
};

export default Chessboard;