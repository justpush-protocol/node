import { verifySignature } from '@justpush/just-push-common';
import { Request, Response, NextFunction } from 'express';
export const hasUser = async (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => {
  let user = req.headers['x-public-key'];

  if (!user || typeof user !== 'string') {
    res.status(400).send('Bad request. Missing `x-public-key` in header');
  }

  req.user = user as string;
  next();
};

export const hasSignature = async (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction
) => {
  let signature = req.headers['x-signature'];

  if (!signature || typeof signature !== 'string') {
    res.status(400).send('Bad request. Missing `x-signature` in header');
  }

  req.signature = signature as string;
  next();
};

export const verifyUser = async (req: Request<any>, res: Response<any>) => {
  let verified = false;
  try {
    verified = await verifySignature({
      signature: req.signature as string,
      publicKey: req.user,
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
