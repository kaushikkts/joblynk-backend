export interface MaterialSourcesModel {
  id: string;
  contractorId: string;
  materialAndSources: MaterialAndSources[]
}

export interface MaterialAndSources {
  id: string;
  name: string;
  sources: Source[];
}
export interface Source {
  id: string;
  sourceName: string;
  website: string;
  isPrimary: boolean;
}