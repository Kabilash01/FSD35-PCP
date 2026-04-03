import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EvaluatorDashboard from './pages/EvaluatorDashboard';
import SubmitEvaluation from './pages/SubmitEvaluation';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/evaluator" element={
            <ProtectedRoute role="evaluator"><EvaluatorDashboard /></ProtectedRoute>
          } />
          <Route path="/evaluator/submit" element={
            <ProtectedRoute role="evaluator"><SubmitEvaluation /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
