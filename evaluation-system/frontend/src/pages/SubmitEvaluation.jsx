import { useState } from 'react';
import API from '../api/axios';

const SubmitEvaluation = () => {
  const [form, setForm] = useState({ submissionTitle: '', candidateName: '', score: '', remarks: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await API.post('/evaluations/submit', form);
      setSuccess('✅ Evaluation submitted and finalized. It cannot be modified.');
      setForm({ submissionTitle: '', candidateName: '', score: '', remarks: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Submit Evaluation</h2>
      <p style={{ color: '#888', fontSize: 13 }}>⚠️ Once submitted, scores are final and cannot be changed.</p>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Submission Title" value={form.submissionTitle} onChange={e => setForm({ ...form, submissionTitle: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input placeholder="Candidate Name" value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="number" placeholder="Score (0-100)" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} min={0} max={100} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <textarea placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8, height: 80 }} />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1a1a2e', color: '#fff', border: 'none', cursor: 'pointer' }}>Submit & Finalize</button>
      </form>
    </div>
  );
};

export default SubmitEvaluation;
