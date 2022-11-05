import {
  AddNotificationRequest,
  AddNotificationResponse,
  SubscribeRequest,
  SubscribeResponse,
  UnsubscribeRequest,
  UnsubscribeResponse
} from '@justpush/api-types';
import express, { Request, Response } from 'express';
import { addNotification, subscribe, unsubscribe } from '../lib';
import { hasSignature, hasUser } from '../middleware';
const router = express.Router();

// TODO: Enable these
// router.use(hasSignature);
// router.use(verifyUser);
router.use(hasUser);
router.post(
  '/notification/new',
  (
    req: Request<AddNotificationRequest>,
    res: Response<AddNotificationResponse>
  ) => {
    // verify(req, res);
    addNotification(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

router.post(
  '/group/subscribe',
  (req: Request<SubscribeRequest>, res: Response<SubscribeResponse>) => {
    // verify(req, res);
    subscribe(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

router.post(
  '/group/unsubscribe',
  (req: Request<UnsubscribeRequest>, res: Response<UnsubscribeResponse>) => {
    // verify(req, res);
    unsubscribe(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

export default router;
