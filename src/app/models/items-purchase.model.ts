import { Accessory } from "./accessory.model";
import { Warehouse } from "./warehouse.model";

export interface PurchaseItem {
  accessory: Accessory;
  warehouse: Warehouse;
  quantity: number;
}
