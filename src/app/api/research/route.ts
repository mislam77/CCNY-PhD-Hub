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

// Updated GET request to fetch research groups with admin and member images
export async function GET(req: NextRequest) {
  const client = createClient();
  await client.connect();
  try {
    const result = await client.query(
      `SELECT id, title, description, image_url, admins, members, group_status, created_at, last_active 
       FROM research_groups 
       ORDER BY last_active DESC`
    );

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