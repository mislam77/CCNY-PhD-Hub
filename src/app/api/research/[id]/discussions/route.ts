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
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = createClient();
  const { userId } = getAuth(req)

  if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await client.connect();
    
    // Get discussions for this group
    const result = await client.query(
      `SELECT * FROM research_group_discussions
      WHERE research_group_discussions.group_id = $1
      ORDER BY created_at DESC`,
      [id]
    );
    
    console.log(result)
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { title, content } = await req.json();
    const client = createClient();
    const id = params.id;
    const { userId } = getAuth(req)

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        await client.connect();

        // Insert the new discussion into the database
        const result = await client.query(
            `INSERT INTO research_group_discussions (id, group_id, user_id, title, content)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING *`,
            [id, userId, title, content]
        );

        const newDiscussion = result.rows[0];
        return NextResponse.json(newDiscussion, { status: 201 });

    } catch (error) {
        console.error("Error creating discussion:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.end();
    }
}