import { useState } from "react";
import server from "./server";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({
  address,
  setBalance,
  recipient,
  setRecipient,
  amount,
  setAmount,
  nonce,
  setNonce,
}) {
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // const msg = JSON.stringify({ amount: parseInt(amount), recipient, nonce });
      // const hashedMsg = keccak256(utf8ToBytes(msg));
      const {
        data: { balance, nonce: newNonce, message },
      } = await server.post(`send`, {
        sender: address,
        recipient,
        nonce,
        amount: parseInt(amount),
        signature,
        // hashedMsg: toHex(hashedMsg),
      });
      setBalance(balance);
      setNonce(newNonce);
      alert(message);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

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
        Signature
        <input
          placeholder="Insert the TX signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
