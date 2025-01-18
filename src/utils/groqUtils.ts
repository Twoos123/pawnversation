import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true  // Add this option to allow browser usage
});

export const processVoiceCommand = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log("Processing voice command with Groq...");
    
    // First, convert the audio to text using the Web Speech API
    const text = await convertAudioToText(audioBlob);
    console.log("Converted speech to text:", text);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a chess move interpreter. Convert spoken chess moves into standard chess notation. Only respond with the move in the format 'a2 to a4' or similar. If you can't understand the move, respond with 'Invalid move'."
        },
        {
          role: "user",
          content: `Interpret this chess move: ${text}`
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
};

const convertAudioToText = (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      resolve(text);
    };

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    // Convert Blob to audio and play it through recognition
    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.addEventListener('ended', () => {
      recognition.stop();
    });

    recognition.start();
    audio.play();
  });
};