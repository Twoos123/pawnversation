import VoiceInput from './VoiceInput';

interface GameControlsProps {
  isThinking: boolean;
  currentLanguage: string;
  onVoiceMove: (from: string, to: string) => void;
  isPlayerTurn: boolean;
  isGameOver: boolean;
}

const GameControls = ({ 
  isThinking, 
  currentLanguage, 
  onVoiceMove, 
  isPlayerTurn,
  isGameOver 
}: GameControlsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {isThinking && (
        <div className="text-center text-gray-600 animate-pulse">
          {currentLanguage === 'en' ? 'AI is thinking...' : 'AI está pensando...'}
        </div>
      )}
      <VoiceInput 
        onMove={onVoiceMove} 
        disabled={isThinking || !isPlayerTurn || isGameOver}
      />
    </div>
  );
};

export default GameControls;