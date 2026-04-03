import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/evaluator');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1a1a2e', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
