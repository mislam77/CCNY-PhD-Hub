import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { getAuth } from "@clerk/nextjs/server";

const createClient = () => {
  return new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "5432", 10),
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string,  discussionId: string} }
) {
    const client = createClient();
    const group_id = params.id;
    const discussion_id = params.discussionId;
    const { userId } = getAuth(req)

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await client.connect();

        // Get comments for this discussion
        const result = await client.query(
            `SELECT * FROM research_group_discussion_comments
            WHERE research_group_discussion_comments.discussion_id = $1
            ORDER BY created_at ASC`,
            [discussion_id]
        )

        console.log(result)
        return NextResponse.json({ comments: result.rows }, { status: 200 });

    } catch (error) {
        console.error("Error fetching discussion comments:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string, discussionId: string } }
) {
    const client = createClient();
    const group_id = params.id;
    const discussion_id = params.discussionId;
    const { userId } = getAuth(req);

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { content } = await req.json();

        if (!content || content.trim() === '') {
            return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
        }

        await client.connect();

        // Create a new comment
        const result = await client.query(
            `INSERT INTO research_group_discussion_comments 
            (id, discussion_id, user_id, content, created_at)
            VALUES (gen_random_uuid(), $1, $2, $3, NOW())
            RETURNING id, discussion_id, user_id, content, created_at`,
            [discussion_id, userId, content]
        );

        const comment = result.rows[0];

        // Log activity
        await client.query(
            `INSERT INTO research_group_activities 
            (group_id, user_id, activity_type, details) 
            VALUES ($1, $2, $3, $4)`,
            [group_id, userId, 'add_discussion_comment', { commentId: comment.id }]
        )

        return NextResponse.json({ 
            message: "Comment created successfully", 
            comment 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await client.end();
    }
}