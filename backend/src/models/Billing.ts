// models/Billing.ts
import { Schema, model, Document, Types } from 'mongoose';

export enum BillingType {
  MATERIAL_ORDER = 'material_order',
  ORDER_PROCESSING = 'order_processing',
  SHIPPING = 'shipping',
  OTHER = 'other'
}

export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue'
}

interface IBilling extends Document <Types.ObjectId> {
  type: BillingType;
  amount: number;
  reference: string;
  status: BillingStatus;
  dueDate?: Date;
  paymentDate?: Date;
  purchaseOrder?: Schema.Types.ObjectId;
  productionOrder?: Schema.Types.ObjectId;
  client?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BillingSchema = new Schema<IBilling>({
  type: { 
    type: String, 
    required: true, 
    enum: Object.values(BillingType) 
  },
  amount: { type: Number, required: true, min: 0 },
  reference: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: Object.values(BillingStatus),
    default: BillingStatus.PENDING
  },
  dueDate: { type: Date },
  paymentDate: { type: Date },
  purchaseOrder: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
  productionOrder: { type: Schema.Types.ObjectId, ref: 'ProductionOrder' },
  client: { type: Schema.Types.ObjectId, ref: 'Client' }
}, { timestamps: true });

export const Billing = model<IBilling>('Billing', BillingSchema);