export const getPieceName = (piece: string): string => {
  const pieceMap: { [key: string]: string } = {
    'p': 'pawn',
    'n': 'knight',
    'b': 'bishop',
    'r': 'rook',
    'q': 'queen',
    'k': 'king'
  };
  
  return pieceMap[piece] || piece;
};