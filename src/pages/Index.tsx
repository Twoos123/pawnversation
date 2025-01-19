import { useEffect, useState } from "react";
import Chessboard from "@/components/Chessboard/Chessboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const [showChessboard, setShowChessboard] = useState(false);

  useEffect(() => {
    // Automatically show chessboard after animation
    const timer = setTimeout(() => setShowChessboard(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Pawnversation
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Experience chess like never before with voice-controlled moves
          </p>
          <div className="flex justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowChessboard(true)}
                className="bg-primary hover:bg-primary/90"
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
              className="absolute w-16 h-16 dark:invert"
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
            },
            {
              title: "Smart AI",
              description: "Challenge yourself against our intelligent AI opponent",
            },
            {
              title: "Beautiful Design",
              description: "Enjoy a sleek and modern chess experience",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-lg bg-card text-card-foreground shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Theme Toggle and Chessboard */}
      <div className="container mx-auto px-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showChessboard ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {showChessboard && <Chessboard />}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;