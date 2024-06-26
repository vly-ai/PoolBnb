import { Schema, model, Document, Model } from 'mongoose';

/**
 * The Booking model keeps track of all bookings made by users for pools listed on PoolBnb.
 * It accurately records the user making the booking, the pool being booked, the booking start
 * and end dates, and the booking status. This model ensures that bookings are linked to both
 * users and pools and supports efficient retrieval of booking history for users and hosts.
 */

/**
 * Interface representing a Booking document in MongoDB.
 */
export interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  pool: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking Schema definition.
 */
const BookingSchema: Schema = new Schema(
  {
    // The user making the booking. References the User collection.
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // The pool being booked. References the Pool collection.
    pool: { type: Schema.Types.ObjectId, ref: 'Pool', required: true },
    // The start date of the booking period.
    startDate: { type: Date, required: true },
    // The end date of the booking period.
    endDate: { type: Date, required: true },
    // The status of the booking. Can be 'pending', 'confirmed', or 'cancelled'.
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], required: true },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps.
);

/**
 * Booking model based on the Booking Schema.
 */
const Booking: Model<IBooking> = model<IBooking>('Booking', BookingSchema);

export default Booking;