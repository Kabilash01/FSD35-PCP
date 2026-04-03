import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem 2rem', background: '#1a1a2e', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>EvalSystem</h2>
      {user && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>{user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 1rem', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
