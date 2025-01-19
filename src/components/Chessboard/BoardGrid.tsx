import { Chess, Square } from 'chess.js';
import SquareComponent from './Square';
import Piece from './Piece';

interface BoardGridProps {
  game: Chess;
  onMove: (from: string, to: string) => void;
}

const BoardGrid = ({ game, onMove }: BoardGridProps) => {
  const renderSquare = (i: number, j: number) => {
    const position = `${String.fromCharCode(97 + i)}${8 - j}` as Square;
    const piece = game.get(position);
    const isBlack = (i + j) % 2 === 1;
    
    return (
      <SquareComponent key={position} black={isBlack} position={position} onDrop={onMove}>
        {piece ? <Piece type={piece.type} color={piece.color} position={position} /> : null}
      </SquareComponent>
    );
  };

  return (
    <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-xl">
      {Array(8).fill(null).map((_, j) => (
        Array(8).fill(null).map((_, i) => renderSquare(i, j))
      ))}
    </div>
  );
};

export default BoardGrid;