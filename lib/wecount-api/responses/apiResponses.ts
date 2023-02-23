import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { Status } from "@custom-types/core/Status";
import { Scope } from "@custom-types/wecount-api/activity";
import { PerimeterRole, Role } from "@custom-types/wecount-api/auth";
import { ListingColumn } from "@custom-types/wecount-api/campaignListing";
import { ComputeMode } from "@custom-types/wecount-api/computeMethod";
import { DbName } from "@custom-types/wecount-api/emissionFactor";
import { SearchType } from "@custom-types/wecount-api/searchTypes";
import { ElementType } from "hoist-non-react-statics/node_modules/@types/react";

interface ShortCampaign {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
}

export type ResponseCampaigns = ShortCampaign[];

interface ActivityModelFull {
  id: number;
  uniqueName: string;
  createdAd: string;
  name: string;
  description: string | null;
  help: string | null;
  seeMore: string | null;
  helpIframe: string | null;
  seeMoreIframe: string | null;
  onlyManual: boolean;
  isPrivate: boolean;
  archivedDate: string | null;
  possibleActions: PossibleAction[];
}

interface ActivityCategory {
  id: number;
  scope: Scope;
  name: string;
  iconName: string | null;
  description: string | null;
  activityModels: ActivityModelFull[];
  possibleActions: PossibleAction[];
  actionPlanHelp: string | null;
}

export type ActivityCategoriesResponse = ActivityCategory[];

export interface ActivityWithModelIdResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string | null;
  description: string | null;
  reductionIdea: string | null;
  reductionTarget: number | null;
  status: Status;
  resultTco2: number | null;
  uncertainty: number | null;
  activityModel: {
    id: number;
  };
  owner: null | {
    id: number;
    email: string;
    createdAt: string;
    archived: boolean;
    roles: Role[];
  };
}

export type ActivitiesResponse = ActivityWithModelIdResponse[];

export type CampaignWithActivitiesResponse = {
  id: number;
  perimeterId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  resultTco2Upstream: number;
  resultTco2Core: number;
  resultTco2Downstream: number;
  uncertaintyUpstream: number;
  uncertaintyCore: number;
  uncertaintyDownstream: number;
  resultTco2UpstreamForTrajectory: number;
  resultTco2CoreForTrajectory: number;
  resultTco2DownstreamForTrajectory: number;
  uncertaintyUpstreamForTrajectory: number;
  uncertaintyCoreForTrajectory: number;
  uncertaintyDownstreamForTrajectory: number;
  year: number;
  targetYear: number | null;
  campaignTrajectoryIds: number[];
  status: CampaignStatus;
  type: CampaignType;
  activities: ActivityWithModelIdResponse[];
}

export interface CampaignResponse {
  id: number;
  perimeterId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  resultTco2Upstream: number;
  resultTco2Core: number;
  resultTco2Downstream: number;
  uncertaintyUpstream: number;
  uncertaintyCore: number;
  uncertaintyDownstream: number;
  resultTco2UpstreamForTrajectory: number;
  resultTco2CoreForTrajectory: number;
  resultTco2DownstreamForTrajectory: number;
  uncertaintyUpstreamForTrajectory: number;
  uncertaintyCoreForTrajectory: number;
  uncertaintyDownstreamForTrajectory: number;
  year: number;
  targetYear: number | null;
  campaignTrajectoryIds: number[];
  status: CampaignStatus;
  type: CampaignType;
}

export type CampaignsResponse = CampaignResponse[];

interface UserResponse {
  id: number;
  createdAt: string;
  email: string;
  roles: Role[];
  archived: boolean;
  passwordIsSet: boolean;
  isAdmin: boolean;
  isManager: boolean;
}

export interface UserFullResponse {
  id: number;
  createdAt: string;
  email: string;
  roles: Role[];
  archived: boolean;
  passwordIsSet: boolean;
  isAdmin: boolean;
  isManager: boolean;
  profile: {
    id: number;
    createdAt: string;
    firstName: string;
    lastName: string;
  };
  company: {
    id: number;
    createdAt: string;
    name: string;
    readonlyMode: boolean;
    logoUrl: string | null;
  };
  roleWithinPerimeters: {
    perimeterId: number;
    role: PerimeterRole;
  }[];
}

export interface UserWithProfileResponse {
  id: number;
  createdAt: string;
  email: string;
  roles: Role[];
  archived: boolean;
  profile: {
    id: number;
    createdAt: string;
    firstName: string;
    lastName: string;
  };
  roleWithinPerimeter?: PerimeterRole;
}

export type UserListResponse = UserWithProfileResponse[];

