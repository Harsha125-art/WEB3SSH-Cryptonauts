import React, { useState } from "react";
import { ethers } from "ethers";
import StartupFundingABI from "../abis/InnoFund.json";


const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function CreateIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) return alert("Please install MetaMask!");

    const durationInDays = getDurationFromToday(deadline);
    if (durationInDays <= 0) return alert("Please select a valid future deadline");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, StartupFundingABI.abi, signer);

      const tx = await contract.postIdea(
        title,
        description,
        ethers.parseEther(targetAmount),
        durationInDays
      );
      await tx.wait();

      alert("Idea successfully posted to the blockchain!");
      // Optional: Clear form
      setTitle("");
      setDescription("");
      setTargetAmount("");
      setDeadline("");
    } catch (err) {
      console.error("Error while posting idea:", err);
      alert("Failed to post idea. Please try again.");
    }
  };

  const getDurationFromToday = (dateString) => {
    const today = new Date();
    const deadlineDate = new Date(dateString);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ms → days
  };

  return (
    <div className="form-container" style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h2>🚀 Post Your Startup Idea</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Idea Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <input
          type="number"
          placeholder="Target Amount in ETH"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <button type="submit">Post Idea</button>
      </form>
    </div>
  );
}

export default CreateIdea;
