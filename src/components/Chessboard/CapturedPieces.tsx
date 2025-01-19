interface CapturedPiecesProps {
  color: 'w' | 'b';
  pieces: string[];
  label: string;
}

const CapturedPieces = ({ color, pieces, label }: CapturedPiecesProps) => {
  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border-2 border-border shadow-sm dark:bg-card/40">
      <div className="text-sm mb-2 text-card-foreground">{label}</div>
      <div className="flex flex-wrap gap-1 p-2">
        {pieces.map((piece, i) => (
          <img 
            key={i}
            src={`/${color}${piece}.svg`} 
            alt={`captured ${piece}`}
            className="w-6 h-6 opacity-75"
          />
        ))}
      </div>
    </div>
  );
};

export default CapturedPieces;