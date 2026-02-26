import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.username, formData.email, formData.password);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-dark-primary' : 'bg-gray-50'} px-4 animate-fade-in`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${isDark ? 'bg-purple-900' : 'bg-purple-100'} opacity-20 blur-3xl`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-100'} opacity-20 blur-3xl`}></div>
      </div>

      {/* Registration Card */}
      <div className={`relative max-w-md w-full ${isDark ? 'bg-dark-card border-dark-border shadow-dark-xl' : 'bg-white border-gray-100 shadow-2xl'} rounded-2xl border p-8 my-8 animate-scale-in`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-dark-text' : 'text-gray-900'} mb-2`}>
            Create Account
          </h2>
          <p className={isDark ? 'text-dark-textSecondary' : 'text-gray-500'}>
            Join Taskly and stay organized
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'} mb-2`}>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 ${isDark ? 'text-dark-textSecondary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="johndoe123"
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200`}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'} mb-2`}>
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 ${isDark ? 'text-dark-textSecondary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-dark-text' : 'text-gray-700'} mb-2`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 ${isDark ? 'text-dark-textSecondary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl ${isDark ? 'bg-dark-secondary border-dark-border text-dark-text placeholder-dark-textSecondary' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'} border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <p className={`mt-2 text-xs ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>
              Must be at least 8 characters long
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className={`h-4 w-4 rounded ${isDark ? 'bg-dark-secondary border-dark-border' : 'bg-white border-gray-300'} text-purple-600 focus:ring-purple-500 mt-1`}
              required
            />
            <label htmlFor="terms" className={`ml-2 block text-sm ${isDark ? 'text-dark-text' : 'text-gray-700'}`}>
              I agree to the{' '}
              <a href="#" className={`font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition`}>
                Terms and Conditions
              </a>
              {' '}and{' '}
              <a href="#" className={`font-medium ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition`}>
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className={`absolute inset-0 flex items-center ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
            <div className="w-full border-t"></div>
          </div>
          <div className={`relative flex justify-center text-sm ${isDark ? 'text-dark-textSecondary' : 'text-gray-500'}`}>
            <span className={`px-2 ${isDark ? 'bg-dark-card' : 'bg-white'}`}>Or continue with</span>
          </div>
        </div>

        

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
          <p className={isDark ? 'text-dark-textSecondary' : 'text-gray-600'}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className={`font-semibold ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} transition`}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;