import React, { useState } from "react";

function DonorSignup() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
        alert(`Wallet connected: ${accounts[0]}`);
      } catch (err) {
        console.error("Wallet connection failed", err);
        alert("Wallet connection rejected.");
      }
    } else {
      alert("MetaMask not detected. Please install it from https://metamask.io/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!wallet) {
      alert("Please connect MetaMask wallet before signing up.");
      return;
    }

    // Just show success alert without MongoDB/backend
    alert("Signup successful!");
    console.log("User Info:", {
      name,
      profession,
      email,
      password,
      wallet,
      role: "donor",
      badges: "None",
    });
  };

  return (
    <div className="form-container">
      <h2>💼 Donor Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="button" onClick={connectWallet}>
          {wallet
            ? `Connected: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`
            : "🔗 Connect Wallet"}
        </button>

        <button type="submit" style={{ marginTop: "10px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default DonorSignup;
