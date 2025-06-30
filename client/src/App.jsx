import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import ErrorPage from "./pages/errorPage";

import Home from "./pages/Home";

import CampusConnect from "./pages/CampusConnect";
import Profile from "./pages/Profile";
import Friends from "./components/Friends";
import Notifications from "./components/Notifications";
// Assuming you have a button component

import React from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<CampusConnect />} />
        <Route path="/home/:username" element={<Home />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
