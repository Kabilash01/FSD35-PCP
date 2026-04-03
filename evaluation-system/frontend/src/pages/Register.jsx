import { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'evaluator' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: '100%', marginBottom: 10, padding: 8 }}>
          <option value="evaluator">Evaluator</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1a1a2e', color: '#fff', border: 'none', cursor: 'pointer' }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
