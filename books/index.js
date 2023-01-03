// Import and load dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import express
import express from 'express';

// Import database connection
import * as db from './database/real-db.js';

// Get PORT from env
const PORT = process.env.PORT ?? 3001;

// Create the Server Instance
const app = express();

// Tell express to use its JSON middleware.
// If the server recevies JSON in a request's body it will automatically convert the JSON to a JavaScript object.
app.use(express.json());


app.get('/', (request, response) => {
    response.send('Libreria Alfonso aperta');
});


app.get('/api/books/:id', async (request, response) => {
    try {
		const book = await db.getBook(request.params.id);
		if (book) {
			return response.status(200).json({
				status: 'success',
				data: book,
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


app.get('/api/books', async (request, response) => {
	const pageNumber = request.query.pageNumber ?? 0;
	const pageSize = request.query.pageSize ?? 10;
	
	try {
		const results = await db.getAllBooks(pageNumber, pageSize);
		return response.status(200).json({
			status: 'success',
			...results
		});
	} catch (err) {
		return response.status(500).json({
			status: 'fail',
			error: err.toString(),
		});
	}
});


app.delete('/api/books/:id', async (request, response) => {
    try {
		const result = await db.removeBook(request.params.id);
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


app.put('/api/books/:id', async (request, response) => {
    const bookData = request.body;
	const bookId = request.params.id;
	
	try {
		const updatedBook = await db.updateBook(bookData, bookId);
		if (updatedBook) {
			return response.status(200).json({
				status: 'success',
				data: updatedBook,
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


app.post('/api/books', async (request, response) => {
    const bookData = request.body;
	
	try {
		const newBook = await db.addBook(bookData);
		return response.status(201).json({
			status: 'success',
			data: newBook,
		});
	} catch (err) {
		return response.status(500).json({
			status: 'fail',
			error: err.toString(),
		});
	}
});



// Default route for bad requests
app.use(
  //'/',
  async function (request, reply) {
    reply.status(400).json({
      success: false,
      error: 'Bad request',
    });
  },
);


// Wait for db connection
await db.dbConnection();


// Tell express to listen to communication on the specified port after the configuration is done.
app.listen(PORT, () => console.log(`Libreria Alfonso sulla porta ${PORT}`));