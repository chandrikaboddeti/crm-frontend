import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', desc: 'Overview' },
    { path: '/customers', label: 'Customers', icon: '👥', desc: 'Manage clients' },
    { path: '/leads', label: 'Leads', icon: '🎯', desc: 'Track prospects' },
    { path: '/deals', label: 'Deals', icon: '💼', desc: 'Sales pipeline' },
    ...(user?.role === 'admin' ? [{ path: '/users', label: 'Users', icon: '👤', desc: 'Manage team' }] : []),
  { path: '/activities', label: 'Activities', icon: '📅', desc: 'Track interactions' },
{ path: '/reports', label: 'Reports', icon: '📈', desc: 'Analytics' },
  ];

  return (
    <div className="w-60 h-screen fixed left-0 top-0 flex flex-col" style={{
      background: 'linear-gradient(180deg, #0f0c29 0%, #1a1535 50%, #0f0c29 100%)',
      borderRight: '1px solid rgba(168,85,247,0.2)',
      boxShadow: '4px 0 30px rgba(0,0,0,0.5)'
    }}>
      <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative" style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: '0 0 20px rgba(168,85,247,0.6)'
          }}>
            <span className="text-white font-bold text-base relative z-10">C</span>
            <div className="absolute inset-0 rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)'
            }}/>
          </div>
          <div>
            <div className="font-bold text-white text-base">CRM Pro</div>
            <div className="text-xs" style={{ color: 'rgba(168,85,247,0.8)' }}>Business Suite</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <div className="text-xs font-semibold px-3 mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Navigation
        </div>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all relative overflow-hidden"
            style={location.pathname === link.path ? {
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.2))',
              border: '1px solid rgba(168,85,247,0.4)',
              boxShadow: '0 0 20px rgba(168,85,247,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
            } : {
              border: '1px solid transparent'
            }}
          >
            {location.pathname === link.path && (
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)'
              }}/>
            )}
            <span className="text-xl relative z-10">{link.icon}</span>
            <div className="relative z-10">
              <div className="text-sm font-semibold" style={{
                color: location.pathname === link.path ? '#e2b3ff' : 'rgba(255,255,255,0.7)'
              }}>
                {link.label}
              </div>
              <div className="text-xs" style={{
                color: location.pathname === link.path ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.3)'
              }}>
                {link.desc}
              </div>
            </div>
            {location.pathname === link.path && (
              <div className="absolute right-2 w-1.5 h-6 rounded-full" style={{
                background: 'linear-gradient(180deg, #a855f7, #ec4899)',
                boxShadow: '0 0 10px rgba(168,85,247,0.8)'
              }}/>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm" style={{
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: '0 0 15px rgba(168,85,247,0.4)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="text-xs capitalize" style={{ color: 'rgba(168,85,247,0.8)' }}>{user?.role}</div>
          </div>
        </div>
        <button
  onClick={toggleTheme}
  className="w-full flex items-center gap-2 px-3 py-2
    rounded-xl transition-all text-sm mb-1"
  style={{
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)'
  }}
>
  <span>{darkMode ? '☀️' : '🌙'}</span>
  {darkMode ? 'Light Mode' : 'Dark Mode'}
</button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;