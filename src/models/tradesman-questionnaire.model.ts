import {StatusEnum} from "../enums/status.enum";

export interface TradesmanQuestionnaireModel {
  id: string;
  contractorId: string;
  status: StatusEnum;
  date: Date;
  name: string;
  primaryContact: string;
  phone: string;
  phone2?: string;
  address: string;
  secondaryContact?: string;
  secondaryPhone?: string;
  ssn: string;
  taxId?: string;
  referredBy: string;
  faxNumber?: string;
  basicQuestions: BasicQuestions;
  trades: Trades;
}

export interface BasicQuestions {
  anyCurrentContractingJobs: boolean;
  helpers: string;
  insuranceLimits: string;
  afterHoursEmergencyRepairs: boolean;
  accessToMoreHelp: boolean;
  workAtNightAndWeekends: boolean;
  phoneAnswerableDuringWorkHours: boolean;
  contractorLicenseNumber?: string;
  contractorLicenseType?: string;
  workersCompensationInsurance: boolean;
  generalLiabilityInsuranceLimits: string;
  driverLicense?: DriverLicense
}

export interface Trades {
  acousticTile?: boolean;
  aluminiumVinylSiding?: boolean;
  cabinets?: boolean;
  cabinetsDetail?: CabinetsDetail;
  ceramicTile?: boolean;
  demolition?: boolean;
  draperyCleaning: boolean;
  electrical?: boolean
  fabricCleaning: boolean;
  finishCarpentry: boolean;
  furnitureRefurbish?: boolean;
  garageDoors: boolean;
  hardContentsCleaning?: boolean;
  hvac: boolean;
  insulation: boolean;
  paint: boolean;
  masonry: boolean;
  plumbing: boolean;
  punchListCarpenter: boolean;
  stuccoAndPlaster: boolean;
  wallpaper: boolean;
  waterExtractionEmergency: boolean;
  windows: boolean;
  stripAndFinishStructure: boolean;
  debris: Debris;
  floorCovering: FloorCovering;
  floors: Floors;
  carpet: CarpetCleaning;
  roofing: Roofing;
  carpentry: Carpentry;
  sandRefinishing: SandRefinishing;
  sheetRockDrywall: SheetRockDrywall;
  structure: Structure;
  iicrcCertifications?: IICRCCertifications;

}

export interface IICRCCertifications {
  water: boolean;
  asd: boolean;
  fire: boolean;
  odor: boolean;
  mold: boolean;
  other: string;
}

export interface CabinetsDetail {
  canRepairCabinets: boolean;
  cabinetShop: boolean;
  installCabinets: boolean;
}

export interface Structure {
  structureCleaning: boolean;
  postConstruction: boolean;
  structureFire: boolean;
  janitorial: boolean;
}

export interface SheetRockDrywall {
  sheetRockDrywall: boolean;
  matchTexture: boolean;
  smallJobs:boolean;
  largeJobs: boolean;
}

export interface SandRefinishing {
  sandRefinishingWoodFloor: boolean;
  screenAndCoat: boolean;
  totalRefinishing: boolean;
  dustControl: boolean;
}

export interface Carpentry {
  roughCarpentry: boolean;
  fence: boolean;
}

export interface Roofing {
  roofing: boolean;
  smallRoofRepair: boolean;
  fullRoofReplacement: boolean;
}

export interface Floors {
  floors?: boolean;
  hardFloors: boolean;
  softFloors?: boolean;
  traditionalHardWoods: boolean;
  preFinishedHardwoods: boolean;
}

export interface FloorCovering {
  floorCoveringInstallation: boolean;
  carpet?: boolean;
  powerStretcher?: boolean;
  vinyl?: boolean;
  laminate?: boolean;
}

export interface Debris {
  debrisRemoval?: boolean;
  accessToTruck?: boolean;
}

export interface CarpetCleaning {
  carpetCleaning?: boolean;
  typeOfEquipment?: string[];
}

export interface DriverLicense {
  driversLicense: string;
  driversLicenseState: string;
  driversLicenseExpiry: Date;
}
