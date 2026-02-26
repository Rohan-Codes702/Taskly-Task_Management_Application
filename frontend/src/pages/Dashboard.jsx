import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', priority: 'Medium' });
  const [editingId, setEditingId] = useState(null);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks', {
        params: { page, status: statusFilter, search }
      });
      setTasks(data.tasks || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, form);
        toast.success('Task updated');
        setEditingId(null);
      } else {
        await API.post('/tasks', form);
        toast.success('Task created');
      }
      setForm({ title: '', description: '', status: 'Pending', priority: 'Medium' });
      fetchTasks();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setForm({ 
      title: task.title, 
      description: task.description, 
      status: task.status,
      priority: task.priority || 'Medium'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/tasks/${id}`, { status: newStatus });
      toast.success('Task status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Helper for dynamic status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return isDark ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return isDark ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
      default: return isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return isDark ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return isDark ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-dark-primary' : 'bg-gray-50'} animate-fade-in`}>
      <Navigation />
      
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'} mb-2`}>
                Taskly <span className="text-blue-500 font-medium">Dashboard</span>
              </h1>
              <p className={isDark ? 'text-dark-textSecondary' : 'text-gray-500'}>
                Welcome back, {user?.name || 'User'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-center md:text-right">
                <div className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>
                  {completionRate}%
                </div>
                <div className={`text-sm ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>
                  Completion Rate
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'} border shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in`} style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>Total Tasks</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'}`}>{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'} border shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in`} style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>Completed</p>
                <p className={`text-2xl font-bold text-green-500`}>{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'} border shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in`} style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>In Progress</p>
                <p className={`text-2xl font-bold text-yellow-500`}>{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'} border shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in`} style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>Pending</p>
                <p className={`text-2xl font-bold text-orange-500`}>{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Task Form */}
          <section className="lg:col-span-1">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border shadow-dark-lg' : 'bg-white border-gray-200 shadow-lg'} sticky top-24 animate-scale-in`} style={{animationDelay: '0.5s'}}>
              <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
                {editingId ? 'Edit Task' : 'Create New Task'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200`}
                  placeholder="Task title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <textarea
                  className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200`}
                  placeholder="Task description"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className={`px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all duration-200`}
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  
                  <select 
                    className={`px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all duration-200`}
                    value={form.priority} 
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className={`flex-1 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-glow`}
                  >
                    {editingId ? 'Update Task' : 'Add Task'}
                  </button>
                  {editingId && (
                    <button 
                      type="button" 
                      className={`${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} font-medium py-3 px-4 rounded-lg transition-all duration-200`}
                      onClick={() => { setEditingId(null); setForm({ title: '', description: '', status: 'Pending', priority: 'Medium' }) }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: List & Filters */}
          <section className="lg:col-span-2 space-y-6">
            
            {/* Search & Filter Bar */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card border-dark-border shadow-dark-lg' : 'bg-white border-gray-200 shadow-lg'} animate-scale-in`} style={{animationDelay: '0.6s'}}>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className={`flex-1 px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                  className={`px-4 py-3 rounded-lg ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text' : 'bg-white border-gray-200 text-gray-900'} border focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200`}
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Task Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.length > 0 ? tasks.map((task, index) => (
                <div 
                  key={task._id} 
                  className={`p-5 rounded-xl ${isDark ? 'bg-dark-card border-dark-border hover:shadow-glow' : 'bg-white border-gray-200 hover:shadow-xl'} border shadow-lg flex flex-col justify-between transition-all duration-300 animate-scale-in hover:scale-[1.02]`} 
                  style={{animationDelay: `${0.7 + index * 0.1}s`}}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'} truncate pr-2`}>{task.title}</h3>
                      <div className="flex gap-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <p className={`${isDark ? 'text-dark-textSecondary' : 'text-gray-600'} text-sm mb-4 line-clamp-2`}>{task.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Status Change Buttons */}
                    <div className="flex gap-2">
                      {task.status !== 'Pending' && (
                        <button 
                          onClick={() => handleStatusChange(task._id, 'Pending')}
                          className="text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition"
                        >
                          Pending
                        </button>
                      )}
                      {task.status !== 'In Progress' && (
                        <button 
                          onClick={() => handleStatusChange(task._id, 'In Progress')}
                          className="text-xs font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 px-2 py-1 rounded transition"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button 
                          onClick={() => handleStatusChange(task._id, 'Completed')}
                          className="text-xs font-medium text-green-500 hover:bg-green-50 dark:hover:bg-green-900 px-2 py-1 rounded transition"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => handleEdit(task)} 
                        className={`flex-1 text-sm font-medium ${isDark ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'} px-3 py-2 rounded-lg transition-all duration-200`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(task._id)} 
                        className={`flex-1 text-sm font-medium ${isDark ? 'text-red-400 hover:bg-red-900' : 'text-red-600 hover:bg-red-50'} px-3 py-2 rounded-lg transition-all duration-200`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className={`col-span-full py-12 text-center ${isDark ? 'text-dark-textSecondary' : 'text-gray-400'} animate-scale-in`}>
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  No tasks found. Try adjusting your filters or create a new task.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 animate-scale-in">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)} 
                  className={`px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 ${isDark ? 'bg-dark-card border-dark-border text-dark-text hover:bg-dark-secondary' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border shadow-lg`}
                >
                  Previous
                </button>
                <span className={`text-sm ${isDark ? 'text-dark-textSecondary' : 'text-gray-600'}`}>
                  Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
                </span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)} 
                  className={`px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} shadow-lg hover:shadow-glow`}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;