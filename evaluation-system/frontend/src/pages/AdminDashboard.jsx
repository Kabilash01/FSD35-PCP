import { useEffect, useState } from 'react';
import API from '../api/axios';

const AdminDashboard = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Modals state
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingEval, setEditingEval] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [evalForm, setEvalForm] = useState({
    evaluatorId: '',
    evaluatorName: '',
    submissionTitle: '',
    candidateName: '',
    score: '',
    remarks: ''
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'evaluator'
  });

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [evals, evs] = await Promise.all([
        API.get('/evaluations/all'),
        API.get('/evaluations/evaluators')
      ]);
      setEvaluations(evals.data);
      setEvaluators(evs.data);
    } catch (err) {
      setMessage(`Error fetching data: ${err.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== EVALUATION CRUD =====

  const openEvalModal = (evaluation = null) => {
    if (evaluation) {
      setEditingEval(evaluation);
      setEvalForm({
        evaluatorId: evaluation.evaluatorId._id || evaluation.evaluatorId,
        evaluatorName: evaluation.evaluatorName,
        submissionTitle: evaluation.submissionTitle,
        candidateName: evaluation.candidateName,
        score: evaluation.score,
        remarks: evaluation.remarks
      });
    } else {
      setEditingEval(null);
      setEvalForm({
        evaluatorId: '',
        evaluatorName: '',
        submissionTitle: '',
        candidateName: '',
        score: '',
        remarks: ''
      });
    }
    setShowEvalModal(true);
  };

  const handleEvalChange = (e) => {
    const { name, value } = e.target;
    setEvalForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingEval) {
        // Update evaluation
        await API.put(`/evaluations/admin/${editingEval._id}`, {
          submissionTitle: evalForm.submissionTitle,
          candidateName: evalForm.candidateName,
          score: Number(evalForm.score),
          remarks: evalForm.remarks
        });
        setMessage('✅ Evaluation updated successfully');
      } else {
        // Create evaluation
        await API.post('/evaluations/admin/create', {
          ...evalForm,
          score: Number(evalForm.score)
        });
        setMessage('✅ Evaluation created successfully');
      }
      setShowEvalModal(false);
      fetchData();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  const deleteEvaluation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this evaluation?')) return;
    setLoading(true);
    try {
      await API.delete(`/evaluations/admin/${id}`);
      setMessage('✅ Evaluation deleted successfully');
      fetchData();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  // ===== USER CRUD =====

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'evaluator'
      });
    }
    setShowUserModal(true);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        // Update user
        const updateData = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role
        };
        if (userForm.password) updateData.password = userForm.password;

        await API.put(`/auth/admin/users/${editingUser._id}`, updateData);
        setMessage('✅ User updated successfully');
      } else {
        // Create user
        await API.post('/auth/admin/users/create', userForm);
        setMessage('✅ User created successfully');
      }
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure? This will also delete all their evaluations.')) return;
    setLoading(true);
    try {
      await API.delete(`/auth/admin/users/${id}`);
      setMessage('✅ User deleted successfully');
      fetchData();
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    }
    setLoading(false);
  };

  // ===== Modal Components =====

  const EvalModal = () => (
    showEvalModal && (
      <div style={modalBackdropStyle}>
        <div style={modalContentStyle}>
          <h3>{editingEval ? 'Edit Evaluation' : 'Create Evaluation'}</h3>
          <form onSubmit={handleEvalSubmit}>
            <div style={formGroupStyle}>
              <label>Evaluator:</label>
              <select
                name="evaluatorId"
                value={evalForm.evaluatorId}
                onChange={handleEvalChange}
                disabled={!!editingEval}
                required
              >
                <option value="">Select Evaluator</option>
                {evaluators.map(ev => (
                  <option key={ev._id} value={ev._id}>{ev.name} ({ev.email})</option>
                ))}
              </select>
            </div>

            <div style={formGroupStyle}>
              <label>Submission Title:</label>
              <input
                type="text"
                name="submissionTitle"
                value={evalForm.submissionTitle}
                onChange={handleEvalChange}
                placeholder="e.g., Project Alpha Review"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label>Candidate Name:</label>
              <input
                type="text"
                name="candidateName"
                value={evalForm.candidateName}
                onChange={handleEvalChange}
                placeholder="e.g., Jane Smith"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label>Score (0-100):</label>
              <input
                type="number"
                name="score"
                value={evalForm.score}
                onChange={handleEvalChange}
                min="0"
                max="100"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label>Remarks:</label>
              <textarea
                name="remarks"
                value={evalForm.remarks}
                onChange={handleEvalChange}
                placeholder="Enter remarks..."
                rows="3"
                required
              />
            </div>

            <div style={buttonGroupStyle}>
              <button type="submit" style={primaryButtonStyle} disabled={loading}>
                {loading ? '...' : editingEval ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowEvalModal(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  const UserModal = () => (
    showUserModal && (
      <div style={modalBackdropStyle}>
        <div style={modalContentStyle}>
          <h3>{editingUser ? 'Edit User' : 'Create User'}</h3>
          <form onSubmit={handleUserSubmit}>
            <div style={formGroupStyle}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleUserChange}
                placeholder="e.g., John Evaluator"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserChange}
                placeholder="e.g., john@test.com"
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label>Password {editingUser && '(leave empty to keep current)'}</label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserChange}
                placeholder="Password"
                required={!editingUser}
              />
            </div>

            <div style={formGroupStyle}>
              <label>Role:</label>
              <select
                name="role"
                value={userForm.role}
                onChange={handleUserChange}
                required
              >
                <option value="evaluator">Evaluator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div style={buttonGroupStyle}>
              <button type="submit" style={primaryButtonStyle} disabled={loading}>
                {loading ? '...' : editingUser ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: message.includes('❌') ? '#fee' : '#efe',
            border: `1px solid ${message.includes('❌') ? '#f99' : '#9f9'}`,
            borderRadius: '4px',
            color: message.includes('❌') ? '#c00' : '#080'
          }}
        >
          {message}
        </div>
      )}

      {/* EVALUATORS SECTION */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Registered Evaluators ({evaluators.length})</h3>
          <button onClick={() => openUserModal()} style={primaryButtonStyle}>
            ➕ New Evaluator
          </button>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1a2e', color: '#fff' }}>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {evaluators.map(ev => (
              <tr key={ev._id}>
                <td>{ev.name}</td>
                <td>{ev.email}</td>
                <td>{ev.role}</td>
                <td>{new Date(ev.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => openUserModal(ev)}
                    style={{ ...actionButtonStyle, marginRight: '0.5rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteUser(ev._id)}
                    style={deleteButtonStyle}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EVALUATIONS SECTION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>All Evaluations ({evaluations.length})</h3>
          <button onClick={() => openEvalModal()} style={primaryButtonStyle}>
            ➕ New Evaluation
          </button>
        </div>

        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1a2e', color: '#fff' }}>
            <tr><th>Evaluator</th><th>Submission</th><th>Candidate</th><th>Score</th><th>Remarks</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {evaluations.map(ev => (
              <tr key={ev._id}>
                <td>{ev.evaluatorName}</td>
                <td>{ev.submissionTitle}</td>
                <td>{ev.candidateName}</td>
                <td><strong>{ev.score}</strong></td>
                <td>{ev.remarks}</td>
                <td>{new Date(ev.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => openEvalModal(ev)}
                    style={{ ...actionButtonStyle, marginRight: '0.5rem' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteEvaluation(ev._id)}
                    style={deleteButtonStyle}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EvalModal />
      <UserModal />
    </div>
  );
};

// Styles
const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const formGroupStyle = {
  marginBottom: '1rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem'
};

const primaryButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const secondaryButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const actionButtonStyle = {
  padding: '0.4rem 0.8rem',
  background: '#17a2b8',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const deleteButtonStyle = {
  padding: '0.4rem 0.8rem',
  background: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default AdminDashboard;
