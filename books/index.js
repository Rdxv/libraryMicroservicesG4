// Import and load dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import express
import express from 'express';

// Import logger
import { logger, loggingMiddleware } from './logger/logger.js';

// Import database connection
import * as db from './database/db.js';


// Parse ENV
const PORT = process.env.PORT ?? 3001;


// Create wrapper function to atch exceptions in async routes and pass them to Express error handling chain (Express by default doesn't catch errors in asyncs)
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


// app.get('/', (request, response) => {
//     response.send('Libreria Alfonso aperta');
// });


app.get('/api/books', asyncRouteWrapper( async (request, response) => {
	const pageNumber = request.query.pageNumber ?? 0;
	const pageSize = request.query.pageSize ?? 10;
	
	const filter = {};
	
	if (request.query.title)
		filter.title = request.query.title;
	if (request.query.author)
		filter.author = request.query.author;
	if (request.query.publisher)
		filter.publisher = request.query.publisher;
	if (request.query.genre)
		filter.genre = request.query.genre;
	if (request.query.year)
		filter.year = request.query.year;
	if (request.query.available !== undefined)
		filter.available = request.query.available === 'true';
	
	const results = await db.getBooksByFilter(filter, pageNumber, pageSize);
	
	return response.status(200).json({
		success: true,
		...results
	});
}));


app.get('/api/books/:id', asyncRouteWrapper( async (request, response) => {
	const book = await db.getBook(request.params.id);
	
	if (book) {
		
		return response.status(200).json({
			success: true,
			data: book,
		});
		
	} else {
		
		return response.status(404).json({
			success: false,
			msg: 'Not found'
		});
		
	}
}));


app.delete('/api/books/:id', asyncRouteWrapper( async (request, response) => {
	const result = await db.removeBook(request.params.id);
	
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


app.put('/api/books/:id', asyncRouteWrapper( async (request, response) => {
    const bookData = request.body;
	const bookId = request.params.id;
	
	const updatedBook = await db.updateBook(bookData, bookId);
	
	if (updatedBook) {
		
		return response.status(200).json({
			success: true,
			data: updatedBook,
		});
		
	} else {
		
		return response.status(404).json({
			success: false,
			msg: 'Not found',
		});
		
	}
}));


app.post('/api/books', asyncRouteWrapper( async (request, response) => {
    const bookData = request.body;
	
	const newBook = await db.addBook(bookData);
	
	return response.status(201).json({
		success: true,
		data: newBook
	});
}));



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
app.use( (error, req, res, next) => {
	
	// Log error
	logger.error(error);
	
	// Return message to user
	return res.status(500).json({
		success: false,
		msg: 'Internal server error'
	});
});


// Wait for db connection
await db.dbConnection(
	error => logger.error(`DB Error: ${error}`),
	info => logger.info(`DB Info: ${info}`)
);


// Tell express to listen to communication on the specified port after the configuration is done
app.listen(PORT, () => logger.info(`Libreria Alfonso listening on port ${PORT}`));