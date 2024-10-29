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
  const { userId, data } = await req.json();

  if (!userId || !data) {
    console.error('User ID and data are required');
    return NextResponse.json({ error: 'User ID and data are required' }, { status: 400 });
  }

  console.log(`Updating profile for user ID: ${userId}`);

  const query = `
    UPDATE users
    SET contact_info = $1,
        bio = $2,
        experiences = $3,
        portfolio = $4,
        education = $5
    WHERE id = $6
    RETURNING *;
  `;
  const values = [
    data.contact_info ? JSON.stringify(data.contact_info) : null,
    data.bio || null,
    data.experiences ? JSON.stringify(data.experiences) : null,
    data.portfolio ? JSON.stringify(data.portfolio) : null,
    data.education ? JSON.stringify(data.education) : null,
    userId,
  ];

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