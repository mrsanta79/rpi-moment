const express = require('express');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();

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
    res.status(200).render('index');
});

app.use((req, res) => {
    res.status(404).send('Route not found!');
});

// Start server
app.listen(process.env.APP_PORT || 3000);