# Eleven Labs Music API Documentation

## Overview

The Eleven Labs Music API is used for AI-driven music generation in Beat Weaver. This API allows for creating original beats and musical elements based on specified parameters.

## Base URL

```
https://api.elevenlabs.io/v1
```

## Authentication

All requests to the Eleven Labs API require an API key, which should be included in the request headers:

```
xi-api-key: YOUR_API_KEY
```

## Endpoints

### Get Available Models

Retrieves a list of available music generation models.

**Endpoint:** `/music/models`

**Method:** GET

**Response:**

```json
{
  "models": [
    {
      "model_id": "eleven_monolith_v1",
      "name": "Monolith",
      "description": "General purpose music generation model",
      "capabilities": ["beat_generation", "melody_generation"]
    },
    {
      "model_id": "eleven_tempo_v1",
      "name": "Tempo",
      "description": "Specialized for rhythm and beat generation",
      "capabilities": ["beat_generation"]
    }
  ]
}
```

### Generate Music

Generates a music track based on specified parameters.

**Endpoint:** `/music/generate`

**Method:** POST

**Request Body:**

```json
{
  "model_id": "eleven_monolith_v1",
  "input": {
    "genre": "electronic",
    "tempo": 120,
    "key": "C",
    "complexity": "medium",
    "duration": 30
  },
  "output_format": "mp3"
}
```

**Parameters:**

- `model_id` (string, required): ID of the model to use for generation
- `input` (object, required):
  - `genre` (string, required): Music genre (e.g., "electronic", "hip-hop", "pop")
  - `tempo` (number, required): Beats per minute (60-180)
  - `key` (string, required): Musical key (e.g., "C", "F#", "Bb")
  - `complexity` (string, required): Complexity level ("simple", "medium", "complex")
  - `duration` (number, optional): Duration in seconds (default: 30, max: 120)
- `output_format` (string, optional): Output format ("mp3" or "wav", default: "mp3")

**Response:**

```json
{
  "task_id": "task_12345",
  "status": "completed",
  "audio_url": "https://api.elevenlabs.io/v1/music/tasks/task_12345/audio",
  "duration": 30
}
```

### Get Generation Task Status

Checks the status of a music generation task.

**Endpoint:** `/music/tasks/{task_id}`

**Method:** GET

**Response:**

```json
{
  "task_id": "task_12345",
  "status": "completed", // "processing", "failed"
  "progress": 100,
  "audio_url": "https://api.elevenlabs.io/v1/music/tasks/task_12345/audio",
  "error": null
}
```

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
    "message": "Invalid genre specified",
    "code": "invalid_parameter"
  }
}
```

## Rate Limits

- Free tier: 10 requests per day
- Basic tier: 100 requests per day
- Pro tier: 1000 requests per day

## Implementation in Beat Weaver

In Beat Weaver, the Eleven Labs Music API is used for the AI Beat Builder feature, allowing users to generate original beats based on their specified genre, tempo, and other parameters.

The implementation can be found in `src/services/elevenLabsService.ts`.

