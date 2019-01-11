import { db, pgp, upsertDoUpdate } from './db'


const cs = new pgp.helpers.ColumnSet(
  ['id', 'email', 'display_name', 'token:json'], { table: 'users' }
)

export async function upsertUser(user) {
  await db.none(upsertDoUpdate(user, cs))
}

export async function all() {
  return db.manyOrNone('SELECT * FROM users;')
}
