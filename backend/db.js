const { Pool } = require('pg');
require('dotenv').config();
const { URL } = require('url');

let pool;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);

  pool = new Pool({
    user: dbUrl.username,
    password: dbUrl.password,
    host: dbUrl.hostname,
    port: dbUrl.port,
    database: dbUrl.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
    family: 4, // 👈 force IPv4
  });
} else {
  pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: { rejectUnauthorized: false },
    family: 4,
  });
}

module.exports = pool;
