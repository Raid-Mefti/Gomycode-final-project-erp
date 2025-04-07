import { Schema, model, Document, Types } from 'mongoose';

interface IMachine extends Document <Types.ObjectId>{
  name: string;
  description: string;
  status: 'operational' | 'maintenance' | 'out_of_service';
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  productionRate: number; // units per hour
}

const MachineSchema = new Schema<IMachine>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['operational', 'maintenance', 'out_of_service'],
    default: 'operational'
  },
  lastMaintenanceDate: { type: Date, required: true },
  nextMaintenanceDate: { type: Date, required: true },
  productionRate: { type: Number, required: true, min: 0 }
});

export const Machine = model<IMachine>('Machine', MachineSchema);