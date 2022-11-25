import server from "./server";
import { useEffect } from "react";

function Wallet({ address, setAddress, balance, setBalance, nonce, setNonce }) {
  useEffect(() => {
    getAccount(address);
  }, [address]);

  async function getAccount(accountAddress) {
    if (accountAddress) {
      const {
        data: { nonce, balance },
      } = await server.get(`account/${accountAddress}`);
      setNonce(nonce);
      setBalance(balance);
    } else {
      setNonce(0);
      setBalance(0);
    }
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={setValue(setAddress)}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      {address.length ? <div className="nonce">Nonce: {nonce}</div> : <></>}
    </div>
  );
}

export default Wallet;
