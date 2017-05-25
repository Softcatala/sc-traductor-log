var express = require("express");
var bodyParser = require('body-parser');
var fs = require('fs');

var cors = require('cors')

var app = express();
app.use(cors())
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(err, req, res, next) {
    res.status(500).send("No s'ha pogut fer parsing dels request!");
});

var streams = { };

var getStream = function($lang) {

    if ( ! ($lang in streams) ) {
        streams[$lang] = fs.createWriteStream('data/' + $lang +'.txt', {flags:'a'})
            .on('finish', function() {
                console.log("Write Finish.");
            })
            .on('error', function(err){
                console.log(err.stack);
            });;
    }

    return streams[$lang];
}

var defLog = {
    'source_txt': '',
    'source_lang': '',
    'target_txt' : '',
    'target_lang' : '',
};

app.get('/format/', function (req, res) {
    res.json(defLog);
});

app.post("/log/", function (req, res) {

    var $log = Object.assign(defLog, req.body);

    if (!$log || $log.source_lang.length == 0 || $log.source_txt.length == 0) {
        res.json({"code": 200, 'status': 'Not yet ready'});
    } else {
        var $lang = $log.source_lang;

        $stream = getStream($log.source_lang);

        if ($stream != null) {
            $stream.write($log.source_txt + "\n-------------------------------------------------\n\n");
        }

        res.json({"code": 200, 'status': 'Thanks!'});
    }
});

app.listen(3000);
