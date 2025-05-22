import { GetPurchaseDetail } from './get-purchase-detail.model';

export interface GetPurchase {
  id: number;
  totalAmount: number;
  totalQuantity: number;
  purchaseDate: string; // ISO string (LocalDateTime)
  supplierName: string;
  supplierEmail: string;
  userName: string;
  purchaseDetails: GetPurchaseDetail[];
}
