import { useDrag } from 'react-dnd';
import { cn } from "@/lib/utils";

interface PieceProps {
  type: string;
  color: 'w' | 'b';
  position: string;
}

const Piece = ({ type, color, position }: PieceProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const pieceImage = `/${color}${type}.svg`;

  return (
    <div
      ref={drag}
      className={cn(
        'w-14 h-14 cursor-grab active:cursor-grabbing transition-transform hover:scale-105',
        isDragging && 'opacity-50'
      )}
      style={{ touchAction: 'none' }}
    >
      <img src={pieceImage} alt={`${color}${type}`} className="w-full h-full" />
    </div>
  );
};

export default Piece;