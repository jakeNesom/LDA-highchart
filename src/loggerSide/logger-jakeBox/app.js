//Client-Server communication using Websockets and Node.JS[express,socket.io]

//server.js

var express = require('express');
var http = require('http');
var io = require('socket.io')(http);
var cors = require('cors');

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
// Connection URL, use the project name
var url = 'mongodb://localhost:27017/clientserverExpSockIO';

var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3035/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.use(cors());
//app.options('*', cors()); // pre-flight CORS enabled for all routes
app.set('view engine', 'ejs')

app.get('/write/log', function (req, res) {
    res.sendFile(__dirname + '/socket.html');
});


app.get('/', function (req, res) {
    res.send("Welcome to Logger");
});


app.get('/write/logbatch', function (req, res) {
    res.sendFile(__dirname + '/socket_batch.html');
});

app.get('/read/getall/', function (req, res) {
    //res.send("All the logged entries");
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        // Get the documents collection, using the collection json
        var collection = db.collection('json');
        //insert Json object
        //collection.insertOne(data,
        //function (err, result) {
        //   assert.equal(err, null);
        //   console.log("Inserted a document into the collection.");

        // Find some documents
        collection.find({}).toArray(function (err, docs) {
            assert.equal(err, null);
            res.render('index.ejs', { logs: JSON.stringify(docs) })
            // console.log("Found the following records");
            // console.log(docs)

        })
        db.close();
    })

});

// all of the routes will be prefixed with /api
//app.use('/api', router);

//app.use(express.static('./public'));
//Specifying the public folder of the server to make the html accesible using the static middleware

var server = http.createServer(app).listen(3039);
//Server listens on the port 8124
io = io.listen(server);
/*initializing the websockets communication , server instance has to be sent as the argument */

io.sockets.on("connection", function (socket) {
    /*Associating the callback function to be executed when client visits the page and 
      websocket connection is made */

    var message_to_client = {
        data: "Connection with the server established"
    }
    socket.send(JSON.stringify(message_to_client));
    /*sending data to the client , this triggers a message event at the client side */
    console.log('Socket.io Connection with the client established');
    socket.on("message", function (data) {
        /*This event is triggered at the server side when client sends the data using socket.send() method */
        data = JSON.parse(data);

        //connect to mongoDB
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            // Get the documents collection, using the collection json
            var collection = db.collection('json');
            //insert Json object
            collection.insertOne(data,
                function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted a document into the collection.");

                    // Find some documents
                    // collection.find({}).toArray(function (err, docs) {
                    // assert.equal(err, null);
                    // console.log("Found the following records");
                    // console.log(docs)
                    // })
                    db.close();
                })
        })

        console.log(data);
        /*Printing the data */
        var ack_to_client = {
            data: "Server Received the message"
        }
        socket.send(JSON.stringify(ack_to_client));
        /*Sending the Acknowledgement back to the client , this will trigger "message" event on the clients side*/
    });

});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
