const { Pool } = require('pg');
const { parse } = require('pg-connection-string');

let pool;

if (process.env.DATABASE_URL) {
  const config = parse(process.env.DATABASE_URL);
  pool = new Pool({
    ...config,
    ssl: { rejectUnauthorized: false },
    family: 4, // force IPv4
    host: config.host // 👈 ensures IPv4 resolution
  });
} else {
  pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    family: 4
  });
}

module.exports = pool;
