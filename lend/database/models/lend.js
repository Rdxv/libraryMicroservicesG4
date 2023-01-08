// Import sequelize datatypes
import DataTypes from 'sequelize';

// Import uuid (v1)
import { v1 as uuid_v1 } from 'uuid';


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
	userId: {
		type: DataTypes.UUID,
		allowNull: false
	},
	borrowing_date: {
		type: DataTypes.DATEONLY,
		defaultValue: DataTypes.NOW,
		allowNull: false
	},
	expiration_date: {
		type: DataTypes.DATEONLY,
		//defaultValue: DataTypes.NOW + maxLendTime,
		allowNull: false
	},
	returned_date: {
		type: DataTypes.DATEONLY
	}
};


// Export
export default LendSchema;
