import axios from 'axios';
import logger from './logger';
import { getTronWeb, getTronGridURL } from './tronweb';
import { Event as JustPushEvent } from './event';
import {
  modelAddNotification,
  modelGetListenerData,
  modelUpdatelastQueryTimestamp
} from '@justpush/just-push-common';
import { v4 } from 'uuid';

export const listenToContractEvents = async ({
  contractAddress
}: {
  contractAddress: string;
}) => {
  const host = getTronGridURL(process.env.NETWORK as string);
  const monitorInterval = 2000;

  while (true) {
    console.log(`Waiting for ${monitorInterval}ms before quering again\n\n`);
    await new Promise((resolve) => setTimeout(resolve, monitorInterval));

    const config = await modelGetListenerData();
    try {
      const result = await axios.get<{ data: JustPushEvent[] }>(
        `${host}/v1/contracts/${contractAddress}/events`,
        {
          headers: {
            'TRON-PRO-API-KEY': process.env.TRON_PRO_API as string
          },
          params: {
            min_block_timestamp: parseInt(config.lastQueryTimestamp) + 1000,
            order_by: 'block_timestamp,desc',
            limit: 50
          }
        }
      );
      if (result.data.data.length == 0) {
        continue;
      }

      const { block_timestamp, block_number } = result.data.data[0];
      await modelUpdatelastQueryTimestamp(block_timestamp, block_number);

      handleEvents(result.data.data);
    } catch (e) {
      logger.error(e);
    }
  }
};

const handleEvents = async (events: JustPushEvent[]) => {
  for (let index = 0; index < events.length; index++) {
    const event = events[index];
    switch (event.event_name) {
      case 'BroadcastNotificationSent':
        handleBroadcastNotificationSent(event);
        break;
      case 'DirectNotificationSent':
        handleDirectNotificationSent(event);
        break;
      default:
        logger.warn('[TODO] Unhandled event: ' + event.event_name);
        console.log(event);
    }
  }
};

const handleBroadcastNotificationSent = (event: JustPushEvent) => {
  const { title, content, groupId } = event.result;
  modelAddNotification({
    id: v4(),
    groupId: groupId,
    userId: undefined,
    title: title,
    content: content,
    timestamp: Math.floor(event.block_timestamp / 1000),
    broadcast: true,
    self: false,
    link: undefined
  });
};

const handleDirectNotificationSent = (event: JustPushEvent) => {
  console.log(event.result);
  const tronWeb = getTronWeb();
  const { title, content, receiver, groupId } = event.result;

  const recieverAddress = tronWeb.address.fromHex(receiver);
  modelAddNotification({
    id: v4(),
    groupId: groupId,
    userId: recieverAddress,
    title: title,
    content: content,
    timestamp: Math.floor(event.block_timestamp / 1000),
    broadcast: false,
    self: false,
    link: undefined
  });
};
