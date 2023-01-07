// Import and load dotenv
import * as dotenv from 'dotenv';
dotenv.config();

// Import connection to SQL (dynamically depending on NODE_ENV)
let useRealDB;
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'db-test')
    useRealDB = true;
else
    useRealDB = false;
const { default: sqlConnection } = await import(useRealDB ? './sql-connection.js' : './fake-sql-connection.js');

const dbConnection = async function(logger) {
    await sqlConnection(logger);
}

//Exports
export {
    dbConnection,
};
