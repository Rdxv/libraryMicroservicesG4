// Import and config dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import the Fake DB functions and the express Framework
import * as db from './database/fake-db.js';
import express from 'express';

// Create the Server Instance
const app = express();
const PORT = process.env.PORT ?? 3002;

// Tell express to use its JSON middleware.
// If the server receives JSON in a request's body it will automatically convert the JSON to a JavaScript object.
app.use(express.json());


app.get('/', (request, response) => {
    response.send('Libreria Alfonso, servizio prestiti');
});

app.get('/api/lends/:lendId', (request, response) => {
    try {
        const lend = db.getLendById(request.params.id);
        if (lend) {
            return response.status(200).json({
                status: 'success',
                data: lend,
            });
        } else {
            return response.status(404).json({
                status: 'fail',
                error: 'Not found',
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
})

app.get('/api/lends/:customerId', (request, response) => {
    try {
        const lend = db.getLendByCustomer(request.params.id);
        if (lend) {
            return response.status(200).json({
                status: 'success',
                data: lend,
            });
        } else {
            return response.status(404).json({
                status: 'fail',
                error: 'Not found',
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
})

app.get('/api/lends/:bookId', (request, response) => {
    try {
        const lend = db.getLendByBook(request.params.id);
        if (lend) {
            return response.status(200).json({
                status: 'success',
                data: lend,
            });
        } else {
            return response.status(404).json({
                status: 'fail',
                error: 'Not found',
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
})

app.get('/api/lends', (request, response) => {
    const pageNumber = request.query.page ?? 0;
    //const pageSize = request.query.pageSize;
    const pageSize = 10;

    try {
        const lends = db.getAllLends(pageNumber, pageSize);
        return response.status(200).json({
            status: 'success',
            page: pageNumber,
            data: lends
        });
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
});

app.delete('/api/lends/:lendId', (request, response) => {
    try {
        const result = db.removeLend(request.params.id);
        if (result) {
            return response.status(200).json({
                status: 'success',
                msg: 'Deleted'
            });
        } else {
            return response.status(404).json({
                status: 'fail',
                error: 'Not found',
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
});

app.put('/api/lends/:lendId', (request, response) => {
    const lendData = request.body;
    const lendId = request.params.id;

    try {
        const updatedLend = db.updateLend(lendData, lendId);
        if (updatedLend) {
            return response.status(200).json({
                status: 'success',
                data: updatedLend,
            });
        } else {
            return response.status(404).json({
                status: 'fail',
                error: 'Not found',
            });
        }
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
});

app.post('/api/lends', (request, response) => {
    const lendData = request.body;

    try {
        const newLend = db.addLend(lendData);
        return response.status(201).json({
            status: 'success',
            data: newLend,
        });
    } catch (err) {
        return response.status(500).json({
            status: 'fail',
            error: err.toString(),
        });
    }
});


/* TODO: change this method

app.post('/api/lends/return', (req, res) => {
    res.json(db.returnLend(req.body.lendId, req.body.bookId));
})
*/

// Tell express to listen to communication on the specified port after the configuration is done.
app.listen(PORT, () => console.log(`Lend Service listening on ${PORT}`));