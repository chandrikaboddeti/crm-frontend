import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon, gradient, glow, sub }) => (
  <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{
    background: gradient,
    boxShadow: `0 8px 32px ${glow}, 0 2px 8px rgba(0,0,0,0.1)`
  }}>
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{
      background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
      transform: 'translate(30%, -30%)'
    }}/>
    <div className="absolute inset-0" style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)'
    }}/>
    <div className="relative z-10">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-90">{title}</div>
      {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState(0);
  const [leads, setLeads] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, leadRes] = await Promise.all([
          api.get('/customers'),
          api.get('/leads')
        ]);
        setCustomers(custRes.data.total || 0);
        setLeads(leadRes.data.length || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-3xl p-6" style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          boxShadow: '0 20px 60px rgba(15,12,41,0.4)'
        }}>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 70% 50%, rgba(168,85,247,0.3), transparent 60%)'
          }}/>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent)',
            filter: 'blur(40px)'
          }}/>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                ✨ Good morning, {user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Here's your business overview for today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{user?.name}</div>
                <div className="text-xs capitalize px-2 py-0.5 rounded-full inline-block" style={{
                  background: 'rgba(168,85,247,0.3)',
                  color: '#e2b3ff',
                  border: '1px solid rgba(168,85,247,0.4)'
                }}>{user?.role}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white" style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                boxShadow: '0 0 20px rgba(168,85,247,0.5)'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Customers" value={customers} icon="👥"
          gradient="linear-gradient(135deg, #667eea, #764ba2)"
          glow="rgba(102,126,234,0.4)" sub="All time" />
        <StatCard title="Active Leads" value={leads} icon="🎯"
          gradient="linear-gradient(135deg, #f093fb, #f5576c)"
          glow="rgba(240,147,251,0.4)" sub="This month" />
        <StatCard title="Total Revenue" value="₹4.2L" icon="💰"
          gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
          glow="rgba(79,172,254,0.4)" sub="Mock data" />
        <StatCard title="Conversion" value="28%" icon="📈"
          gradient="linear-gradient(135deg, #43e97b, #38f9d7)"
          glow="rgba(67,233,123,0.4)" sub="Lead to customer" />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm" style={{
        border: '1px solid rgba(168,85,247,0.1)',
        boxShadow: '0 4px 30px rgba(168,85,247,0.08)'
      }}>
        <h3 className="text-base font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { href: '/customers', icon: '👥', label: 'Add Customer', desc: 'Create new client',
              gradient: 'linear-gradient(135deg, #667eea, #764ba2)', glow: 'rgba(102,126,234,0.3)' },
            { href: '/leads', icon: '🎯', label: 'Add Lead', desc: 'Track prospect',
              gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', glow: 'rgba(240,147,251,0.3)' },
            { href: '/deals', icon: '💼', label: 'New Deal', desc: 'Pipeline entry',
              gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)', glow: 'rgba(67,233,123,0.3)' },
          ].map((action) => (
            <a key={action.href} href={action.href}
              className="flex flex-col items-center p-6 rounded-2xl text-center transition-all hover:scale-105 relative overflow-hidden text-white"
              style={{ background: action.gradient, boxShadow: `0 8px 25px ${action.glow}` }}>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent)'
              }}/>
              <span className="text-4xl mb-3 relative z-10">{action.icon}</span>
              <div className="text-sm font-bold relative z-10">{action.label}</div>
              <div className="text-xs opacity-80 mt-1 relative z-10">{action.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;