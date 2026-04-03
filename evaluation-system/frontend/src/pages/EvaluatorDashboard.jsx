import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const EvaluatorDashboard = () => {
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    API.get('/evaluations/my').then(res => setEvaluations(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Evaluator Dashboard</h2>
      <Link to="/evaluator/submit">
        <button style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>+ New Evaluation</button>
      </Link>
      <h3>My Submitted Evaluations</h3>
      {evaluations.length === 0 ? <p>No evaluations submitted yet.</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1a2e', color: '#fff' }}>
            <tr>
              <th>Submission</th><th>Candidate</th><th>Score</th><th>Remarks</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map(ev => (
              <tr key={ev._id}>
                <td>{ev.submissionTitle}</td>
                <td>{ev.candidateName}</td>
                <td>{ev.score}</td>
                <td>{ev.remarks}</td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>🔒 Finalized</td>
                <td>{new Date(ev.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EvaluatorDashboard;
