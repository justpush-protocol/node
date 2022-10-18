import { Notification } from './notification';
export interface AddGroupResponse {}

export interface AddNotificationResponse {
  notificationId: number;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
}

export interface SubscribeResponse {}

export interface UnsubscribeResponse {}
