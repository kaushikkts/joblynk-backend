export interface LineItemModel {
  id: string;
  workOrderId: string;
  photoRequired: boolean;
  subcontractorNotes: any[];
  managementNotes: any[];
  status: string;
}
