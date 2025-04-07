import { Schema, model, Document, Types } from 'mongoose';

interface IProduct extends Document <Types.ObjectId>{
  fabricationDate: Date;
  name: string;
  productId: string;
  supplier: string;
  stock: number;
  price: number;
  destination: string;
}

const ProductSchema = new Schema<IProduct>({
  fabricationDate: { type: Date, required: true },
  name: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  destination: { type: String, required: true }
});

export const Product = model<IProduct>('Product', ProductSchema);