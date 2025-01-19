import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isHoveringStart, setIsHoveringStart] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <UserCircle2 className="h-6 w-6" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <motion.img
              src="/logo.png"
              alt="Pawnversation Logo"
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
              Pawnversation
            </motion.h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8">
            Experience chess like never before with voice-controlled moves
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/game")}
              className="px-4 py-2 text-lg font-semibold"
              onMouseEnter={() => setIsHoveringStart(true)}
              onMouseLeave={() => setIsHoveringStart(false)}
            >
              {isHoveringStart ? "Let's Play!" : "Start Game"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
