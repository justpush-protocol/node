import { NotificationContent } from './notification';

export interface AddGroupRequest {
  id: number;
  name: string;
  owner: string;
  description: string | undefined;
  image: string | undefined;
  website: string | undefined;
}

export interface AddNotificationRequest {
  groupId: number;
  to: string;
  notification: NotificationContent;
  broadcast: boolean;
  self: boolean;
  timestamp: number;
}

export interface GetNotificationsRequest {
  groupId: number;
  limit?: number;
  offset?: number;
}

export interface SubscribeRequest {
  groupId: number;
}

export interface UnsubscribeRequest {
  groupId: number;
}
