import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const processVoiceCommand = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log("Processing voice command with Groq...");
    
    // Convert Blob to File
    const file = new File([audioBlob], "recording.webm", { type: "audio/webm" });
    
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

// Helper function to convert audio blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Remove data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};