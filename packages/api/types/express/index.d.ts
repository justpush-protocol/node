export {}

declare global {
  namespace Express {
    export interface Request {
      user: string;
      signature?: string;
    }
  }
}