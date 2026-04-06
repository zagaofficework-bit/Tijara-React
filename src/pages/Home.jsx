import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import SignupPage from "../features/auth/pages/SignupPage";

const Home = () => {
  return (
    <div>
      <Router>
        <Route path="/auth/signup" element={<SignupPage />} />
      </Router>
    </div>
  );
};

export default Home;