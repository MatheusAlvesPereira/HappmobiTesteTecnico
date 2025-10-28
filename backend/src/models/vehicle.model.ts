import mongoose, { Schema, type HydratedDocument, type Types } from 'mongoose';

export interface VehicleSchemaType {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  isReserved: boolean;
  reservedBy?: Types.ObjectId | null;
}

const VehicleSchema = new Schema<VehicleSchemaType>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  licensePlate: { type: String, required: true, unique: true },
  isReserved: { type: Boolean, default: false },
  reservedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

export type VehicleDocument = HydratedDocument<VehicleSchemaType>;
export const Vehicle = mongoose.model<VehicleSchemaType>('Vehicle', VehicleSchema);

