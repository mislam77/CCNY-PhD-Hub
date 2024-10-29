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
  const { text, authorId, postId, replyToId } = await req.json();

  if (!text || !authorId || !postId) {
    return NextResponse.json({ error: 'Text, authorId, and postId are required' }, { status: 400 });
  }

  const query = `
    INSERT INTO comments (text, author_id, post_id, reply_to_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [text, authorId, postId, replyToId || null]; // Set replyToId to null if not provided

  try {
    const result = await client.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  }

  const query = `
    SELECT comments.*, users.username AS author_username
    FROM comments
    JOIN users ON comments.author_id = users.id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC;
  `;
  const values = [postId];

  try {
    const result = await client.query(query, values);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}