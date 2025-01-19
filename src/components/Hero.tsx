import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Hero;