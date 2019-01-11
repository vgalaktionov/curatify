const path = require('path')

require('sql-migrations').run({
    migrationsDir: path.resolve(__dirname, 'migrations'),
    host: 'localhost',
    port: 5432,
    db: 'curatify',
    user: 'postgres',
    password: '',
    adapter: 'pg'
})
