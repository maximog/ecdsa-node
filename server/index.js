const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const ACCOUNTS = require("./constants/constants");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  [ACCOUNTS[0].address]: 100,
  [ACCOUNTS[1].address]: 50,
  [ACCOUNTS[2].address]: 75,
};

const nonces = {
  [ACCOUNTS[0].address]: 5,
  [ACCOUNTS[1].address]: 3,
  [ACCOUNTS[2].address]: 1,
};

app.get("/account/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const nonce = nonces[address] || 0;
  res.send({ balance, nonce });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nonce/:address", (req, res) => {
  const { address } = req.params;
  const nonce = nonces[address] || 0;
  res.send({ nonce });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!isSignatureValid(req.body)) {
    res.status(400).send({ message: "Invalid signature!" });
  } else {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      ++nonces[sender];
      res.send({ balance: balances[sender], nonce: nonces[sender], message: "Tx was successful!" });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function isSignatureValid({ sender, recipient, amount, nonce, signature }) {
  if (nonce !== nonces[sender]) return false;
  const message = JSON.stringify({ amount: parseInt(amount), recipient, nonce });
  const msgHash = keccak256(utf8ToBytes(message));
  try {
    // get last number as recoveryBit
    const recovery = +signature.slice(signature.length - 1);
    parsedSignature = signature.substring(0, signature.length - 1);
    const pubKey = secp.recoverPublicKey(msgHash, parsedSignature, recovery);
    // Derive address from pubkey
    const address = "0x" + toHex(keccak256(pubKey.slice(1)).slice(-20));
    if (address !== sender) {
      console.log("Recovered address is different from sender address");
      return false;
    }
    const isVerified = secp.verify(parsedSignature, msgHash, pubKey);
    return isVerified;
  } catch (error) {
    console.error(error);
    return false;
  }
}
