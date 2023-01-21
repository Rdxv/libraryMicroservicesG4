// Import sequelize datatypes
import DataTypes from 'sequelize';

// Import uuid (v1)
// import { v1 as uuid_v1 } from 'uuid';

// Setup schema
const LendSchema = {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV1,
		primaryKey: true
	},
	bookId: {
		type: DataTypes.UUID,
		allowNull: false
	},
	customerId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	borrowingDate: {
		type: DataTypes.DATEONLY,
		//defaultValue: DataTypes.NOW, // default value will be set in db.js
		allowNull: false
	},
	expirationDate: {
		type: DataTypes.DATEONLY,
		//defaultValue: DataTypes.NOW, // default value will be set in db.js
		allowNull: false
	},
	returnedDate: {
		type: DataTypes.DATEONLY
	}
};


// Export
export default LendSchema;
