import { prisma } from './client';
import { Prisma, Notification, Group } from '@prisma/client';
import { group } from 'console';
import { ListenerData } from '@prisma/client';

export const addNotification = async ({
  id,
  groupId,
  userId,
  title,
  content,
  link,
  broadcast,
  self,
  timestamp
}: {
  id: string;
  groupId: string;
  userId: string | undefined;
  title: string | undefined | null;
  link: string | undefined | null;
  content: string;
  broadcast: boolean;
  self: boolean;
  timestamp: number;
}): Promise<string> => {
  if (!broadcast && userId && userId !== '') {
    userId = await createUserIfNotExists(userId);
  }

  const notification = await prisma.notification.create({
    data: {
      id,
      groupId,
      userId: userId && userId !== '' ? userId : undefined,
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

export const getNotificatios = async ({
  userId,
  offset,
  limit,
  cursor
}: {
  userId: string;
  offset?: number;
  limit?: number;
  cursor?: string;
}): Promise<(Notification & { group: Group })[]> => {
  // find subscribed groups
  const groups = await listGroups({
    caller: userId,
    owned: false,
    skip: undefined,
    take: undefined,
    subscribed: true
  });

  const where: Prisma.NotificationWhereInput = {
    OR: [
      {
        userId
      },
      {
        AND: [
          {
            groupId: {
              in: groups.map((group) => group.id)
            }
          },
          {
            broadcast: true
          }
        ]
      }
    ]
  };

  let filter: Prisma.NotificationFindManyArgs;
  if (cursor) {
    filter = {
      where,
      cursor: {
        id: cursor
      },
      skip: 1,
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        group: true
      }
    };
  } else {
    filter = {
      where,
      take: limit,
      skip: offset,
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        group: true
      }
    };
  }
  // user notifications
  const notifications = (await prisma.notification.findMany(
    filter
  )) as (Notification & { group: Group })[];
  // return paginated
  return notifications;
};

export const getNotificationsByGroup = async ({
  userId,
  groupId,
  skip = 0,
  take = 10
}: {
  userId: string;
  groupId: string;
  skip: number | undefined;
  take: number | undefined;
}): Promise<[Notification[], Group]> => {
  let filter: Prisma.NotificationFindManyArgs;

  if (userId) {
    userId = await createUserIfNotExists(userId);
  }

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

  return [
    await prisma.notification.findMany(filter),
    (await prisma.group.findFirst({ where: { id: groupId } })) as Group
  ];
};

export const addGroup = async ({
  id,
  name,
  description,
  image,
  website,
  owner
}: {
  id: string;
  name: string;
  owner: string;
  description: string | undefined;
  image: string | undefined;
  website: string | undefined;
}) => {
  const existing = await prisma.group.findFirst({
    where: {
      id
    }
  });
  if (existing) return;
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

export const listGroups = async ({
  subscribed = false,
  owned = false,
  caller,
  skip = 0,
  take = 10
}: {
  owned?: boolean;
  caller: string;
  subscribed?: boolean;
  skip: number | undefined;
  take: number | undefined;
}): Promise<Group[]> => {
  let filter: Prisma.GroupFindManyArgs;

  if (owned) {
    filter = {
      where: {
        owner: caller
      },
      skip,
      take,
      distinct: 'id'
    };
  } else if (subscribed) {
    caller = await createUserIfNotExists(caller);
    filter = {
      where: {
        Subscriptions: {
          some: {
            userId: caller
          }
        }
      },
      skip,
      take,
      distinct: 'id'
    };
  } else {
    filter = {
      skip,
      take,
      distinct: 'id'
    };
  }

  let result = await prisma.group.findMany(filter);
  return result;
};

export const addSubscription = async ({
  groupId,
  userId
}: {
  userId: string;
  groupId: string;
}) => {
  if (userId) {
    userId = await createUserIfNotExists(userId);
  }

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
  groupId: string;
}) => {
  if (userId) {
    userId = await createUserIfNotExists(userId);
  }

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

export const getGroup = async (groupId: string) => {
  return await prisma.group.findFirst({
    where: {
      id: groupId
    }
  });
};
const createUserIfNotExists = async (publicKey: string): Promise<string> => {
  // find userid from prisma
  let user = await prisma.user.findFirst({
    where: {
      userId: publicKey
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        userId: publicKey
      }
    });
  }

  return user.userId;
};

export const getAllUserIds = async () => {
  const result = await prisma.user.findMany({});
  return result;
};

const LISTENER_ID = 'SETTINGS';
const firstTimstamp = '1667595939000';
const blockNumberFrom = 28843124;
export const getListenerData = async (): Promise<ListenerData> => {
  let config = await prisma.listenerData.findFirst({
    where: {
      id: LISTENER_ID
    }
  });

  if (!config) {
    config = await prisma.listenerData.create({
      data: {
        id: LISTENER_ID,
        lastQueryTimestamp: firstTimstamp,
        lastQueryBlockNumber: blockNumberFrom
      }
    });
  }

  return config;
};

export const updatelastQueryTimestamp = async (
  timestamp: number,
  blockNumber: number
) => {
  await prisma.listenerData.update({
    where: {
      id: LISTENER_ID
    },
    data: {
      lastQueryTimestamp: `${timestamp}`,
      lastQueryBlockNumber: blockNumber
    }
  });
};
