import { GetTransferDetail } from './get-transfer-detail.model';

export interface GetTransfer {
  id: number;
  description: string;
  date: string;
  originWarehouse: string;
  destinationWarehouse: string;
  userName: string;
  details: GetTransferDetail[];
}
