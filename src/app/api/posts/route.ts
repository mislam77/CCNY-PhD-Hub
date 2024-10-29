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
  const { title, content, authorId } = await req.json();

  if (!title || !authorId) {
    return NextResponse.json({ error: 'Title and authorId are required' }, { status: 400 });
  }

  let contentJson;
  try {
    contentJson = JSON.stringify(content);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON content' }, { status: 400 });
  }

  const query = `
    INSERT INTO posts (title, content, author_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [title, contentJson, authorId];

  try {
    const result = await client.query(query, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const query = `
    SELECT posts.*, users.username AS author_username
    FROM posts
    JOIN users ON posts.author_id = users.id
    ORDER BY posts.created_at DESC;
  `;

  try {
    const result = await client.query(query);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}