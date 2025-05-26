import { AccessoryCatalog } from "./accessory-catalog.model";

export interface CartItem {
  accessory: AccessoryCatalog;
  quantity: number;
}