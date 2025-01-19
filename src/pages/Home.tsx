import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

  // Generate multiple instances of each piece type for better distribution
  const pieces = [
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

  // Generate random positions for each piece across the entire viewport
  const piecePositions = pieces.map((piece) => ({
    piece,
    left: Math.random() * 80 + 10,     // Random position between 10% and 90% horizontally
    top: Math.random() * 70 + 15,      // Random position between 15% and 85% vertically
    delay: Math.random() * 0.8,        // Random delay for animations
    duration: 3 + Math.random() * 2,   // Random duration between 3-5s
    yOffset: Math.random() * 40 - 20,  // Random Y offset for floating
    scale: 0.8 + Math.random() * 0.4,  // Random initial scale between 0.8 and 1.2
    rotation: Math.random() * 360,     // Random initial rotation
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden relative">
      {/* Floating Chess Pieces Layer */}
      <div className="fixed inset-0 pointer-events-none">
        {piecePositions.map(({ piece, left, top, delay, duration, yOffset, scale, rotation }, index) => (
          <motion.img
            key={`${piece}-${index}`}
            src={`/${piece}.svg`}
            alt={piece}
            className={`absolute w-8 h-8 md:w-12 md:h-12 dark:invert opacity-20 ${
              hoveredPiece === `${piece}-${index}` ? 'opacity-100' : ''
            }`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
            initial={{ 
              scale: 0,
              opacity: 0,
              rotate: -180
            }}
            animate={{
              scale: hoveredPiece === `${piece}-${index}` ? scale * 1.2 : scale,
              opacity: hoveredPiece === `${piece}-${index}` ? 1 : 0.2,
              y: [yOffset, -yOffset, yOffset],
              rotate: [rotation, rotation + 5, rotation - 5, rotation],
            }}
            transition={{
              scale: { duration: 0.5, delay },
              opacity: { duration: 0.5 },
              y: {
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              },
              rotate: {
                duration: duration * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              },
            }}
            whileHover={{
              scale: scale * 1.3,
              opacity: 1,
              rotate: rotation,
              transition: { duration: 0.2 }
            }}
            onHoverStart={() => setHoveredPiece(`${piece}-${index}`)}
            onHoverEnd={() => setHoveredPiece(null)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.img
              src="/logo.svg"
              alt="PawnVersation Logo"
              className="w-24 h-24 md:w-32 md:h-32 dark:invert"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1 }}
            />
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text px-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              PawnVersation
            </motion.h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Experience chess like never before with voice-controlled moves
          </p>
          <div className="flex justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/game")}
                className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:shadow-lg"
              >
                Start Playing
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16"
        >
          {[
            {
              title: "Voice Control",
              description: "Make moves naturally using voice commands",
              icon: "🎤"
            },
            {
              title: "Smart AI",
              description: "Challenge yourself against our intelligent AI opponent",
              icon: "🤖"
            },
            {
              title: "Beautiful Design",
              description: "Enjoy a sleek and modern chess experience",
              icon: "✨"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-lg transition-all duration-300 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className="text-4xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Theme Toggle */}
      <motion.div 
        className="absolute top-4 right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ThemeToggle />
      </motion.div>
    </div>
  );
};

export default Home;