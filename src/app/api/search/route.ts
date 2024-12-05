import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { clerkClient } from '@clerk/nextjs/server';

const createClient = () => {
    return new Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: parseInt(process.env.PG_PORT || '5432', 10),
        ssl: {
            rejectUnauthorized: false,
        },
    });
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords');

    if (!keywords) {
        return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    const client = createClient();
    const clerk = await clerkClient()
    await client.connect();

    try {
        const usersQuery = 'SELECT * FROM users WHERE username ILIKE $1';
        const communitiesQuery = 'SELECT * FROM communities WHERE name ILIKE $1';
        const postsQuery = 'SELECT * FROM posts WHERE title ILIKE $1 OR content ILIKE $1';

        const values = [`%${keywords}%`];

        const [usersResult, communitiesResult, postsResult] = await Promise.all([
            client.query(usersQuery, values),
            client.query(communitiesQuery, values),
            client.query(postsQuery, values),
        ]);

        const users = await Promise.all(
            usersResult.rows.map(async (user) => {
                const clerkUser = await clerk.users.getUser(user.id);
                return {
                    ...user,
                    profile_image_url: clerkUser.imageUrl,
                };
            })
        );

        const posts = await Promise.all(
            postsResult.rows.map(async (post) => {
                const user = await clerk.users.getUser(post.author_id);
                return {
                    ...post,
                    author_username: user.username,
                    author_profile_image_url: user.imageUrl,
                };
            })
        );

        return NextResponse.json({
            users,
            communities: communitiesResult.rows,
            posts,
        });
    } catch (error) {
        console.error('Error fetching search results:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await client.end();
    }
}