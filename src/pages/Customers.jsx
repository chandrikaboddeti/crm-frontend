import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
const exportToCSV = () => {
  const headers = ['Name', 'Email', 'Phone', 'Company'];
  const rows = customers.map(c => [
    c.name, c.email, c.phone, c.company
  ]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customers.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
  const fetchCustomers = async () => {
    try {
      const { data } = await api.get(`/customers?search=${search}`);
      setCustomers(data.customers);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await api.put(`/customers/${editCustomer._id}`, form);
      } else {
        await api.post('/customers', form);
      }
      setShowForm(false); setEditCustomer(null);
      setForm({ name: '', email: '', phone: '', company: '' });
      fetchCustomers();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (c) => {
    setEditCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer?')) {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    }
  };

  const avatarColors = ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)', 'linear-gradient(135deg,#fa709a,#fee140)'];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👥 Customers</h2>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} total customers</p>
        </div>
        <button
  onClick={exportToCSV}
  className="text-white px-5 py-2.5 rounded-xl text-sm
    font-semibold transition-all hover:scale-105"
  style={{
    background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    boxShadow: '0 8px 25px rgba(67,233,123,0.4)'
  }}
>
  📥 Export CSV
</button>
        <button onClick={() => { setShowForm(true); setEditCustomer(null); setForm({ name: '', email: '', phone: '', company: '' }); }}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 8px 25px rgba(102,126,234,0.4)' }}>
          <span className="relative z-10">+ Add Customer</span>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
        </button>
      </div>

      <div className="mb-5">
        <div className="relative w-80">
          <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search customers..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 w-full text-sm focus:outline-none bg-white shadow-sm"
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
            onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.5)'}
            onBlur={e => e.target.style.border = '1px solid #e5e7eb'}
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(15,12,41,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-7 w-full max-w-md relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1a1535, #0f0c29)',
            border: '1px solid rgba(168,85,247,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 60px rgba(168,85,247,0.15)'
          }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(168,85,247,0.2), transparent 60%)' }}/>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  boxShadow: '0 0 20px rgba(102,126,234,0.5)'
                }}>👥</div>
                <h3 className="text-lg font-bold text-white">{editCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
              </div>
              <form onSubmit={handleSubmit}>
                {[{ field: 'name', label: 'Full Name', placeholder: 'John Doe' },
                  { field: 'email', label: 'Email Address', placeholder: 'john@company.com' },
                  { field: 'phone', label: 'Phone Number', placeholder: '+91 9876543210' },
                  { field: 'company', label: 'Company', placeholder: 'Company Inc.' }
                ].map(({ field, label, placeholder }) => (
                  <div key={field} className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</label>
                    <input type={field === 'email' ? 'email' : 'text'}
                      value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.6)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
                      required={field === 'name' || field === 'email'} />
                  </div>
                ))}
                <div className="flex gap-3 mt-5">
                  <button type="submit" className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 0 20px rgba(102,126,234,0.4)' }}>
                    <span className="relative z-10">{editCustomer ? '✏️ Update' : '➕ Add Customer'}</span>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditCustomer(null); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl overflow-hidden" style={{
        border: '1px solid rgba(168,85,247,0.1)',
        boxShadow: '0 4px 30px rgba(168,85,247,0.08)'
      }}>
        <div className="px-5 py-4 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63)'
        }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(168,85,247,0.3), transparent 60%)' }}/>
          <div className="relative z-10 grid grid-cols-5 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div>Customer</div><div>Email</div><div>Phone</div><div>Company</div><div>Actions</div>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-12 text-gray-300">⏳ Loading...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <div className="text-5xl mb-3">👥</div>
              <div className="font-medium text-gray-400">No customers yet</div>
              <div className="text-sm text-gray-300 mt-1">Add your first customer to get started</div>
            </div>
          ) : customers.map((c, i) => (
            <div key={c._id} className="grid grid-cols-5 items-center px-5 py-4 transition-all hover:bg-purple-50"
              style={{ borderBottom: '1px solid rgba(168,85,247,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{
                  background: avatarColors[i % avatarColors.length],
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900 text-sm">{c.name}</span>
              </div>
              <div className="text-gray-500 text-sm">{c.email}</div>
              <div className="text-gray-500 text-sm">{c.phone}</div>
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                  color: '#764ba2',
                  border: '1px solid rgba(118,75,162,0.2)'
                }}>{c.company}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(c)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all text-white"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 2px 8px rgba(102,126,234,0.3)' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(c._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Customers;