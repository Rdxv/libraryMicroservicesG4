// Import mongoose
import mongoose from 'mongoose';


// To suppress dumb mongoose deprecation warning (it's dumb because we are not using anything deprecated)
mongoose.set('strictQuery', false);


async function mongoConnection(logger) {
	let mongoUri;
	let mongoOptions;
	
	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'db-test') { // Use real DB
	
		// const username = encodeURIComponent(process.env.MONGO_USER);
		// const password = encodeURIComponent(process.env.MONGO_PASSWORD);
		// const mongoCluster = process.env.MONGO_CLUSTER;
		// const mongoDatabase = process.env.MONGO_DB;
		
		// mongoUri = `mongodb+srv://${username}:${password}@${mongoCluster}/${mongoDatabase}?retryWrites=true&w=majority`;
		
		mongoUri = process.env.MONGO_URI;
		
		mongoOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};
		
	} else { // Use fake DB (in-memory)

		logger.warn('Using fake DB (in-memory)');

		const { MongoMemoryServer } = await import('mongodb-memory-server'); // Dynamically import in-memory mongo lib
		
		const mongoServer = await MongoMemoryServer.create(); // Spin up in-memory mongodb
		
		mongoUri = mongoServer.getUri(); // Get connection string for fake db
		
		mongoOptions = {
			dbName: "microservices"
		};
		
	}
	
	const dbConnection = mongoose.connection;
	dbConnection.on('error', (err) => logger.error(err));
	dbConnection.once('open', () => logger.info('Connected to DB!'));
	
	try {
		await mongoose.connect(
			mongoUri, // Connection string
			mongoOptions // Other options
		);
	} catch (err) {
		logger.fatal(err);
	}
}


export default mongoConnection;
