import { Schema, model, Document } from 'mongoose';

// interface pour le modele Employee
interface EmployeeI extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    service: string;
    role: string;
    healthStatus: string; 
    familySituation: string; 
    militarySituation: string; 
    attendances?: Schema.Types.ObjectId[];
    contracts?: Schema.Types.ObjectId[]; 
}

// Schema pour Employee
const EmployeeSchema = new Schema<EmployeeI>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    service: { type: String, required: true }, 
    role: { type: String, required: true }, 
    healthStatus: { type: String, required: true }, 
    familySituation: { type: String, required: true }, 
    militarySituation: { type: String, required: true }, 
    attendances: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }], 
    contracts: [{ type: Schema.Types.ObjectId, ref: 'Contract' }], 
});


export const Employee = model<EmployeeI>('Employee', EmployeeSchema);