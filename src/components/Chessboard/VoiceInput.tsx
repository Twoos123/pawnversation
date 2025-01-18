import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { processVoiceCommand } from '@/utils/groqUtils';
import { wait } from '@/utils/timeUtils';
import { playMoveSpeech } from '@/utils/audio';

interface VoiceInputProps {
  onMove: (from: string, to: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onMove, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const RECORDING_DURATION = 3000; // 3 seconds in milliseconds

  useEffect(() => {
    wait(2000);
    playMoveSpeech("","","Please tell us your next move");
    // Start recording when it's player's turn (disabled = false)
    if (!disabled && !isRecording) {
      console.log("Player's turn - starting microphone");
      startRecording();
    }
    
    // Cleanup function
    return () => {
      if (mediaRecorder) {
        console.log("Cleaning up media recorder");
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [disabled]); // Re-run when disabled prop changes

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
          const moveText = await processVoiceCommand(audioBlob);
          console.log("Processed move text:", moveText);
          
          // Extract from and to positions from the move text
          const match = moveText.match(/([a-h][1-8])\s*to\s*([a-h][1-8])/i);
          if (match) {
            const [_, from, to] = match;
            setIsRecording(false); // Stop recording when valid move is detected
            onMove(from.toLowerCase(), to.toLowerCase());
          } else {
            console.log("No valid move found, restarting recording");
            // Start a new recording cycle if no valid move was found
            startRecording();
          }
        } catch (error) {
          console.error("Error processing voice command:", error);
          toast.error("Failed to process voice command. Please try again.");
          // Restart recording after error
          startRecording();
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      console.log("Started recording");
      toast.info("Listening for your move...");

      // Stop recording after RECORDING_DURATION
      setTimeout(() => {
        if (recorder.state === 'recording') {
          console.log("2-second timer completed, stopping recording");
          recorder.stop();
          recorder.stream.getTracks().forEach(track => track.stop());
        }
      }, RECORDING_DURATION);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={true} // Always disabled since we're handling recording automatically
      className={`transition-colors ${isRecording ? 'bg-red-100 hover:bg-red-200' : ''}`}
    >
      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceInput;