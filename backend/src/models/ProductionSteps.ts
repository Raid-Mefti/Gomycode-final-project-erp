import { Schema, model, Document, Types } from 'mongoose';

interface IProductionStep extends Document <Types.ObjectId> {
  name: string;
  description: string;
  machine: Schema.Types.ObjectId;
  duration: number; // in minutes
  requiredMaterials: Array<{
    material: Schema.Types.ObjectId;
    quantity: number;
  }>;
  outputProduct: Schema.Types.ObjectId;
  outputQuantity: number;
}

const ProductionStepSchema = new Schema<IProductionStep>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  machine: { type: Schema.Types.ObjectId, ref: 'Machine', required: true },
  duration: { type: Number, required: true, min: 1 },
  requiredMaterials: [{
    material: { type: Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
    quantity: { type: Number, required: true, min: 0 }
  }],
  outputProduct: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  outputQuantity: { type: Number, required: true, min: 1 }
});

export const ProductionStep = model<IProductionStep>('ProductionStep', ProductionStepSchema);