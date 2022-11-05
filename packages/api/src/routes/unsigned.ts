import {
  AddGroupRequest,
  AddGroupResponse,
  GetNotificationsByGroupRequest,
  GetNotificationsByGroupResponse,
  GetNotificationsRequest,
  GetNotificationsResponse,
  ListGroupRequest,
  ListGroupResponse
} from '@justpush/api-types';
import express, { Request, Response } from 'express';
import {
  addGroup,
  getNotifications,
  listGroups,
  getNotificationsByGroup
} from '../lib';
import { hasUser } from '../middleware';

const router = express.Router();
router.use(hasUser);
router.post(
  '/group/new',
  (req: Request<AddGroupRequest>, res: Response<AddGroupResponse>) => {
    // verify(req, res);
    addGroup(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) => {
        res.status(e.code ? e.code : 500).send();
      });
  }
);

router.post(
  '/notification/list',
  (
    req: Request<GetNotificationsRequest>,
    res: Response<GetNotificationsResponse>
  ) => {
    getNotifications(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) => {
        res.status(e.code ? e.code : 500).send();
      });
  }
);

router.post(
  '/notification/listByGroup',
  (
    req: Request<GetNotificationsByGroupRequest>,
    res: Response<GetNotificationsByGroupResponse>
  ) => {
    getNotificationsByGroup(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) =>
        res.status(e.code ? e.code : 500).send()
      );
  }
);

router.post(
  '/group/list',
  (req: Request<ListGroupRequest>, res: Response<ListGroupResponse>) => {
    listGroups(req.user, req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((e: { code?: number }) => {
        res.status(e.code ? e.code : 500).send();
      });
  }
);
export default router;
