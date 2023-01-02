// Import mongoose
import mongoose from 'mongoose';

// Import uuid (v1)
import { v1 as uuid_v1 } from 'uuid';


// Setup schema
const BookSchema = new mongoose.Schema(
  {
	_id: {
	  type: mongoose.Schema.Types.UUID,
	  default: uuid_v1,
	  immutable: true
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
//  { versionKey: '_v1' }
);


// Set indexes and unique constrains
BookSchema.index({ isbn13: 1 }, { unique: true, sparse: true }); // If provided must be unique (because old books don't have an ISBN)
BookSchema.index({ title: 1, year: 1 }, { unique: true }); // No books with same title and year


// Create book model based on book schema
const Book = mongoose.model('Book', BookSchema);


// Export
export default Book;
