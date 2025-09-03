# Pinata API Documentation

## Overview

Pinata is an IPFS (InterPlanetary File System) pinning service used in Beat Weaver for decentralized storage of audio files, stems, and remixes. This ensures that user-generated content remains accessible and persistent.

## Base URL

```
https://api.pinata.cloud
```

## Authentication

All requests to the Pinata API require API credentials, which should be included in the request headers:

```
pinata_api_key: YOUR_API_KEY
pinata_secret_api_key: YOUR_API_SECRET
```

## Endpoints

### Pin File to IPFS

Uploads a file to IPFS and pins it to ensure it remains accessible.

**Endpoint:** `/pinning/pinFileToIPFS`

**Method:** POST

**Request:**

- Format: `multipart/form-data`
- Parameters:
  - `file` (file, required): The file to upload
  - `pinataMetadata` (string, optional): JSON string containing metadata for the file
  - `pinataOptions` (string, optional): JSON string containing pinning options

**Example Metadata:**

```json
{
  "name": "My Audio File",
  "keyvalues": {
    "type": "remix",
    "genre": "electronic",
    "creator": "user123",
    "timestamp": "2023-09-03T12:34:56Z"
  }
}
```

**Example Options:**

```json
{
  "cidVersion": 1,
  "wrapWithDirectory": false
}
```

**Response:**

```json
{
  "IpfsHash": "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
  "PinSize": 1234,
  "Timestamp": "2023-09-03T12:34:56.789Z"
}
```

### Get Pinned Files

Retrieves a list of files pinned to IPFS.

**Endpoint:** `/data/pinList`

**Method:** GET

**Parameters:**

- `status` (string, optional): Filter by pin status ("all", "pinned", "unpinned")
- `pageLimit` (number, optional): Number of items per page (default: 10, max: 1000)
- `pageOffset` (number, optional): Page number for pagination
- `metadata` (object, optional): Filter by metadata

**Response:**

```json
{
  "count": 1,
  "rows": [
    {
      "id": "12345",
      "ipfs_pin_hash": "QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx",
      "size": 1234,
      "user_id": "user123",
      "date_pinned": "2023-09-03T12:34:56.789Z",
      "date_unpinned": null,
      "metadata": {
        "name": "My Audio File",
        "keyvalues": {
          "type": "remix",
          "genre": "electronic",
          "creator": "user123",
          "timestamp": "2023-09-03T12:34:56Z"
        }
      }
    }
  ]
}
```

### Unpin File from IPFS

Removes a pin from IPFS, allowing the file to be garbage collected.

**Endpoint:** `/pinning/unpin/{ipfs_pin_hash}`

**Method:** DELETE

**Response:**

```json
{
  "success": true
}
```

## IPFS Gateways

After pinning a file to IPFS, it can be accessed through various IPFS gateways:

- Pinata Gateway: `https://gateway.pinata.cloud/ipfs/{ipfs_pin_hash}`
- Public Gateway: `https://ipfs.io/ipfs/{ipfs_pin_hash}`
- Cloudflare Gateway: `https://cloudflare-ipfs.com/ipfs/{ipfs_pin_hash}`

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request (invalid parameters)
- 401: Unauthorized (invalid API credentials)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

Error responses include a message explaining the error:

```json
{
  "error": {
    "reason": "Invalid file format",
    "details": "The provided file is not supported"
  }
}
```

## Rate Limits and Storage Quotas

- Free tier: 1GB storage, 100 API calls per day
- Professional tier: 50GB storage, 1000 API calls per day
- Enterprise tier: Custom storage and API call limits

## Implementation in Beat Weaver

In Beat Weaver, Pinata is used for:

1. Storing separated stems from the AI Stem Separator
2. Storing generated beats from the AI Beat Builder
3. Storing user remixes for sharing in the Community Hub

The implementation can be found in `src/services/pinataService.ts`.

