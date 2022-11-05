import { Group } from '@prisma/client';
import {
  AddGroupRequest,
  AddGroupResponse,
  AddNotificationRequest,
  AddNotificationResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  GetNotificationsByGroupRequest,
  GetNotificationsByGroupResponse,
  ListGroupRequest,
  ListGroupResponse,
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
  UnsubscribeResponse,
  Notification
} from '@justpush/api-types/dist';
import {
  modelAddGroup,
  modelListGroup,
  modelAddNotification,
  modelGetNotificatios,
  modelGetNotificationByGroup,
  modelAddSubscription,
  modelRemoveSubscription,
  modelGetGroup
} from '@justpush/just-push-common';

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

export const listGroups = async (
  user: string,
  req: ListGroupRequest
): Promise<ListGroupResponse> => {
  try {
    const groups = await modelListGroup({
      caller: user,
      owned: req.filter?.owned,
      subscribed: req.filter?.subscribed,
      take: req.limit,
      skip: req.limit
    });
    return {
      groups
    };
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const addNotification = async (
  user: string,
  request: AddNotificationRequest
): Promise<AddNotificationResponse> => {
  if (
    (request.self && !request.to) ||
    (request.self && request.broadcast) ||
    (request.broadcast && request.to)
  ) {
    throw { code: 400 };
  }

  const group = await modelGetGroup(request.groupId);

  if (!group) {
    throw { code: 404, message: 'Group does not exist.' };
  }

  if (group.owner !== user) {
    throw { code: 401, message: 'Unauthorize' };
  }

  try {
    const id = await modelAddNotification({
      id: request.id,
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
    const modelNotifications = await modelGetNotificatios({
      userId: user,
      limit: request.limit,
      offset: request.limit
    });

    const notifications: Notification[] = [];
    modelNotifications.forEach((notification) => {
      notifications.push({
        id: notification.id,
        timestamp: notification.timestamp,
        data: {
          title: notification.title,
          content: notification.content,
          link: notification.link
        },
        group: notification.group
      });
    });
    return {
      notifications
    };
  } catch (e) {
    if (debug) console.error(e);
    throw {
      code: 500
    };
  }
};

export const getNotificationsByGroup = async (
  user: string,
  request: GetNotificationsByGroupRequest
): Promise<GetNotificationsByGroupResponse> => {
  try {
    const [modelNotifications, group] = await modelGetNotificationByGroup({
      userId: user,
      groupId: request.groupId,
      take: request.limit,
      skip: request.limit
    });
    return {
      notifications: modelNotifications.map((notification) => ({
        id: notification.id,
        groupId: notification.groupId,
        timestamp: notification.timestamp,
        data: {
          title: notification.title,
          content: notification.content,
          link: notification.link
        },
        group: group as Group
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
