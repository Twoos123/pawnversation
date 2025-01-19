import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type PiecePosition = {
  piece: string;
  left: number;
  top: number;
  delay: number;
  duration: number;
  scale: number;
  rotation: number;
};

const FloatingChessPieces = () => {
  const [pieces, setPieces] = useState<PiecePosition[]>([]);

  useEffect(() => {
    // Generate multiple instances of each piece type for better distribution
    const pieceTypes = [
      'wp', 'wp', 'wp', 'wp',  // 4 white pawns
      'wn', 'wn',              // 2 white knights
      'wb', 'wb',              // 2 white bishops
      'wr', 'wr',              // 2 white rooks
      'wq',                    // 1 white queen
      'wk',                    // 1 white king
      'bp', 'bp', 'bp', 'bp',  // 4 black pawns
      'bn', 'bn',              // 2 black knights
      'bb', 'bb',              // 2 black bishops
      'br', 'br',              // 2 black rooks
      'bq',                    // 1 black queen
      'bk',                    // 1 black king
    ];

    const positions = pieceTypes.map((piece) => ({
      piece,
      left: Math.random() * 80 + 10,
      top: Math.random() * 70 + 15,
      delay: Math.random() * 0.8,
      duration: 15 + Math.random() * 10,
      scale: 0.8 + Math.random() * 0.4,
      rotation: Math.random() * 360,
    }));

    setPieces(positions);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {pieces.map(({ piece, delay, duration, scale, rotation }, index) => (
          <motion.img
            key={`${piece}-${index}`}
            src={`/${piece}.svg`}
            alt={piece}
            className="absolute w-8 h-8 md:w-12 md:h-12 dark:invert opacity-20"
            initial={{ 
              scale: 0,
              opacity: 0,
              rotate: -180,
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
            }}
            animate={{
              scale,
              opacity: 0.2,
              rotate: [rotation, rotation + 10, rotation - 10, rotation],
              x: [
                `${Math.random() * 80 + 10}vw`,
                `${Math.random() * 80 + 10}vw`,
                `${Math.random() * 80 + 10}vw`,
                `${Math.random() * 80 + 10}vw`
              ],
              y: [
                `${Math.random() * 70 + 15}vh`,
                `${Math.random() * 70 + 15}vh`,
                `${Math.random() * 70 + 15}vh`,
                `${Math.random() * 70 + 15}vh`
              ],
            }}
            transition={{
              scale: { 
                duration: 1.5,
                delay,
                ease: "easeInOut"
              },
              opacity: { 
                duration: 1.5,
                delay,
                ease: "easeInOut"
              },
              rotate: {
                duration: duration * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              },
              x: {
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1]
              },
              y: {
                duration: duration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1]
              }
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: {
                duration: 1.5,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChessPieces;