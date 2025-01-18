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

  return (
    <div
      ref={drop}
      className={cn(
        'w-16 h-16 flex items-center justify-center relative',
        black ? 'bg-[#B58863]' : 'bg-[#F0D9B5]',
        isOver && 'opacity-75'
      )}
    >
      {children}
    </div>
  );
};

export default Square;