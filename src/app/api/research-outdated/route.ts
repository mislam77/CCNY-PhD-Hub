import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { getAuth } from '@clerk/nextjs/server';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { uploadToS3PDF } from '@/lib/aws-pdf';

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

// Handle file upload and PDF parsing
export async function POST(req: NextRequest) {
  console.log('Received POST request at /api/research/upload');

  const { userId } = getAuth(req);
  if (!userId) {
    console.log('User not authenticated');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File uploaded:', file.name);

    // Parse PDF
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(fileBuffer);
    const { title, abstract } = extractMetadata(pdfData);

    console.log('Extracted Metadata:', { title, abstract });

    // Upload the PDF to S3
    const fileUrl = await uploadToS3PDF(file);
    console.log('File uploaded to S3:', fileUrl);

    // Save to database
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

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractMetadata(pdfData: any) {
  const title = pdfData.info.Title || 'Untitled';
  const abstract = pdfData.text.slice(0, 1000); // Use first 1000 characters as abstract
  return { title, abstract };
}