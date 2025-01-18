import { Groq } from "groq-sdk";
import { validateAudioFile } from "./audioUtils";
import { extractChessMove } from "./voiceCommandUtils";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

/**
 * Processes voice command using Groq API
 */
export const processVoiceCommand = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log("Processing voice command with Groq...");
    
    // Convert Blob to File
    const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
    
    // Validate audio file
    if (!validateAudioFile(file)) {
      throw new Error("Invalid audio file format or size");
    }
    
    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
      temperature: 0.0,
    });

    console.log("Transcription result:", transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("Error processing voice command:", error);
    throw new Error("Failed to process voice command");
  }
};