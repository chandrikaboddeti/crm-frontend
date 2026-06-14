import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';

export default function Activities() {
  const { darkMode } = useTheme();
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('activities');
  const [form, setForm] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchActivities();
    fetchTasks();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get('/activities/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', form);
      setShowModal(false);
      fetchActivities();
      setForm({
        type: 'call', title: '',
        description: '', dueDate: '', status: 'pending'
      });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/activities/${id}`);
    fetchActivities();
  };

  const handleStatusUpdate = async (id, status) => {
    await api.put(`/activities/${id}`, { status });
    fetchActivities();
  };

  // Theme colors
  const cardBg = darkMode ? '#1e293b' : 'white';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const subTextColor = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode
    ? 'rgba(255,255,255,0.1)'
    : 'rgba(14,165,233,0.15)';

  const typeConfig = {
    call: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: '📞 CALL' },
    email: { bg: 'rgba(14,165,233,0.1)', color: '#0ea5e9', label: '📧 EMAIL' },
    meeting: { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: '🤝 MEETING' },
    task: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: '✅ TASK' },
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold"
              style={{ color: textColor }}>
              📅 Activities & Tasks
            </h1>
            <p className="text-sm mt-0.5"
              style={{ color: subTextColor }}>
              Track all interactions and tasks
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-white px-5 py-2.5 rounded-xl text-sm
              font-semibold transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              boxShadow: '0 8px 25px rgba(14,165,233,0.35)'
            }}
          >
            + Add Activity
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {['activities', 'tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold
                transition-all capitalize"
              style={activeTab === tab ? {
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(14,165,233,0.3)'
              } : {
                background: cardBg,
                color: subTextColor,
                border: `1px solid ${borderColor}`
              }}
            >
              {tab === 'activities' ? '⚡ Activities' : '✅ Tasks'}
            </button>
          ))}
        </div>

        {/* Activities List */}
        {activeTab === 'activities' && (
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity._id}
                className="p-4 rounded-2xl flex justify-between
                  items-start transition-all hover:scale-[1.01]"
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 4px 15px rgba(14,165,233,0.06)'
                }}>
                <div className="flex gap-4">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{
                      background: typeConfig[activity.type]?.bg,
                      color: typeConfig[activity.type]?.color
                    }}>
                    {typeConfig[activity.type]?.label}
                  </span>
                  <div>
                    <p className="font-semibold text-sm"
                      style={{ color: textColor }}>
                      {activity.title}
                    </p>
                    <p className="text-xs mt-0.5"
                      style={{ color: subTextColor }}>
                      {activity.description}
                    </p>
                    <p className="text-xs mt-1"
                      style={{ color: '#0ea5e9' }}>
                      📅 {activity.dueDate
                        ? new Date(activity.dueDate).toLocaleDateString()
                        : 'No due date'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <select
                    value={activity.status}
                    onChange={(e) =>
                      handleStatusUpdate(activity._id, e.target.value)}
                    className="text-xs rounded-lg px-2 py-1.5
                      focus:outline-none"
                    style={{
                      background: 'rgba(14,165,233,0.1)',
                      color: '#0ea5e9',
                      border: '1px solid rgba(14,165,233,0.2)'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="text-xs px-3 py-1.5 rounded-lg
                      transition-all"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.2)'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-16 rounded-2xl"
                style={{
                  background: cardBg,
                  border: `2px dashed ${borderColor}`
                }}>
                <div className="text-5xl mb-3">📅</div>
                <p className="font-medium"
                  style={{ color: subTextColor }}>
                  No activities yet
                </p>
                <p className="text-sm mt-1"
                  style={{ color: subTextColor, opacity: 0.7 }}>
                  Click "+ Add Activity" to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tasks List */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task._id}
                className="p-4 rounded-2xl flex justify-between
                  items-center transition-all hover:scale-[1.01]"
                style={{
                  background: cardBg,
                  border: `1px solid ${borderColor}`,
                  boxShadow: '0 4px 15px rgba(14,165,233,0.06)'
                }}>
                <div>
                  <p className="font-semibold text-sm"
                    style={{ color: textColor }}>
                    {task.title}
                  </p>
                  <p className="text-xs mt-0.5"
                    style={{ color: subTextColor }}>
                    {task.description}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-lg
                    mt-1.5 inline-block font-semibold"
                    style={{
                      background: task.priority === 'high'
                        ? 'rgba(239,68,68,0.1)'
                        : task.priority === 'medium'
                        ? 'rgba(245,158,11,0.1)'
                        : 'rgba(16,185,129,0.1)',
                      color: task.priority === 'high'
                        ? '#ef4444'
                        : task.priority === 'medium'
                        ? '#f59e0b'
                        : '#10b981'
                    }}>
                    {task.priority} priority
                  </span>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-lg
                  font-semibold"
                  style={{
                    background: task.status === 'completed'
                      ? 'rgba(16,185,129,0.1)'
                      : task.status === 'in-progress'
                      ? 'rgba(14,165,233,0.1)'
                      : 'rgba(245,158,11,0.1)',
                    color: task.status === 'completed'
                      ? '#10b981'
                      : task.status === 'in-progress'
                      ? '#0ea5e9'
                      : '#f59e0b'
                  }}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-16 rounded-2xl"
                style={{
                  background: cardBg,
                  border: `2px dashed ${borderColor}`
                }}>
                <div className="text-5xl mb-3">✅</div>
                <p className="font-medium"
                  style={{ color: subTextColor }}>
                  No tasks yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center
            justify-center z-50"
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)'
            }}>
            <div className="rounded-3xl p-7 w-full max-w-md"
              style={{
                background: darkMode ? '#1e293b' : 'white',
                border: '1px solid rgba(14,165,233,0.2)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
              }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center
                  justify-center text-xl"
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
                  }}>
                  📅
                </div>
                <h2 className="text-lg font-bold"
                  style={{ color: textColor }}>
                  Add Activity
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <select
                  value={form.type}
                  onChange={e =>
                    setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(14,165,233,0.05)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    color: textColor
                  }}
                >
                  <option value="call">📞 Call</option>
                  <option value="email">📧 Email</option>
                  <option value="meeting">🤝 Meeting</option>
                  <option value="task">✅ Task</option>
                </select>
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={e =>
                    setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(14,165,233,0.05)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    color: textColor
                  }}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={e =>
                    setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(14,165,233,0.05)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    color: textColor
                  }}
                  rows={3}
                />
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e =>
                    setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none"
                  style={{
                    background: darkMode
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(14,165,233,0.05)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    color: textColor
                  }}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="flex-1 text-white py-2.5 rounded-xl
                      text-sm font-semibold"
                    style={{
                      background:
                        'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      boxShadow: '0 4px 15px rgba(14,165,233,0.3)'
                    }}
                  >
                    Save Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm
                      font-semibold"
                    style={{
                      background: darkMode
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(14,165,233,0.05)',
                      color: subTextColor,
                      border: `1px solid ${borderColor}`
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}