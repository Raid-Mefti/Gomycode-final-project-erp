import { Schema, model, Document, Types } from 'mongoose';

interface ILogistics extends Document <Types.ObjectId>{
  teamName: string;
  members: Schema.Types.ObjectId[];
  manager: Schema.Types.ObjectId;
  available: boolean;
  currentAssignments: Schema.Types.ObjectId[];
  capacity: number;
  specialization?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LogisticsSchema = new Schema<ILogistics>({
  teamName: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Employee', required: true }],
  manager: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  available: { type: Boolean, default: true },
  currentAssignments: [{ type: Schema.Types.ObjectId, ref: 'PurchaseOrder' }],
  capacity: { type: Number, required: true, min: 1 }, // Max concurrent assignments
  specialization: [{ type: String }] // e.g., ['shipping', 'production', 'inventory']
}, { timestamps: true });

export const Logistics = model<ILogistics>('Logistics', LogisticsSchema);