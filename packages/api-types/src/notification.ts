export interface NotificationContent {
  title: string | null | undefined;
  content: string;
  link: string | null | undefined;
}

export interface Notification {
  id: number;
  data: NotificationContent;
  timestamp: number;
  groupId: number;
}
