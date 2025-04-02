import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
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


// GET handler to fetch resources for a research group
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    const client = createClient();

    // Get the research group ID from route params
    const { id } = params;

  try {
    await client.connect();
    
    // Fetch resources for the group
    const resources = await client.query(
      `SELECT * FROM research_group_resources 
       WHERE group_id = $1 
       ORDER BY created_at DESC`,
      [id]
    );
    
    // Transform snake_case keys to camelCase
    const transformedResources = resources.rows.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      fileKey: resource.file_key,
      fileName: resource.file_name,
      fileType: resource.file_type,
      fileSize: resource.file_size,
      groupId: resource.group_id,
      user_id: resource.user_id,
      created_at: resource.created_at
    }));
    
    return NextResponse.json({ resources: transformedResources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST handler to create a new resource
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
  
) {
    const client = createClient();

    // Get the research group ID from route params
    const { id } = params;

    // Verify user authentication
    
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  try {
    await client.connect();
    
    // Parse the request body
    const body = await request.json();
    const { title, description, fileKey, fileName, fileType, fileSize } = body;
    
    if (!title || !fileKey || !fileName) {
      return NextResponse.json(
        { error: 'Title, file key, and file name are required' },
        { status: 400 }
      );
    }
    
    // Insert the new resource into the database
    const result = await client.query(
      `INSERT INTO research_group_resources  
       (id, title, description, file_key, file_name, file_type, file_size, group_id, user_id, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [title, description, fileKey, fileName, fileType, fileSize, id, userId]
    );
    
    const newResource = result.rows[0];

    // Log activity
    await client.query(
      `INSERT INTO research_group_activities
       (group_id, user_id, activity_type, details)
       VALUES ($1, $2, $3, $4)`,
      [id, userId, 'create_resource', { resource_id: newResource.id }]
    )
    
    return NextResponse.json(newResource);

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
