const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
const port = process.env.port | 3000;

// Route
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/add', (req, res) => {
    res.render('addcourse');
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log('Server har startat på port ' + port);
});