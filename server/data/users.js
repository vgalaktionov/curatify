import * as db from './db'
import sql from 'pg-template-tag'


export async function upsertUser({ id, email, display_name, token }) {
  await db.query(sql `
    INSERT INTO users (id, email, display_name, token)
    VALUES (${id}, ${email}, ${display_name}, ${token}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      token = EXCLUDED.token;
  `)
}

export async function allUsers() {
  const res = await db.query(sql `SELECT * FROM users;`)
  return res.rows
}
