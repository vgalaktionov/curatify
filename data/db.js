import pgPromise from 'pg-promise'

export const pgp = pgPromise()
export const db = pgp(process.env.DATABASE_URL)

export function upsertDoNothing(payload, cs, target = ['id']) {
  const insert = pgp.helpers.insert(payload, cs)
  return `${insert} ON CONFLICT (${target.join(',')}) DO NOTHING;`
}

export function upsertDoUpdate(payload, cs, target = ['id']) {
  const insert = pgp.helpers.insert(payload, cs)
  const columns = cs.assignColumns({ from: 'EXCLUDED' })
  return `${insert} ON CONFLICT (${target.join(',')}) DO UPDATE SET ${columns};`
}
