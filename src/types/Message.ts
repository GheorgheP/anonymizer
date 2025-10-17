import type { Issue } from "./Issue.ts";

// region Messages
export type Message = NewEmails | NewIssues | DismissIssues;

export const isMessage = (id: string, s: unknown): s is Message => {
  return (
    typeof s === "object" &&
    s !== null &&
    "id" in s &&
    s.id === id &&
    "type" in s &&
    typeof s.type === "string"
  );
};
// endregion

// region NewEmails
export interface NewEmails {
  id: string;
  type: "NewEmails";
  payload: string[];
}

export const newEmails = (
  id: string,
  payload: NewEmails["payload"],
): NewEmails => ({
  id,
  type: "NewEmails",
  payload,
});

export const isNewEmails = (s: Message): s is NewEmails =>
  s.type === "NewEmails";
// endregion

// region NewIssues
export interface NewIssues {
  id: string;
  type: "NewIssues";
  payload: Issue[];
}

export const newIssues = (
  id: string,
  payload: NewIssues["payload"],
): NewIssues => ({
  id,
  type: "NewIssues",
  payload,
});

export const isNewIssues = (s: Message): s is NewIssues =>
  s.type === "NewIssues";
// endregion

// region DismissIssues
export interface DismissIssues {
  id: string;
  type: "DismissIssues";
  payload: string[];
}

export const dismissIssues = (
  id: string,
  payload: DismissIssues["payload"],
): DismissIssues => ({
  id,
  type: "DismissIssues",
  payload,
});

export const isDismissIssues = (s: Message): s is DismissIssues =>
  s.type === "DismissIssues";
// endregion
