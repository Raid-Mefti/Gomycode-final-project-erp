import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document<Types.ObjectId> {
  username: string;
  password: string;
  email: string;
  role: 'admin' | 'rh' | 'marketing' | 'finance' | 'commercial' | 'logistic';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'rh', 'marketing', 'finance', 'commercial', 'logistic'] 
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);