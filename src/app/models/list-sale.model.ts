export interface Sale {
  id: number;
  totalAmount: number;
  totalQuantity: number;
  saleDate: string; // ISO 8601 string (LocalDateTime)
  clientId: number;
  userId: number;
}
