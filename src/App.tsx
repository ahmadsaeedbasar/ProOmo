"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Future routes: /creators, /creators/:slug, /dashboard/* */}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;