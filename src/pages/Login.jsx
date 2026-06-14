import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.3) 0%, transparent 60%)',
        }}/>
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10" style={{
          background: 'radial-gradient(circle, #a855f7, transparent)',
          filter: 'blur(40px)'
        }}/>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: '0 0 20px rgba(168,85,247,0.5)'
          }}>
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <div className="text-white font-bold text-xl">CRM Pro</div>
            <div className="text-purple-300 text-xs">Business Suite</div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Grow your business with <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>smart CRM</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Manage customers, track leads, and close deals faster.
          </p>
          <div className="flex gap-4 mt-8">
            {[{ val: '128+', label: 'Customers' }, { val: '34+', label: 'Active Leads' }, { val: '28%', label: 'Conversion' }].map((item) => (
              <div key={item.label} className="flex-1 text-center p-4 rounded-2xl border border-white border-opacity-10" style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <div className="text-2xl font-bold text-white">{item.val}</div>
                <div className="text-purple-300 text-xs mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-500 text-sm">© 2026 CRM Pro. All rights reserved.</div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative" style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className="absolute inset-0 border-l border-white border-opacity-10"/>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 relative" style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              boxShadow: '0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(168,85,247,0.2)'
            }}>
              <span className="text-white text-3xl font-bold">C</span>
              <div className="absolute inset-0 rounded-3xl" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
              }}/>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your CRM Pro account</p>
          </div>

          {error && (
            <div className="border border-red-500 border-opacity-50 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2" style={{
              background: 'rgba(239,68,68,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.8)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(168,85,247,0.8)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.15)'}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-xl text-sm font-semibold transition-all relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
                boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <span className="relative z-10">{loading ? '⏳ Signing in...' : '🚀 Sign in to CRM Pro'}</span>
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
              }}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;