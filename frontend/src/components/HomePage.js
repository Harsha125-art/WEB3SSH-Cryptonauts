// components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <header className="hero">
    <img src="/InnoFund.png" alt="InnoFund Logo" className="logo" />
    <h1>
      Welcome to <span className="brand">InnoFund</span>
    </h1>
    <p className="subtitle">Empowering student startups with micro-investments!</p>

    <div className="buttons">
      <Link to="/student-login">
        <button className="student-btn">I’m a Student</button>
      </Link>
      <Link to="/donor-login">
        <button className="donor-btn">I’m a Donor</button>
      </Link>
    </div>
  </header>
);

export default HomePage;
