import { useIsMobile } from '@/hooks/use-mobile';

interface CapturedPiecesProps {
  color: 'w' | 'b';
  pieces: string[];
  label: string;
}

const CapturedPieces = ({ color, pieces, label }: CapturedPiecesProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-4 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="text-xs sm:text-sm mb-1 sm:mb-2">{label}</div>
      <div className="flex flex-wrap gap-1 p-1 sm:p-2">
        {pieces.map((piece, i) => (
          <img 
            key={i}
            src={`/${color}${piece}.svg`} 
            alt={`captured ${piece}`}
            className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} opacity-75`}
          />
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;