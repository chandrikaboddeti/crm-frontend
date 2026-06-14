import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const stages = ['Prospect', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const stageConfig = {
  'Prospect': { gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', glow: 'rgba(79,172,254,0.4)', icon: '🔍' },
  'Proposal': { gradient: 'linear-gradient(135deg,#fa709a,#fee140)', glow: 'rgba(250,112,154,0.4)', icon: '📄' },
  'Negotiation': { gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', glow: 'rgba(240,147,251,0.4)', icon: '🤝' },
  'Closed Won': { gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', glow: 'rgba(67,233,123,0.4)', icon: '🏆' },
  'Closed Lost': { gradient: 'linear-gradient(135deg,#868f96,#596164)', glow: 'rgba(134,143,150,0.4)', icon: '❌' },
};

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', stage: 'Prospect', revenue: '' });

  const fetchDeals = async () => {
    try {
      const { data } = await api.get('/deals');
      setDeals(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchDeals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/deals', form);
      setShowForm(false); setForm({ title: '', stage: 'Prospect', revenue: '' });
      fetchDeals();
    } catch (err) { console.error(err); }
  };

  const handleStageChange = async (dealId, newStage) => {
    try { await api.put(`/deals/${dealId}`, { stage: newStage }); fetchDeals(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this deal?')) { await api.delete(`/deals/${id}`); fetchDeals(); }
  };

  const getDealsByStage = (stage) => deals.filter(d => d.stage === stage);
  const totalWon = deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + (d.revenue || 0), 0);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💼 Deals Pipeline</h2>
          <p className="text-sm text-gray-400 mt-0.5">{deals.length} deals · 🏆 ₹{totalWon.toLocaleString()} won</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 8px 25px rgba(168,85,247,0.4)' }}>
          <span className="relative z-10">+ New Deal</span>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
        </button>
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
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.5)'
                }}>💼</div>
                <h3 className="text-lg font-bold text-white">Add New Deal</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Deal Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. TechCorp SaaS Deal"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.6)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
                    required />
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Stage</label>
                  <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {stages.map(s => <option key={s} style={{ background: '#1a1535' }}>{s}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Revenue (₹)</label>
                  <input type="number" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.6)'}
                    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.12)'} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}>
                    <span className="relative z-10">➕ Add Deal</span>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
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

      {loading ? (
        <div className="text-center py-12 text-gray-300">⏳ Loading...</div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {stages.map(stage => {
            const config = stageConfig[stage];
            const stageDeals = getDealsByStage(stage);
            return (
              <div key={stage} className="rounded-2xl overflow-hidden" style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
              }}>
                <div className="p-3 relative overflow-hidden" style={{ background: config.gradient }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)' }}/>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{config.icon}</span>
                      <span className="text-xs font-bold text-white">{stage}</span>
                    </div>
                    <span className="text-xs font-bold text-white bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  {stageDeals.length === 0 ? (
                    <div className="text-xs text-gray-300 text-center py-8 border-2 border-dashed border-gray-100 rounded-xl m-1">
                      No deals
                    </div>
                  ) : stageDeals.map(deal => (
                    <div key={deal._id} className="rounded-xl p-3 mb-2 transition-all hover:shadow-md" style={{
                      background: 'linear-gradient(135deg, #fafafa, #f8f4ff)',
                      border: '1px solid rgba(168,85,247,0.1)'
                    }}>
                      <div className="text-xs font-bold text-gray-900 mb-1">{deal.title}</div>
                      {deal.revenue > 0 && (
                        <div className="text-xs font-bold mb-2" style={{
                          background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                          ₹{deal.revenue.toLocaleString()}
                        </div>
                      )}
                      <select value={deal.stage} onChange={(e) => handleStageChange(deal._id, e.target.value)}
                        className="w-full text-xs rounded-lg px-2 py-1.5 mb-2 focus:outline-none"
                        style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: '#6b21a8' }}>
                        {stages.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => handleDelete(deal._id)}
                        className="text-xs font-medium transition-colors"
                        style={{ color: 'rgba(239,68,68,0.6)' }}
                        onMouseEnter={e => e.target.style.color = '#ef4444'}
                        onMouseLeave={e => e.target.style.color = 'rgba(239,68,68,0.6)'}>
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Deals;