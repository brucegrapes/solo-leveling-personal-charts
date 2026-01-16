import * as Minio from 'minio';

// MinIO configuration
export const MINIO_CONFIG = {
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'brucegrapes',
  secretKey: process.env.MINIO_SECRET_KEY || '98ded220-f215-11f0-8b94-37046d5d960d',
};

export const BUCKET_NAME = 'monarchdomain-posts-images';
export const PUBLIC_URL = 'https://storage.monarchdomain.in';

// Create MinIO client
export const minioClient = new Minio.Client(MINIO_CONFIG);

/**
 * Ensure bucket exists and is publicly accessible
 */
export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
  }
  
  // Always set the bucket policy to ensure public access
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      },
    ],
  };
  
  try {
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    console.log(`Bucket policy set for ${BUCKET_NAME}`);
  } catch (error) {
    console.error('Failed to set bucket policy:', error);
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(filename: string): string {
  return `${PUBLIC_URL}/${BUCKET_NAME}/${filename}`;
}

/**
 * Upload file to MinIO
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  userId: string
): Promise<string> {
  await ensureBucket();
  
  const metaData = {
    'Content-Type': mimeType,
    'X-Uploaded-By': userId,
  };
  
  await minioClient.putObject(BUCKET_NAME, filename, buffer, buffer.length, metaData);
  
  return getPublicUrl(filename);
}
