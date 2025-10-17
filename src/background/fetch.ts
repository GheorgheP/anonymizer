import browser from "webextension-polyfill";
import type { NewEmails } from "../types/Message";

/**
 * Inject a script in `MAIN` world to overwrite `fetch` function,
 * to intercept requests to ChatGPT conversation API,
 * decode the body, anonymize email addresses, and
 * send the anonymized emails to the background script.
 *
 * Content scripts run in a different context the main scripts, thas's why we cannot overwrite fetch function with a content script.
 *
 * For more beautiful code we could inject a file to the page context. However, it's not possible to access the
 * Chrome extension APIs from there, and cannot get access to runtime id that is used in message passing.
 *
 * Also all the code is inside the function because inside the callback cannot access functon and values from the outer scope.
 * This is because the callback is executed in a different context.
 */

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "loading" &&
    tab.url &&
    tab.url.startsWith("https://chatgpt.com/")
  ) {
    browser.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      args: [browser.runtime.id],
      func: (appId: string) => {
        const _fetch = window.fetch;

        /**
         * Custom fetch implementation that decodes JSON bodies.
         * @param input
         * @param init
         */
        function fetch(
          input: RequestInfo | URL,
          init?: RequestInit,
        ): Promise<Response> {
          if (
            typeof init?.body !== "string" ||
            typeof input !== "string" ||
            !input.startsWith("https://chatgpt.com/backend-api/f/conversation")
          ) {
            return _fetch(input, init);
          }

          const decodedBody = decodeBody(init.body);

          if (decodedBody) {
            const body = handleBody(decodedBody);
            return _fetch(input, {
              ...init,
              body: body ? JSON.stringify(body) : undefined,
            });
          }

          return _fetch(input, init);
        }

        window.fetch = fetch;

        function decodeBody(body: string): object | undefined {
          try {
            const result = JSON.parse(body);

            return typeof result === "object"
              ? (result ?? undefined)
              : undefined;
          } catch {
            return undefined;
          }
        }

        function handleBody(body: object) {
          const r = anonymizeEmail(body);

          if (r.emails.length) {
            const newEmails: NewEmails = {
              payload: r.emails,
              id: appId,
              type: "NewEmails",
            };
            /**
             * We use window.postMessage to communicate with the content script, that will send them to the background script.
             * We cannot use chrome.runtime.sendMessage directly from here, because this script is injected into the page context,
             * and does not have access to the Chrome extension APIs.
             */
            window.postMessage(newEmails);
          }
          return r.body;
        }

        function anonymizeEmail<T extends object>(
          body: T,
        ): {
          body: T;
          anonymized: boolean;
          emails: string[];
        } {
          if (!isBody(body)) {
            return {
              body,
              anonymized: false,
              emails: [],
            };
          }

          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const emailsSet = new Set<string>();

          const messages: Body["messages"] = body.messages.map((msg) => {
            if (isMessage(msg)) {
              return {
                author: msg.author,
                content: {
                  content_type: msg.content.content_type,
                  parts: msg.content.parts.map((part) => {
                    return part.replace(emailRegex, (match) => {
                      emailsSet.add(match);
                      return "[EMAIL_ADDRESS]";
                    });
                  }),
                },
              } satisfies ChatGptMessage;
            }

            return msg;
          });

          if (emailsSet.size === 0) {
            return {
              body,
              anonymized: false,
              emails: [],
            };
          }

          return {
            body: {
              ...body,
              messages,
            } as T,
            anonymized: true,
            emails: Array.from(emailsSet),
          };
        }

        function isBody(obj: object): obj is Body {
          if (obj === null) return false;

          const _body = obj as Partial<Body>;

          if (!Array.isArray(_body?.messages) || _body.messages.length === 0)
            return false;

          return _body?.messages?.some(isMessage);
        }

        function isMessage(obj: unknown): obj is ChatGptMessage {
          if (typeof obj !== "object" || obj === null) return false;

          const _message = obj as Partial<ChatGptMessage>;

          if (_message?.author?.role !== "user") return false;
          if (
            typeof _message?.content?.content_type !== "string" ||
            _message?.content?.content_type !== "text"
          )
            return false;
          if (!Array.isArray(_message?.content?.parts)) return false;
          if (_message?.content?.parts.length === 0) return false;

          return _message.content.parts.every((v) => typeof v === "string");
        }
      },
    });
  }
});

interface ChatGptMessage {
  author: {
    role: "user";
  };
  content: {
    content_type: "text";
    parts: string[];
  };
}

interface Body {
  messages: (ChatGptMessage | unknown)[];
}
