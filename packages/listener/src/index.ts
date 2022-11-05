import { listenToContractEvents } from './lib';
import JustPushV1 from '@justpush/contracts/build/contracts/JustPushV1.json';
import { getTronWeb } from './tronweb';

require('dotenv').config();

const main = async () => {
  const network = process.env.NETWORK;
  const trongridProKey = process.env.TRON_PRO_API;
  const dbUrl = process.env.DATABASE_URL;

  if (!network) {
    throw new Error('NETWORK is not set');
  }
  let networkId = 2;
  if (network.toLocaleLowerCase() === 'shasta') {
    networkId = 2;
  } else if (network.toLocaleLowerCase() === 'mainnet') {
    networkId = 1;
  } else {
    throw new Error('NETWORK is not supported');
  }

  if (!trongridProKey) {
    throw new Error('TRON_PRO_API is not set');
  }

  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log(
    'Using hardcoded shasta network. Change this in the code if you want to use mainnet'
  );

  const tronWeb = await getTronWeb();
  listenToContractEvents({
    // TODO: replace network once deployed to mainnet
    contractAddress: tronWeb.address.fromHex(JustPushV1.networks['2'].address)
  });
};

main().catch((err) => {
  console.error(err);
});
