
// Import mongo-connection
import mongoConnection from './mongo-connection.js';

// Import book model
import Book from './models/book.js';


// Connect to mongodb
const dbConnection = async function() {
	await mongoConnection(); // TODO change logging inside mongoConnection
}


const addBook = async function(data) {
	const newBook = new Book(data);
    const result = await newBook.save();
    return result;
}


const updateBook = async function(data, id) {
    const bookId = id; // Search book by id
	const bookData = data;
	
	const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      bookData,
      { new: true } // Return updated book instead of old one
    ).exec();
	
    if (updatedBook === null) { // Book to update was not found
		return undefined;
    }
	
    return updateBook;
}


const removeBook = async function(id) {
	const deletedBook = await Book.findByIdAndDelete(id).exec();
	
    if (deletedBook === null) { // Book to delete was not found
		return undefined;
    }
	
    return deletedBook;
}


const getBook = async function(id) {
    const book = await Book.findById(id).exec();
	
    if (book === null) { // Book was not found
		return undefined;
    }
	
    return book;
}


const getAllBooks = async function(pageNumber = 1, pageSize = 10) {
	const results = await Book.paginate({}, { page: pageNumber, limit: pageSize }); // Functions from pagination plugin already return a promise and don't need .exec()
	
	const output = {
		data: results.docs,
		pageNumber: results.page,
		pageSize: results.limit,
		totalPages: results.totalPages
	};
	
    return output;
}


// If this file is imported an instance of this file is created 
// and the below specified functions are made available to the importing party.
export {
	dbConnection,
    addBook,
    updateBook,
    removeBook,
    getBook,
	getAllBooks
};