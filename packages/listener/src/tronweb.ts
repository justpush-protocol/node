const TronWeb = require('tronweb');
export const getTronWeb = () => {
  const host = 'https://api.trongrid.io';
  const tronProApiKey = process.env.TRON_PRO_API;
  return new TronWeb({
    fullHost: host,
    headers: tronProApiKey ? { 'TRON-PRO-API-KEY': tronProApiKey } : {},
    privateKey: ''
  });
};
