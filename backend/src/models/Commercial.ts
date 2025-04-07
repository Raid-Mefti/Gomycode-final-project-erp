import { Schema, model, Document, Types } from 'mongoose';

interface ICommercial extends Document <Types.ObjectId>{
  clientList: Schema.Types.ObjectId[];
  driverList: Schema.Types.ObjectId[];
  productType: string;
  stock: number;
  products: Schema.Types.ObjectId[];
  employee: Schema.Types.ObjectId;
}

const CommercialSchema = new Schema<ICommercial>({
  clientList: [{ type: Schema.Types.ObjectId, ref: 'Client' }],
  driverList: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  productType: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true }
});

export const Commercial = model<ICommercial>('Commercial', CommercialSchema);