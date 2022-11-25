import { useState } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function GenerateSignature({
  address,
  setBalance,
  recipient,
  setRecipient,
  amount,
  setAmount,
  nonce,
}) {
  const [privateKey, setPrivateKey] = useState(
    "aa8659282571af927953dc594b40a5cb8e4646fe86a0082783d01bf0797744c7"
  );
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function generate(evt) {
    evt.preventDefault();
    const message = JSON.stringify({ amount: parseInt(amount), recipient, nonce });
    const hashedMsg = keccak256(utf8ToBytes(message));
    const signature = secp.signSync(hashedMsg, privateKey, { recovered: true });
    const signWithRecBit = toHex(signature[0]) + signature[1];
    setSignature(signWithRecBit);
  }

  return (
    <form className="container signature" onSubmit={generate}>
      <h1>Generate Signature</h1>

      {address.length ? (
        <div className="address">
          Address: {address.substr(0, 6)}...{address.substr(address.length - 6, 6)}
        </div>
      ) : (
        <div className="address">Address: none</div>
      )}

      <label>
        Send Amount
        <input placeholder="1, 2, 3..." value={amount} onChange={setValue(setAmount)}></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key
        <input
          placeholder="Insert private key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      {address.length ? <div className="nonce">Nonce: {nonce}</div> : <></>}

      <input type="submit" className="button" value="Sign" />

      {signature && <div className="sign">Signature: {signature}</div>}
    </form>
  );
}

export default GenerateSignature;
