export type CellValue = string | number | boolean | null;

export type Row = CellValue[];
export type Sheet = Row[];

export type HashMapRow<Keys extends string> = { [key in Keys]: CellValue };
export type HashMapSheet<Keys extends string> = HashMapRow<Keys>[];

export interface ParseSheetArgs {
  sheet: number | string;
  ignoreFirstRow?: boolean;
};

export interface ParseAsHashMapArgs<Keys extends string> extends ParseSheetArgs {
  mapping: readonly Keys[];
};

export interface ExcelParserInterface {
  load(file: File): void;
  parseAsArray({ sheet, ignoreFirstRow }: ParseSheetArgs): Sheet;
  parseAsHashMap<Keys extends string>(
    {mapping}: ParseAsHashMapArgs<Keys>
  ): HashMapSheet<Keys>;
}
