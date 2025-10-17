import type { ReactElement, ReactNode } from "react";
import { HistoryTab } from "src/content/containers/HistoryTab.tsx";
import { NewIssuesTab } from "src/content/containers/NewIssuesTab.tsx";
import { actions, selectors } from "store/contentSlice.ts";
import { useAppDispatch, useAppSelector } from "store/hooks.ts";
import type { RootState } from "store/index.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs.tsx";

export interface DialogTabsProps {
  children?: ReactNode;
}

export function DialogTabs(p: DialogTabsProps) {
  const tab = useAppSelector(selectors.activeTab);
  const dispatch = useAppDispatch();

  return (
    <Tabs
      value={tab}
      onValueChange={(v) =>
        dispatch(actions.switchTab(v as RootState["content"]["activeTab"]))
      }
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value={tab} className="space-y-4">
        <TabContent />
      </TabsContent>
    </Tabs>
  );
}

function TabContent(): ReactElement {
  const activeTab = useAppSelector(selectors.activeTab);

  switch (activeTab) {
    case "issues":
      return <NewIssuesTab />;
    case "history":
      return <HistoryTab />;
  }
}
