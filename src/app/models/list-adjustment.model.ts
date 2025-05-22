export interface Adjustment {
  id: number;
  date: string; // ISO string
  type: string;
  description: string;
  totalQuantity: number;
}
