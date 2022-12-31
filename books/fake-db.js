/*
A collection of functions simulating a data storage.
*/

// Import a library to create ids.
const { v4: uuid } = require('uuid');


// Create empty fake db
const books = [];


// Create some mock data
books.push(
	{
		id: uuid(),
		isbn: "978-3-548-26308-3",
		title: "Es",
		author: "Stephen King",
		publisher: "Ullstein",
		year: 2005,
		genre: "Horror",
		copies: 0
	},
	{
		id: uuid(),
		isbn: "978-3-548-26308-3",
		title: "Schnelles Denken, langsames Denken",
		author: "Daniel Kahneman",
		publisher: "Penguin Verlag",
		year: 2016,
		genre: "Sachbuch",
		copies: 2
	}
);



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
		delete books[index];
		return true;
	}
    return undefined;
}


const getBook = function(id) {
    return books.find(element => element && element.id === id);
}


const getAllBooks = function(pageNumber = 0, pageSize = 10, filterFunction = item => true) {
	pageBeginsAt = pageNumber * pageSize;
	pageEndsAt = pageBeginsAt + pageSize;
	
	const results = books.filter(function(item) {
		// If item exists and filterFunction returns true (always does by default)...
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
	
    return results;
}



// If this file is imported an instance of this file is created 
// and the below specified functions are made available to the importing party.
module.exports = {
    addBook,
    updateBook,
    removeBook,
    getBook,
	getAllBooks
}