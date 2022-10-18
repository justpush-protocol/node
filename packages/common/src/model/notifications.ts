import { prisma } from './client';
import { Prisma, Notification } from '@prisma/client';

export const addNotification = async ({
  groupId,
  userId,
  title,
  content,
  link,
  broadcast,
  self,
  timestamp
}: {
  groupId: number;
  userId: string | undefined;
  title: string | undefined | null;
  link: string | undefined | null;
  content: string;
  broadcast: boolean;
  self: boolean;
  timestamp: number;
}): Promise<number> => {
  const notification = await prisma.notification.create({
    data: {
      groupId,
      userId,
      title,
      link,
      content,
      broadcast,
      self,
      timestamp
    }
  });
  return notification.id;
};

export const getNotifications = async ({
  userId,
  groupId,
  skip = 0,
  take = 10
}: {
  userId: string;
  groupId: number | undefined;
  skip: number | undefined;
  take: number | undefined;
}): Promise<Notification[]> => {
  let filter: Prisma.NotificationFindManyArgs;

  if (groupId) {
    filter = {
      where: {
        OR: [
          {
            groupId,
            userId
          },
          {
            groupId,
            broadcast: true
          }
        ]
      },
      skip,
      take,
      distinct: 'id'
    };
  } else {
    filter = {
      where: {
        userId
      },
      skip,
      take,
      distinct: 'id'
    };
  }

  return await prisma.notification.findMany(filter);
};

export const addGroup = async ({
  id,
  name,
  description,
  image,
  website,
  owner
}: {
  id: number;
  name: string;
  owner: string;
  description: string | undefined;
  image: string | undefined;
  website: string | undefined;
}) => {
  return await prisma.group.create({
    data: {
      owner,
      id,
      name,
      description,
      image,
      website
    }
  });
};

export const addSubscription = async ({
  groupId,
  userId
}: {
  userId: string;
  groupId: number;
}) => {
  const existing = await prisma.subscriptions.findFirst({
    where: {
      userId,
      groupId
    }
  });

  if (!existing) {
    await prisma.subscriptions.create({
      data: {
        userId,
        groupId
      }
    });
  }

  return;
};

export const removeSubscription = async ({
  groupId,
  userId
}: {
  userId: string;
  groupId: number;
}) => {
  const existing = await prisma.subscriptions.findFirst({
    where: {
      userId,
      groupId
    }
  });

  if (existing) {
    await prisma.subscriptions.delete({
      where: {
        id: existing.id
      }
    });
  }
};
