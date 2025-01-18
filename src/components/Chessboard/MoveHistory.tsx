interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory = ({ moves }: MoveHistoryProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 w-64 h-[400px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Move History</h3>
      <div className="space-y-1">
        {moves.map((move, index) => (
          <div key={index} className="flex">
            <span className="w-8 text-gray-500">{Math.floor(index / 2) + 1}.</span>
            <span className="flex-1">{move}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveHistory;