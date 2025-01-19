import { useDrag } from 'react-dnd';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface PieceProps {
  type: string;
  color: 'w' | 'b';
  position: string;
}

const Piece = ({ type, color, position }: PieceProps) => {
  const isMobile = useIsMobile();
  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const pieceImage = `/${color}${type}.svg`;

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('Touch start on piece:', position);
    // Prevent scrolling while dragging
    e.preventDefault();
  };

  return (
    <div
      ref={drag}
      className={cn(
        'cursor-grab active:cursor-grabbing',
        isMobile ? 'w-8 h-8' : 'w-14 h-14',
        'transition-all duration-300 ease-in-out transform',
        'hover:scale-105',
        isDragging ? 'opacity-50 scale-95' : 'opacity-100',
        'animate-fade-in'
      )}
      style={{ 
        touchAction: 'none',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out'
      }}
      onTouchStart={handleTouchStart}
    >
      <img 
        src={pieceImage} 
        alt={`${color}${type}`} 
        className="w-full h-full transition-transform duration-300 ease-in-out" 
        draggable={false}
      />
    </div>
  );
};

export default Piece;