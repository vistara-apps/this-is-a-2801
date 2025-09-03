import axios from 'axios';
import { 
  PinataMetadata,
  PinataOptions,
  PinataPinResponse,
  PinataPinListResponse
} from '../types/api';

// API configuration
const API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const API_SECRET = import.meta.env.VITE_PINATA_SECRET_API_KEY || '';
const BASE_URL = 'https://api.pinata.cloud';

// Create axios instance with default config
const pinataApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'pinata_api_key': API_KEY,
    'pinata_secret_api_key': API_SECRET,
  },
});

/**
 * Upload a file to IPFS via Pinata
 */
export const uploadFileToPinata = async (
  file: File,
  metadata?: Record<string, any>
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata if provided
    if (metadata) {
      const pinataMetadata: PinataMetadata = {
        name: metadata.name || file.name,
        keyvalues: { ...metadata },
      };
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
    }

    // Add options
    const pinataOptions: PinataOptions = {
      cidVersion: 1,
      wrapWithDirectory: false,
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));

    const response = await pinataApi.post<PinataPinResponse>(
      '/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

/**
 * Get a list of pinned files
 */
export const getPinnedFiles = async (
  metadata?: Record<string, any>,
  pageLimit: number = 10,
  pageOffset: number = 0
): Promise<PinataPinListResponse> => {
  try {
    const params: Record<string, any> = {
      status: 'pinned',
      pageLimit,
      pageOffset,
    };

    // Add metadata filter if provided
    if (metadata) {
      params.metadata = JSON.stringify(metadata);
    }

    const response = await pinataApi.get<PinataPinListResponse>(
      '/data/pinList',
      { params }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching pinned files:', error);
    throw new Error('Failed to fetch pinned files');
  }
};

/**
 * Unpin a file from IPFS
 */
export const unpinFile = async (ipfsHash: string): Promise<boolean> => {
  try {
    await pinataApi.delete(`/pinning/unpin/${ipfsHash}`);
    return true;
  } catch (error) {
    console.error('Error unpinning file:', error);
    throw new Error('Failed to unpin file');
  }
};

/**
 * Get the gateway URL for an IPFS hash
 */
export const getIpfsGatewayUrl = (ipfsHash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};

/**
 * Upload a remix to IPFS
 */
export const uploadRemixToPinata = async (
  audioFile: File,
  remixData: Record<string, any>
): Promise<string> => {
  try {
    const metadata = {
      name: remixData.title || 'Untitled Remix',
      keyvalues: {
        type: 'remix',
        creator: remixData.userId,
        username: remixData.username,
        description: remixData.description,
        timestamp: new Date().toISOString(),
      },
    };

    const ipfsHash = await uploadFileToPinata(audioFile, metadata);
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading remix to Pinata:', error);
    throw new Error('Failed to upload remix to IPFS');
  }
};

/**
 * Upload stems to IPFS
 */
export const uploadStemsToPinata = async (
  originalFile: File,
  stemFiles: File[],
  userId: string
): Promise<string[]> => {
  try {
    const stemHashes: string[] = [];

    // Upload each stem file
    for (const stemFile of stemFiles) {
      const metadata = {
        name: stemFile.name,
        keyvalues: {
          type: 'stem',
          creator: userId,
          originalFile: originalFile.name,
          timestamp: new Date().toISOString(),
        },
      };

      const ipfsHash = await uploadFileToPinata(stemFile, metadata);
      stemHashes.push(ipfsHash);
    }

    return stemHashes;
  } catch (error) {
    console.error('Error uploading stems to Pinata:', error);
    throw new Error('Failed to upload stems to IPFS');
  }
};

