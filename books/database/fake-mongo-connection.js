// Fake mongo connection using in-memmory mongodb

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';


async function mongoConnection() {
	// const username = encodeURIComponent(process.env.MONGO_USER);
	// const password = encodeURIComponent(process.env.MONGO_PASSWORD);
	// const mongoCluster = process.env.MONGO_CLUSTER;
	// const mongoDatabase = process.env.MONGO_DB;
	
	const dbConnection = mongoose.connection;
	dbConnection.on('error', (err) => console.error(`Connection error ${err}`));
	dbConnection.once('open', () => console.log('Connected to DB!'));
	
	const mongoServer = await MongoMemoryServer.create(); // Spin up in-memory mongodb

	try {
		await mongoose.connect(
			mongoServer.getUri(), // Get connection string for fake db
			{ dbName: "microservices" } // Set db name
		);
	} catch (err) {
		console.error(`Error connecting to the database. \n ${err}`);
	}
}


export default mongoConnection;