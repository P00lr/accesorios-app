import { CreateAdjustmentDetail } from "./CreateAdjustmentDetail.model";

export interface CreateAdjustment {
  date: string; // formato ISO, ej: '2025-05-20T14:30:00'
  type: string;
  description: string;
  userId: number;
  adjustmentDetails: CreateAdjustmentDetail[];
}