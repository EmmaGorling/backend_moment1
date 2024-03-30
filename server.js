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
    // Hämta från databas
    client.query('SELECT * FROM courses', (err, result) => {
        if(err) {
            console.log('Fel i DB-fråga.')
        } else {
            res.render('index', {
                courses: result.rows
            });
        }
    });
});
app.get('/add', async (req, res) => {
    res.render('addcourse');
});
app.get('/about', (req, res) => {
    res.render('about');
});

// Lägg till kurs
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
// Radera kurs
app.get('/delete/:id', (req, res) => {
    let id = req.params.id;

    client.query('DELETE FROM courses WHERE id = $1;' , 
    [id]);

    res.redirect('/');
});
// Redigera kurs
app.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const result = await client.query('SELECT * FROM courses WHERE id = $1',
        [id]);

        res.render('edit', {
            courses: result.rows
        });
    } catch (err) {
        console.log('Fel i DB-fråga:' + err);
    }
});
app.post('/edit/:id', async (req, res) => {
    // Hämta data
    let id = req.params.id;
    const courseCode = req.body.code;
    const courseName = req.body.name;
    const courseSyll = req.body.syllabus;
    const courseProg = req.body.progression;

    // SQL
    const result = await client.query('UPDATE courses SET coursecode=$1, coursename=$2, syllabus=$3, progression=$4 WHERE id=$5;', 
    [courseCode, courseName, courseSyll, courseProg, id]);

    // skicka tillbaka till startsidan
    res.redirect('/');
});


// Starta server
app.listen(process.env.DB_PORT, () => {
    console.log('Server har startat på port ' + process.env.DB_PORT);
});