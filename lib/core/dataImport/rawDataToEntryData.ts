import { uniqueId } from "lodash";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { parseAvoidingNaN } from "@lib/utils/calculator";

import { CategoriesByName } from "@selectors/category/selectAllCategoriesByName";
import { NameHashMap } from "@lib/utils/getNameHashMap";

import {
  HashMapRow,
  CellValue,
} from "@lib/utils/excel-parser/ExcelParserInterface";

import { MappableData } from "./mappableData";

export type RawEntryData = {
  activityCategory: string | null;
  activityModel: string | null;
  input1: number | null;
  input2: number | null;
  commentary: string | null;
  source: string | null;
  site: string | null;
  product: string | null;
  owner: string | null;
  writer: string | null;
  tags: string | null;
  inputInstruction: string | null;
  input1Unit: string | null;
  input2Unit: string | null;
};

type MapperArgs = {
  categories: CategoriesByName;
  sites: NameHashMap;
  products: NameHashMap;
  tags: NameHashMap;
  users: NameHashMap;
  managers: NameHashMap;
};

function buildDataMapper({
  categories,
  sites,
  products,
  users,
  managers,
  tags,
}: MapperArgs) {
  return function (data: RawEntryData): EntryData {
    const categoryName = data.activityCategory?.toLowerCase() ?? "";
    const category = categories[categoryName];
    const mappedCategory = {
      triedInput: data.activityCategory,
      value: category?.id,
      entityName: categoryName,
    };

    const activityModelId =
      category == null
        ? null
        : category.activityModelsByName[
            data.activityModel?.toLowerCase() ?? ""
          ];
    const mappedActivityModel = {
      triedInput: data.activityModel,
      value: activityModelId,
      entityName: data.activityModel?.toLowerCase() ?? "",
    };

    const mappedSite = getFieldMapping(
      data.site,
      sites,
      upperFirst(t("site.notAffectedSite.name"))
    );

    const mappedProduct = getFieldMapping(
      data.product,
      products,
      upperFirst(t("product.notAffectedProduct.name"))
    );

    const mappedOwner = getFieldMapping(
      data.owner,
      managers,
      upperFirst(t("entry.unaffected"))
    );

    const mappedWriter = getFieldMapping(
      data.writer,
      users,
      upperFirst(t("entry.unaffected"))
    );

    const mappedTags = getTagsMapping(data.tags, tags);

    return {
      id: uniqueId("entry-data-"),
      activityCategory: mappedCategory,
      activityModel: mappedActivityModel,
      site: mappedSite,
      product: mappedProduct,
      owner: mappedOwner,
      writer: mappedWriter,
      tags: mappedTags,
      input1: data.input1,
      input2: data.input2,
      input1Unit: data.input1Unit,
      input2Unit: data.input2Unit,
      commentary: data.commentary,
      source: data.source,
      inputInstruction: data.inputInstruction,
      computeMethod: null,
      emissionFactor: null,
    };
  };
}

const entryDataKeys = [
  "activityCategory",
  "activityModel",
  "site",
  "product",
  "tags",
  "inputInstruction",
  "input1",
  "input1Unit",
  "input2",
  "input2Unit",
  "commentary",
  "source",
  "owner",
  "writer",
] as const;

type Keys = typeof entryDataKeys[number];

function hashMapRowToRawEntryData(row: HashMapRow<Keys>): RawEntryData {
  return {
    activityCategory: row.activityCategory?.toString() ?? null,
    activityModel: row.activityModel?.toString() ?? null,
    site: row.site?.toString() ?? null,
    product: row.product?.toString() ?? null,
    inputInstruction: row.inputInstruction?.toString() ?? null,
    tags: row.tags?.toString() ?? null,
    input1: extractNumber(row.input1),
    input1Unit: row.input1Unit?.toString() ?? "",
    input2: extractNumber(row.input2),
    input2Unit: row.input2Unit?.toString() ?? "",
    commentary: row.commentary?.toString() ?? "",
    source: row.source?.toString() ?? "",
    owner: row.owner?.toString() ?? null,
    writer: row.writer?.toString() ?? null,
  };
}

function extractNumber(value: CellValue): number | null {
  if (typeof value === "number") {
    return value;
  }
  return parseAvoidingNaN(value?.toString() ?? "");
}

function getFieldMapping(
  triedInput: string | null,
  nameHashMap: NameHashMap,
  defaultName: string
): MappableData {
  const id = triedInput === null ? -1 : nameHashMap[triedInput.toLowerCase()];
  const entityName =
    id != null && triedInput != null ? triedInput.toLowerCase() : defaultName;
  return {
    triedInput,
    value: id,
    entityName,
  };
}

function getTagsMapping(
  triedInput: string | null,
  nameHashMap: NameHashMap
): MappableData<number[]> {
  if (triedInput == null) {
    return {
      triedInput,
      value: null,
      entityName: upperFirst(t("tag.untagged.plural")),
    };
  }
  const triedTags = triedInput.split(";") ?? [];
  const mappedTagIds = triedTags.map(triedTag => {
    const trimedTriedTag = triedTag.trim();
    const id = nameHashMap[trimedTriedTag.toLowerCase()];
    const tagName = id != null ? trimedTriedTag.toLowerCase() : null;
    return {
      id,
      tagName,
    };
  });

  const allFailed = mappedTagIds.every(tagId => tagId.id == null);

  return {
    triedInput,
    value: !allFailed ? mappedTagIds.map(tag => tag.id) : undefined,
    entityName: !allFailed
      ? mappedTagIds
          .flatMap(({ tagName }) => (tagName != null ? [tagName] : []))
          .join(", ")
      : upperFirst(t("tag.untagged.plural")),
  };
}

export { entryDataKeys, hashMapRowToRawEntryData, buildDataMapper };
