import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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"
});

export const processVoiceCommand = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log("Processing voice command with Groq...");
    
    // Convert audio blob to base64
    const reader = new FileReader();
    const base64Audio = await new Promise<string>((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.readAsDataURL(audioBlob);
    });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a chess move interpreter. Convert spoken chess moves like 'a2 to a4' into standard chess notation."
        },
        {
          role: "user",
          content: `Process this chess move command: ${base64Audio}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 50,
    });

    console.log("Groq response:", completion.choices[0]?.message?.content);
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error processing voice command:", error);
    throw new Error("Failed to process voice command");
  }
}