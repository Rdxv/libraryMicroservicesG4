// Import and load dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import connection to mongodb (with regular ES6 import)
import mongoConnection from './mongo-connection.js';

// Import book model
import Book from './models/book.js';


// Connect to mongodb
const dbConnection = async function(logger) {
	await mongoConnection(logger);
}


const addBook = async function(data) {
	const newBook = new Book(data);
	
    try {
		
		const result = await newBook.save();
		return result;
		
	} catch (exception) {
		
		if (exception.name === 'MongoError' && exception.code === 11000) // DuplicateError
			return null;
		
    }
}


const updateBook = async function(data, id) {
    const bookId = id; // Search book by id
	const bookData = data;
	
	try {
		
		const updatedBook = await Book.findByIdAndUpdate(
			bookId,
			bookData,
			{ new: true } // Return updated book instead of old one
		).exec();
		
		if (updatedBook === null) // Book to update was not found
			return undefined;
		
	} catch (exception) {
		
		if (exception.name === 'MongoError' && exception.code === 11000) // DuplicateError
			return null;
		
    }
	
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


const getBooksWithQuery = async function(mongooseQuery, pageNumber = 1, pageSize = 10) {
	const results = await Book.paginate(mongooseQuery, { page: pageNumber, limit: pageSize }); // Functions from pagination plugin already return a promise and don't need .exec()
	
	const output = {
		data: results.docs,
		pageNumber: results.page,
		pageSize: results.limit,
		totalPages: results.totalPages
	};
	
    return output;
}


const getAllBooks = async function(pageNumber = 1, pageSize = 10) {
	const results = await getMultipleBooks({}, pageNumber, pageSize); // Empty query = All books
	return results;
}


const getBooksByFilter = async function(filter, pageNumber = 1, pageSize = 10) {
	
	// Filter example:
	// {
	//     title: "EaRtH",
	//     author: "Jules"
	// }
	// Result "Journey to the Center of the Earth" by "Jules Verne"
	
	const mongooseQuery = { $and: [{}] }; // Create empty query (without other options it returns all records in db)
	
	const { year: yearFilter, isbn: isbnFilter, available: availableFilter, ...otherFilters } = filter;
	
	if (yearFilter) {
		//mongooseQuery.$and ??= [];
		mongooseQuery.$and.push({ year: yearFilter });
	}
	
	if (availableFilter !== undefined) { // availableFilter is bool so we need to specifically check if it's defined
		//mongooseQuery.$and ??= [];
		if (availableFilter)
			mongooseQuery.$and.push({ copies: { $gt: 0 } }); // If we have (at the moment) more than zero copies, then it's available
		else
			mongooseQuery.$and.push({ copies: 0 }); // Looking for unavailable books doesn't seem very useful, but maybe it's so...
	}
	
	for (const property in otherFilters) {
		const wordsInSearchString = otherFilters[property].replace(/[^\w\s]/gu, '').split(/\s+/u); // Split search string in words
		
		const regex = wordsInSearchString.map(word => '(?=.*' + word + ')').join(''); // Create a regex that matches strings containing all the words provided in any order
		
		const mongooseSubquery = { [property]: { $regex: regex, $options: 'i' } }; // Create subquery to look for recors that match the regex (case insensitive)
		
		//mongooseQuery.$and ??= []; // Add empty $and array to mongoose query if undefined
		mongooseQuery.$and.push(mongooseSubquery); // Add subquery to $and array (see MongoDB/Mongoose queries documentation)
	}
	
	const results = await getBooksWithQuery(mongooseQuery, pageNumber, pageSize);
	
	return results;
}


// If this file is imported an instance of this file is created 
// and the below specified functions are made available to the importing party.
export {
	dbConnection,
    addBook,
    updateBook,
    removeBook,
    getBook,
	getAllBooks,
	getBooksByFilter
};