export interface EmissionFactorResponse {
  id: number;
  emissionFactorInfo: {
    postType: string | null;
    cO2f: number | null;
    cH4f: number | null;
    cH4b: number | null;
    n2O: number | null;
    cO2b: number | null;
    valeurGazSupplementaire: number | null;
    valeurGazSupplementaire2: number | null;
    valeurGazSupplementaire3: number | null;
    valeurGazSupplementaire4: number | null;
    valeurGazSupplementaire5: number | null;
    autreGES: number | null;
  };
  combustionPart: number;
  createdAt: string;
  updatedAt: string;
  value: number;
  elementType: ElementType;
  dbName: DbName;
  dbId: string;
  uncertainty: number;
  name: string;
  source: string | null;
  description: string | null;
  unit: string | null;
  input1Unit: string | null;
  input2Unit: string | null;
  program: string | null;
  urlProgram: string | null;
  isPrivate: boolean;
  archived: boolean;
  notVisible: boolean;
  inactive: boolean;
  comment: string | null;
  tagIds: number[];
}

export interface ActivityEntryReferenceResponse {
  createdAt: Date;
  updatedAt: Date;
  referenceId: string;
}

export interface ActivityEntryResponse {
  activityId: number;
  activityEntryReference: ActivityEntryReferenceResponse;
  emissionFactor: EmissionFactorResponse | null;
  customEmissionFactor: CustomEmissionFactorResponse | null;
  id: number;
  createdAt: string;
  updatedAt: string;
  value: number | null;
  value2: number | null;
  uncertainty: number;
  resultTco2: number;
  title: string | null;
  description: string | null;
  instruction: string | null;
  dataSource: string | null;
  isExcludedFromTrajectory: boolean;
  manualTco2: number | null;
  manualUnitNumber: number | null;
  product: ProductResponse | null;
  site: SiteResponse | null;
  status: Status;
  computeMethodType: ComputeMethodType;
  computeMethod: {
    id: number;
  } | null;
  activityModel: {
    id: number;
  };
  input1Unit: string | undefined;
  input2Unit: string | undefined;
  ownerId: number | null;
  writerId: number | null;
  entryTagMappings: {
    entryTagId: number;
  }[];
}

export interface ActivityEntryHistoryResponse extends ActivityEntryResponse {
  activity: {
    campaign: {
      year: number;
      status: CampaignStatus;
      type: CampaignType;
    };
  };
  computeMethod: {
    id: number;
    name: string;
    description: string | null;
    position: number;
    isDefault: boolean;
    emissionFactorLabel: string;
    valueName: string;
    value2Name: string;
    emissionFactorSearchType: SearchType;
    archivedDate: string | null;
  } | null;
}

export interface ActivityEntryFullResponse {
  activity: {
    id: number;
    activityModel: {
      id: number;
    };
  };
  activityEntryReference: ActivityEntryReferenceResponse;
  emissionFactor: EmissionFactorResponse | null;
  customEmissionFactor: CustomEmissionFactorResponse | null;
  id: number;
  createdAt: string;
  updatedAt: string;
  value: number | null;
  value2: number | null;
  uncertainty: number;
  resultTco2: number;
  title: string | null;
  description: string | null;
  instruction: string | null;
  dataSource: string | null;
  manualTco2: number | null;
  manualUnitNumber: number | null;
  product: ProductResponse | null;
  site: SiteResponse | null;
  status: Status;
  computeMethodType: ComputeMethodType;
  isExcludedFromTrajectory: boolean;
  computeMethod: {
    id: number;
  } | null;
  activityModel: {
    id: number;
  };
  input1Unit: string | undefined;
  input2Unit: string | undefined;
  owner: {
    id: number;
  } | null;
  writer: {
    id: number;
  } | null;
  entryTagMappings: {
    entryTagId: number;
  }[];
}

export interface EntriesResponse {
  emissionFactor: EmissionFactorResponse | null;
  resultTco2: number;
  activityEntries: ActivityEntryFullResponse[];
  id: number;
  activityModel: {
    id: number;
  };
}

export interface ComputeMethodResponse {
  id: number;
  name: string;
  description: string | null;
  position: number;
  isDefault: boolean;
  valueName: string;
  value2Name: string | null;
  emissionFactorSearchType: SearchType;
  emissionFactorMappings: EmissionFactorMappingResponse[];
  specialComputeMode: ComputeMode | null;
  emissionFactorLabel: string | null;
  relatedEFAreEditableEvenIfHasHistory: boolean;
  archivedDate: string | null;
  rootTagLabels: RootTagLabel[];
}

export type RootTagLabel = {
  id: number;
  name: string;
  childrenTagLabels: ChildTagLabel[];
};

export type ChildTagLabel = {
  id: number;
  name: string;
  emissionFactorTags: EmissionFactorTag[];
};

type EmissionFactorTag = {
  id: number;
  name: string;
};

export interface EmissionFactorMappingResponse {
  emissionFactor: EmissionFactorResponse;
  recommended: boolean;
}

export interface UserPeferencesCampaignListingResponse {
  columns: ListingColumn[];
}

export interface UserPreferencesActivityModelsRepsonse {
  visibleActivityModels: string[];
}

