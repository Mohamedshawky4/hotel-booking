import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', formData);

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));

        toast.success(t('admin.login.success') || 'Login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 px-8 text-center">
          <h2
            className={`text-3xl font-bold text-white tracking-wide ${
              isRTL ? 'font-arabic' : ''
            }`}
          >
            {t('admin.login.title') || 'Admin Login'}
          </h2>
          <p
            className={`mt-2 text-blue-100 text-sm ${
              isRTL ? 'font-arabic' : ''
            }`}
          >
            {t('admin.login.subtitle') || 'Sign in to your admin account'}
          </p>
        </div>

        {/* Form */}
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t('admin.login.email') || 'Email address'}
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12H8m8 0a4 4 0 10-8 0m8 0v1a3 3 0 01-3 3h-2a3 3 0 01-3-3v-1"
                />
              </svg>
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder={t('admin.login.password') || 'Password'}
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v2a2 2 0 002 2s2 0 2-2v-2zM6 11v-1a6 6 0 1112 0v1"
                />
              </svg>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 ${
              isRTL ? 'font-arabic' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  ></path>
                </svg>
                {t('admin.login.signingIn') || 'Signing in...'}
              </>
            ) : (
              t('admin.login.signIn') || 'Sign in'
            )}
          </button>

          {/* Demo credentials */}
          <div
            className={`text-center text-xs text-gray-500 border-t border-gray-200 pt-4 ${
              isRTL ? 'font-arabic' : ''
            }`}
          >
            <p>{t('admin.login.demoCredentials') || 'Demo credentials:'}</p>
            <p className="mt-1 font-mono text-gray-600">
              Email: <span className="font-semibold">admin@hotelbooking.com</span>
              <br />
              Pass: <span className="font-semibold">admin123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
