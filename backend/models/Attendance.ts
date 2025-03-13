import { Schema, model, Document } from 'mongoose';

// interface pour le modele Attendance
interface AttendanceI extends Document {
    employee: Schema.Types.ObjectId; 
    date: Date;
    status: 'present' | 'absent' | 'late'; 
}

// Schema pour Attendance
const AttendanceSchema = new Schema<AttendanceI>({
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
});

export const Attendance = model<AttendanceI>('Attendance', AttendanceSchema);