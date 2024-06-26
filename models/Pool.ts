import { Schema, model, Document, Model } from 'mongoose';

/**
 * The Pool model stores detailed information about each pool available for rent on PoolBnb.
 * It includes fields for pool name, location, description, price, availability dates,
 * amenities, photos, and the host user. This model also has fields to mark listings as featured
 * and includes an array for storing reviews. This model ensures that details like location
 * and amenities are well-defined and allows for efficient querying and sorting of pool listings.
 */

/**
 * Interface representing a Pool document in MongoDB.
 */
export interface IPool extends Document {
  name: string;
  location: string;
  description: string;
  price: number;
  availability: { startDate: Date; endDate: Date }[];
  amenities: string[];
  photos: string[];
  featured: boolean;
  host: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pool Schema definition.
 */
const PoolSchema: Schema = new Schema(
  {
    // The pool's name.
    name: { type: String, required: true },
    // A description of the pool's location.
    location: { type: String, required: true },
    // A detailed description of the pool.
    description: { type: String, required: true },
    // The price per hour for renting the pool.
    price: { type: Number, required: true },
    // The availability dates for the pool.
    availability: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
      }
    ],
    // The amenities available at the pool.
    amenities: { type: [String], required: true },
    // URLs for photos of the pool.
    photos: { type: [String], required: true },
    // Boolean indicating if the pool is featured.
    featured: { type: Boolean, default: false },
    // Reference to the User model (host of the pool).
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // References to reviews for the pool.
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', required: false }],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps.
);

/**
 * Pool model based on the Pool Schema.
 */
const Pool: Model<IPool> = model<IPool>('Pool', PoolSchema);

export default Pool;