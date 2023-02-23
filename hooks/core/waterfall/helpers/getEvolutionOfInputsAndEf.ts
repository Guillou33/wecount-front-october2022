import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesForTrajectory";

function getEvolutionOfInputsAndEf(
  entry1: ActivityEntryExtended | undefined,
  entry2: ActivityEntryExtended | undefined
): [inputEvolution: number, efEvolution: number] {
  const efEvolution =
    entry1?.emissionFactor != null && entry2?.emissionFactor != null
      ? entry2.emissionFactor.value / entry1.emissionFactor.value
      : 1;

  const entry1Result = entry1?.resultTco2 ?? 0;
  const entry2Result = entry2?.resultTco2 ?? 0;

  const evolutionFromEf = entry1Result * efEvolution - entry1Result;

  const evolutionFromInputs = entry2Result - evolutionFromEf - entry1Result;

  return [evolutionFromInputs, evolutionFromEf];
}

export default getEvolutionOfInputsAndEf;
