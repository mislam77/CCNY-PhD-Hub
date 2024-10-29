import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Client } from 'pg';

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

client.connect().catch(err => console.error('Error connecting to the database:', err));

// Define a type for external accounts
type ExternalAccount = {
  provider?: string;
  accountId?: string;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const eventType = evt.type;

  console.log(`Webhook with an ID of ${evt.data.id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle only specific event types
  if (eventType === 'user.updated' || eventType === 'user.created') {
    // Narrow the type of evt.data to access user fields safely
    const userData = evt.data as {
      id: string;
      email_addresses: { email_address: string }[];
      first_name?: string;
      last_name?: string;
      username?: string;
      external_accounts?: ExternalAccount[] | null;
    };

    const { id, email_addresses, first_name, last_name, username, external_accounts } = userData;

    const query = `
      INSERT INTO users (id, email, first_name, last_name, username, external_accounts)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          username = EXCLUDED.username,
          external_accounts = EXCLUDED.external_accounts;
    `;

    const values = [
      id,
      email_addresses[0].email_address,
      first_name,
      last_name,
      username,
      external_accounts ? JSON.stringify(external_accounts) : null,
    ];

    try {
      await client.query(query, values);
      console.log('User information saved');
    } catch (error) {
      console.error('Error saving user information:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  } else if (eventType === 'user.deleted') {
    const query = 'DELETE FROM users WHERE id = $1';
    const values = [evt.data.id];

    try {
      await client.query(query, values);
      console.log('User information deleted');
    } catch (error) {
      console.error('Error deleting user information:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}