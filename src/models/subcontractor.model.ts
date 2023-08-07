import { JobModel } from "./job.model";
import { DocumentsModel } from "./documents.model";
import { TradesmanQuestionnaireModel } from "./tradesman-questionnaire.model";

export interface SubcontractorModel {
  id: string;
  name: string;
  primaryContact: string;
  email: string;
  phone: string;
  phone2?: string;
  address: string;
  documents: DocumentsModel; // view all documents can be a modal
  trades: []; // will add later
  qualityOfWork: string;
  areasOfImprovement: string;
  notes: string;
  jobs: JobModel[];
  tradesmanQuestionnaire: TradesmanQuestionnaireModel;
}
