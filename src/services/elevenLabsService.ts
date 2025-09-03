import axios from 'axios';
import { BeatParams } from '../types';
import { 
  ElevenLabsGenerationRequest, 
  ElevenLabsGenerationResponse,
  ElevenLabsTaskStatusResponse,
  ElevenLabsModelsResponse
} from '../types/api';

// API configuration
const API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY || '';
const BASE_URL = 'https://api.elevenlabs.io/v1';

// Create axios instance with default config
const elevenLabsApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'xi-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

/**
 * Get available music generation models
 */
export const getAvailableModels = async (): Promise<ElevenLabsModelsResponse> => {
  try {
    const response = await elevenLabsApi.get('/music/models');
    return response.data;
  } catch (error) {
    console.error('Error fetching Eleven Labs models:', error);
    throw new Error('Failed to fetch available music models');
  }
};

/**
 * Generate a beat based on parameters
 */
export const generateBeat = async (params: BeatParams): Promise<string> => {
  try {
    // Prepare request payload
    const payload: ElevenLabsGenerationRequest = {
      model_id: 'eleven_monolith_v1', // Default model
      input: {
        genre: params.genre,
        tempo: params.tempo,
        key: params.key,
        complexity: params.complexity,
        duration: 30, // Default 30 seconds
      },
      output_format: 'mp3',
    };

    // Start generation task
    const response = await elevenLabsApi.post<ElevenLabsGenerationResponse>(
      '/music/generate',
      payload
    );

    // If task is immediately completed
    if (response.data.status === 'completed' && response.data.audio_url) {
      return response.data.audio_url;
    }

    // If task is processing, poll for completion
    const taskId = response.data.task_id;
    return await pollTaskCompletion(taskId);
  } catch (error) {
    console.error('Error generating beat with Eleven Labs:', error);
    throw new Error('Failed to generate beat');
  }
};

/**
 * Poll for task completion
 */
const pollTaskCompletion = async (taskId: string): Promise<string> => {
  const maxAttempts = 30;
  const pollingInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Wait for the polling interval
      await new Promise(resolve => setTimeout(resolve, pollingInterval));

      // Check task status
      const response = await elevenLabsApi.get<ElevenLabsTaskStatusResponse>(
        `/music/tasks/${taskId}`
      );

      // If task completed successfully
      if (response.data.status === 'completed' && response.data.audio_url) {
        return response.data.audio_url;
      }

      // If task failed
      if (response.data.status === 'failed') {
        throw new Error(response.data.error || 'Beat generation failed');
      }

      // Continue polling if still processing
    } catch (error) {
      console.error('Error polling task status:', error);
      throw new Error('Failed to check beat generation status');
    }
  }

  throw new Error('Beat generation timed out');
};

/**
 * Get a pre-signed URL for the generated audio
 */
export const getAudioUrl = async (taskId: string): Promise<string> => {
  try {
    const response = await elevenLabsApi.get<{ audio_url: string }>(
      `/music/tasks/${taskId}/audio`
    );
    return response.data.audio_url;
  } catch (error) {
    console.error('Error fetching audio URL:', error);
    throw new Error('Failed to get audio URL');
  }
};

