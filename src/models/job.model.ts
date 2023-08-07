import {CustomerModel} from "./customer.model";
import {WorkOrderModel} from "./work-order.model";

export interface JobModel {
  id: string;
  contractorId: string;
  subContractorId: string;
  customer: CustomerModel; // will add later
  workOrder: WorkOrderModel[]; // will add later
}
