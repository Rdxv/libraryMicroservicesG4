
// Import connection to SQL database
import sqlConnection from './sql-connection.js';


// Connect to SQL database
const dbConnection = async function(logger) {
	await sqlConnection(logger);
};


//Exports
export {
    dbConnection
}
