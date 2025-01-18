export const playMoveSpeech = (from: string, to: string, specialMove?: string) => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis is not supported in this browser.");
    return;
  }

  const message = specialMove ? specialMove : `Moved from ${from} to ${to}`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};