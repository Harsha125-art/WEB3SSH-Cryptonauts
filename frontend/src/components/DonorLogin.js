import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function DonorLogin() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  // Connect MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected:", accounts[0]);

        
        localStorage.setItem("user", JSON.stringify({ wallet: accounts[0], role: "donor" }));

        // Redirecting to dashboard
        navigate("/donor-dashboard");
      } catch (err) {
        console.error("MetaMask connection error", err);
        alert("Connection failed");
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  return (
    <div className="form-container">
      <h2>💼 Donor Login</h2>
      <p>You only need to connect your MetaMask wallet to continue.</p>

      <button onClick={connectToMetaMask}>
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "🔗 Connect to MetaMask"}
      </button>

      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link to="/donor-signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default DonorLogin;
