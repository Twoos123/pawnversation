import { useDrop } from 'react-dnd';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface SquareProps {
  children?: React.ReactNode;
  black: boolean;
  position: string;
  onDrop: (fromPos: string, toPos: string) => void;
}

const Square = ({ black, children, position, onDrop }: SquareProps) => {
  const isMobile = useIsMobile();
  const [{ isOver }, drop] = useDrop({
    accept: 'piece',
    drop: (item: { position: string }) => {
      console.log('Dropping piece from', item.position, 'to', position);
      onDrop(item.position, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const file = position[0];
  const rank = position[1];
  const isBottomEdge = rank === '1';
  const isLeftEdge = file === 'a';

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log('Touch end on square:', position);
    e.preventDefault();
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const square = element?.closest('[data-square]');
    if (square) {
      const toPosition = square.getAttribute('data-square');
      const fromPosition = position;
      if (toPosition && fromPosition !== toPosition) {
        console.log('Moving piece from', fromPosition, 'to', toPosition);
        onDrop(fromPosition, toPosition);
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={drop}
        data-square={position}
        className={cn(
          'flex items-center justify-center relative',
          isMobile ? 'w-10 h-10' : 'w-16 h-16',
          black ? 'bg-[#B58863]' : 'bg-[#F0D9B5]',
          isOver && 'opacity-75 scale-105',
          'transition-all duration-200 ease-in-out'
        )}
        onTouchEnd={handleTouchEnd}
      >
        <div className={cn(
          'w-full h-full flex items-center justify-center',
          'transition-all duration-300 ease-in-out',
          isOver && 'scale-110'
        )}>
          {children}
        </div>
        
        {isBottomEdge && (
          <div className={cn(
            "absolute bottom-1 right-1 font-medium",
            isMobile ? "text-[10px]" : "text-xs",
            "text-gray-600"
          )}>
            {file}
          </div>
        )}
        
        {isLeftEdge && (
          <div className={cn(
            "absolute top-1 left-1 font-medium",
            isMobile ? "text-[10px]" : "text-xs",
            "text-gray-600"
          )}>
            {rank}
          </div>
        )}
      </div>
    </div>
  );
};

export default Square;