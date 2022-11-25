const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const ACCOUNTS = require("../constants/constants");

const message = JSON.stringify({ amount: 10, recipient: ACCOUNTS[1].address });
const hashedMsg = keccak256(utf8ToBytes(message));
console.log(toHex(hashedMsg));

async function signTx() {
  const signature = await secp.sign(hashedMsg, ACCOUNTS[0].privateKey, { recovered: true });
  console.log({ signature: toHex(signature[0]), recover: signature[1] });
  console.log({ signature: toHex(signature[0]) + signature[1] });
}

signTx();

console.log(toHex(secp.getPublicKey(ACCOUNTS[0].privateKey)));
