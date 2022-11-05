export interface NotificationContent {
  title: string | null | undefined;
  content: string;
  link: string | null | undefined;
}

export interface Notification {
  id: string;
  data: NotificationContent;
  timestamp: number;
  group: Group;
}

export interface Group {
  id: string;
  name: string;
  owner: string;
  description: string | null;
  image: string | null;
  website: string | null;
}
