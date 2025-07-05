import React, { useState } from "react";
import { Link } from "react-router-dom";

function StudentLogin() {
  const [account, setAccount] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Connect MetaMask Wallet
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("User rejected MetaMask connection", error);
        alert("MetaMask connection rejected.");
      }
    } else {
      alert("MetaMask is not installed. Please install it from https://metamask.io/");
    }
  };

  // ✅ Handle Login 
  const handleLogin = (e) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect MetaMask wallet first.");
      return;
    }

    // Simulate login
    alert("🎉 Login Successful!");
    window.open("/student-dashboard", "_blank");
  };

  return (
    <div className="form-container">
      <h2>🎓 Student Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link to="/student-signup">Sign up here</Link>
      </p>

      <hr style={{ margin: "20px 0" }} />

      <button onClick={connectToMetaMask}>
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "🔗 Connect to MetaMask"}
      </button>
    </div>
  );
}

export default StudentLogin;
