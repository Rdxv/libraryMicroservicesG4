// Import and config dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import express
import express from 'express';

// Import logger
import { logger, loggingMiddleware } from './logger/logger.js';

// Import database connection
// TODO in the next row, change the import file with SQL
//import * as db from './database/db.js';


// Parse ENV
const PORT = process.env.PORT ?? 3002;

// Create wrapper function to catch exceptions in async routes and pass them to Express
// error handling chain (Express by default doesn't catch errors in asyncs)
const asyncRouteWrapper = function (callback) {
    return function (req, res, next) {
        callback(req, res, next).catch(next);
    }
}


// Create the server instance
const app = express();


// Add logging middleware
app.use(loggingMiddleware);


// Parses JSON in request body and handles parsing errors
app.use(
    express.json(),
    function (err, request, response, next) {
        if (err instanceof SyntaxError && err.status === 400) {
            response.status(400).json({
                success: false,
                msg: 'Bad JSON'
            });
        }
    },
);


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

/*app.get('/api/lends/:customerId', (request, response) => {
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
})*/

/*app.get('/api/lends/:bookId', (request, response) => {
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
})*/

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