import { CreateSaleDetail } from './create-sale-detail.model';

export interface CreateSale {
  clientId: number;
  userId: number;
  saleDetails: CreateSaleDetail[];
}
