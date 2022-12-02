// Import the Fake DB functions and the express Framework
const db = require('./fake-db');
const express = require('express');
// Create the Server Instance
const app = express();
const PORT = process.env.PORT || 3001;

// Tell express to use its JSON middleware.
// If the server recevies JSON in a request's body it will automatically convert the JSON to a JavaScript object.
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Libreria Alfonso aperta');
});

app.post('/add', (req, res) => {
    res.json(db.addBook(req.body));
});

app.post('/update', (req, res) => {
    res.json(db.updateBook(req.body));
});

app.post('/delete', (req, res) => {
    res.json(db.removeBook(req.body.id));
});

app.post('/getAll', (req, res) => {
    res.json(db.getAllBooks());
});

app.post('/getId', (req, res) => {
    res.json(db.getBookById(req.body.id));
})

app.post('/setAvailable', (req, res) => {
    res.json(db.setAvailable(req.body.id));
})

// Tell express to listen to communication on the specified port after the configuration is done.
app.listen(PORT, () => console.log(`Libreria Alfonso sulla porta ${PORT}`));