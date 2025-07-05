import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import DonorLogin from "./components/DonorLogin";
import DonorSignup from "./components/DonorSignup";
import StudentDashboard from "./components/StudentDashboard";
import CreateIdea from "./components/CreateIdea";
import DonorDashboard from "./components/DonorDashboard";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/donor-login" element={<DonorLogin />} />
          <Route path="/donor-signup" element={<DonorSignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-idea" element={<CreateIdea />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
