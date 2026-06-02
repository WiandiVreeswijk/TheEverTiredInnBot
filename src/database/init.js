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

        await pool.query(`
            CREATE TABLE IF NOT EXISTS retro_games (
                                                       id TEXT PRIMARY KEY,
                                                       title TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS retro_votes (
                                                       game_id TEXT REFERENCES retro_games(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL,
                PRIMARY KEY (game_id, user_id)
                );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS fireside_gatherings (
                                                               id SERIAL PRIMARY KEY,
                                                               message_id TEXT NOT NULL,
                                                               channel_id TEXT NOT NULL,
                                                               started_by TEXT NOT NULL,
                                                               status TEXT NOT NULL DEFAULT 'active',
                                                               ends_at TIMESTAMP NOT NULL,
                                                               created_at TIMESTAMP DEFAULT NOW()
                );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS fireside_participants (
                                                                 id SERIAL PRIMARY KEY,
                                                                 gathering_id INTEGER REFERENCES fireside_gatherings(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL,
                joined_at TIMESTAMP DEFAULT NOW(),
                UNIQUE (gathering_id, user_id)
                );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS fireside_sessions (
                                                             id SERIAL PRIMARY KEY,
                                                             channel_id TEXT NOT NULL,
                                                             user_a TEXT NOT NULL,
                                                             user_b TEXT NOT NULL,
                                                             last_message_at TIMESTAMP DEFAULT NOW(),
                status TEXT NOT NULL DEFAULT 'active',
                created_at TIMESTAMP DEFAULT NOW()
                );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS fireside_cooldowns (
                                                              user_id TEXT PRIMARY KEY,
                                                              cooldown_until TIMESTAMP NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS predictions (
                                                       id TEXT PRIMARY KEY,
                                                       message_id TEXT,
                                                       match_date DATE NOT NULL,
                                                       team1 TEXT NOT NULL,
                                                       team2 TEXT NOT NULL,
                                                       created_by TEXT NOT NULL,
                                                       status TEXT NOT NULL DEFAULT 'open',
                                                       result TEXT,
                                                       created_at TIMESTAMP DEFAULT NOW()
                );
        `);

        await pool.query(`
            ALTER TABLE predictions
                ADD COLUMN IF NOT EXISTS message_id TEXT;
        `);

        await pool.query(`
            ALTER TABLE predictions
                ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open';
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS prediction_votes (
                                                            prediction_id TEXT REFERENCES predictions(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL,
                prediction TEXT NOT NULL CHECK (
                                                   prediction IN ('team1', 'draw', 'team2')
                ),
                PRIMARY KEY (prediction_id, user_id)
                );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_prediction_votes_prediction_id
            ON prediction_votes(prediction_id);
        `);

        console.log('✅ Tables created successfully.');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

init();