import { GetAdjustmentDetail } from "./adjustmen.model";

export interface GetAdjustment {
  id: number;
  date: string;  // ISO string
  type: string;
  description: string;
  userFullName: string;
  details: GetAdjustmentDetail[];
}