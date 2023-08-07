export interface ServicePartnersModel {
  id: string;
  contractorId: string;
  name: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  secondaryContactFirstName?: string | null;
  secondaryContactLastName?: string | null;
  secondaryContactPhone?: string | null;
  secondaryContactEmail?: string | null;
  services: string;
  qualityOfWork?: number;
  notes: string;
}
