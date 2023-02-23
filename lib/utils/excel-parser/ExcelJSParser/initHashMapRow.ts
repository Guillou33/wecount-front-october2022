import { HashMapRow } from "../ExcelParserInterface";

function initHashMapRow<Keys extends string>(keys: readonly Keys[]): HashMapRow<Keys> {
  const initialEntries = keys.map(key => [key, null]);
  return Object.fromEntries(initialEntries);
}

export default initHashMapRow;
