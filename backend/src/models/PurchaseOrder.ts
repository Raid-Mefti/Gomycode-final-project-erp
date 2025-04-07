import { Schema, model, Document, Types } from 'mongoose';

export enum PurchaseOrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  SHIPPED = 'shipped'
}

interface IPurchaseOrder extends Document<Types.ObjectId> {
  orderNumber: string;
  client: Schema.Types.ObjectId;
  commercial: Schema.Types.ObjectId;
  products: Array<{
    product: Schema.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: PurchaseOrderStatus;
  logistics?: Schema.Types.ObjectId;
  billing?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>({
  orderNumber: { type: String, required: true, unique: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  commercial: { type: Schema.Types.ObjectId, ref: 'Commercial', required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: Object.values(PurchaseOrderStatus),
    default: PurchaseOrderStatus.PENDING
  },
  logistics: { type: Schema.Types.ObjectId, ref: 'Logistics' },
  billing: { type: Schema.Types.ObjectId, ref: 'Billing' }
}, { timestamps: true });

export const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);