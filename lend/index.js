// Import the Fake DB functions and the express Framework
const db = require('./fakeData');
const express = require('express');
// Create the Server Instance
const app = express();
const PORT = process.env.PORT || 3002;

// Tell express to use its JSON middleware.
// If the server recevies JSON in a request's body it will automatically convert the JSON to a JavaScript object.
app.use(express.json());

/*
 Configure the REST paths for the server.
 Express provides functions to add paths. app.get() will listen for GET requests, app.post() for POST requests.
 These functions require the url part to listen to and a callback function to execute when something arrives at this url.
 The callback function to execute receives the request (req) and a JavaScript Object containing multiple reply functions (res) from express.
 At the end of our callback we use the reply functions to fulfill a request.
*/

app.get('/', (req, res) => {
    res.send('Ready to lend books.');
});

app.post('/add', (req, res) => {
    res.json(db.addLend(req.body));
});

app.post('/update', (req, res) => {
    res.json(db.updateLend(req.body));
});

app.post('/delete', (req, res) => {
    res.json(db.removeLend(req.body.id));
});

app.post('/return', (req, res) => {
    res.json(db.returnBook(req.body.lendId, req.body.bookId));
})

app.post('/getAll', (req, res) => {
    res.json(db.getAllLends());
});

app.post('/getId', (req, res) => {
    res.json(db.getLendById(req.body.id));
})

app.post('/getByBook', (req, res) => {
    res.json(db.getLendByBook(req.body.bookId));
})

app.post('/getByCustomer', (req, res) => {
    res.json(db.getLendByCustomer(req.body.customerId));
})

// Tell express to listen to communication on the specified port after the configuration is done.
const port = process.env.PORT
app.listen(port, () => console.log(`Lend Service listening on ${port}`));