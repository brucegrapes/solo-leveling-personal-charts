/**
 * Client-side media compression utilities
 * Compresses images and videos before upload to reduce bandwidth and storage
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  onProgress?: (progress: number) => void;
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const compressedFile = new File(
                [blob],
                file.name,
                { type: 'image/jpeg' }
              );
              
              const result: CompressionResult = {
                file: compressedFile,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: Math.round((1 - blob.size / file.size) * 100),
              };
              
              if (onProgress) onProgress(100);
              resolve(result);
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
    
    if (onProgress) onProgress(50);
  });
}

/**
 * Compress a video file using HTMLVideoElement and Canvas
 * This creates a preview/thumbnail rather than true video compression
 * For actual video compression, consider using FFmpeg.wasm
 */
export async function compressVideo(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1280,
    maxHeight = 720,
    onProgress,
  } = options;

  // For basic implementation, we'll just validate and return the original
  // True video compression requires FFmpeg or similar heavy libraries
  // which might not be suitable for all use cases
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      
      // Check if video needs compression based on duration or file size
      const duration = video.duration;
      const maxDuration = 60; // 60 seconds max
      
      if (duration > maxDuration) {
        reject(new Error(`Video duration exceeds ${maxDuration} seconds`));
        return;
      }
      
      // For now, return the original file
      // In production, consider using FFmpeg.wasm for actual compression
      const result: CompressionResult = {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
      };
      
      if (onProgress) onProgress(100);
      resolve(result);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
    
    video.src = URL.createObjectURL(file);
    if (onProgress) onProgress(50);
  });
}

/**
 * Main compression function that handles both images and videos
 */
export async function compressMedia(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const fileType = file.type.split('/')[0];
  
  if (fileType === 'image') {
    return compressImage(file, options);
  } else if (fileType === 'video') {
    return compressVideo(file, options);
  } else {
    throw new Error('Unsupported file type');
  }
}

/**
 * Validate file before compression
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
  const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed.',
    };
  }
  
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 20MB limit.',
    };
  }
  
  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
