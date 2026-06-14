import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const roleConfig = {
  admin: { style: 'bg-red-50 text-red-700 border border-red-200', icon: '👑' },
  manager: { style: 'bg-blue-50 text-blue-700 border border-blue-200', icon: '👔' },
  sales: { style: 'bg-green-50 text-green-700 border border-green-200', icon: '💼' },
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'sales' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👤 Users</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage your team members</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}
        >
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}>
                👤
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">👤 Full Name</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50" required />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">📧 Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50" required />
              </div>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">🔒 Password</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50" required />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">🎭 Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50">
                  <option value="sales">Sales Executive</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}>
                  ➕ Add User
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #f3e8ff, #faf5ff)' }}>
              <th className="text-left px-5 py-4 text-xs font-bold text-purple-700 uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-purple-700 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-purple-700 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-purple-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-12 text-gray-300">⏳ Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-12 text-gray-300">
                <div className="text-4xl mb-2">👤</div>
                <div>No users found</div>
              </td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleConfig[u.role]?.style}`}>
                      {roleConfig[u.role]?.icon} {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                      🟢 Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Users;