import { listenToContractEvents } from './lib';
import JustPushV1 from '@justpush/contracts/build/contracts/JustPushV1.json';
import { getTronWeb } from './tronweb';

require('dotenv').config();

const main = async () => {
  const trongridProKey = process.env.TRON_PRO_API;
  const dbUrl = process.env.DATABASE_URL;

  if (!trongridProKey) {
    throw new Error('TRON_PRO_API is not set');
  }

  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const tronWeb = await getTronWeb();
  listenToContractEvents({
    // TODO: replace network once deployed to mainnet
    contractAddress: tronWeb.address.fromHex(JustPushV1.networks['1'].address)
  });
};

main().catch((err) => {
  console.error(err);
});
