let useSSL = true;

const axios = require('axios');
const express = require('express');
const https = require('https');
const app = express();
const cors = require('cors');
const fs = require('fs');
let port = 8443;
if (!useSSL) {
  port = 3000;
}

app.use(cors());
let sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/shutdown.gallery/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/shutdown.gallery/cert.pem')
};

app.get('/', function (req, res) {
  axios
    .get(req.query.site)
    .then((response) => {
      res.setHeader('Content-Type', 'text/plain');
      res.send(response.data);
    })
    .catch((error) => {
      res.setHeader('Content-Type', 'text/plain');
      res.send(error);
    });
});

// app.listen(3000);

if (useSSL) {
  https.createServer(sslOptions, app).listen(port, function () {
    return console.log("SSL connection: Listening on port ".concat(port, "!"));
  });
} else {
  app.listen(port, function () {
    return console.log("Non-SSL connection: Listening on port ".concat(port, "!"));
  });
}