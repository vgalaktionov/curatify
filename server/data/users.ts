import * as db from "./db";
import sql from "pg-template-tag";

export interface User {
  id: string;
  email: string;
  display_name: string;
  token: Token;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function upsertUser({
  id,
  email,
  display_name: displayName,
  token
}: User) {
  await db.query(sql`
    INSERT INTO users (id, email, display_name, token)
    VALUES (${id}, ${email}, ${displayName}, ${token}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      token = EXCLUDED.token;
  `);
}

export async function allUsers(): Promise<User[]> {
  const res = await db.query(sql`SELECT * FROM users;`);
  return res.rows;
}
