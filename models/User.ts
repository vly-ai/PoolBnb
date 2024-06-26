import { Schema, model, Document, Model } from 'mongoose';

/**
 * The User model stores essential information about the users of the PoolBnb application.
 * It includes fields to keep track of the user's personal details, authentication credentials,
 * bookings, and listed pools. Additional user profile information such as biography
 * and avatar can also be stored. The model supports unique email constraints for secure
 * authentication and contains embedded references to other collections like bookings and pools.
 */

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  bookings: Schema.Types.ObjectId[];
  listings: Schema.Types.ObjectId[];
  profile: {
    bio?: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema definition.
 */
const UserSchema: Schema = new Schema(
  {
    // The user's full name.
    fullName: { type: String, required: true },
    // The user's email address. Must be unique.
    email: { type: String, required: true, unique: true },
    // The user's encrypted password.
    password: { type: String, required: true },
    // References to the bookings made by the user.
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking', required: false }],
    // References to the pools listed by the user.
    listings: [{ type: Schema.Types.ObjectId, ref: 'Pool', required: false }],
    // User profile information.
    profile: {
      bio: { type: String, required: false },
      avatar: { type: String, required: false },
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps.
);

/**
 * User model based on the User Schema.
 */
const User: Model<IUser> = model<IUser>('User', UserSchema);

export default User;