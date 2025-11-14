import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const AdminHeader = () => {
    const { t, isRTL } = useTranslation();
    const [adminData, setAdminData] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const storedAdminData = localStorage.getItem('adminData');
        if (storedAdminData) {
            setAdminData(JSON.parse(storedAdminData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/admin/login';
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo/Brand */}
                    <div className="flex items-center">
                        <h1 className={`text-xl font-bold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('admin.header.brand') || 'Hotel Booking Admin'}
                        </h1>
                    </div>

                    {/* Right side - User menu and notifications */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {adminData?.profile?.firstName?.charAt(0) || adminData?.username?.charAt(0) || 'A'}
                                    </span>
                                </div>
                                <div className={`hidden md:block text-left ${isRTL ? 'text-right' : ''}`}>
                                    <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                        {adminData?.profile?.firstName && adminData?.profile?.lastName
                                            ? `${adminData.profile.firstName} ${adminData.profile.lastName}`
                                            : adminData?.username || 'Admin'
                                        }
                                    </p>
                                    <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                                        {adminData?.role || 'Admin'}
                                    </p>
                                </div>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className={`text-sm font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                            {adminData?.profile?.firstName && adminData?.profile?.lastName
                                                ? `${adminData.profile.firstName} ${adminData.profile.lastName}`
                                                : adminData?.username || 'Admin'
                                            }
                                        </p>
                                        <p className={`text-xs text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                                            {adminData?.email || 'admin@example.com'}
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            // Navigate to profile settings
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isRTL ? 'font-arabic' : ''}`}
                                    >
                                        {t('admin.header.profile') || 'Profile Settings'}
                                    </button>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className={`block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${isRTL ? 'font-arabic' : ''}`}
                                    >
                                        {t('admin.header.logout') || 'Sign out'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                />
            )}
        </header>
    );
};

export default AdminHeader;
