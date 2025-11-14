import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminDashboard = () => {
    const { t, isRTL } = useTranslation();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const StatCard = ({ title, value, icon, color = 'blue' }) => (
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
            <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
                    {icon}
                </div>
                <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                    <p className={`text-sm font-medium text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                        {title}
                    </p>
                    <p className={`text-2xl font-semibold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminHeader />
                <div className="flex">
                    <AdminSidebar />
                    <div className="flex-1 p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-gray-300 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />
            <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-8">
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('admin.dashboard.title') || 'Dashboard'}
                        </h1>
                        <p className={`text-gray-600 mt-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('admin.dashboard.subtitle') || 'Overview of your platform'}
                        </p>
                    </div>

                    {dashboardData && (
                        <>
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <StatCard
                                    title={t('admin.dashboard.totalUsers') || 'Total Users'}
                                    value={dashboardData.overview.totalUsers}
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    }
                                    color="blue"
                                />
                                <StatCard
                                    title={t('admin.dashboard.totalHotels') || 'Total Hotels'}
                                    value={dashboardData.overview.totalHotels}
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    }
                                    color="green"
                                />
                                <StatCard
                                    title={t('admin.dashboard.totalBookings') || 'Total Bookings'}
                                    value={dashboardData.overview.totalBookings}
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    }
                                    color="purple"
                                />
                                <StatCard
                                    title={t('admin.dashboard.totalRevenue') || 'Total Revenue'}
                                    value={formatCurrency(dashboardData.overview.totalRevenue)}
                                    icon={
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    }
                                    color="yellow"
                                />
                            </div>

                            {/* Pending Approvals */}
                            {dashboardData.overview.pendingHotels > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className={`text-yellow-800 font-medium ${isRTL ? 'font-arabic' : ''}`}>
                                            {dashboardData.overview.pendingHotels} {t('admin.dashboard.pendingHotels') || 'hotels pending approval'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Recent Bookings */}
                            <div className="bg-white rounded-lg shadow mb-8">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className={`text-lg font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                        {t('admin.dashboard.recentBookings') || 'Recent Bookings'}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                                    {t('admin.dashboard.customer') || 'Customer'}
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                                    {t('admin.dashboard.hotel') || 'Hotel'}
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                                    {t('admin.dashboard.room') || 'Room'}
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                                    {t('admin.dashboard.amount') || 'Amount'}
                                                </th>
                                                <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                                    {t('admin.dashboard.date') || 'Date'}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dashboardData.recentBookings.map((booking) => (
                                                <tr key={booking._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {booking.user?.username || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.user?.email || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {booking.hotel?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {booking.room?.roomType || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(booking.totalPrice)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(booking.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Performing Hotels */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className={`text-lg font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                        {t('admin.dashboard.topHotels') || 'Top Performing Hotels'}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {dashboardData.topHotels.map((hotel, index) => (
                                            <div key={hotel._id?._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                        {index + 1}
                                                    </div>
                                                    <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                                        <div className={`text-sm font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                                            {hotel._id?.name || 'Unknown Hotel'}
                                                        </div>
                                                        <div className={`text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                                                            {hotel._id?.city || 'Unknown City'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                                        {formatCurrency(hotel.totalRevenue)}
                                                    </div>
                                                    <div className={`text-sm text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                                                        {hotel.totalBookings} {t('admin.dashboard.bookings') || 'bookings'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
