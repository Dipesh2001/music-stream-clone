/**
 * Extracts the duration of an audio file in seconds.
 * 
 * @param file The audio file to extract duration from.
 * @returns A promise that resolves to the duration in seconds.
 */
export const extractAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        const objectUrl = URL.createObjectURL(file);
        audio.src = objectUrl;

        audio.onloadedmetadata = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(audio.duration);
        };

        audio.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to load audio metadata. Please ensure the file is a valid audio format.'));
        };
    });
};

/**
 * Validates if a file is a valid audio file based on common MIME types.
 * 
 * @param file The file to validate.
 * @returns True if the file is a valid audio file, false otherwise.
 */
export const validateAudioFile = (file: File): boolean => {
    const validTypes = [
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'audio/webm',
        'audio/aac',
        'audio/x-m4a',
        'audio/mp4',
        'audio/mp3', // Non-standard but sometimes used
    ];
    return validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.mp3');
};

/**
 * Formats duration in seconds to MM:SS format.
 * 
 * @param seconds The duration in seconds.
 * @returns Formatted duration string (e.g., "3:45").
 */
export const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
