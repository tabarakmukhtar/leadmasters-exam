import React, { useEffect, useState, useCallback } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Exam page: handles fetching questions, timer, answer selection, and submission
export default function Exam() {
  // State for questions, answers, current question index, timer, and exam start time
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(1800); // 30 min in seconds
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();

  // Fetch questions and set start time on mount
  useEffect(() => {
    API.post('/exam/start')
      .then(res => {
        setQuestions(res.data);
        setStartTime(new Date().toISOString());
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  // Timer countdown and auto-submit when time runs out
  useEffect(() => {
    if (timer <= 0) {
      handleSubmit();
      return;
    }
    const t = setInterval(() => setTimer(time => time - 1), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line
  }, [timer]);

  // Handle answer selection
  const handleOption = (qid, opt) => {
    setAnswers(prev => ({ ...prev, [qid]: opt }));
  };

  // Handle exam submission
  const handleSubmit = useCallback(async () => {
    if (Object.keys(answers).length === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }
    const payload = {
      answers: Object.entries(answers).map(([question_id, selected_option]) => ({ question_id: Number(question_id), selected_option })),
      start_time: startTime,
    };
    try {
      const res = await API.post('/exam/submit', payload);
      localStorage.setItem('lastSubmissionId', res.data.id);
      navigate(`/result/${res.data.id}`);
    } catch (err) {
      console.error('Exam submission error:', err, err.response);
      if (err.response && err.response.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response && err.response.data && err.response.data.detail) {
        alert('Submission failed: ' + err.response.data.detail);
      } else {
        alert('Submission failed. Please try again.');
      }
    }
  }, [answers, startTime, navigate]);

  if (!questions.length) return <div className="container" style={{textAlign:'center',marginTop:'80px'}}><div className="loader"></div><p>Loading questions...</p></div>;

  const q = questions[current];
  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <div className="container">
      <h2>📝 Online Exam</h2>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <span style={{fontWeight:500, color:'#6c63ff'}}>Time left: {mins}:{secs.toString().padStart(2, '0')}</span>
        <span style={{fontSize:14, color:'#888'}}>Question {current+1} of {questions.length}</span>
      </div>
      <div style={{background:'#f7f8fa',borderRadius:8,padding:'18px 14px',marginBottom:18,boxShadow:'0 1px 4px #6c63ff11'}}>
        <p style={{fontWeight:600, fontSize:'1.13em', color:'#3a3a6a',marginBottom:10}}><span style={{color:'#48c6ef'}}>Q{current + 1}:</span> {q.question_text}</p>
        {/* Render options A-D */}
        {["A","B","C","D"].map(opt => (
          <label key={opt} style={{display:'block',margin:'10px 0',padding:'8px 12px',borderRadius:6,background:answers[q.id]===opt?'#e9eafc':'#fff',boxShadow:answers[q.id]===opt?'0 2px 8px #6c63ff22':'none',border:answers[q.id]===opt?'1.5px solid #6c63ff':'1.5px solid #e0e0e0',cursor:'pointer',transition:'all 0.2s'}}>
            <input
              type="radio"
              name={`q${q.id}`}
              value={opt}
              checked={answers[q.id] === opt}
              onChange={() => handleOption(q.id, opt)}
              style={{marginRight:10}}
            />
            <span style={{fontWeight:500}}>{q[`option_${opt.toLowerCase()}`]}</span>
          </label>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:18}}>
        <button disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>Previous</button>
        <button disabled={current === questions.length - 1} onClick={() => setCurrent(c => c + 1)}>Next</button>
        <button onClick={handleSubmit} style={{background:'#48c6ef',marginLeft:'auto'}}>Submit Exam</button>
      </div>
    </div>
  );
}
