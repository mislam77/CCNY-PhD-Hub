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
  const { pathname } = new URL(req.url);
  const postId = pathname.split('/').pop(); // Extract postId from the path

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  const query = `
    SELECT posts.*, users.username AS author_username
    FROM posts
    JOIN users ON posts.author_id = users.id
    WHERE posts.id = $1;
  `;
  const values = [postId];

  try {
    const result = await client.query(query, values);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}