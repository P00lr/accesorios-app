export interface WarehouseDetail {
  id: number; // warehouseDetailId
  warehouseId: number;
  warehouseName: string; // 👈 si lo usarás en el select
  accessoryId: number;
  accessoryName: string; // 👈 para el autocompletado
  stock: number;         // 👈 útil si quieres validar cantidad
  state: string;         // 👈 opcional si filtras por estado
}

