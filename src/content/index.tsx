import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import {
  isDismissIssues,
  isMessage,
  isNewEmails,
  isNewIssues,
  type NewEmails,
} from "../types/Message.ts";
import { App } from "./App.tsx";

window.addEventListener("message", (e) => {
  const runtimeId = browser.runtime.id;
  if (!isMessage(runtimeId, e.data)) return;

  if (isNewEmails(e.data)) {
    browser.runtime.sendMessage<NewEmails>(e.data);
    return;
  }

  if (isNewIssues(e.data)) return;
  if (isDismissIssues(e.data)) return;

  e.data satisfies never;
});

const rootNode = document.createElement("div");
document.body.appendChild(rootNode);

const root = createRoot(rootNode);
root.render(<App />);
