import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { areComputeMethodEqual } from "./computeMethod";

function areEntryDataEquals(a: EntryData, b: EntryData): boolean {
  return (
    a.id === b.id &&
    a.activityCategory.value === b.activityCategory.value &&
    a.activityModel.value === b.activityModel.value &&
    a.site.value === b.site.value &&
    a.product.value === b.product.value &&
    a.owner.value === b.owner.value &&
    a.writer.value === b.writer.value &&
    a.source === b.source &&
    a.inputInstruction === b.inputInstruction &&
    a.commentary === b.commentary &&
    areComputeMethodEqual(a.computeMethod, b.computeMethod) &&
    a.emissionFactor?.id === b.emissionFactor?.id &&
    a.input1 === b.input1 &&
    a.input2 === b.input2 &&
    a.tags.value === b.tags.value &&
    a.input1Unit === b.input1Unit &&
    a.input2Unit === b.input2Unit
  );
}

export default areEntryDataEquals;
