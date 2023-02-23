import { NbByStatus } from "@lib/core/activityEntries/nbByStatus";
import { SiteData } from "@reducers/dataImport/sitesDataReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { Status } from "./Status";

export interface SubSiteEmission {
    id: number;
    name: string;
    tCo2: number;
    nb: number;
    nbByStatus: NbByStatus;
}

export interface SiteEmission {
    id: number;
    name: string;
    tCo2: number;
    nb: number;
    nbByStatus: NbByStatus;
    subSites?: SubSiteEmission[];
}

export const emptySiteData = {
    id: 0,
    name: "",
    tCo2: 0,
    nb: 0,
    nbByStatus: {
        [Status.ARCHIVED]: 0,
        [Status.IN_PROGRESS]: 0,
        [Status.TO_VALIDATE]: 0,
        [Status.TERMINATED]: 0,
    }
}
export interface SubSiteDataForCreation {
    name: string;
    description: string | null;
    archivedDate: string | null;
}

export interface SiteDataForCreation {
  name: string;
  description: string | null;
  archivedDate: string | null;
  parent: string;
  level: number;
  subSites: SubSiteDataForCreation[];
}

export enum SitesDataError {
    UNEXISTING_PARENT = "UNEXISTING_PARENT",
    DUPLICATED_SITE = "DUPLICATED_SITE",
    EMPTY_NAME = "EMPTY_NAME"
}

export type DataSitesImportError = Record<SitesDataError, boolean>;

export const possibleErrors = {
    [SitesDataError.UNEXISTING_PARENT]: upperFirst(t("site.import.error.unexistingParent")),
    [SitesDataError.DUPLICATED_SITE]: upperFirst(t("site.import.error.duplicatedSite")),
    [SitesDataError.EMPTY_NAME]: upperFirst(t("site.import.error.emptyName")),
};

export interface ValidateSiteData extends SiteData {
    error: DataSitesImportError;
}
  