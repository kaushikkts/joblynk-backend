import { JobModel } from "./job.model";
import { DocumentsModel } from "./documents.model";
import { TradesmanQuestionnaireModel } from "./tradesman-questionnaire.model";

export interface SubcontractorModel {
  _id: any;
  name: string;
  primaryContactFirstName: string;
  primaryContactLastName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactPhone2?: string;
  secondaryContactFirstName?: string;
  secondaryContactLastName?: string;
  secondaryContactEmail?: string;
  secondaryContactPhone?: string;
  address: string;
  documents: DocumentsModel; // view all documents can be a modal
  primaryTrade: string;
  otherTrades: []; // will add later
  qualityOfWork: string;
  areasOfImprovement: string;
  notes: string;
  status: string;
  jobs: JobModel[];
  tradesmanQuestionnaire: TradesmanQuestionnaireModel;
}
