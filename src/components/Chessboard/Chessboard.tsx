import { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { playMoveSpeech } from '@/utils/audio';
import { wait } from '@/utils/timeUtils';
import { getPieceName } from '@/utils/chessPieceUtils';
import VoiceInput from './VoiceInput';
import MoveHistory from './MoveHistory';
import CapturedPieces from './CapturedPieces';
import GameStatus from './GameStatus';
import BoardGrid from './BoardGrid';

const Chessboard = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState<'initial' | 'playing' | 'checkmate' | 'draw'>('initial');

  const handleVoiceMove = (from: string, to: string) => {
    console.log("Voice move received:", from, "to", to);
    handleMove(from, to);
  };

  const makeAIMove = () => {
    setIsThinking(true);
    console.log("AI is thinking...");
  
    setTimeout(() => {
      try {
        const moves = game.moves({ verbose: true });
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          handleMove(move.from, move.to);
        }
      } catch (error) {
        console.error("AI move error:", error);
        toast.error("AI encountered an error.");
      } finally {
        setIsThinking(false);
      }
    }, 1500);
  };

  const handleMove = (from: string, to: string) => {
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

        // Get the piece name and color for the speech
        const pieceColor = move.color === 'w' ? 'White' : 'Black';
        const pieceName = getPieceName(move.piece);
        playMoveSpeech(from, to, `${pieceColor} ${pieceName} moves from ${from} to ${to}`);
  
        if (move.captured) {
          const capturedPiece = move.captured;
          const capturedColor = move.color === 'w' ? 'b' : 'w';
          setCapturedPieces(prev => ({
            ...prev,
            [capturedColor]: [...prev[capturedColor], capturedPiece],
          }));

          const color = capturedColor === 'w' ? "White" : "Black";
          const capturedPieceName = getPieceName(capturedPiece);
          
          toast.success(
            <div className="flex items-center gap-2">
              <img 
                src={`/${capturedColor}${capturedPiece}.svg`} 
                alt={`${color} ${capturedPieceName}`}
                className="w-5 h-5"
              />
              <span>Captured {color}'s {capturedPieceName}</span>
            </div>
          );

          playMoveSpeech("", "", `Captured ${color}'s ${capturedPieceName}`);
        }
  
        if (newGame.isCheckmate()) {
          playMoveSpeech("","",`Checkmate! ${move.color === 'w' ? 'White' : 'Black'} wins!`);
          setGameStatus('checkmate');
          toast.success(`Checkmate! ${move.color === 'w' ? 'White' : 'Black'} wins!`);
        } else if (newGame.isDraw()) {
          playMoveSpeech("","","Game over. It's a draw");
          setGameStatus('draw');
          toast.info("Game Over - Draw!");
        } else if (newGame.isCheck()) {
          playMoveSpeech("","",`Check! ${move.color === 'b' ? 'White' : 'Black'}'s King is threatened!`);
          toast.warning(`Check! ${move.color === 'b' ? 'White' : 'Black'}'s King is threatened!`);
        }
  
        if (move.color === 'w' && !newGame.isGameOver()) {
          makeAIMove();
        }
      }
    } catch (error) {
      console.error("Move error:", error);
      playMoveSpeech("","","This was an invalid move");
      toast.error("Invalid move!");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center gap-8">
        <div className="space-y-4">
          <GameStatus 
            status={gameStatus} 
            winner={game.turn() === 'w' ? 'b' : 'w'} 
          />
          
          <div className="flex justify-between items-center mb-4">
            <VoiceInput 
              onMove={handleVoiceMove} 
              disabled={isThinking || game.turn() !== 'w' || game.isGameOver()}
            />
          </div>
          
          <CapturedPieces 
            color="w" 
            pieces={capturedPieces.w} 
            label="Captured by Black:"
          />
          
          <BoardGrid game={game} onMove={handleMove} />
          
          <CapturedPieces 
            color="b" 
            pieces={capturedPieces.b} 
            label="Captured by White:"
          />
        </div>
        
        <div className="w-full max-w-4xl mt-8">
          <MoveHistory moves={moveHistory} />
        </div>
      </div>
    </DndProvider>
  );
};

export default Chessboard;