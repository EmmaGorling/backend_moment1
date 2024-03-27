const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded( {extended: true} ));
const port = /*process.env.DB_PORT |*/ 3000;

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

// Route
app.get('/', async (req, res) => {
    res.render('index');
});
app.get('/add', async (req, res) => {
    res.render('addcourse');
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/', async (req, res) => {
    // Hämta data från formulär
    const courseCode = req.body.code;
    const courseName = req.body.name;
    const courseSyll = req.body.syllabus;
    const courseProg = req.body.progression;
});

// Starta server
app.listen(port, () => {
    console.log('Server har startat på port ' + port);
});