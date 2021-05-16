const express = require('express');
const path = require('path');
const ejs = require('ejs');
const exec = require('child_process').exec;
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

app.get('/poweroff/:type', (req, res) => {
    const type = req.params.type;

    if (type === '' || typeof type === 'undefined') {
        return;
    }

    let command = '';
    if (type === 'poweroff') {
        command = '--poweroff';
    } else if (type === 'reboot') {
        command = '--reboot';
    }

    exec(`poweroff ${command}`, (err, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    })
});

app.use((req, res) => {
    res.status(404).send('Route not found!');
});

// Start server
app.listen(process.env.APP_PORT || 3000);