import { useEffect } from "react";
import { Provider } from "react-redux";
import { IssuesDialog } from "src/content/containers/Dialog.tsx";
import { DialogTabs } from "src/content/containers/DialogTabs.tsx";
import { getIssues, onIssuesChange } from "src/storage";
import type { Issue } from "src/types/Issue.ts";
import {
  isDismissIssues,
  isMessage,
  isNewEmails,
  isNewIssues,
} from "src/types/Message.ts";
import { actions } from "store/contentSlice.ts";
import { store } from "store/index.ts";
import browser from "webextension-polyfill";

import "src/globals.css";

export function App() {
  useEffect(() => {
    const appId = browser.runtime.id;

    const listenMessages = (msg: unknown) => {
      if (!isMessage(appId, msg)) return;

      if (isNewIssues(msg)) {
        store.dispatch(actions.setNewIssues(msg.payload));
        return;
      }

      if (isNewEmails(msg)) {
        return;
      }

      if (isDismissIssues(msg)) {
        return;
      }

      msg satisfies never;
    };

    const listenIssues = (issues: Map<string, Issue>) =>
      store.dispatch(actions.historyUpdate(Array.from(issues.values())));

    browser.runtime.onMessage.addListener(listenMessages);
    const unsubscribe = onIssuesChange(listenIssues);
    getIssues().then(listenIssues);

    return () => {
      browser.runtime.onMessage.removeListener(listenMessages);
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <IssuesDialog>
        <DialogTabs />
      </IssuesDialog>
    </Provider>
  );
}
