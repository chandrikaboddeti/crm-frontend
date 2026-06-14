import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Users from './pages/Users';
// Find line 8 (after import Users)
// ADD these 2 lines there:
import Activities from './pages/Activities';
import Reports from './pages/Reports';
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
      <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
      <Route path="/deals" element={<PrivateRoute><Deals /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      <Route path="/activities" element={<PrivateRoute><Activities /></PrivateRoute>} />
<Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;