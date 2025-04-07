import { Schema, model, Document, Types } from 'mongoose';

export enum ProductionStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface IProductionOrder extends Document <Types.ObjectId> {
  purchaseOrder: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  steps: Array<{
    step: Schema.Types.ObjectId;
    status: ProductionStatus;
    startDate?: Date;
    endDate?: Date;
    operator?: Schema.Types.ObjectId;
  }>;
  currentStep: number;
  status: ProductionStatus;
  startDate?: Date;
  completionDate?: Date;
}

const ProductionOrderSchema = new Schema<IProductionOrder>({
  purchaseOrder: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  steps: [{
    step: { type: Schema.Types.ObjectId, ref: 'ProductionStep', required: true },
    status: { 
      type: String, 
      enum: Object.values(ProductionStatus),
      default: ProductionStatus.PLANNED
    },
    startDate: { type: Date },
    endDate: { type: Date },
    operator: { type: Schema.Types.ObjectId, ref: 'Employee' }
  }],
  currentStep: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: Object.values(ProductionStatus),
    default: ProductionStatus.PLANNED
  },
  startDate: { type: Date },
  completionDate: { type: Date }
}, { timestamps: true });

export const ProductionOrder = model<IProductionOrder>('ProductionOrder', ProductionOrderSchema);