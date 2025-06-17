import { SalesSummaryDTO } from "./sales-summary.model";
import { TotalsDTO } from "./totals.model";

export interface DashboardDTO {
  totals: TotalsDTO;
  salesSummary: SalesSummaryDTO;
}
