import { useLanguage } from "@/contexts/LanguageContext";

interface CapturedPiecesProps {
  pieces: string[];
  color: 'w' | 'b';
}

const CapturedPieces = ({ pieces, color }: CapturedPiecesProps) => {
  const { currentLanguage } = useLanguage();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
      <div className="text-sm mb-2">
        {currentLanguage === 'en' 
          ? `Captured by ${color === 'w' ? 'White' : 'Black'}:`
          : `Capturado por ${color === 'w' ? 'Blanco' : 'Negro'}:`}
      </div>
      <div className="flex flex-wrap gap-1">
        {pieces.map((piece, i) => (
          <img 
            key={i}
            src={`/${color === 'w' ? 'b' : 'w'}${piece}.svg`}
            alt={`captured ${piece}`}
            className="w-6 h-6 opacity-75"
          />
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;