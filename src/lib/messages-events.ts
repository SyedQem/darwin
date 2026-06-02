export const MESSAGES_READ_EVENT = 'darwin:messages-read';

export type MessagesReadDetail = { cleared?: number };

export function notifyMessagesRead(cleared?: number) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<MessagesReadDetail>(MESSAGES_READ_EVENT, {
        detail: { cleared },
      })
    );
  }
}
