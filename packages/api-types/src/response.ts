import { Notification } from './notification';
export interface AddGroupResponse {}

export interface ListGroupResponse {
  groups: {
    id: string;
    name: string;
    owner: string;
    description: string | null;
    image: string | null;
    website: string | null;
  }[];
}

export interface AddNotificationResponse {
  notificationId: string;
}

export interface GetNotificationsByGroupResponse {
  notifications: Notification[];
}

export interface GetNotificationsResponse {
  notifications: Notification[];
}

export interface SubscribeResponse {}

export interface UnsubscribeResponse {}
