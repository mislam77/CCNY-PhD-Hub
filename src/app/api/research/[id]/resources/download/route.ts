import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import AWS from 'aws-sdk';

// Configure AWS S3 with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify user authentication
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Parse the request body to get the fileKey
    const body = await request.json();
    const { fileKey } = body;
    
    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Make sure AWS_S3_BUCKET_NAME is available
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
    }
    
    // Set the parameters for the presigned URL
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Expires: 60 * 5, // URL expires in 5 minutes
    };

    console.log('Generating download presigned URL for:', fileKey);
    
    // Generate a presigned URL for downloading
    const url = s3.getSignedUrl('getObject', params);
    
    // Return the URL to the client
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating download presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
