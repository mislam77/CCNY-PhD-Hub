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

// Handle GET request for a single community by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Get the `id` from route params

  if (!id) {
    return NextResponse.json(
      { error: 'Community ID is required' },
      { status: 400 }
    );
  }

  const client = createClient();
  await client.connect();
  try {
    const result = await client.query('SELECT * FROM communities WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}