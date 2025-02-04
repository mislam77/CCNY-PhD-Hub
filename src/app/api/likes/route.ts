import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { getAuth } from '@clerk/nextjs/server';

// Helper to create a PostgreSQL client
const createClient = () => {
  return new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    ssl: { rejectUnauthorized: false },
  });
};

// Handle POST to toggle like
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { postId } = body;
  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
  }

  const client = createClient();
  await client.connect();

  try {
    // Check if the user already liked the post
    const likeCheck = await client.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (likeCheck.rows.length > 0) {
      // User already liked, remove the like
      await client.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
      await client.query('UPDATE posts SET like_count = like_count - 1 WHERE id = $1', [postId]);
      return NextResponse.json({ liked: false });
    } else {
      // Add the like
      await client.query(
        'INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, NOW())',
        [userId, postId]
      );
      await client.query('UPDATE posts SET like_count = like_count + 1 WHERE id = $1', [postId]);
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}