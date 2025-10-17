import browser, { Storage } from "webextension-polyfill";
import type { Issue } from "../types/Issue";

import StorageAreaOnChangedChangesType = Storage.StorageAreaOnChangedChangesType;

export const getIssues = () =>
  browser.storage.local
    .get("issues")
    .then((v) => new Map(issuesToMap((v["issues"] as Issue[]) ?? [])));

export const setIssues = (issues: Map<string, Issue>) =>
  browser.storage.local.set({ issues: Array.from(issues.values()) });

export const onIssuesChange = (
  callback: (issues: Map<string, Issue>) => void,
): (() => void) => {
  const cb = (changes: StorageAreaOnChangedChangesType) => {
    if (changes["issues"]) {
      callback(issuesToMap(changes["issues"].newValue as Issue[]));
    }
  };
  browser.storage.local.onChanged.addListener(cb);

  return () => {
    browser.storage.local.onChanged.removeListener(cb);
  };
};

function issuesToMap(issues: Issue[]): Map<string, Issue> {
  return new Map(issues.map((issue) => [issue.email, issue]));
}
