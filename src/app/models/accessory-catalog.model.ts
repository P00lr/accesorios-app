export interface AccessoryCatalog {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  stock: number;
  // Opcional si decides incluirlo en el DTO:
  categoryId?: number;
  categoryName?: string;
}
