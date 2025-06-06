export interface Purchase {
  id: number;
  totalAmount: number;
  totalQuantity: number;
  purchaseDate: string; // usualmente fecha en ISO string
  supplierName: string;
  userName: string;
}
