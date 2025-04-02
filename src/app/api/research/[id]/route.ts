// app/api/research/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

// Helper function to create a new database client instance
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
  await client.connect();
  
  try {
    const result = await client.query(
      `SELECT id, title, description, image_url, admins, members, group_status, created_at, last_active 
       FROM research_groups 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Research group not found" }, { status: 404 });
    }

    const group = result.rows[0];
    
    // Fetch admin user details
    const adminInfoPromises = group.admins.map(async (adminId) => {
      try {
        const user = await clerkClient.users.getUser(adminId);
        return {
          id: adminId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin',
          imageUrl: user.imageUrl
        };
      } catch (error) {
        console.error(`Error fetching admin ${adminId}:`, error);
        return {
          id: adminId,
          name: 'Admin',
          imageUrl: null
        };
      }
    });
    
    // Get regular members (who are not admins)
    const regularMemberIds = group.members.filter(memberId => !group.admins.includes(memberId));
    
    // Fetch regular member user details
    const memberInfoPromises = regularMemberIds.map(async (memberId) => {
      try {
        const user = await clerkClient.users.getUser(memberId);
        return {
          id: memberId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
          imageUrl: user.imageUrl
        };
      } catch (error) {
        console.error(`Error fetching member ${memberId}:`, error);
        return {
          id: memberId,
          name: 'Member',
          imageUrl: null
        };
      }
    });
    
    // Wait for all promises to resolve
    const [adminInfo, memberInfo] = await Promise.all([
      Promise.all(adminInfoPromises),
      Promise.all(memberInfoPromises)
    ]);

    return NextResponse.json({
      ...group,
      adminInfo,
      memberInfo,
      memberCount: group.members.length,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching research group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}