import { GetSaleDetail } from "./get-sale-detail.model";

export interface GetSale {
    id: number;
    totalAmount: number;
    totalQuantity:  number;
    saleDate: string;
    clientName: string;
    clientEmail: string;
    userName: string;
    saleDetails: GetSaleDetail[];

}