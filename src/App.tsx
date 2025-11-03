"use client";

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Route>
        
        {/* Future public routes: /creators, /creators/:slug */}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;