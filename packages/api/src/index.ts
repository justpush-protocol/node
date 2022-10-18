import express, { Express, Request, Response } from 'express';
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
import dotenv from 'dotenv';
import {
  addGroup,
  addNotification,
  getNotifications,
  subscribe,
  unsubscribe
} from './lib';
import { verify } from './verification';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();

const app: Express = express();
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post(
  '/notification/get',
  (
    req: Request<GetNotificationsRequest>,
    res: Response<GetNotificationsResponse>
  ) => {
    const user = req.headers['x-public-key'];
    if (!user || typeof user !== 'string') {
      res.status(400).send();
    }

    getNotifications(user as string, req.body)
      .then(res.json)
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

app.post(
  '/notification/new',
  (
    req: Request<AddNotificationRequest>,
    res: Response<AddNotificationResponse>
  ) => {
    // verify(req, res);
    addNotification(req.body)
      .then(res.json)
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

// call this while calling the smart contract to create group
app.post(
  '/group/new',
  (req: Request<AddGroupRequest>, res: Response<AddGroupResponse>) => {
    // verify(req, res);
    addGroup(req.body)
      .then((result) => {
        console.log('###########');
        console.log(result);
        res.json(result);
      })
      .catch((e: { code?: number }) => {
        console.log('00000000');
        console.error(e);
        res.status(e.code ? e.code : 500).send();
      });
  }
);

app.post(
  '/group/subscribe',
  (req: Request<SubscribeRequest>, res: Response<SubscribeResponse>) => {
    // verify(req, res);
    const user = req.headers['x-public-key'];
    if (!user || typeof user !== 'string') {
      res.status(400).send();
    }
    subscribe(user as string, req.body)
      .then(res.json)
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

app.post(
  '/group/unsubscribe',
  (req: Request<UnsubscribeRequest>, res: Response<UnsubscribeResponse>) => {
    // verify(req, res);
    const user = req.headers['x-public-key'];
    if (!user || typeof user !== 'string') {
      res.status(400).send();
    }
    unsubscribe(user as string, req.body)
      .then(res.json)
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
