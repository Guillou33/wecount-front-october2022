import { ReglementationTable } from "@lib/wecount-api/responses/apiResponses";

function formatReglementationTableStructure(
  reglementationTables: ReglementationTable[]
): Record<string, ReglementationTable> {
  return reglementationTables.reduce((acc, reglementationTable) => {
    acc[reglementationTable.name] = reglementationTable;
    return acc;
  }, {} as Record<string, ReglementationTable>);
}

export default formatReglementationTableStructure;
