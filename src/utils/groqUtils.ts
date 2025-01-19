import { Groq } from "groq-sdk";
import { validateAudioFile } from "./audioUtils";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

type SupportedLanguage = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';

const languageMap: Record<SupportedLanguage, string> = {
  'en-US': 'en',
  'es-ES': 'es',
  'fr-FR': 'fr',
  'de-DE': 'de'
};

/**
 * Translates text to English using Groq
 */
const translateToEnglish = async (text: string, sourceLanguage: string): Promise<string> => {
  if (sourceLanguage === 'en') return text;
  
  console.log(`Translating text from ${sourceLanguage} to English:`, text);
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a translator. Translate the following chess move to English. Only return the translation, nothing else."
        },
        {
          role: "user",
          content: `Translate this chess move from ${sourceLanguage} to English: ${text}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
      max_tokens: 100,
    });

    const translation = completion.choices[0]?.message?.content || text;
    console.log("Translated text:", translation);
    return translation;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text if translation fails
  }
};

/**
 * Processes voice command using Groq API
 */
export const processVoiceCommand = async (
  audioBlob: Blob, 
  language: SupportedLanguage = 'en-US'
): Promise<string> => {
  try {
    console.log(`Processing voice command with Groq in language: ${language}`);
    
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
      language: languageMap[language],
      response_format: "json",
      temperature: 0.0,
    });

    console.log("Transcription result:", transcription.text);
    
    // Translate to English if not already in English
    const translatedText = await translateToEnglish(
      transcription.text, 
      languageMap[language]
    );
    
    return translatedText;
  } catch (error) {
    console.error("Error processing voice command:", error);
    throw new Error("Failed to process voice command");
  }
};