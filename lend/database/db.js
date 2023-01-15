// Import lend model
import LendSchema from './models/lend.js';

// Import connection to SQL database
import sqlConnection from './sql-connection.js';

// Change the variable in .env if you want the lend duration not to be 30 days
const MAX_LEND_DAYS = process.env.MAX_LEND_DAYS ?? 30;

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

// create a getAllLends function with id query parameter
const getLendsByFilter = async function(filter, pageNumber=1, pageSize=10) {

    const results = await Lend.findAndCountAll({
        where: {
            // add to the filters the expiration date
           /* expirationDate: {
                [Op.gte]: new Date()
            },*/
            ...filter

        },
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize
    });
    return {
        data: results.rows,
        pageNumber: parseInt(pageNumber),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(results.count / pageSize),
    };

}



const getLend = async function(id) {
    const record = await Lend.findByPk(id);
	
    if (record === null) { // Record was not found
		return undefined;
    }
	
    return record;
}


const addLend = async function(data) {
    data.borrowingDate = new Date(data.borrowingDate ?? Date.now());

    // converts the lend duration to milliseconds and add them to the borrowing date.
    // ms * 1000 to get seconds, * 60 to get minutes, * 60 to get hours, * 24 to get 1 day
    data.expirationDate ??= new Date(data.borrowingDate.getTime() + 1000 * 60 * 60 * 24 * MAX_LEND_DAYS);

	const newRecord = await Lend.create(data);
    
    return newRecord;
}

const updateLend = async function(id, data) {
    const updatedCount = await Lend.update(data, { where: { id: id } });

    if (updatedCount === 0)  // Record was not found
        return undefined;
    return await getLend(id);
}

const removeLend = async function(id) {
    const deletedCount = await Lend.destroy({ where: { id: id } });

    if (deletedCount === 1)  // Record was not found
        return true;
    return false;
}

//Exports
export {
    dbConnection,
    getLendsByFilter,
	getLend,
	addLend,
    updateLend,
    removeLend
}
