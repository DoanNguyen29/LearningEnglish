const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  database: process.env.DB_NAME     || 'FlashLearn',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  port:     parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt:              process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

const getPool = async () => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};

module.exports = { getPool, sql };
