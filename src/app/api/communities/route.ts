import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// Helper function to create a new client instance
const createClient = () => {
  return new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

// Handle GET request to fetch all communities
export async function GET(req: NextRequest) {
  const client = createClient();
  await client.connect();
  try {
    const result = await client.query('SELECT * FROM communities ORDER BY created_at DESC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}

// Handle POST request to create a new community
export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
    console.log('Received body:', body); // Debug log
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, description, hashtags } = body;

  if (!name || !description || !Array.isArray(hashtags)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const client = createClient();
  await client.connect();
  try {
    const result = await client.query(
      'INSERT INTO communities (name, description, hashtags) VALUES ($1, $2, $3) RETURNING *',
      [name, description, hashtags]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}