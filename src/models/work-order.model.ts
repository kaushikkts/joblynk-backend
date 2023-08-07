import {LineItemModel} from "./line-item.model";

export interface WorkOrderModel {
  id: string;
  startDate: Date;
  endDate: Date;
  contractorNotes: any[];
  subContractorNotes: any[];
  photos: any[]; //will add later
  lineItems: LineItemModel[]; // will add later
}
