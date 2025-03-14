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

// Updated GET request to fetch research groups with admin images
export async function GET(req: NextRequest) {
    const client = createClient();
    await client.connect();
    try {
      const result = await client.query(
        `SELECT id, title, description, image_url, admins, members, group_status, created_at, last_active 
         FROM research_groups 
         ORDER BY last_active DESC`
      );
  
      // Fetch user images for admins
      const groupsWithAdminImages = await Promise.all(
        result.rows.map(async (group) => {
          const adminImages = await Promise.all(
            group.admins.map(async (adminId) => {
              const user = await clerkClient.users.getUser(adminId);
              return user.imageUrl;
            })
          );
  
          return {
            ...group,
            adminImages,
            memberCount: group.members.length, // Calculate the member count
          };
        })
      );
  
      return NextResponse.json(groupsWithAdminImages, { status: 200 });
    } catch (error) {
      console.error("Error fetching research groups:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
      await client.end();
    }
  }  

// Handle POST request to create a new research group
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
  
    const { title, description, image_url, group_status } = body;
  
    if (
      !title ||
      !description ||
      !image_url ||
      !["private", "public"].includes(group_status)
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }
  
    // Automatically set creator as admin and member
    const admins = [userId];
    const members = [userId];
  
    const client = createClient();
    await client.connect();
    try {
      const result = await client.query(
        `INSERT INTO research_groups (title, description, image_url, admins, members, group_status) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [title, description, image_url, admins, members, group_status]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error("Error creating research group:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
      await client.end();
    }
  }