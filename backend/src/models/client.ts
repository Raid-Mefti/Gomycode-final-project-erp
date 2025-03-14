import { Schema, model, Document } from "mongoose";

// interface pour le modele Client
interface ClientI extends Document {
  clientCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyAddress: string;
  fees: number;
  commerceRegistryNumber?: string;
}

// Schema pour Client
const ClientSchema = new Schema<ClientI>({
  clientCode: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  companyAddress: { type: String, required: true },
  fees: { type: Number, required: true, default: 0 },
  commerceRegistryNumber: { type: String },
});

export const Client = model<ClientI>("Client", ClientSchema);
