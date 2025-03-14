import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3PDF(file: File) { 
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `pdfs/${Date.now()}_${file.name}`;
  
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      };
  
      console.log('Uploading to S3:', params.Bucket, params.Key);
      const data = await s3.upload(params).promise();
  
      return data.Location;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
}  