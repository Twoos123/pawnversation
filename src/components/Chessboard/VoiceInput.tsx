import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { processVoiceCommand } from '@/utils/groqUtils';

interface VoiceInputProps {
  onMove: (from: string, to: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onMove, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // Start recording when it's player's turn (disabled = false)
    if (!disabled && !isRecording) {
      startRecording();
    }
    // Stop recording when it's AI's turn (disabled = true)
    else if (disabled && isRecording) {
      stopRecording();
    }

    // Cleanup function
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [disabled]); // Only re-run when disabled prop changes

  const startRecording = async () => {
    try {
      console.log("Starting voice recording...");
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
            onMove(from.toLowerCase(), to.toLowerCase());
          } else {
            toast.error("Could not understand the move. Please try again.");
          }
        } catch (error) {
          console.error("Error processing voice command:", error);
          toast.error("Failed to process voice command. Please try again.");
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      toast.info("Listening for your move...");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    console.log("Stopping voice recording...");
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={disabled}
      className={`transition-colors ${isRecording ? 'bg-red-100 hover:bg-red-200' : ''}`}
    >
      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};

export default VoiceInput;