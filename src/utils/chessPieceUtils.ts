export const getPieceName = (piece: string): string => {
  const pieceMap: { [key: string]: string } = {
    'p': 'Pawn',
    'n': 'Knight',
    'b': 'Bishop',
    'r': 'Rook',
    'q': 'Queen',
    'k': 'King'
  };
  
  return pieceMap[piece] || piece;
};