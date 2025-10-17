import * as React from "react";
import { Issue } from "src/types/Issue";
import { Button } from "ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "ui/item";

interface IssuesListProps {
  issues: Issue[];
  onDismiss: (email: string) => void;
}

export function IssuesList({ issues, onDismiss }: IssuesListProps) {
  const handleDismiss = (email: string) => {
    if (onDismiss) {
      onDismiss(email);
    }
  };

  if (issues.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-2">Issues</h3>
        <p className="text-sm text-muted-foreground">
          No issues found. Your anonymizer is working correctly.
        </p>
      </div>
    );
  }

  return (
    <ItemGroup>
      {issues.map((issue, index) => (
        <React.Fragment key={issue.email}>
          {index > 0 && <ItemSeparator />}
          <Item>
            <ItemContent>
              <ItemTitle>{issue.email}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button
                disabled={Issue.isDismissed(issue)}
                onClick={() => handleDismiss(issue.email)}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {Issue.isDismissed(issue) ? "Dismissed" : "Dismiss"}
              </Button>
            </ItemActions>
          </Item>
        </React.Fragment>
      ))}
    </ItemGroup>
  );
}
