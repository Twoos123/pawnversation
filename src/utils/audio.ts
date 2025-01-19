type SupportedLanguage = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE';

const languageMap: Record<SupportedLanguage, string> = {
  'en-US': 'en-US',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'de-DE': 'de-DE'
};

const moveTranslations: Record<SupportedLanguage, (from: string, to: string) => string> = {
  'en-US': (from, to) => `${from} to ${to}`,
  'es-ES': (from, to) => `${from} a ${to}`,
  'fr-FR': (from, to) => `${from} à ${to}`,
  'de-DE': (from, to) => `${from} nach ${to}`
};

export const playMoveSpeech = (
  from: string, 
  to: string, 
  specialMove?: string, 
  language: SupportedLanguage = 'en-US'
) => {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis is not supported in this browser.");
    return;
  }

  const message = specialMove ? specialMove : moveTranslations[language](from, to);
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = languageMap[language];
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  console.log(`Playing speech in ${language}: ${message}`);
  window.speechSynthesis.speak(utterance);
};