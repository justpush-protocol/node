import { pubsub } from './polling';

export const resolvers = {
  Subscription: {
    notificationAdded: {
      subscribe: async (
        _parent: any,
        args: { userId: string; media: string },
        _context: any,
        _info: any
      ) => {
        const { userId, media } = args;
        return pubsub.asyncIterator([`notifications_${userId}`]);
      }
    }
  }
};
