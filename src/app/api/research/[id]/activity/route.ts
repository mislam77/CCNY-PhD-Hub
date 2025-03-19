// app/api/research/[id]/activity/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

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
  
  try {
    await client.connect();
    
    // Get activities for this group
    const result = await client.query(
      `SELECT a.id, a.user_id, a.activity_type, a.details, a.created_at
       FROM research_group_activities a
       WHERE a.group_id = $1
       ORDER BY a.created_at DESC
       LIMIT 50`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Get all unique user IDs
    const userIds = [...new Set(result.rows.map(row => row.user_id))];
    
    // Fetch users from your database
    const usersResult = await client.query(
      `SELECT id, first_name, last_name, username 
       FROM users 
       WHERE id = ANY($1)`,
      [userIds]
    );
    
    // Create a lookup map for user data
    const userMap = {};
    usersResult.rows.forEach(user => {
      userMap[user.id] = {
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'User',
        imageUrl: clerkClient.users.getUser(user.id).then(user => user.imageUrl).catch(() => null),
      };
    });

    // Enhance activities with user data
    const enhancedActivities = result.rows.map(row => ({
      id: row.id,
      activityType: row.activity_type,
      details: row.details,
      createdAt: row.created_at,
      user: userMap[row.user_id] || { name: "Unknown User", imageUrl: clerkClient.users.getUser(row.user_id).then(user => user.imageUrl).catch(() => null) },
    }));

    return NextResponse.json(enhancedActivities, { status: 200 });
  } catch (error) {
    console.error("Error fetching group activities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}