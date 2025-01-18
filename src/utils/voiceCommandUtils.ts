/**
 * Extracts chess move from transcribed text
 */
export const extractChessMove = (text: string): { from: string; to: string } | null => {
  const match = text.match(/([a-h][1-8])\s*to\s*([a-h][1-8])/i);
  if (match) {
    const [_, from, to] = match;
    return {
      from: from.toLowerCase(),
      to: to.toLowerCase()
    };
  }
  return null;
};