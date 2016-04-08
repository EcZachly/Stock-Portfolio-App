var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.json({
    limit: '50mb'
}));


app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/api', require('./routes'));

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});