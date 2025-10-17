export interface Issue {
  email: string;
  dismissedUntil: number | undefined;
}

export namespace Issue {
  export const create = (email: string): Issue => ({
    email: email,
    dismissedUntil: undefined,
  });

  export const isDismissed = (issue: Issue) => {
    return (
      issue.dismissedUntil !== undefined && issue.dismissedUntil > Date.now()
    );
  };

  export const dismiss = (issue: Issue): Issue => {
    return {
      email: issue.email,
      dismissedUntil: Date.now() + 1000 * 60 * 60 * 24 * 365,
    };
  };
}
