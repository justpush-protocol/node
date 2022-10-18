const TronWeb = require('tronweb');
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: { 'TRON-PRO-API-KEY': process.env.TRON_PRO_API as string },
  privateKey: ''
});

export const verifySignature = async ({
  signature,
  publicKey,
  message
}: {
  signature: string;
  message: string;
  publicKey: string;
}): Promise<boolean> => {
  // convert to hex format and remove the beginning "0x"
  let hexStrWithout0x = tronWeb.toHex(message).replace(/^0x/, '');
  // conert hex string to byte array
  var byteArray = tronWeb.utils.code.hexStr2byteArray(hexStrWithout0x);
  // keccak256 computing, then remove "0x"
  var strHash = tronWeb.sha3(byteArray).replace(/^0x/, '');

  var tail = signature.substring(128, 130);
  if (tail == '01') {
    signature = signature.substring(0, 128) + '1c';
  } else if (tail == '00') {
    signature = signature.substring(0, 128) + '1b';
  }

  return await tronWeb.trx.verifyMessage(strHash, signature, publicKey);
};
