import { Schema, model, Document, Types } from 'mongoose';

interface IRawMaterial extends Document <Types.ObjectId> {
  name: string;
  supplier: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  minimumStockLevel: number;
  arrivalDate?: Date;
}

const RawMaterialSchema = new Schema<IRawMaterial>({
  name: { type: String, required: true },
  supplier: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, enum: ['kg', 'g', 'l', 'ml', 'units'] },
  costPerUnit: { type: Number, required: true, min: 0 },
  minimumStockLevel: { type: Number, required: true, min: 0 },
  arrivalDate: { type: Date }
});

export const RawMaterial = model<IRawMaterial>('RawMaterial', RawMaterialSchema);