import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [hoveredPiece, setHoveredPiece] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Pawnversation
          </motion.h1>
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

        {/* Floating Chess Pieces */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative h-40 mb-12"
        >
          {['wp', 'wn', 'wb', 'wq', 'wk'].map((piece, index) => (
            <motion.img
              key={piece}
              src={`/${piece}.svg`}
              alt={piece}
              className={`absolute w-16 h-16 dark:invert cursor-pointer transition-all duration-300 ${
                hoveredPiece === piece ? 'scale-125 rotate-12' : ''
              }`}
              style={{
                left: `${index * 20}%`,
                top: '50%',
              }}
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              whileHover={{
                scale: 1.2,
                rotate: 12,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredPiece(piece)}
              onHoverEnd={() => setHoveredPiece(null)}
            />
          ))}
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