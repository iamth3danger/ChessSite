import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Analysis from "./Pages/Analysis";
import Data from "./Pages/Data";
import Global from "./Pages/Global";
import Login from "./Pages/Login";
import GraphComponent from "./components/GraphComponent";
import ErrorPage from "./ErrorPage";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path="/data" element={<Data />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/global" element={<Global />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default App;
