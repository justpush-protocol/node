import {
  AddGroupRequest,
  AddGroupResponse,
  AddNotificationRequest,
  AddNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
  UnsubscribeResponse
} from '@justlabs-platform/just-push-api-types';
import {
  modelAddGroup,
  modelAddNotification,
  modelGetNotification,
  modelAddSubscription,
  modelRemoveSubscription
} from '@justlabs-platform/just-push-common';

const debug = true;

export const addGroup = async (
  req: AddGroupRequest
): Promise<AddGroupResponse> => {
  try {
    await modelAddGroup(req);
    return {};
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const addNotification = async (
  request: AddNotificationRequest
): Promise<AddNotificationResponse> => {
  if (
    (request.self && !request.to) ||
    (request.self && request.broadcast) ||
    (request.broadcast && request.to)
  ) {
    throw { code: 400 };
  }

  try {
    const id = await modelAddNotification({
      groupId: request.groupId,
      link: request.notification.link,
      userId: request.to,
      title: request.notification.title,
      content: request.notification.content,
      broadcast: request.broadcast,
      self: request.self,
      timestamp: request.timestamp
    });
    return {
      notificationId: id
    };
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const getNotifications = async (
  user: string,
  request: GetNotificationsRequest
): Promise<GetNotificationsResponse> => {
  try {
    const notifications = await modelGetNotification({
      userId: user,
      groupId: request.groupId,
      take: request.limit,
      skip: request.limit
    });
    return {
      notifications: notifications.map((notification) => ({
        id: notification.id,
        groupId: notification.groupId,
        timestamp: notification.timestamp,
        data: {
          title: notification.title,
          content: notification.content,
          link: notification.link
        }
      }))
    };
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const subscribe = async (
  user: string,
  request: SubscribeRequest
): Promise<SubscribeResponse> => {
  try {
    await modelAddSubscription({
      groupId: request.groupId,
      userId: user
    });
    return {};
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const unsubscribe = async (
  user: string,
  request: UnsubscribeRequest
): Promise<UnsubscribeResponse> => {
  try {
    await modelRemoveSubscription({
      groupId: request.groupId,
      userId: user
    });
    return {};
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};
