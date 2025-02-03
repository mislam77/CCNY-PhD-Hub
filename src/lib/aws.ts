import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// The credentials are read from the environment automatically
const s3Client = new S3Client({});

export const uploadToS3 = new PutObjectCommand({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: 'file-name',
  Body: 'file-body',
});


// For Local Dev:

// import AWS from 'aws-sdk';
// import dotenv from 'dotenv';

// dotenv.config({ path: '.env.local' });

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// export const uploadToS3 = async (file: File) => {
//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Key: `banners/${file.name}`,
//     Body: file,
//   };

//   console.log('Uploading to bucket:', params.Bucket); // Add this line to debug

//   const data = await s3.upload(params).promise();
//   return data.Location;
// };