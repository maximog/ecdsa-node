import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import GenerateSignature from "./GenerateSignature";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("0xd78f4fba25ccd9086486b371324f2c3dc6df96e4");
  const [recipient, setRecipient] = useState("0xa311db737ace2f48de1b949051d1cc2e975a258c");
  const [amount, setAmount] = useState(0);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        nonce={nonce}
        setNonce={setNonce}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        nonce={nonce}
        setNonce={setNonce}
      />
      <GenerateSignature
        setBalance={setBalance}
        address={address}
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        nonce={nonce}
        setNonce={setNonce}
      />
    </div>
  );
}

export default App;
