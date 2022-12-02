/*
A collection of functions simulating a data storage.
*/

// Import a library to create ids.
let uuid = require('uuid/v1');
let lends = [];

const addLend = lend => {
    const id = uuid();
    // The spread operator (...) is used to create a new object which contains all elements of the received lend object
    // and adds new keys or changes keys of the object.
    // Here the id is added to the lend and a fees key is added to the customer object.
    let newlend = {...lend, id: id, customer: {...lend.customer, fees: 0}};
    lends.push(newlend);
    return newlend;
}

const updateLend = lend => {
    // Finds the index where the condition function returns true
    const index = lends.findIndex(element => element.id === lend.id);
    lends[index] = lend;
    return lends[index];
}

const removeLend = id => {
    // Finds the first element for which the condition function returns true
    const lendToRemove = lends.find(lend => lend.id === id);
    // Creates a new array containing all elements for which the condition function returns true (removes the element)
    lends = lends.filter(lend => lend.id !== id);
    return lendToRemove;
}

const returnBook = (lendId, bookId) => {
    let manipLend = lends.find(lend => lendId === lend.id);
    manipLend.books = manipLend.books.filter(book => {
        if (bookId === book.id) {
            // If the book was returned late we have to add to the late fees
            if (book.returndate < Date.now()) {
                manipLend.customer.fees += 2;
            }
            return false;
        }
        return true;
    })
    return manipLend;
}

const getAllLends = () => {
    return lends;
}

const getLendById = id => {
    return lends.find(lend => lend.id === id);
}

const getLendByBook = bookId => {
    return lends.find(lend => {
        const book = lend.books.find(book => bookId === book.id);
        if (book !== undefined) {
            return true;
        }
        return false;
    });
}

const getLendByCustomer = customerId => {
    return lends.find(lend => lend.customer.id === customerId);
}

// If this file is imported an instance of this file is created
// and the below specified functions are made available to the importing party.
module.exports = {
    addLend,
    updateLend,
    removeLend,
    returnBook,
    getAllLends,
    getLendById,
    getLendByBook,
    getLendByCustomer
}