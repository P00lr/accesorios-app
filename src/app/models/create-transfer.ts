import { CreateTransferDetail } from "./create-transfer-detail";

export interface CreateTransfer {
  description: string;
  userId: number;
  originWarehouseId: number;
  destinationWarehouseId: number;
  transferDetails: CreateTransferDetail[];
}