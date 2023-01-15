// Import and config dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import express
import express from 'express';

// Import logger
import { logger, loggingMiddleware } from './logger/logger.js';

// Import database connection
import * as db from './database/db.js';


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


/* app.get('/', (request, response) => {
    response.send('Libreria Alfonso, servizio prestiti');
}); */


app.get('/api/lends', asyncRouteWrapper( async (request, response) => {
	const pageNumber = request.query.pageNumber ?? 1;
	const pageSize = request.query.pageSize ?? 10;
	
	const filter = {};
	
	// TODO add filters
	
	const results = await db.getLendsByFilter(filter, pageNumber, pageSize);
	
	return response.status(200).json({
		success: true,
		data: results.rows,
		pageNumber: pageNumber,
		pageSize: pageSize,
		totalPages: Math.floor(results.count / pageSize) + 1,
	});
}));


app.get('/api/lends/:id', asyncRouteWrapper( async (request, response) => {
	const result = await db.getLend(request.params.id);
	
	if (result) {
		
		return response.status(200).json({
			success: true,
			data: result
		});
		
	} else {
		
		return response.status(404).json({
			success: false,
			msg: 'Not found'
		});
		
	}
}));


app.delete('/api/lends/:id', asyncRouteWrapper( async (request, response) => {
	const result = await db.removeLend(request.params.id);
	
	if (result) {
		
		return response.status(200).json({
			success: true,
			msg: 'Deleted'
		});
		
	} else {
		
		return response.status(404).json({
			success: false,
			msg: 'Not found'
		});
		
	}
}));


app.put('/api/lends/:id', asyncRouteWrapper( async (request, response) => {
    const lendData = request.body;
	const lendId = request.params.id;
	
	const updatedLend = await db.updateLend(lendId, lendData);
	
	if (updatedLend) {
		
		return response.status(200).json({
			success: true,
			data: updatedLend,
		});
		
	} else {
		
		return response.status(404).json({
			success: false,
			msg: 'Not found',
		});
		
	}
}));


app.post('/api/lends', asyncRouteWrapper( async (request, response) => {
    const lendData = request.body;
	
	const newLend = await db.addLend(lendData);
	
	return response.status(201).json({
		success: true,
		data: newLend
	});
}));


/*app.get('/api/lends/:customerId', asyncRouteWrapper( async (request, response) => {
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
}))*/


/*app.get('/api/lends/:lendId', asyncRouteWrapper( async (request, response) => {
    try {
        const lend = db.getLendByLend(request.params.id);
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
}))*/


/* TODO: change this method

app.post('/api/lends/return', (req, res) => {
    res.json(db.returnLend(req.body.lendId, req.body.lendId));
})
*/


// Default route for unimplemented paths
app.use(
	//'/',
	async (request, response) => {
		response.status(501).json({
			success: false,
			msg: 'Unimplemented route'
		});
	}
);


// Route error handler
app.use( async (error, req, res, next) => {
	
	// Log error
	logger.error(error);
	
	// Return message to user
	return res.status(500).json({
		success: false,
		msg: 'Internal server error'
	});
});


// Wait for db connection
await db.dbConnection(logger);


// Tell express to listen to communication on the specified port after the configuration is done.
app.listen(PORT, () => logger.info(`Lends service listening on port ${PORT}`));

// Exports for tests
export default app
