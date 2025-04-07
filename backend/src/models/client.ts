import { Schema, model, Document, Types } from 'mongoose';

interface IClient extends Document <Types.ObjectId>{
  clientId: string;
  firstName: string;
  lastName: string;
  location: string;
  type: string;
  image?: string;
  target: string;
  payment: {
    method: string;
    terms: string;
  };
  commercial: Schema.Types.ObjectId;
}

const ClientSchema = new Schema<IClient>({
  clientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String },
  target: { type: String, required: true },
  payment: {
    method: { type: String, required: true },
    terms: { type: String, required: true }
  },
  commercial: { type: Schema.Types.ObjectId, ref: 'Commercial', required: true }
});

export const Client = model<IClient>('Client', ClientSchema);