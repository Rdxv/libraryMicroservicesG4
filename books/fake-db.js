/*
A collection of functions simulating a data storage.
*/

// Import a library to create ids.
let uuid = require('uuid/v1');
let books = [];


// Create some mock data
books.push({
    id: uuid(),
    isbn: "978-3-548-26308-3",
    title: "Es",
    author: "Stephen King",
    publisher: "Ullstein",
    year: 2005,
    genre: "Horror",
    condition: "New",
    available: true
},
{
    id: uuid(),
    isbn: "978-3-548-26308-3",
    title: "Schnelles Denken, langsames Denken",
    author: "Daniel Kahneman",
    publisher: "Penguin Verlag",
    year: 2016,
    genre: "Sachbuch",
    condition: "New",
    available: true
});

const addBook = book => {
    const id = uuid();
    // The spread operator (...) is used to create a new object which contains all elements of the received lend object
    // and adds new keys or changes keys of the object.
    // Here the id is added to the book object before it is pushed into the array.
    let newBook = { ...book,
        id: id
    }
    books.push(newBook);
    return newBook;
}

const updateBook = book => {
    // Finds the index where the condition function returns true
    const index = books.findIndex(element => element.id === book.id);
    books[index] = book;
    return books[index];
}

const removeBook = id => {
    // Finds the first element for which the condition function returns true
    const bookToRemove = books.find(book => book.id === id);
    // Creates a new array containing all elements for which the condition function returns true (removes the element)
    books = books.filter(book => book.id !== id);
    return bookToRemove;
}

const getAllBooks = () => {
    return books;
}

const getBookById = id => {
    return books.find(book => book.id === id);
}

const setAvailable = (id) => {
    const index = books.findIndex(book => book.id === id);
    books[index] = {...books[index], available: !books[index].available};
    return books[index];
}

// If this file is imported an instance of this file is created 
// and the below specified functions are made available to the importing party.
module.exports = {
    addBook,
    updateBook,
    removeBook,
    getAllBooks,
    getBookById,
    setAvailable
}