import mongoose, { Schema, type Document, type Types } from 'mongoose';

export interface ReservationDocument extends Document {
  userId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  status: 'reserved' | 'released';
}

const ReservationSchema = new Schema<ReservationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  status: { type: String, enum: ['reserved', 'released'], default: 'reserved' }
}, { timestamps: true });

export const Reservation = mongoose.model<ReservationDocument>('Reservation', ReservationSchema);

