const { Client } = require('pg');
require('dotenv').config();

// Anslut till databasen
const client = new Client ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Meddelanden
client.connect((err) => {
    if(err) {
        console.log('Fel vid anslutning:' + err)
    } else {
        console.log('Ansluten till databsen...')
    }
});

// Skapa tabell i databasen
client.query(`
    CREATE TABLE courses(
        id SERIAL PRIMARY KEY,
        coursecode VARCHAR(6) NOT NULL,
        coursename TEXT,
        syllabus TEXT,
        progression VARCHAR(2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
);