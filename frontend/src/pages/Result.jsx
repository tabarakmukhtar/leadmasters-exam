import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    API.get(`/exam/result/${id}`)
      .then(res => setResult(res.data))
      .catch(err => {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else if (err.response && err.response.data && err.response.data.detail) {
          setResult({ error: err.response.data.detail });
        } else {
          setResult({ error: 'Could not load result.' });
        }
      });
  }, [id, navigate]);

  if (!result) return <div className="container" style={{textAlign:'center',marginTop:'80px'}}><div className="loader"></div><p>Loading result...</p></div>;
  if (result.error) return (
    <div className="container">
      <h2 style={{color:'#ff5e62'}}>Exam Result</h2>
      <p style={{color:'#ff5e62',fontWeight:500}}>{result.error}</p>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
        <button onClick={() => navigate('/exam')}>Back to Exam</button>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
      </div>
    </div>
  );
  return (
    <div className="container">
      <h2 style={{color:'#48c6ef'}}>Exam Result</h2>
      <div style={{background:'#f7f8fa',borderRadius:8,padding:'18px 14px',marginBottom:18,boxShadow:'0 1px 4px #6c63ff11'}}>
        <p style={{fontWeight:600, fontSize:'1.13em', color:'#3a3a6a',marginBottom:10}}>
          <span style={{color:'#6c63ff'}}>Score:</span> <span style={{fontSize:'1.2em'}}>{result.score} / {result.total}</span>
        </p>
        <p style={{color:'#888',fontSize:14}}>Submitted at: {result.submitted_at}</p>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
        <button onClick={() => navigate('/exam')}>Retake Exam</button>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
      </div>
    </div>
  );
}
