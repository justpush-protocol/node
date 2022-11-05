export interface Event {
  block_number: number;
  block_timestamp: number;
  event_name: string;
  transaction: string;
  result: EventResult;
  fingerprint: string | null | undefined;
}

interface EventResult {
  [key: string]: string;
}
