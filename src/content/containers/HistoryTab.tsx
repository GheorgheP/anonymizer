import { HistoryFilters } from "src/content/containers/HistoryFilters";
import { HistoryIssues } from "src/content/containers/HistoryIssues";

export function HistoryTab() {
  return (
    <>
      <HistoryFilters />
      <HistoryIssues />
    </>
  );
}
