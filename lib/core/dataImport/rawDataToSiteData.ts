import { HashMapRow } from "@lib/utils/excel-parser/ExcelParserInterface";
import { SiteData } from "@reducers/dataImport/sitesDataReducer";
import { uniqueId } from "lodash";

export type RawSiteData = {
   name: string | null;
   description: string | null;
   parent: string | null;
};

const siteDataKeys = [
    "Nom du site",
    "Description de la donnée",
    "Nom du site parent (optionnel)"
] as const;

type Keys = typeof siteDataKeys[number];

export function dataMapper(rawSiteData: RawSiteData): SiteData{
  return {
      id: uniqueId("site-data-"),
      name: rawSiteData.name ?? "",
      description: rawSiteData.description ?? "",
      parent: rawSiteData.parent,
      level: rawSiteData.parent ? 2 : 1,
  } as SiteData;
}

function hashMapRowToRawSiteData(row: HashMapRow<Keys>): RawSiteData {
  return {
    name: row["Nom du site"]?.toString() ?? null,
    description: row["Description de la donnée"]?.toString() ?? null,
    parent: row["Nom du site parent (optionnel)"]?.toString() ?? null,
  };
}

export { siteDataKeys, hashMapRowToRawSiteData };