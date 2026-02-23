require('dotenv').config();
const pool = require('./db');

async function init() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS movies (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS votes (
                movie_id TEXT REFERENCES movies(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL,
                PRIMARY KEY (movie_id, user_id)
            );
        `);

        console.log("✅ Tables created successfully.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();