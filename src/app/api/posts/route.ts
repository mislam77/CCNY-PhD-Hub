import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

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

// Handle GET requests to fetch posts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const communityId = searchParams.get('communityId');

  if (!communityId) {
    return NextResponse.json(
      { error: 'Community ID is required' },
      { status: 400 }
    );
  }

  const client = createClient();
  const clerk = await clerkClient()
  await client.connect();
  try {
    const result = await client.query(
      'SELECT * FROM posts WHERE community_id = $1 ORDER BY created_at DESC',
      [communityId]
    );

    const posts = await Promise.all(
      result.rows.map(async (post) => {
        const user = await clerk.users.getUser(post.author_id);
        return {
          ...post,
          author_username: user.username,
          author_profile_image_url: user.imageUrl,
        };
      })
    );

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}

// Handle POST requests to create a new post
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json(); // Parse JSON body safely
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { communityId, title, content, mediaUrl } = body;

  if (!communityId || !title || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const client = createClient();
  await client.connect();
  try {
    const result = await client.query(
      `INSERT INTO posts (author_id, community_id, title, content, media_url, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [userId, communityId, title, content, mediaUrl]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}

// Handle PUT requests to update a post
export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json(); // Parse JSON body safely
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { postId, title, content, mediaUrl } = body;

  if (!postId || !title || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const client = createClient();
  await client.connect();
  try {
    const result = await client.query(
      `UPDATE posts
       SET title = $1, content = $2, media_url = $3, updated_at = NOW()
       WHERE id = $4 AND author_id = $5
       RETURNING *`,
      [title, content, mediaUrl, postId, userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await client.end();
  }
}