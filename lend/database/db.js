
// Import lend model
import LendSchema from './models/lend.js';

// Import connection to SQL database
import sqlConnection from './sql-connection.js';


// Connect to SQL database and initialize model
let Lend; // Empty lend model
const dbConnection = async function(logger) {
	
	// Define db connection
	const connection = await sqlConnection(logger);
	
	// Define table from entity model
	Lend = connection.define('lends', LendSchema);
	
    try {
		
		// Try to connect to db
        await connection.authenticate();
		
		// // Try to sync tables on db (create them if they don't exist)
		await connection.sync();
		
        logger.info('Connected to DB');
		
    } catch (error) {
		
		// Errors on connection to db are fatal
        logger.fatal(error.message);
		
		throw error;
		
    }
	
};


const getLend = async function(id) {
    const record = await Lend.findByPk(id);
	
    if (record === null) { // Record was not found
		return undefined;
    }
	
    return record;
}


const addLend = async function(data) {
	const newRecord = await Lend.create(data);
    
    return newRecord;
}


//Exports
export {
    dbConnection,
	getLend,
	addLend
}
