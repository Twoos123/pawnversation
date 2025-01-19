import { useLanguage } from "@/contexts/LanguageContext";

interface ThinkingIndicatorProps {
  isThinking: boolean;
}

const ThinkingIndicator = ({ isThinking }: ThinkingIndicatorProps) => {
  const { currentLanguage } = useLanguage();

  if (!isThinking) return null;

  return (
    <div className="text-center text-gray-600 animate-pulse">
      {currentLanguage === 'en' ? 'AI is thinking...' : 'AI está pensando...'}
    </div>
  );
};

export default ThinkingIndicator;