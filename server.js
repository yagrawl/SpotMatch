const express = require('express');
const request = require('request');
const path = require('path');
const bodyParser = require('body-parser');

const credentials = require('./config.js');

const app = express();
const PORT = process.env.PORT || 3000;

//app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('check');
});

app.get('/auth', (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize/?' +
                 'client_id=' + credentials.keys.clientid +
                 '&response_type=code' +
                 '&redirect_uri=' + 'http://localhost:3000/callback' +
                 '&scope=user-read-private');
});

app.get('/callback', (req, res) => {
    if(typeof req.query.code !== 'undefined') {
        var options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            form: {'grant_type': 'authorization_code',
                   'code': req.query.code,
                   'redirect_uri': 'http://localhost:3000/callback',
                   'client_id': credentials.keys.clientid,
                   'client_secret': credentials.keys.clientsecret }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(JSON.parse(body));
                res.send('Success');
            }

        });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})
