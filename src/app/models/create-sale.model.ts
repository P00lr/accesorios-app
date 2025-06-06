import { CreateSaleDetail } from './create-sale-detail.model';

export interface CreateSale {
  userId: number;
  saleDetails: CreateSaleDetail[];
}
