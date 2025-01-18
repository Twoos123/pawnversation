import { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Square as SquareComponent from './Square';
import Piece from './Piece';
import MoveHistory from './MoveHistory';
import { toast } from 'sonner';

const Chessboard = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });

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
        
        // Update move history
        setMoveHistory(prev => [...prev, `${from}-${to}`]);
        
        // Check for captured pieces
        if (move.captured) {
          const capturedPiece = move.captured;
          const capturedColor = move.color === 'w' ? 'b' : 'w';
          setCapturedPieces(prev => ({
            ...prev,
            [capturedColor]: [...prev[capturedColor], capturedPiece]
          }));
          
          toast.success(`Captured ${capturedColor === 'w' ? 'White' : 'Black'}'s ${capturedPiece}`);
        }

        // Check game status
        if (newGame.isCheckmate()) {
          toast.success(`Checkmate! ${move.color === 'w' ? 'White' : 'Black'} wins!`);
        } else if (newGame.isDraw()) {
          toast.info("Game Over - Draw!");
        } else if (newGame.isCheck()) {
          toast.warning("Check!");
        }
      }
    } catch (error) {
      toast.error("Invalid move!");
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col md:flex-row items-start gap-8 p-8">
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm mb-2">Captured by Black:</div>
            {renderCapturedPieces('w')}
          </div>
          
          <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-xl">
            {Array(8).fill(null).map((_, j) => (
              Array(8).fill(null).map((_, i) => renderSquare(i, j))
            ))}
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm mb-2">Captured by White:</div>
            {renderCapturedPieces('b')}
          </div>
        </div>
        
        <MoveHistory moves={moveHistory} />
      </div>
    </DndProvider>
  );
};

export default Chessboard;