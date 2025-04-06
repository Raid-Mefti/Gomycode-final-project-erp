import { Schema, model, Document } from "mongoose";

// interface pour le modele Contract
interface ContractI extends Document {
  employee: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  contractType: string;
  salary: number;
}

// Schema pour Contract
const ContractSchema = new Schema<ContractI>({
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  contractType: { type: String, required: true },
  salary: { type: Number, required: true },
});

export const Contract = model<ContractI>("Contract", ContractSchema);
