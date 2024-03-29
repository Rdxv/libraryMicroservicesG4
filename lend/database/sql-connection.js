import Sequelize from 'sequelize';


const sqlConnection = async function(logger) {
	
	// Database configs
	const databaseConfig = {
		
		// Real database configs
		real: {
			dialect: 'mysql',
			//dialect: 'mariadb',
			
			port: process.env.SQL_PORT ?? 3306,
			host: process.env.SQL_HOST ?? 'localhost',
			
			username: process.env.SQL_USER,
			password: process.env.SQL_PASSWORD,
			database: process.env.SQL_DBNAME
		},
		
		// Fake database configs (for development)
		fake: {
			dialect: 'sqlite',
			storage: ':memory:'
		}
		
	};
	
	// Other configs
	const commonConfig = {
		
		// Define configs
		define: { timestamps: false }, // Don't add timestamps columns to all tables
		
		// Debug logging function (set to false to disable debug logging)
		logging: process.env.LOG_LEVEL === 'debug' ? msg => logger.debug(msg) : false,
		
		// similar for sync: you can define this to always force sync for models
		sync: { force: true },

		// Pool configuration used to pool database connections
		/* pool: {
			max: 5,
			idle: 30000,
			acquire: 60000
		} */

	};
	
	// If in production env or in db-test env, set useRealDb to true
	const useRealDb = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'db-test';

	if (!useRealDb)
		logger.warn('Using fake DB (in-memory)');

	
	// Set up sequelite connection
	const sequelizeConnection = new Sequelize({
		
		// DB specific configs
		...databaseConfig[ useRealDb ? 'real' : 'fake' ], // Use real or fake db according to useRealDb value
		
		// Other sequelize configs
		...commonConfig
		
	});
	
	
	return sequelizeConnection;

}


// Exports
export default sqlConnection;
