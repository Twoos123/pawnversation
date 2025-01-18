/**
 * Converts a Blob to base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
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

/**
 * Validates audio file format and size
 */
export const validateAudioFile = (file: File): boolean => {
  const validTypes = ['audio/webm', 'audio/mp3', 'audio/wav'];
  const maxSize = 25 * 1024 * 1024; // 25MB in bytes

  return validTypes.includes(file.type) && file.size <= maxSize;
};