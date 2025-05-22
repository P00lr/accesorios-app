export interface ListTransfer {
  id: number;
  description: string;
  date: string; // Puede ser string si el backend envía ISO8601
  userName: string;
}
