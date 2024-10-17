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

export async function POST(req: NextRequest) {
  const { userId, section, data } = await req.json();

  if (!userId || !section || !data) {
    console.error('User ID, section, and data are required');
    return NextResponse.json({ error: 'User ID, section, and data are required' }, { status: 400 });
  }

  console.log(`Updating profile for user ID: ${userId}, section: ${section}`);

  const query = `
    UPDATE users
    SET ${section} = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [data, userId];

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      console.error(`User not found: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log(`User profile updated: ${JSON.stringify(result.rows[0])}`);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}