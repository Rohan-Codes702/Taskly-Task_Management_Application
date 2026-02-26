import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const TaskForm = ({ onTaskCreated, editingTask, onCancelEdit }) => {
  const { isDark } = useTheme();
  const [form, setForm] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    status: editingTask?.status || 'Pending',
    priority: editingTask?.priority || 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, form);
        toast.success('Task updated successfully!');
      } else {
        await API.post('/tasks', form);
        toast.success('Task created successfully!');
      }
      
      setForm({ title: '', description: '', status: 'Pending', priority: 'Medium' });
      onTaskCreated?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border-dark-border shadow-dark-lg' : 'bg-white border-gray-200 shadow-lg'} border`}>
      <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-dark-text' : 'text-gray-800'}`}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            required
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
              isDark 
                ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter task description..."
            rows="3"
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none ${
              isDark 
                ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none ${
                isDark 
                  ? 'bg-dark-secondary border-dark-border text-dark-text' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none ${
                isDark 
                  ? 'bg-dark-secondary border-dark-border text-dark-text' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-glow' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingTask ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              editingTask ? 'Update Task' : 'Create Task'
            )}
          </button>
          
          {editingTask && (
            <button
              type="button"
              onClick={onCancelEdit}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;