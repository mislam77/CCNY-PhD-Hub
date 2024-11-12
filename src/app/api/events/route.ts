import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { getAuth } from '@clerk/nextjs/server';

// Initialize PostgreSQL client
const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect().catch((err) => console.error('Error connecting to the database:', err));

// POST route: Create a new event
export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, start_time, end_time, description, link } = await req.json();

    if (!title || !start_time || !end_time || !link) {
        return NextResponse.json({ error: 'Title, start, end, and link are required' }, { status: 400 });
    }

    const query = `
        INSERT INTO events (title, start_time, end_time, description, link, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [title, new Date(start_time), new Date(end_time), description, link, userId];

    try {
        const result = await client.query(query, values);
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (dbError) {
        console.error('Error creating event:', dbError);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET route: Fetch all events
export async function GET() {
    const query = `
        SELECT * FROM events
        ORDER BY start_time ASC;
    `;
    try {
        const result = await client.query(query);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (dbError) {
        console.error('Error fetching events:', dbError);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}