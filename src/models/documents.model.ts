export interface DocumentsModel {
  id: string;
  document: Document[];
}

export interface Document {
  id: string;
  type: DocumentType;
  dateAdded: Date;
  format: string;
  url: string;
}

export enum DocumentType {
  W9,
  INSURANCE,
  CERTIFICATES,
  TRADESMAN_QUESTIONNAIRE
}
