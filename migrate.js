require('dotenv').config()
const Postgrator = require('postgrator')
const fs = require('fs')

const postgrator = new Postgrator({
  driver: 'pg',
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  migrationDirectory: __dirname + '/migrations'
})

const action = process.argv[2]
const arg = process.argv[3]

let version = 0
try {
  version = parseInt(
    fs.readdirSync('migrations')
      .filter(f => f.endsWith('sql'))
      .sort()
      .reverse()[0]
      .slice(0, 3)
  )
} catch (e) {}


if (action == 'migrate') {
  const to = (arg || version.toString()).padStart(3, '0')
  console.info(`migrating to ${to}`)

  postgrator.migrate(to).then(console.info).catch(console.error)
} else if (action == 'create') {
  console.info('creating migration')

  const newVersion = (version + 1).toString().padStart(3, '0')
  if (!arg) {
    throw new Error('no name provided')
  }
  fs.writeFileSync(`./migrations/${newVersion}.do.${arg}.sql`, '')
  fs.writeFileSync(`./migrations/${newVersion}.undo.${arg}.sql`, '')
} else if (action == 'drop') {
  postgrator.runQuery(`
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
  `).then(console.info).catch(console.error)
} else {
  console.error('no argument supplied')
}
