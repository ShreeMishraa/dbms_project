import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Create the pool
const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promisified query method (used by init.js and controllers)
// export const sqlQuery = (sql, params) => {
//   return new Promise((resolve, reject) => {
//     pool.query(sql, params, (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// };

// Export the pool directly (used for connection checks in index.js)
export default pool;