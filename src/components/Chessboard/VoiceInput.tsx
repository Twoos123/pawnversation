import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { processVoiceCommand } from '@/utils/groqUtils';
import { playMoveSpeech } from '@/utils/audio';

type SupportedLanguage = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';

interface VoiceInputProps {
  onMove: (from: string, to: string) => void;
  disabled?: boolean;
  language?: SupportedLanguage;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onMove, 
  disabled, 
  language = 'en-US' 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        try {
          const moveText = await processVoiceCommand(audioBlob, language);
          console.log("Processed move text:", moveText);
          
          // Extract from and to positions using a more flexible regex pattern
          // This will match any two chess coordinates (a-h)(1-8) that appear in the text
          const coordinates = moveText.match(/[a-h][1-8]/gi);
          console.log("Extracted coordinates:", coordinates);
          
          if (coordinates && coordinates.length >= 2) {
            const [from, to] = coordinates;
            console.log(`Executing move from ${from} to ${to}`);
            onMove(from.toLowerCase(), to.toLowerCase());
          } else {
            const errorMessages = {
              'en-US': 'Could not understand the move. Please try again.',
              'es-ES': 'No se pudo entender el movimiento. Por favor, inténtelo de nuevo.',
              'fr-FR': 'Impossible de comprendre le mouvement. Veuillez réessayer.',
              'de-DE': 'Konnte den Zug nicht verstehen. Bitte versuchen Sie es erneut.'
            };
            playMoveSpeech("", "", errorMessages[language], language);
            toast.error(errorMessages[language]);
          }
        } catch (error) {
          console.error("Error processing voice command:", error);
          const errorMessages = {
            'en-US': 'Failed to process voice command. Please try again.',
            'es-ES': 'Error al procesar el comando de voz. Por favor, inténtelo de nuevo.',
            'fr-FR': 'Échec du traitement de la commande vocale. Veuillez réessayer.',
            'de-DE': 'Fehler bei der Verarbeitung des Sprachbefehls. Bitte versuchen Sie es erneut.'
          };
          playMoveSpeech("", "", errorMessages[language], language);
          toast.error(errorMessages[language]);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      const listeningMessages = {
        'en-US': 'Listening for your move...',
        'es-ES': 'Escuchando tu movimiento...',
        'fr-FR': 'En attente de votre mouvement...',
        'de-DE': 'Warte auf Ihren Zug...'
      };
      toast.info(listeningMessages[language]);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      const errorMessages = {
        'en-US': 'Could not access microphone. Please check permissions.',
        'es-ES': 'No se pudo acceder al micrófono. Por favor, verifique los permisos.',
        'fr-FR': 'Impossible d\'accéder au microphone. Veuillez vérifier les autorisations.',
        'de-DE': 'Konnte nicht auf das Mikrofon zugreifen. Bitte überprüfen Sie die Berechtigungen.'
      };
      toast.error(errorMessages[language]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Button
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={isRecording ? stopRecording : startRecording}
        className={`transition-colors ${isRecording ? 'bg-red-100 hover:bg-red-200' : ''}`}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default VoiceInput;