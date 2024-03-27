const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded( {extended: true} ));

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
    
    // SQL
    const result = await client.query("INSERT INTO courses(coursecode, coursename, syllabus, progression)VALUES($1, $2, $3, $4)", 
    [courseCode, courseName, courseSyll, courseProg]);

    res.redirect('/');
});

// Starta server
app.listen(process.env.DB_PORT, () => {
    console.log('Server har startat på port ' + process.env.DB_PORT);
});