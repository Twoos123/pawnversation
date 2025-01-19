import { motion } from "framer-motion";

const features = [
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
];

const FeaturesGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16"
    >
      {features.map((feature, index) => (
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
  );
};

export default FeaturesGrid;