import { Workbook, Worksheet } from "exceljs";

import {
  ExcelParserInterface,
  Sheet,
  CellValue,
  ParseSheetArgs,
  ParseAsHashMapArgs,
  HashMapSheet,
} from "../ExcelParserInterface";

import adaptCellValue from "./adaptCellValue";
import initHashMapRow from "./initHashMapRow";

class ExcelJSParser implements ExcelParserInterface {
  private workbook: Workbook;
  constructor() {
    this.workbook = new Workbook();
  }

  private getSheet(sheet: number | string): Worksheet | undefined {
    return typeof sheet === "number"
      ? this.workbook.worksheets[sheet]
      : this.workbook.getWorksheet(sheet);
  }

  async load(file: File) {
    this.workbook = await this.workbook.xlsx.load(await file.arrayBuffer());
  }

  parseAsArray({ sheet, ignoreFirstRow = false }: ParseSheetArgs): Sheet {
    const adaptedSheet: Sheet = [];

    this.getSheet(sheet)?.eachRow((row, index) => {
      if (!ignoreFirstRow || index !== 1) {
        const cells: CellValue[] = [];
        row.eachCell({ includeEmpty: true }, cell => {
          cells.push(adaptCellValue(cell));
        });
        adaptedSheet.push(cells);
      }
    });

    return adaptedSheet;
  }

  parseAsHashMap<Keys extends string>({
    sheet,
    ignoreFirstRow,
    mapping,
  }: ParseAsHashMapArgs<Keys>): HashMapSheet<Keys> {
    const adaptedSheet: HashMapSheet<Keys> = [];

    this.getSheet(sheet)?.eachRow((row, index) => {
      if (!ignoreFirstRow || index !== 1) {
        const cells = initHashMapRow(mapping);
        row.eachCell({ includeEmpty: true }, (cell, index) => {
          const column = mapping[index - 1];
          if (column != null) {
            cells[column] = adaptCellValue(cell);
          }
        });
        adaptedSheet.push(cells);
      }
    });

    return adaptedSheet;
  }
}

export default ExcelJSParser;
