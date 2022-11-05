const TronWeb = require('tronweb');
export const getTronWeb = () => {
  const host = getTronGridURL(process.env.NETWORK as string);
  const tronProApiKey = process.env.TRON_PRO_API;
  return new TronWeb({
    fullHost: host,
    headers: tronProApiKey ? { 'TRON-PRO-API-KEY': tronProApiKey } : {},
    privateKey: ''
  });
};

export const getTronGridURL = (network: string) => {
  const host =
    network === 'tron'
      ? 'https://api.trongrid.io'
      : `https://api.${network}.trongrid.io`;
  return host;
};
