const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

// Environment Variables
const APP_PORT = 3000

// Initialize app
const app = express();

// View engine setup
app.engine('ejs', ejs.renderFile);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Serve static CSS JS files for views
app.use('/assets', express.static(path.join(__dirname, '/assets')));

// Routes
app.get('/', (req, res) => {
    const data = {
        test: 'Hello'
    };

    res.status(200).render('index', data);
})

app.listen(APP_PORT);