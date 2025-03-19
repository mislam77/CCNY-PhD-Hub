// app/api/research/[id]/membership/route.ts
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

// Join group
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groupId = params.id;
  const client = createClient();
  
  try {
    await client.connect();
    
    // Get current group data
    const groupResult = await client.query(
      `SELECT members, group_status FROM research_groups WHERE id = $1`,
      [groupId]
    );
    
    if (groupResult.rows.length === 0) {
      return NextResponse.json({ error: "Research group not found" }, { status: 404 });
    }
    
    const group = groupResult.rows[0];
    const members = group.members || [];
    
    // Check if user is already a member
    if (members.includes(userId)) {
      return NextResponse.json(
        { error: "You're already a member of this group" },
        { status: 400 }
      );
    }
    
    // Add user to members and update last_active
    const updatedMembers = [...members, userId];
    await client.query(
      `UPDATE research_groups 
       SET members = $1, last_active = NOW() 
       WHERE id = $2`,
      [updatedMembers, groupId]
    );
    
    // Log activity
    await client.query(
      `INSERT INTO research_group_activities 
        (group_id, user_id, activity_type, details) 
       VALUES ($1, $2, $3, $4)`,
      [groupId, userId, 'join_group', {}]
    );
    
    return NextResponse.json(
      { success: true, message: "Successfully joined the group" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}

// Leave group
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groupId = params.id;
  const client = createClient();
  
  try {
    await client.connect();
    
    // Get current group data
    const groupResult = await client.query(
      `SELECT members, admins FROM research_groups WHERE id = $1`,
      [groupId]
    );
    
    if (groupResult.rows.length === 0) {
      return NextResponse.json({ error: "Research group not found" }, { status: 404 });
    }
    
    const group = groupResult.rows[0];
    const members = group.members || [];
    const admins = group.admins || [];
    
    // Check if user is a member
    if (!members.includes(userId)) {
      return NextResponse.json(
        { error: "You're not a member of this group" },
        { status: 400 }
      );
    }
    
    // Don't allow the last admin to leave
    if (admins.includes(userId) && admins.length === 1) {
      return NextResponse.json(
        { error: "You are the last admin. Please assign another admin before leaving." },
        { status: 400 }
      );
    }
    
    // Remove user from members and admins
    const updatedMembers = members.filter(id => id !== userId);
    const updatedAdmins = admins.filter(id => id !== userId);
    
    await client.query(
      `UPDATE research_groups 
       SET members = $1, admins = $2, last_active = NOW() 
       WHERE id = $3`,
      [updatedMembers, updatedAdmins, groupId]
    );
    
    // Log activity
    await client.query(
      `INSERT INTO research_group_activities 
        (group_id, user_id, activity_type, details) 
       VALUES ($1, $2, $3, $4)`,
      [groupId, userId, 'leave_group', {}]
    );
    
    return NextResponse.json(
      { success: true, message: "Successfully left the group" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await client.end();
  }
}