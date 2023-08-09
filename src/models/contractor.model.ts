import {MaterialSourcesModel} from "./material-sources.model";
import { JobModel } from "./job.model";
import {ServicePartnersModel} from "./service-partners.model";
import {SubcontractorModel} from "./subcontractor.model";
import {SubcontractorGapsModel} from "./subcontractor-gaps.model";

export interface ContractorModel {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  primaryContact: string;
  secondaryContact: string;
  address: string;
  email: string;
  subcontractors?: SubcontractorModel[];
  jobs?: JobModel[];
  servicePartners?: ServicePartnersModel[];
  subcontractorGaps?: SubcontractorGapsModel[];
  materialSources?: MaterialSourcesModel;
}
