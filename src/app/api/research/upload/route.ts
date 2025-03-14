import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { getAuth } from '@clerk/nextjs/server';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { uploadToS3PDF } from '../../../../lib/aws-pdf';

// Create database connection
const createClient = () => new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  ssl: { rejectUnauthorized: false },
});

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Set an appropriate duration for file processing

// Setup Multer to store uploaded files temporarily in memory
const storage = multer.memoryStorage(); // Use memory storage to avoid local disk storage
const upload = multer({ storage: storage });

// Multer middleware handler
function multerMiddleware(req: NextRequest, res: any, next: Function) {
  console.log("Multer middleware called");  // Add log to ensure this is being hit
  upload.single('file')(req as any, res as any, (err: any) => {
    if (err) {
      console.error('Multer error:', err); // Log the error if multer fails
      return res.status(500).json({ error: 'Error during file upload' });
    }
    console.log("File uploaded:", req.file); // Log the file object after upload
    next();
  });
}

// Handle file upload and PDF parsing
export async function POST(req: NextRequest) {
  console.log('Received POST request at /api/research/upload'); // Log to verify request is reaching server

  const { userId } = getAuth(req);
  if (!userId) {
    console.log('User not authenticated');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return new Promise((resolve, reject) => {
    console.log('Processing file upload...');
    
    // Use Multer middleware to process the upload
    multerMiddleware(req, {}, async () => {
      console.log('Multer middleware executed'); // Confirm Multer is triggered
      const file = (req as any).file;
      if (!file) {
        console.log('No file uploaded');
        return resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
      }

      // Continue processing after file is uploaded
      try {
        // Parsing PDF, uploading, and saving to DB
        console.log('PDF file processing begins');
        const fileBuffer = file.buffer;
        const pdfData = await pdfParse(fileBuffer);
        const { title, abstract } = extractMetadata(pdfData);

        console.log('Extracted Metadata:', { title, abstract });

        const fileUrl = await uploadToS3PDF(file); 
        console.log('File uploaded to S3:', fileUrl);

        const client = createClient();
        await client.connect();
        console.log('Connected to database');

        const result = await client.query(
          `INSERT INTO research_papers (title, author, abstract, file_url) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [title, userId, abstract, fileUrl]
        );

        console.log('Database insertion result:', result.rows[0]);
        await client.end();

        resolve(NextResponse.json(result.rows[0], { status: 201 }));
      } catch (error) {
        console.error('Error processing upload:', error);
        resolve(NextResponse.json({ error: 'Internal server error' }, { status: 500 }));
      }
    });
  });
}

function extractMetadata(pdfData: any) {
  const title = pdfData.info.Title || 'Untitled';
  const abstract = pdfData.text.slice(0, 1000); // Use first 1000 characters as abstract
  return { title, abstract };
}