import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// Create database connection
const createClient = () => new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const client = createClient();
  await client.connect();

  try {
    const result = await client.query(
      `SELECT id, title, file_url FROM research_papers 
       WHERE title ILIKE $1 OR abstract ILIKE $1 
       ORDER BY title ASC`,
      [`%${query}%`]
    );

    await client.end();
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    await client.end();
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}