import { Pool } from 'pg'
import sql, { join } from 'pg-template-tag'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export function query (text, params) {
  return pool.query(text, params)
}

export function values (objects, ...vals) {
  return join(objects.map(obj => {
    const valueSet = join(vals.map(val => {
      switch (typeof val) {
        case 'object':
          const { key, def = null, json = false } = val
          let data = obj[key] || def
          if (json) {
            data = JSON.stringify(data)
          }
          return sql `${data}`
        case 'string':
          return sql `${obj[val]}`
        default:
          throw new Error('Vals should be either strings describing an object path, or objects.')
      }
    }))
    return sql `(${valueSet})`
  }), ', ')
}
