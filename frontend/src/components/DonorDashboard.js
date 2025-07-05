import React, { useState } from "react";
import { ethers } from "ethers";
import Navbar from "./Navbar";

function DonorDashboard() {
  const [badges, setBadges] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState({});
  const [loanInputs, setLoanInputs] = useState({});

  const divbox = {
    padding: "10px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  };
  const ideabox = {
    backgroundColor: "pink",
    width: "250px",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };
  const Conbox = {
    padding: "8px 12px",
    border: "none",
    backgroundColor: "#ff5c8d",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const addBadge = (badgeType) => {
    setBadges((prev) => [...prev, badgeType]);
  };

  const handleContribute = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const amountInEth = prompt("Enter contribution amount in ETH:");
    if (!amountInEth || isNaN(amountInEth) || parseFloat(amountInEth) <= 0) {
      alert("Invalid amount entered.");
      return;
    }

    const ethValue = parseFloat(amountInEth);

    // Assign badge before transaction
    if (ethValue >= 5) addBadge("Gold");
    else if (ethValue >= 2) addBadge("Silver");
    else if (ethValue >= 0.5) addBadge("Bronze");
    else addBadge("No Badge");

    try {
      const valueInWei = ethers.parseEther(amountInEth);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: "0x000000000000000000000000000000000000dead", // dummy
        value: valueInWei,
      });

      await tx.wait();
      alert("Transaction successful!");
    } catch (err) {
      console.error("Transaction failed or rejected", err);
      alert("Transaction failed or rejected, but badge assigned.");
    }
  };

  const toggleLoanForm = (idx) => {
    setShowLoanForm((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLoanInput = (idx, field, value) => {
    setLoanInputs((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value },
    }));
  };

  const handleSendLoanRequest = (idx) => {
    const loan = loanInputs[idx];
    if (!loan?.amount || !loan?.expectedReturn) {
      alert("Please fill in both fields.");
      return;
    }

    alert(
      `📤 Loan Request Sent:\nInvesting: ${loan.amount} ETH\nExpecting: ${loan.expectedReturn} ETH`
    );

    addBadge("Loan Giver 🏆");
    setShowLoanForm((prev) => ({ ...prev, [idx]: false }));
    setLoanInputs((prev) => ({ ...prev, [idx]: {} }));
  };

  const badgeCounts = badges.reduce((acc, badge) => {
    acc[badge] = (acc[badge] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <style>{`html { scroll-behavior: smooth; }`}</style>
      <Navbar />

      <div style={{ padding: "30px", textAlign: "center" }}>
        <h1>🎉 Welcome to the Donor Dashboard</h1>
        <p style={{ fontSize: "30px" }}>
          Here you can view and support student startup projects that you like.
        </p>

        {badges.length > 0 && (
          <div style={{ marginTop: "20px", fontSize: "20px", color: "#0A192F" }}>
            🏅 <strong>Your Badges:</strong>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {Object.entries(badgeCounts).map(([badge, count]) => (
                <li key={badge}>
                  {badge}: <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h2 style={{ paddingLeft: "20px" }}>Startups that you may like:</h2>

      <div style={divbox}>
        {[...Array(9)].map((_, i) => (
          <div key={i} style={ideabox}>
            <h3>Startup Title</h3>
            <p>Description of the startup in a few lines.</p>
            <p><strong>Goal:</strong> ₹1,00,000</p>
            <p><strong>Raised:</strong> ₹25,000</p>
            <p><strong>Deadline:</strong> dd/mm/yy</p>

            <button style={Conbox} onClick={handleContribute}>
              Contribute
            </button>

            <button
              style={{ ...Conbox, backgroundColor: "#6C63FF" }}
              onClick={() => toggleLoanForm(i)}
            >
              Give Loan
            </button>

            {showLoanForm[i] && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="number"
                  placeholder="Amount (ETH)"
                  onChange={(e) => handleLoanInput(i, "amount", e.target.value)}
                  style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
                />
                <input
                  type="number"
                  placeholder="Expected Return (ETH)"
                  onChange={(e) =>
                    handleLoanInput(i, "expectedReturn", e.target.value)
                  }
                  style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
                />
                <button
                  style={{ ...Conbox, backgroundColor: "#374151", width: "100%" }}
                  onClick={() => handleSendLoanRequest(i)}
                >
                  Send Request
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Startups with ending deadlines:</h2>

      <div style={divbox}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={ideabox}>
            <h3>Startup Title</h3>
            <p>Description of the startup in a few lines.</p>
            <p><strong>Goal:</strong> ₹1,00,000</p>
            <p><strong>Raised:</strong> ₹25,000</p>
            <p><strong>Deadline:</strong> dd/mm/yy</p>

            <button style={Conbox} onClick={handleContribute}>
              Contribute
            </button>

            <button
              style={{ ...Conbox, backgroundColor: "#6C63FF" }}
              onClick={() => toggleLoanForm(i + 100)}
            >
              Give Loan
            </button>

            {showLoanForm[i + 100] && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="number"
                  placeholder="Amount (ETH)"
                  onChange={(e) =>
                    handleLoanInput(i + 100, "amount", e.target.value)
                  }
                  style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
                />
                <input
                  type="number"
                  placeholder="Expected Return (ETH)"
                  onChange={(e) =>
                    handleLoanInput(i + 100, "expectedReturn", e.target.value)
                  }
                  style={{ padding: "6px", width: "100%", marginBottom: "6px" }}
                />
                <button
                  style={{ ...Conbox, backgroundColor: "#374151", width: "100%" }}
                  onClick={() => handleSendLoanRequest(i + 100)}
                >
                  Send Request
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        id="about"
        style={{
          padding: "40px 20px",
          backgroundColor: "#f0f4f8",
          lineHeight: 1.6,
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
          About Innofund
        </h2>

        <h3 style={{ marginTop: "0" }}>NFTs & Badges</h3>
        <p>
          Become an investor for many startups by donating even a small amount.
          Your profile earns <strong>badges</strong> (NFTs) based on the
          percentage you contribute. Badges unlock discount coupons, other
          rewards, and a premium membership that lasts for a time period
          proportional to your support.
        </p>

        <h4 style={{ marginBottom: "8px" }}>Types of NFTs / Badges</h4>
        <ul style={{ paddingLeft: "20px" }}>
          <li>Bronze Badge</li>
          <li>Silver Badge</li>
          <li>Gold Badge</li>
          <li>Loan Giver 🏆</li>
        </ul>

        <p>
          <strong>Gold</strong> and <strong>Platinum</strong> badge donors can
          participate in key decisions made by the startup. <em>Any</em> badge
          holder has the right to suggest improvements that help the startup
          grow.
        </p>

        <h3 style={{ marginTop: "32px" }}>
          Prefer Less Risk? — Loan the Startup
        </h3>
        <p>
          Interested in supporting a startup but want to limit risk? You can
          choose to <strong>loan</strong> funds instead of donating. When you
          send a loan request, specify the amount, repayment timeline, and
          (optionally) an extra interest amount if the startup succeeds. If the
          startup fails, you receive back only the amount you loaned, helping
          the student avoid heavy debt.
        </p>

        <p>
          Upon lending, you receive a special <strong>Funding NFT</strong>,
          giving you a “Good Funder” reputation badge on your profile.
        </p>
      </div>
    </div>
  );
}

export default DonorDashboard;
