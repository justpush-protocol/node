import { NotificationContent } from './notification';

export interface AddGroupRequest {
  id: string;
  name: string;
  owner: string;
  description: string | undefined;
  image: string | undefined;
  website: string | undefined;
}

export interface ListGroupRequest {
  filter?: {
    subscribed?: boolean;
    owned?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface AddNotificationRequest {
  id: string;
  groupId: string;
  to: string;
  notification: NotificationContent;
  broadcast: boolean;
  self: boolean;
  timestamp: number;
}

export interface GetNotificationsByGroupRequest {
  groupId: string;
  limit?: number;
  offset?: number;
}

export interface GetNotificationsRequest {
  limit?: number;
  offset?: number;
}

export interface SubscribeRequest {
  groupId: string;
}

export interface UnsubscribeRequest {
  groupId: string;
}
