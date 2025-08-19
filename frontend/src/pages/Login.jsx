import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('username', username);
      form.append('password', password);
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/exam');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit} style={{marginTop:18}}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" style={{width:'100%',marginTop:10}}>Login</button>
      </form>
      {error && <p style={{color:'#ff5e62',marginTop:10}}>{error}</p>}
      <p style={{marginTop:18}}>Don't have an account? <a href="/register" style={{color:'#6c63ff'}}>Register</a></p>
    </div>
  );
}
