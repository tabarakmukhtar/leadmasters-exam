import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const lastId = localStorage.getItem('lastSubmissionId');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      marginBottom: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.1em 2em',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px #0001',
      minHeight: 60
    }}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <span style={{fontWeight:700, fontSize:'1.25em', color:'#6c63ff', letterSpacing:1, marginRight:18}}>
          <span role="img" aria-label="exam">📝</span> LeadMasters Exam
        </span>
        <Link to="/exam" style={{marginRight:10}}>Exam</Link>
        {lastId ? (
          <Link to={`/result/${lastId}`} style={{marginRight:10}}>Result</Link>
        ) : (
          <span style={{color:'#aaa',marginRight:10}}>Result</span>
        )}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{marginRight:8}}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
