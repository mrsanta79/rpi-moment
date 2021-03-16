const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
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
    const data = {
        WEATHER_API_KEY: process.env.WEATHER_API_KEY,
        LOCATION: {
            CITY: process.env.CITY,
            STATE_CODE: process.env.STATE_CODE,
            COUNTRY_CODE: process.env.COUNTRY_CODE
        }
    };

    res.status(200).render('index', data);
})

app.listen(process.env.APP_PORT || 3000);