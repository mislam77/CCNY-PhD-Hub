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

// GET request to fetch research groups with admin and member images, plus keyword filtering
export async function GET(req: NextRequest) {
  const client = createClient();
  await client.connect();
  
  // Get the keyword from query parameters
  const url = new URL(req.url);
  const keyword = url.searchParams.get('keyword');
  
  try {
    let queryText = `
      SELECT id, title, description, image_url, admins, members, group_status, created_at, last_active 
      FROM research_groups
    `;
    
    const queryParams: any[] = [];
    
    // Add title filter if keyword is provided
    if (keyword && keyword.trim() !== '') {
      queryText += ` WHERE title ILIKE $1`;
      queryParams.push(`%${keyword}%`); // Use ILIKE for case-insensitive search with wildcard
    }
    
    // Add ordering
    queryText += ` ORDER BY last_active DESC`;
    
    const result = await client.query(queryText, queryParams);

    // Fetch user images for all members (both admins and regular members)
    const enhancedGroups = await Promise.all(
      result.rows.map(async (group) => {
        // Fetch admin images
        const adminImages = await Promise.all(
          group.admins.map(async (adminId) => {
            try {
              const user = await clerkClient.users.getUser(adminId);
              return {
                id: adminId,
                imageUrl: user.imageUrl,
                isAdmin: true
              };
            } catch (error) {
              console.error(`Error fetching admin ${adminId}:`, error);
              return {
                id: adminId,
                imageUrl: null, 
                isAdmin: true
              };
            }
          })
        );
        
        // Get regular members (who are not admins)
        const regularMemberIds = group.members.filter(id => !group.admins.includes(id));
        
        // Fetch member images for non-admin members
        const memberImages = await Promise.all(
          regularMemberIds.map(async (memberId) => {
            try {
              const user = await clerkClient.users.getUser(memberId);
              return {
                id: memberId,
                imageUrl: user.imageUrl,
                isAdmin: false
              };
            } catch (error) {
              console.error(`Error fetching member ${memberId}:`, error);
              return {
                id: memberId,
                imageUrl: null,
                isAdmin: false
              };
            }
          })
        );
        
        // Combine admin and member images, but limit to 5 total to avoid overcrowding
        const allMemberImages = [...adminImages, ...memberImages].slice(0, 5);
        
        return {
          ...group,
          adminImages: adminImages.map(admin => admin.imageUrl), // For backward compatibility
          allMemberImages, // New field with combined data
          memberCount: group.members.length,
        };
      })
    );

    return NextResponse.json(enhancedGroups, { status: 200 });
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