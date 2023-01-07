// Import mongoose
import mongoose from 'mongoose';

// Import mongoose pagination plugin
import paginate from 'mongoose-paginate-v2';

// Import uuid (v1)
import { v1 as uuid_v1 } from 'uuid';


const normalize = function (doc, ret, game) {
	ret.id = doc.id; // Use doc(ument) default getter id (that always displays _id in string form) as id field in ret(urned plain object) 
	delete ret._id; // Remove raw _id from returnd plain object
	delete ret.__v; // Remove __v (versionKey) from returnd plain object
}


// Setup schema
const BookSchema = new mongoose.Schema(
  {
	_id: {
	  type: mongoose.Schema.Types.UUID,
	  default: uuid_v1,
	  immutable: true,
	},
    title: {
      type: String,
      required: true,
	  unique: false,
      trim: true,
	  minLength: 1,
      maxLength: 100
    },
	year: {
      type: Number,
	  required: true,
	  unique: false,
	  min: 1800, // Older books BELONG IN A MUSEUM!
	  max: 2100 // To update before 2100 ;-)
    },
    isbn13: {
      type: String,
      required: false,
      trim: true,
	  lowercase: true,
	  minLength: 17,
	  maxLength: 17
    },
    author: {
      type: String,
      required: false,
      trim: true,
	  minLength: 1,
      maxLength: 100
    },
	publisher: {
      type: String,
      required: false,
      trim: true,
	  minLength: 1,
      maxLength: 100
    },
	genre: {
      type: String,
      required: true,
      trim: true,
	  minLength: 1,
      maxLength: 100
    },
    copies: {
      type: Number,
	  required: false, // If not provided becomes default
	  min: 0,
      default: 0
    }
  },
  {
	//versionKey: false,
    toJSON: {transform: normalize},
    toObject: {transform: normalize}
  }
);


// Set indexes and unique constrains
BookSchema.index({ isbn13: 1 }, { unique: true, sparse: true }); // If provided must be unique (because old books don't have an ISBN)
BookSchema.index({ title: 1, year: 1, publisher: 1, }, { unique: true }); // No books with same title, year and publisher
BookSchema.index({ title: 'text', publisher: 'text', author: 'text' });


// Add pagination plugin
BookSchema.plugin(paginate);


// Create book model based on book schema
const Book = mongoose.model('Book', BookSchema);


// Export
export default Book;
