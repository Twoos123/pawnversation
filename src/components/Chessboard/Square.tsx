import { useDrop } from 'react-dnd';
import { cn } from "@/lib/utils";

interface SquareProps {
  children?: React.ReactNode;
  black: boolean;
  position: string;
  onDrop: (fromPos: string, toPos: string) => void;
}

const Square = ({ black, children, position, onDrop }: SquareProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'piece',
    drop: (item: { position: string }) => {
      onDrop(item.position, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Get file (a-h) and rank (1-8) from position
  const file = position[0];
  const rank = position[1];

  // Determine if this square is on the edge of the board
  const isBottomEdge = rank === '1';
  const isLeftEdge = file === 'a';

  return (
    <div className="relative">
      <div
        ref={drop}
        className={cn(
          'w-16 h-16 flex items-center justify-center relative',
          black ? 'bg-[#B58863]' : 'bg-[#F0D9B5]',
          isOver && 'opacity-75'
        )}
      >
        {children}
        
        {/* File label (a-h) on bottom edge */}
        {isBottomEdge && (
          <div className="absolute bottom-1 right-1 text-xs text-gray-600 font-medium">
            {file}
          </div>
        )}
        
        {/* Rank label (1-8) on left edge */}
        {isLeftEdge && (
          <div className="absolute top-1 left-1 text-xs text-gray-600 font-medium">
            {rank}
          </div>
        )}
      </div>
    </div>
  );
};

export default Square;