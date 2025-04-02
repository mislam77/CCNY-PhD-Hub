import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Validate required environment variables
if (!process.env.AWS_ACCESS_KEY_ID || 
    !process.env.AWS_SECRET_ACCESS_KEY || 
    !process.env.AWS_REGION || 
    !process.env.AWS_S3_BUCKET_NAME) {
  console.error('Missing required AWS environment variables');
}

// Configure AWS S3 with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Log bucket information for debugging during initialization
console.log('Using S3 bucket:', process.env.AWS_S3_BUCKET_NAME);
console.log('AWS Region:', process.env.AWS_REGION);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const userId  = getAuth(request);
  // Verify user authentication
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Parse the request body
    const body = await request.json();
    const { fileName, fileType } = body;
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Generate a unique key for the file
    const uniqueId = uuidv4();
    const fileExtension = fileName.split('.').pop();
    const key = `resources/${id}/${uniqueId}.${fileExtension}`;
    
    // Make sure AWS_S3_BUCKET_NAME is available
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set');
    }
    
    // Set the parameters for the presigned URL
    const params = {
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
      Expires: 600, // URL expires in 10 minutes
    };

    console.log('Generating presigned URL for:', key);
    
    // Generate a presigned URL for uploading
    const url = s3.getSignedUrl('putObject', params);
    console.log('Presigned URL generated:', url);

    // Return the URL and key to the client
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
