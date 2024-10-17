import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect().catch(err => console.error('Error connecting to the database:', err));

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    console.error('User ID is required');
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  console.log(`Fetching profile for user ID: ${userId}`);

  const query = `
    SELECT id, email, username, first_name, last_name, external_accounts, contact_info, bio, experiences, portfolio, education
    FROM users
    WHERE id = $1;
  `;
  const values = [userId];

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      console.error(`User not found: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(`User profile found: ${JSON.stringify(result.rows[0])}`);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}