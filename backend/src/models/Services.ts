import { Schema, model, Document, Types } from 'mongoose';

interface IService extends Document <Types.ObjectId>{
  name: string;
  department: string;
  employees: Schema.Types.ObjectId[];
  director: Schema.Types.ObjectId;
  activity: string;
  statistics: {
    employeesCount: number;
    // other stats
  };
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true, enum: ['RH', 'marketing', 'finance', 'commercial', 'logistic'] },
  department: { type: String, required: true },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  director: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  activity: { type: String, required: true },
  statistics: {
    employeesCount: { type: Number, default: 0 }
  }
});

export const Service = model<IService>('Service', ServiceSchema);