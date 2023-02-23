import {
  Cell as ExcelJSCell,
  CellValue as ExcelJSCellValue,
  ValueType,
} from "exceljs";

import { CellValue } from "../ExcelParserInterface";

function adaptValue(value: ExcelJSCellValue): CellValue {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return null;
}

function adaptCellValue(cell: ExcelJSCell): CellValue {
  if (cell.type === ValueType.Formula) {
    return adaptValue(cell.result);
  }
  if (cell.type === ValueType.Hyperlink) {
    return adaptValue(cell.text);
  }
  return adaptValue(cell.value);
}

export default adaptCellValue;
