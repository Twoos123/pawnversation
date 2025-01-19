import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it';

export const translateText = async (text: string, targetLanguage: SupportedLanguage): Promise<string> => {
  try {
    console.log(`Translating text to ${targetLanguage}:`, text);
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a chess game translator. Translate the following text to ${targetLanguage}. Only respond with the translation, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
      max_tokens: 100,
      stream: false
    });

    const translation = completion.choices[0]?.message?.content || text;
    console.log("Translation result:", translation);
    return translation;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text
  }
};

export const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano"
};