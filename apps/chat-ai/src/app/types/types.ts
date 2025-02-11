export type MessageStatus = 'error' | 'loading' | 'loaded';

export interface IMessage {
  message: string;
  answer: string;
  status: MessageStatus;
  errorMessage?: string;
}
