import React from 'react';
import Navbar from './components/Navbar';
import './App.modern.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Exam from './pages/Exam';
import Result from './pages/Result';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
