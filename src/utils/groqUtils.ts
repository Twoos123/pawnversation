import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const processVoiceCommand = async (audioBlob: Blob): Promise<string> => {
  try {
    console.log("Processing voice command with Groq...");
    
    const text = await convertAudioToText(audioBlob);
    console.log("Converted speech to text:", text);

    if (!text) {
      throw new Error("No speech was detected");
    }

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
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition is not supported in this browser");
      }

      const recognition: SpeechRecognition = new SpeechRecognition();
      recognition.lang = 'en-US';  // Explicitly set to US English
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        console.log("Speech recognition successful:", text);
        resolve(text);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognition.start();
      console.log("Speech recognition started");

      // Convert Blob to audio and play it
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.addEventListener('ended', () => {
        recognition.stop();
        console.log("Audio playback ended, stopping recognition");
      });

      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error setting up speech recognition:", error);
      reject(error);
    }
  });
};