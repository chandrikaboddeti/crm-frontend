import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const statusConfig = {
  New: { gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', glow: 'rgba(79,172,254,0.3)', icon: '🆕' },
  Contacted: { gradient: 'linear-gradient(135deg,#fa709a,#fee140)', glow: 'rgba(250,112,154,0.3)', icon: '📞' },
  Qualified: { gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', glow: 'rgba(67,233,123,0.3)', icon: '✅' },
  Lost: { gradient: 'linear-gradient(135deg,#f5576c,#f093fb)', glow: 'rgba(245,87,108,0.3)', icon: '❌' },
  Converted: { gradient: 'linear-gradient(135deg,#a855f7,#ec4899)', glow: 'rgba(168,85,247,0.3)', icon: '🎉' },
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'New' });
const exportToCSV = () => {
  const headers = ['Name', 'Email', 'Phone', 'Status'];
  const rows = leads.map(l => [
    l.name, l.email, l.phone, l.status
  ]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLead) { await api.put(`/leads/${editLead._id}`, form); }
      else { await api.post('/leads', form); }
      setShowForm(false); setEditLead(null);
      setForm({ name: '', email: '', phone: '', status: 'New' });
      fetchLeads();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (l) => {
    setEditLead(l);
    setForm({ name: l.name, email: l.email, phone: l.phone, status: l.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead?')) { await api.delete(`/leads/${id}`); fetchLeads(); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎯 Leads</h2>
          <p className="text-sm text-gray-400 mt-0.5">Track and manage your sales pipeline</p>
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
        <button onClick={() => { setShowForm(true); setEditLead(null); setForm({ name: '', email: '', phone: '', status: 'New' }); }}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', boxShadow: '0 8px 25px rgba(240,147,251,0.4)' }}>
          <span className="relative z-10">+ Add Lead</span>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="relative overflow-hidden rounded-2xl p-4 text-white text-center" style={{
            background: config.gradient,
            boxShadow: `0 8px 25px ${config.glow}`
          }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
            <div className="relative z-10">
              <div className="text-2xl mb-1">{config.icon}</div>
              <div className="text-2xl font-bold">{leads.filter(l => l.status === status).length}</div>
              <div className="text-xs opacity-80 mt-0.5">{status}</div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(15,12,41,0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="rounded-3xl p-7 w-full max-w-md relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1a1535, #0f0c29)',
            border: '1px solid rgba(240,147,251,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 60px rgba(240,147,251,0.15)'
          }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(240,147,251,0.2), transparent 60%)' }}/>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  boxShadow: '0 0 20px rgba(240,147,251,0.5)'
                }}>🎯</div>
                <h3 className="text-lg font-bold text-white">{editLead ? 'Edit Lead' : 'Add New Lead'}</h3>
              </div>
              <form onSubmit={handleSubmit}>
                {[{ field: 'name', label: 'Full Name', type: 'text' },
                  { field: 'email', label: 'Email', type: 'email' },
                  { field: 'phone', label: 'Phone', type: 'text' }].map(({ field, label, type }) => (
                  <div key={field} className="mb-3">
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</label>
                    <input type={type} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                      onFocus={e => e.target.style.border = '1px solid rgba(240,147,251,0.6)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
                      required={field !== 'phone'} />
                  </div>
                ))}
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {Object.keys(statusConfig).map(s => <option key={s} style={{ background: '#1a1535' }}>{s}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="submit" className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', boxShadow: '0 0 20px rgba(240,147,251,0.4)' }}>
                    <span className="relative z-10">{editLead ? '✏️ Update' : '➕ Add Lead'}</span>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditLead(null); }}
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
        border: '1px solid rgba(240,147,251,0.1)',
        boxShadow: '0 4px 30px rgba(240,147,251,0.08)'
      }}>
        <div className="px-5 py-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(240,147,251,0.3), transparent 60%)' }}/>
          <div className="relative z-10 grid grid-cols-5 text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div>Lead</div><div>Email</div><div>Phone</div><div>Status</div><div>Actions</div>
          </div>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-12 text-gray-300">⏳ Loading...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🎯</div>
              <div className="font-medium text-gray-400">No leads yet</div>
            </div>
          ) : leads.map((l, i) => (
            <div key={l._id} className="grid grid-cols-5 items-center px-5 py-4 transition-all hover:bg-pink-50"
              style={{ borderBottom: '1px solid rgba(240,147,251,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{
                  background: Object.values(statusConfig)[i % 5].gradient,
                  boxShadow: `0 4px 12px ${Object.values(statusConfig)[i % 5].glow}`
                }}>
                  {l.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-900 text-sm">{l.name}</span>
              </div>
              <div className="text-gray-500 text-sm">{l.email}</div>
              <div className="text-gray-500 text-sm">{l.phone}</div>
              <div>
                <span className="text-xs font-bold px-2.5 py-1.5 rounded-full text-white" style={{
                  background: statusConfig[l.status]?.gradient,
                  boxShadow: `0 2px 8px ${statusConfig[l.status]?.glow}`
                }}>
                  {statusConfig[l.status]?.icon} {l.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(l)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', boxShadow: '0 2px 8px rgba(240,147,251,0.3)' }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(l._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
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

export default Leads;