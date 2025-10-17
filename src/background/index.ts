import browser from "webextension-polyfill";
import { getIssues, setIssues } from "../storage";
import { Issue } from "../types/Issue";
import {
  isDismissIssues,
  isMessage,
  isNewEmails,
  isNewIssues,
  type NewIssues,
} from "../types/Message.ts";

import "./fetch.ts";

browser.runtime.onMessage.addListener(
  async (msg: unknown, _sender: unknown) => {
    const sender = _sender as Sender;
    if (!isMessage(browser.runtime.id, msg)) return;

    if (isNewEmails(msg)) {
      /**
       * When new emails are received, we need to update the issues map.
       */
      const issues = await getIssues();

      msg.payload.forEach((email) => {
        // Do not use set() here, because it will overwrite the existing value.
        // But there may be issues with dismissedUntil
        if (issues.has(email)) return;
        issues.set(email, Issue.create(email));
      });

      await setIssues(issues);

      // Notify about new issues
      const tabId = sender.tab?.id;
      if (tabId) {
        const _newIssues = msg.payload
          .map((e) => issues.get(e))
          .filter((v): v is Issue => !!v && !Issue.isDismissed(v));
        if (_newIssues.length) {
          const newIssues: NewIssues = {
            type: "NewIssues",
            id: browser.runtime.id,
            payload: _newIssues,
          };
          browser.tabs.sendMessage(tabId, newIssues);
        }
      }

      return;
    }

    if (isDismissIssues(msg)) {
      /**
       * When issues are dismissed, we need to update the issues map.
       * Don't really care if the email was dismissed already, just update with the new dismissed value.
       */
      const map = await getIssues();

      const issues = msg.payload
        .map((email) => map.get(email))
        .filter((v): v is Issue => !!v)
        .map(Issue.dismiss);

      if (issues.length) {
        issues.forEach((issue) => {
          map.set(issue.email, issue);
        });

        await setIssues(map);
      }

      return;
    }

    if (isNewIssues(msg)) return;

    msg satisfies never;
  },
);

interface Sender {
  tab?: {
    id: number;
  };
}
