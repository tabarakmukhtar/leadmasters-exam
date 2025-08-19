import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure correct content-type and payload
      const res = await API.post('/auth/register', { username, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/exam');
    } catch (err) {
      console.error('Registration error:', err, err.response);
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit} style={{marginTop:18}}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%',marginTop:10}}>Register</button>
      </form>
      {error && <p style={{color:'#ff5e62',marginTop:10}}>{error}</p>}
      <p style={{marginTop:18}}>Already have an account? <a href="/login" style={{color:'#6c63ff'}}>Login</a></p>
    </div>
  );
}
