import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

const createClient = () => {
  return new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "5432", 10),
    ssl: { rejectUnauthorized: false },
  });
};

// Handle GET requests to fetch comments for a post
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  const client = createClient();
  await client.connect();

  try {
    const result = await client.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC",
      [postId]
    );

    const comments = await Promise.all(
      result.rows.map(async (comment) => {
        const user = await clerkClient.users.getUser(comment.author_id);
        return {
          ...comment,
          author_username: user.username,
          author_profile_image_url: user.imageUrl,
        };
      })
    );

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}

// Handle POST requests to create a new comment
export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { postId, content, communityId } = body;

  if (!postId || !content || !communityId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const client = createClient();
  await client.connect();

  try {
    const result = await client.query(
      `INSERT INTO comments (id, author_id, post_id, community_id, content, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userId, postId, communityId, content]
    );

    const newComment = result.rows[0];
    const user = await clerkClient.users.getUser(userId);

    return NextResponse.json(
      {
        ...newComment,
        author_username: user.username,
        author_profile_image_url: user.imageUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}