export interface UserPreferencesActivityCategoryResponse {
  activityCategoryId: number;
  order: number;
  description?: string | null;
}

export interface SubSiteResponse {
  id: number;
  name: string;
  description: string | null;
  archivedDate: string;
  createdAt: string;
  resultTco2: number;
}

export type SubSiteListResponse = SubSiteResponse[];

export interface SiteResponse {
  id: number;
  name: string;
  description: string | null;
  archivedDate: string;
  createdAt: string;
  resultTco2: number;
  subSites?: SubSiteListResponse;
}

export type SiteListResponse = SiteResponse[];

export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  quantity: number | null;
  archivedDate: string;
  createdAt: string;
}

export type ProductListResponse = ProductResponse[];

export interface EntryTagResponse {
  id: number;
  name: string;
  archivedDate: string | null;
  createdAt: string;
}

export interface CompanyFullResponse {
  id: number;
  createdAt: string;
  name: string;
  lockedDate: string;
  users: UserResponse[];
  readonlyMode: boolean;
}

export interface PossibleAction {
  id: number;
  name: string;
}

export interface CampaignTrajectoryResponse {
  id: number;
  campaignId: number;
  createdAt: string;
  updatedAt: string;
  scopeTargets: ScopeTargetResponse[];
  actionPlans: ActionPlanResponse[];
}

export interface ScopeTargetResponse {
  id: number;
  scope: Scope;
  target: number | null;
  description: string | null;
}

export interface ActionPlanResponse {
  id: number;
  categoryId: number;
  campaignTrajectoryId: number;
  action: PossibleAction | null;
  createdAt: string;
  updatedAt: string;
  reduction: number | null;
  description: string | null;
  comments: string | null;
  activityModelId: number;
}

export interface ScopeHelpResponse {
  id: number;
  scope: Scope;
  help: string;
}

export interface IndicatorResponse {
  id: number;
  campaignId: number;
  createdAt: string;
  name: string;
  unit: string | null;
  quantity: number | null;
}

export interface PerimeterFullResponse {
  activities: PerimeterActivityResponse[];
  synthesis: PerimeterEmissionsResponse[];
}

export interface PerimeterResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface PerimeterActivityResponse {
  perimeterId: number;
  campaignId: number;
  categoryId: number;
  activityModelId: number;
  scope: Scope;
  tco2Included: number;
  tco2Excluded: number;
  nbrEntriesIncluded: string;
  nbrEntriesExcluded: string;
}

export interface PerimeterEmissionsResponse {
  id: number;
  name: string;
  description: string | null;
  campaigns: {
    id: number;
    status: CampaignStatus;
    type: CampaignType;
    name: string;
    resultTco2Upstream: number;
    resultTco2Core: number;
    resultTco2Downstream: number;
    resultTco2UpstreamForTrajectory: number;
    resultTco2CoreForTrajectory: number;
    resultTco2DownstreamForTrajectory: number;
    year: number;
  }[];
}

export interface CartographySettingsResponse {
  categorySettings: UserPreferencesActivityCategoryResponse[];
  visibleActivityModels: string[];
}

export interface TrajectorySettingsResponse {
  id: number;
  scopeTargets: ScopeTargetResponse[];
  targetYear: number;
}

export interface ReglementationTablesResponse {
  structure: ReglementationTable[];
}

export interface ReglementationTable {
  id: number;
  name: string;
  reglementationCategories: ReglementationCategory[];
}

export interface ReglementationCategory {
  id: number;
  name: string;
  reglementationSubCategories: ReglementationSubCategory[];
}

export interface ReglementationSubCategory {
  id: number;
  name: string;
}

export type TableType = "BEGES" | "GHG" | "ISO"

export type ReglemetationResultsResponse<T extends TableType> = {
  activityEntryResults: ReglementationResults[T][];
};

export type ReglementationResults = {
  ISO: ResultsISO;
  BEGES: ResultsBEGES;
  GHG: ResultsGHG;
};

export interface ResultsISO {
  id: number;
  deletedAt: string | null;
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  fluoredGaz: number;
  otherGaz: number;
  co2bCombustion: number;
  co2bOther: number;
  activityEntryId: number;
  subCategoryId: number;
}
export interface ResultsBEGES {
  id: number;
  deletedAt: string | null;
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  otherGaz: number;
  co2b: number;
  activityEntryId: number;
  subCategoryId: number;
}
export interface ResultsGHG {
  id: number;
  deletedAt: string | null;
  result: number;
  uncertainty: number;
  co2: number;
  ch4: number;
  n2O: number;
  hfcs: number;
  pfcs: number;
  sf6: number;
  otherGaz: number;
  co2b: number;
  activityEntryId: number;
  subCategoryId: number;
}

export interface Analytics {
  eventName: string;
}

export interface CustomEmissionFactorResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  value: number;
  name: string;
  input1Name: string;
  input1Unit: string;
  comment: string | null;
  source: string | null;
  archivedDate: string | null;
}
