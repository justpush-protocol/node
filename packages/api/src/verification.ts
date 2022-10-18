import { Request, Response, NextFunction } from 'express';
import { verifySignature } from '@justlabs-platform/just-push-common';

export const verify = async (req: Request<any>, res: Response<any>) => {
  let verified = false;
  try {
    verified = await verifySignature({
      signature: req.headers['x-signature'] as string,
      publicKey: req.headers['x-public-key'] as string,
      message: JSON.stringify(req.body)
    });
  } catch (e) {
    verified = false;
  }
  if (!verified) {
    res.status(401).send('Unauthorized');
  }
  return verified;
};
