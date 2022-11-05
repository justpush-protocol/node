import { PubSub } from 'graphql-subscriptions';
import { Notification, Group } from '@prisma/client';
import {
  modelGetAllUserIs,
  modelGetNotificatios
} from '@justpush/just-push-common';

export const pubsub = new PubSub();

interface PollingUsers {
  [key: string]: boolean;
}

let alreadyPolling: PollingUsers = {};
const userListPollingInterval = 1000 * 5;
const notificationPollingInterval = 1000 * 5;

export const startPolling = async () => {
  console.log('Polling started');
  while (true) {
    const users = await modelGetAllUserIs();
    const usersToPoll = users.filter((user) => !alreadyPolling[user.userId]);
    usersToPoll.forEach((user) => {
      alreadyPolling[user.userId] = true;
      poll(user.userId);
    });
    await new Promise((resolve) =>
      setTimeout(resolve, userListPollingInterval)
    );
  }
};

const poll = async (userId: string) => {
  let lastNotificationTimestamp = 0;
  while (true) {
    console.log('Polling for notifications for: ' + userId);
    let notifications: (Notification & { group: Group })[];

    notifications = await modelGetNotificatios({
      userId,
      limit: 50
    });

    if (notifications.length > 0) {
      for (let index = 0; index < notifications.length; index++) {
        const element = notifications[index];
        console.log('element.timestamp', element.timestamp);
        console.log('lastNotificationTimestamp', lastNotificationTimestamp);
        console.log(
          'element.timestamp <= lastNotificationTimestamp',
          element.timestamp <= lastNotificationTimestamp
        );
        console.log('\n');
        if (element.timestamp <= lastNotificationTimestamp) {
          break;
        }
        let addedNotification = {
          id: element.id,
          timestamp: element.timestamp,
          data: {
            title: element.title,
            content: element.content,
            link: element.link
          },
          group: element.group
        };
        pubsub.publish(`notifications_${userId}`, {
          notificationAdded: addedNotification
        });
      }
      lastNotificationTimestamp = notifications[0].timestamp;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, notificationPollingInterval)
    );
  }
};
