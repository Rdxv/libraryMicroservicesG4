import mongoose from 'mongoose';

async function mongoConnection(errorLogger, infoLogger) {
	const username = encodeURIComponent(process.env.MONGO_USER);
	const password = encodeURIComponent(process.env.MONGO_PASSWORD);
	const mongoCluster = process.env.MONGO_CLUSTER;
	const mongoDatabase = process.env.MONGO_DB;
	
	const uri = `mongodb+srv://${username}:${password}@${mongoCluster}/${mongoDatabase}?retryWrites=true&w=majority`;
	
	const dbConnection = mongoose.connection;
	dbConnection.on('error', (err) => errorLogger(err));
	dbConnection.once('open', () => infoLogger('Connected to DB!'));
	
	try {
		await mongoose.connect(
			uri, // Connection string
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
	} catch (err) {
		errorLogger(err);
	}
}

export default mongoConnection;
