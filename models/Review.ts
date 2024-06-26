import { Schema, model, Document, Model } from 'mongoose';

/**
 * The Review model stores user-generated reviews for pools listed on PoolBnb.
 * It contains the user providing the review, the pool being reviewed, a rating score,
 * a textual comment, and the date when the review was created. This model ensures that
 * each review is linked to a user and a pool and provides a mechanism for users to share
 * their experiences, which assists others in making informed booking decisions.
 */

/**
 * Interface representing a Review document in MongoDB.
 */
export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  pool: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Review Schema definition.
 */
const ReviewSchema: Schema = new Schema(
  {
    // The user who wrote the review.
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // The pool being reviewed.
    pool: { type: Schema.Types.ObjectId, ref: 'Pool', required: true },
    // The rating score given by the user (minimum 1, maximum 5).
    rating: { type: Number, required: true, min: 1, max: 5 },
    // The comment provided by the user about the pool.
    comment: { type: String, required: true },
    // The date when the review was created. Defaults to the current date.
    date: { type: Date, default: Date.now },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps.
);

/**
 * Review model based on the Review Schema.
 */
const Review: Model<IReview> = model<IReview>('Review', ReviewSchema);

export default Review;