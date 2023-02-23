import { ExcelParserInterface } from "./ExcelParserInterface";
import ExcelJSParser from "./ExcelJSParser/ExcelJSParser";

export enum AvailableParsers {
  excelJs,
}

const DefaultParser = ExcelJSParser;

function createExcelParser(parser?: AvailableParsers): ExcelParserInterface {
  switch (parser) {
    case AvailableParsers.excelJs: {
      return new ExcelJSParser();
    }
    default: {
      return new DefaultParser();
    }
  }
}

export default createExcelParser;
