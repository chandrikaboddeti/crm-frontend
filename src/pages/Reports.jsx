import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

export default function Reports() {
  const { darkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/reports/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Customers', stats?.totalCustomers],
      ['Total Leads', stats?.totalLeads],
      ['Total Deals', stats?.totalDeals],
      ['Conversion Rate', `${stats?.conversionRate}%`],
      ['Total Revenue', `$${stats?.totalRevenue}`],
    ];
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Theme colors
  const cardBg = darkMode ? '#1e293b' : 'white';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const subTextColor = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(14,165,233,0.15)';

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p style={{ color: subTextColor }}>Loading reports...</p>
        </div>
      </div>
    </Layout>
  );

  const statCards = [
    {
      label: 'Total Customers',
      value: stats?.totalCustomers,
      icon: '👥',
      color: '#0ea5e9',
      bg: 'rgba(14,165,233,0.1)',
      gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
    },
    {
      label: 'Total Leads',
      value: stats?.totalLeads,
      icon: '🎯',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      label: 'Total Deals',
      value: stats?.totalDeals,
      icon: '💼',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
    },
    {
      label: 'Conversion Rate',
      value: `${stats?.conversionRate}%`,
      icon: '📈',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
  ];

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold"
              style={{ color: textColor }}>
              📈 Reports & Analytics
            </h1>
            <p className="text-sm mt-0.5"
              style={{ color: subTextColor }}>
              Business performance overview
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="text-white px-5 py-2.5 rounded-xl text-sm
              font-semibold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              boxShadow: '0 8px 25px rgba(14,165,233,0.35)'
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => (
            <div key={i}
              className="rounded-2xl p-5 transition-all hover:scale-105"
              style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center
                  justify-center text-xl"
                  style={{ background: card.bg }}>
                  {card.icon}
                </div>
                <div className="w-2 h-2 rounded-full"
                  style={{ background: card.color }}/>
              </div>
              <div className="text-3xl font-bold mb-1"
                style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="text-xs font-medium"
                style={{ color: subTextColor }}>
                {card.label}
              </div>
              {/* Bottom gradient bar */}
              <div className="mt-3 h-1 rounded-full"
                style={{ background: card.gradient, opacity: 0.5 }}/>
            </div>
          ))}
        </div>

        {/* Lead Status Breakdown */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
          }}>
          {/* Card Header */}
          <div className="px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
            }}>
            <h2 className="text-white font-bold text-sm">
              🎯 Lead Status Breakdown
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {stats?.leadsByStatus?.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold"
                    style={{ color: textColor }}>
                    {item._id}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(14,165,233,0.1)',
                      color: '#0ea5e9'
                    }}>
                    {item.count} leads
                  </span>
                </div>
                <div className="h-2.5 rounded-full"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.1)'
                      : '#e2e8f0'
                  }}>
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width: `${(item.count / stats.totalLeads) * 100}%`,
                      background:
                        'linear-gradient(135deg, #0ea5e9, #0284c7)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals by Stage */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            boxShadow: '0 4px 20px rgba(14,165,233,0.08)'
          }}>
          {/* Card Header */}
          <div className="px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)'
            }}>
            <h2 className="text-white font-bold text-sm">
              💼 Deals by Stage
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats?.dealsByStage?.map((item, i) => (
                <div key={i}
                  className="flex justify-between items-center
                    py-3 rounded-xl px-4"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(14,165,233,0.04)',
                    border: `1px solid ${borderColor}`
                  }}>
                  <span className="text-sm font-semibold"
                    style={{ color: textColor }}>
                    {item._id}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: 'rgba(14,165,233,0.1)',
                        color: '#0ea5e9'
                      }}>
                      {item.count} deals
                    </span>
                    <span className="text-sm font-bold"
                      style={{ color: '#10b981' }}>
                      ${item.revenue?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Revenue */}
            <div className="mt-5 pt-5 flex justify-between items-center
              rounded-xl px-4 py-3"
              style={{
                borderTop: `1px solid ${borderColor}`,
                background: 'rgba(14,165,233,0.05)'
              }}>
              <span className="font-bold text-sm"
                style={{ color: textColor }}>
                💰 Total Revenue
              </span>
              <span className="text-xl font-bold"
                style={{ color: '#10b981' }}>
                ${stats?.totalRevenue?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}