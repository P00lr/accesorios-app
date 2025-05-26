import { CreatePurchaseDetail } from './create-purchase-detail.model';

export interface CreatePurchase {
  supplierId: number;
  userId: number;
  warehouseId: number;
  purchaseDetails: CreatePurchaseDetail[];
}
