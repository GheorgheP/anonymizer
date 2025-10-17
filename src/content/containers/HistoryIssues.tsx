import { IssuesList } from "layouts/IssuesList.tsx";
import { actions, selectors } from "store/contentSlice.ts";
import { useAppDispatch, useAppSelector } from "store/hooks.ts";

export function HistoryIssues() {
  const issues = useAppSelector(selectors.historyFilteredIssues);
  const dispatch = useAppDispatch();

  return (
    <IssuesList
      issues={issues}
      onDismiss={(issue) => dispatch(actions.dismiss(issue))}
    />
  );
}
