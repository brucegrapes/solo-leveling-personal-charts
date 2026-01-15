'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  compressMedia,
  validateFile,
  formatFileSize,
  CompressionResult,
} from '@/lib/media-compression';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setCompressionResult(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Compress the file
    try {
      setIsCompressing(true);
      setCompressionProgress(0);

      const result = await compressMedia(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        onProgress: (progress) => setCompressionProgress(progress),
      });

      setCompressionResult(result);
      setSelectedFile(result.file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed');
      setSelectedFile(null);
      setPreview(null);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await uploadRes.json();

      // Create the post
      const postRes = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          mediaUrl: uploadData.url,
          mediaType: uploadData.type,
          fileSize: uploadData.size,
          mimeType: uploadData.mimeType,
        }),
      });

      if (!postRes.ok) {
        const errorData = await postRes.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      // Reset form
      setContent('');
      setSelectedFile(null);
      setPreview(null);
      setCompressionResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setCompressionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-800 border border-purple-500/30 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Create Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Caption (optional)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your achievement..."
            maxLength={1000}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {content.length} / 1000 characters
          </p>
        </div>

        {/* File input */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-2">
            Image or Video *
          </label>
          <input
            ref={fileInputRef}
            id="file"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={isCompressing || isUploading}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
          />
          <p className="text-xs text-gray-400 mt-1">
            Max 20MB. Images (JPEG, PNG, WebP, GIF) or Videos (MP4, WebM, MOV)
          </p>
        </div>

        {/* Preview */}
        {preview && selectedFile && (
          <div className="relative border border-gray-600 rounded-lg overflow-hidden">
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-96 object-contain bg-gray-900"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-96 bg-gray-900"
              />
            )}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Compression progress */}
        {isCompressing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Compressing...</span>
              <span>{compressionProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${compressionProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Compression result */}
        {compressionResult && (
          <div className="bg-gray-700 rounded-lg p-3 text-sm space-y-1">
            <p>
              Original: {formatFileSize(compressionResult.originalSize)}
            </p>
            <p>
              Compressed: {formatFileSize(compressionResult.compressedSize)}
            </p>
            {compressionResult.compressionRatio > 0 && (
              <p className="text-green-400">
                Saved {compressionResult.compressionRatio}% space
              </p>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!selectedFile || isCompressing || isUploading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isUploading ? 'Posting...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}
