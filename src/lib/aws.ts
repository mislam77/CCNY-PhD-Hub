import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file: File) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `banners/${file.name}`,
    Body: file,
  };

  console.log('Uploading to bucket:', params.Bucket);

  const data = await s3.upload(params).promise();
  return data.Location;
};