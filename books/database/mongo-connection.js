import mongoose from 'mongoose';

async function mongoConnection() {
	const username = encodeURIComponent(process.env.MONGO_USER);
	const password = encodeURIComponent(process.env.MONGO_PASSWORD);
	const mongoCluster = process.env.MONGO_CLUSTER;
	const mongoDatabase = process.env.MONGO_DB;

	const uri = `mongodb+srv://${username}:${password}@${mongoCluster}/${mongoDatabase}?retryWrites=true&w=majority`;

	try {
		mongoose.connect(
			uri,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			() => console.log('Database connection established!')
		);
	} catch (err) {
		console.error(`Error connecting to the database. \n ${err}`);
	}

	const dbConnection = mongoose.connection;
	dbConnection.on('error', (err) => console.error(`Connection error ${err}`));
	dbConnection.once('open', () => console.log('Connected to DB!'));
}

export default mongoConnection;
