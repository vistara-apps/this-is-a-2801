import axios from 'axios';
import { 
  OpenAITranscriptionRequest,
  OpenAITranscriptionResponse,
  OpenAIAudioGenerationRequest
} from '../types/api';

// API configuration
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const BASE_URL = 'https://api.openai.com/v1';

// Create axios instance with default config
const openaiApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
  },
});

/**
 * Transcribe audio to text
 */
export const transcribeAudio = async (audioFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    const response = await openaiApi.post<OpenAITranscriptionResponse>(
      '/audio/transcriptions',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error('Error transcribing audio with OpenAI:', error);
    throw new Error('Failed to transcribe audio');
  }
};

/**
 * Generate audio from text
 */
export const generateAudio = async (
  prompt: string,
  voice: string = 'alloy'
): Promise<ArrayBuffer> => {
  try {
    const payload: OpenAIAudioGenerationRequest = {
      model: 'tts-1',
      input: prompt,
      voice,
      response_format: 'mp3',
    };

    const response = await openaiApi.post('/audio/speech', payload, {
      responseType: 'arraybuffer',
    });

    return response.data;
  } catch (error) {
    console.error('Error generating audio with OpenAI:', error);
    throw new Error('Failed to generate audio');
  }
};

/**
 * Separate stems from an audio file
 * Note: This is a simplified implementation for demonstration purposes.
 * In a production environment, you would use a specialized audio separation service.
 */
export const separateStems = async (audioFile: File): Promise<{
  vocals: ArrayBuffer;
  drums: ArrayBuffer;
  bass: ArrayBuffer;
  other: ArrayBuffer;
}> => {
  try {
    // In a real implementation, you would call a specialized service
    // For demonstration, we'll simulate stem separation with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create mock stem data (in a real app, these would be actual separated stems)
    const mockStems = {
      vocals: new ArrayBuffer(1024),
      drums: new ArrayBuffer(1024),
      bass: new ArrayBuffer(1024),
      other: new ArrayBuffer(1024),
    };

    return mockStems;
  } catch (error) {
    console.error('Error separating stems:', error);
    throw new Error('Failed to separate stems');
  }
};

