import { EntryData } from "@reducers/dataImport/entryDataReducer";

export type EntryDataKey = keyof EntryData;

export type ColumnSetting = {
  name: ColumnName;
  entryDataKey: EntryDataKey;
  isVisible: boolean;
};

export enum ColumnName {
  CATEGORY = "activity.category.category",
  ACTIVITY_MODEL = "activity.activity",
  SITE = "site.site",
  PRODUCT = "product.product",
  INPUT_INSTRUCTION = "entry.instruction.instruction",
  TAGS = "tags",
  COMPUTE_METHOD = "entry.computeMethod.computeMethod",
  EMISSION_FACTOR = "footprint.emission.emissionFactor.emissionFactor",
  INPUT_1 = "dataImport.fields.input1",
  INPUT_2 = "dataImport.fields.input2",
  COMMENT = "entry.comment.comment.singular",
  SOURCE = "entry.comment.source",
  OWNER = "dataImport.fields.owner",
  WRITER = "dataImport.fields.writer",
  INPUT_1_UNIT = "dataImport.fields.input1Unit",
  INPUT_2_UNIT = "dataImport.fields.input2Unit",
}

export const MAX_DISPLAYED_COLUMN_NUMBER = 7;

export const INITIAL_COLUMNS_SETTINGS: ColumnSetting[] = [
  {
    name: ColumnName.CATEGORY,
    entryDataKey: "activityCategory",
    isVisible: true,
  },
  {
    name: ColumnName.ACTIVITY_MODEL,
    entryDataKey: "activityModel",
    isVisible: true,
  },
  {
    name: ColumnName.SITE,
    entryDataKey: "site",
    isVisible: true,
  },
  {
    name: ColumnName.PRODUCT,
    entryDataKey: "product",
    isVisible: true,
  },
  {
    name: ColumnName.INPUT_INSTRUCTION,
    entryDataKey: "inputInstruction",
    isVisible: true,
  },
  {
    name: ColumnName.COMPUTE_METHOD,
    entryDataKey: "computeMethod",
    isVisible: true,
  },
  {
    name: ColumnName.EMISSION_FACTOR,
    entryDataKey: "emissionFactor",
    isVisible: true,
  },
  {
    name: ColumnName.INPUT_1,
    entryDataKey: "input1",
    isVisible: true,
  },
  {
    name: ColumnName.INPUT_1_UNIT,
    entryDataKey: "input1Unit",
    isVisible: true,
  },
  {
    name: ColumnName.INPUT_2,
    entryDataKey: "input2",
    isVisible: true,
  },
  {
    name: ColumnName.INPUT_2_UNIT,
    entryDataKey: "input2Unit",
    isVisible: true,
  },
  {
    name: ColumnName.TAGS,
    entryDataKey: "tags",
    isVisible: true,
  },
  {
    name: ColumnName.COMMENT,
    entryDataKey: "commentary",
    isVisible: true,
  },
  {
    name: ColumnName.SOURCE,
    entryDataKey: "source",
    isVisible: true,
  },
  {
    name: ColumnName.OWNER,
    entryDataKey: "owner",
    isVisible: true,
  },
  {
    name: ColumnName.WRITER,
    entryDataKey: "writer",
    isVisible: true,
  },
];

export const columnsAllowedToBeHidden: { [key in EntryDataKey]?: true } = {
  inputInstruction: true,
  site: true,
  product: true,
  owner: true,
  writer: true,
  commentary: true,
  source: true,
};

export const cartographyAssociationIgnoredColumns: EntryDataKey[] = [
  "computeMethod",
  "emissionFactor",
];
