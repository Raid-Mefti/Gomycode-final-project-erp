import { Schema, model, Document, Types } from 'mongoose';

interface IEmployee extends Document<Types.ObjectId> {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  service: string;
  role: string;
  image?: string;
  user: Types.ObjectId; // Reference to User model
  createdAt: Date;
  updatedAt: Date;
  logisticsTeam?: Schema.Types.ObjectId; // Reference to Logistics team
  isLogisticsManager: boolean;
}

const EmployeeSchema = new Schema<IEmployee>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  service: { type: String, required: true, enum: ['RH', 'marketing', 'finance', 'commercial', 'logistic'] },
  role: { type: String, required: true },
  image: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  logisticsTeam: { type: Schema.Types.ObjectId, ref: 'Logistics' },
  isLogisticsManager: { type: Boolean, default: false }

}, { timestamps: true });

export const Employee = model<IEmployee>('Employee', EmployeeSchema);