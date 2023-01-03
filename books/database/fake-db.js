/*
A collection of functions simulating a data storage.
*/

// Import a library to create ids.
import { v1 as uuid } from 'uuid';


// Create empty fake db
const books = [];


// Pretend we're connecting to a db
const dbConnection = async function() {
	// Create some mock data
	books.push(
		{
			id: uuid(),
			isbn13: "978-3-548-26308-3",
			title: "Es",
			author: "Stephen King",
			publisher: "Ullstein",
			year: 2005,
			genre: "Horror",
			copies: 0
		},
		{
			id: uuid(),
			isbn13: "978-3-548-26308-3",
			title: "Schnelles Denken, langsames Denken",
			author: "Daniel Kahneman",
			publisher: "Penguin Verlag",
			year: 2016,
			genre: "Sachbuch",
			copies: 2
		}
	);
	
	// TODO add something to log
}


const addBook = function(book) {
    const newBook = { ...book,
        id: uuid()
    };
    books.push(newBook);
    return newBook;
}


const updateBook = function(data, id) {
    // Finds the index where the condition function returns true
    const index = books.findIndex(element => element && element.id === id);
	if (index !== -1) {
		books[index] = { ...data,
			id: id
		};
		return books[index];
	}
    return undefined;
}


const removeBook = function(id) {
    // Finds the index where the condition function returns true
    const index = books.findIndex(element => element && element.id === id);
	if (index !== -1) {
		const deletedBook = JSON.parse(JSON.stringify(books[index])); // Deep copy book before deleting it (very ugly but most portable solution to emulate real db)
		delete books[index];
		return deletedBook;
	}
    return undefined;
}


const getBook = function(id) {
    return books.find(element => element && element.id === id);
}


const getBooksFiltered = function(pageNumber = 1, pageSize = 10, filterFunction) {
	const pageBeginsAt = (pageNumber - 1) * pageSize;
	const pageEndsAt = pageBeginsAt + pageSize;
	
	const results = books.filter(function(item) {
		// If item exists and filterFunction returns true...
		if (item && filterFunction(item)) {
			// If item is in the page requested...
			if (this.counter >= pageBeginsAt && this.counter < pageEndsAt) {
				// ...return true (AKA add the item to filtered list)
				this.counter++;
				return true;
			}
			this.counter++;
		}
		// ...else return false
		return false;
	}, {counter: 0});
	
	const output = {
		data: results,
		pageNumber: pageNumber,
		pageSize: pageSize
	};
	
    return output;
}


const getAllBooks = function(pageNumber = 1, pageSize = 10) {
	const getAllFilterFunction = item => true; // Get all results
	return getBooksFiltered(pageNumber, pageSize, getAllFilterFunction);
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