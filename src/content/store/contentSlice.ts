import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dismissIssues } from "src/types/Message.ts";
import browser from "webextension-polyfill";
import { Issue } from "../../types/Issue";

interface ContentState {
  isOpen: boolean;
  activeTab: "issues" | "history";
  newIssues: string[];
  history: {
    filters: {
      search?: string;
      status: "all" | "active" | "dismissed";
    };
    issues: Issue[];
  };
}

const initialState: ContentState = {
  isOpen: false,
  activeTab: "issues",
  newIssues: [],
  history: {
    filters: {
      search: undefined,
      status: "all",
    },
    issues: [],
  },
};

const historyFilteredIssues = (s: ContentState): Issue[] => {
  const search = s.history.filters.search?.toLowerCase();
  const status = s.history.filters.status;
  return s.history.issues.filter((issue) => {
    const matchesSearch = !search || issue.email.toLowerCase().includes(search);
    const isDismissed = Issue.isDismissed(issue);
    const matchesStatus =
      status === "all" ||
      (status === "active" && !isDismissed) ||
      (status === "dismissed" && isDismissed);
    return matchesSearch && matchesStatus;
  });
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setNewIssues: (state, action: PayloadAction<Issue[]>) => {
      state.newIssues = Array.from(
        new Set([...action.payload.map((v) => v.email), ...state.newIssues]),
      );
      state.isOpen = true;
    },
    close: () => initialState,
    switchTab: (state, action: PayloadAction<"issues" | "history">) => {
      state.activeTab = action.payload;
    },
    historyUpdate: (state, action: PayloadAction<Issue[]>) => {
      state.history.issues = action.payload;
    },
    search: (state, action: PayloadAction<string | undefined>) => {
      state.history.filters.search = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<"all" | "active" | "dismissed">,
    ) => {
      state.history.filters.status = action.payload;
    },
    dismiss: (state, action: PayloadAction<string>) => {
      const issue = state.history.issues.find(
        (i) => i.email === action.payload,
      );

      if (issue) {
        browser.runtime.sendMessage(
          dismissIssues(browser.runtime.id, [issue.email]),
        );
      }
    },
    dismissAll: (state) => {
      const filtered = historyFilteredIssues(state).map((v) => v.email);

      browser.runtime.sendMessage(dismissIssues(browser.runtime.id, filtered));
    },
  },
  selectors: {
    isOpen: (s) => s.isOpen,
    newIssues: (s) =>
      s.history.issues.filter((i) => s.newIssues.includes(i.email)),
    historyIssues: (s) => s.history.issues,
    historyFilteredIssues: historyFilteredIssues,
    filteredHasDismissable: (s) =>
      historyFilteredIssues(s).some((issue) => !Issue.isDismissed(issue)),
    filtersSearch: (s) => s.history.filters.search,
    filtersStatus: (s) => s.history.filters.status,
    activeTab: (s) => s.activeTab,
  },
});

export const actions = contentSlice.actions;
export const selectors = contentSlice.selectors;

export default contentSlice.reducer;
