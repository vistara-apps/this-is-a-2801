# OpenAI API Documentation

## Overview

The OpenAI API is used in Beat Weaver for audio processing, specifically for stem separation. This API allows for analyzing and manipulating audio files using AI models.

## Base URL

```
https://api.openai.com/v1
```

## Authentication

All requests to the OpenAI API require an API key, which should be included in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Audio Transcription

Transcribes audio into text, which is used as part of the stem separation process.

**Endpoint:** `/audio/transcriptions`

**Method:** POST

**Request:**

- Format: `multipart/form-data`
- Parameters:
  - `file` (file, required): The audio file to transcribe (mp3, mp4, mpeg, mpga, m4a, wav, or webm)
  - `model` (string, required): ID of the model to use (e.g., "whisper-1")
  - `response_format` (string, optional): The format of the transcript output (json, text, srt, verbose_json, or vtt)
  - `temperature` (number, optional): Sampling temperature between 0 and 1 (default: 0)

**Response:**

```json
{
  "text": "This is the transcribed text from the audio file.",
  "task": "transcribe",
  "language": "en",
  "duration": 120.5
}
```

### Audio Generation

Generates audio from text prompts, which can be used for creating new audio elements.

**Endpoint:** `/audio/generations`

**Method:** POST

**Request Body:**

```json
{
  "model": "tts-1",
  "input": "Generate a drum beat with a tempo of 120 BPM in 4/4 time signature",
  "voice": "alloy",
  "response_format": "mp3",
  "speed": 1.0
}
```

**Parameters:**

- `model` (string, required): ID of the model to use
- `input` (string, required): The text prompt to generate audio from
- `voice` (string, required): The voice to use for generation
- `response_format` (string, optional): The format of the audio output (mp3, opus, aac, or flac)
- `speed` (number, optional): The speed of the generated audio (0.25-4.0)

**Response:**

The API returns the audio data directly as a binary stream with the appropriate content type.

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API key)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

Error responses include a message explaining the error:

```json
{
  "error": {
    "message": "Invalid file format. Please upload an audio file.",
    "type": "invalid_request_error",
    "param": "file",
    "code": "invalid_file_format"
  }
}
```

## Rate Limits

Rate limits vary based on your OpenAI account tier and the specific models being used. Check the OpenAI documentation for current rate limits.

## Implementation in Beat Weaver

In Beat Weaver, the OpenAI API is primarily used for the AI Stem Separator feature, which allows users to upload a song and separate it into individual stems (vocals, drums, bass, other instruments).

The implementation can be found in `src/services/openaiService.ts`.

**Note:** In a production environment, a specialized audio separation service would be more appropriate for stem separation. The OpenAI implementation in Beat Weaver is a simplified approach that demonstrates the concept.

