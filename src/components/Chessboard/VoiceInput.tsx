import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { processVoiceCommand } from '@/utils/groqUtils';

interface VoiceInputProps {
  onMove: (from: string, to: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onMove, disabled }) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    let recorder: MediaRecorder | null = null;
    let chunks: Blob[] = [];

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm'
        });
        
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          chunks = [];
          try {
            const moveText = await processVoiceCommand(audioBlob);
            console.log("Processed move text:", moveText);
            
            const match = moveText.match(/([a-h][1-8])\s*to\s*([a-h][1-8])/i);
            if (match) {
              const [_, from, to] = match;
              onMove(from.toLowerCase(), to.toLowerCase());
            } else {
              toast.error("Could not understand the move. Please try again.");
            }
          } catch (error) {
            console.error("Error processing voice command:", error);
            toast.error("Failed to process voice command. Please try again.");
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        toast.info("Voice recognition activated - it's your turn!");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Could not access microphone. Please check permissions.");
      }
    };

    const stopRecording = () => {
      if (recorder && recorder.state === 'recording') {
        recorder.stop();
        recorder.stream.getTracks().forEach(track => track.stop());
      }
    };

    if (!disabled) {
      console.log("Starting voice recording - player's turn");
      startRecording();
    } else {
      console.log("Stopping voice recording - AI's turn");
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [disabled, onMove]);

  return null; // No UI needed as recording is handled automatically
};

export default VoiceInput;