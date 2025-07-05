import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import StartupFundingABI from "../abis/InnoFund.json";

const CONTRACT_ADDRESS = " 0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

function StudentDashboard() {
  const [startups, setStartups] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          StartupFundingABI.abi,
          signer
        );

        const ideas = await contract.getMyIdeas(); // 👈 from smart contract

        const parsedIdeas = ideas.map((idea) => ({
          title: idea.title,
          description: idea.description,
          goal: ethers.formatEther(idea.targetAmount),
          now: ethers.formatEther(idea.currentAmount),
          deadline: new Date(Number(idea.deadline) * 1000).toLocaleDateString(),
          status: idea.isSuccess ? "Successful" : "Active",
        }));

        setStartups(parsedIdeas);
      } catch (err) {
        console.error("Error loading ideas:", err);
      }
    }

    loadIdeas();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-title">
          <img src="/InnoFund.png" alt="logo" className="logo" />
          <span className="site-title">INNO FUND</span>
        </div>
        <div className="nav-right">
          <div className="Profile">
            <img src="/profile-icon.png" alt="profile" className="icon" />
            <span className="user-role">Profile</span>
          </div>
          <div className="Inbox">
            <img src="/inbox.png" alt="inbox" className="inbox-icon" />
            <span className="user-role">Inbox</span>
          </div>
        </div>
      </nav>
       
       <h2>Welcome to Student Dashboard</h2>
       <p> -Here you can post start-up ideas or view your previous ideas </p>
      {/* Upload Button */}
      <div className="upload-section">
        <Link to="/create-idea" className="upload-btn">
          📤 Upload a New Startup Idea
        </Link>
      </div>

      {/* Previous Startups List */}
      <div className="startup-list">
        <h3>📌 My Previous Startup Ideas:</h3>
        {startups.length === 0 ? (
          <p>No startups submitted yet.</p>
        ) : (
          startups.map((s, i) => (
            <div key={i} className="startup-card">
              <h4>{s.title}</h4>
              <p><strong>Description:</strong> {s.description}</p>
              <p><strong>Goal:</strong> {s.goal} ETH</p>
              <p><strong>Amount Now:</strong> {s.now} ETH</p>
              <p><strong>Deadline:</strong> {s.deadline}</p>
              <p><strong>Status:</strong> {s.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
