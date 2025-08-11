import React, { useState, useEffect } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import AvailabilityCalendar from '../../components/AvailabilityCalendar';

const EnhancedDashboard = () => {
    const { currency, user, getToken, toast, axios } = useAppContext();
    const { t, isRTL } = useTranslation();
    
    const [dashboardData, setDashboardData] = useState({
        bookings: [],
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        monthlyRevenue: [],
        topRooms: [],
        recentActivity: []
    });
    
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/bookings/hotel', {
                headers: { authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmed';
            case 'pending': return 'Pending';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    return (
        <div className={`p-6 ${isRTL ? 'font-arabic' : ''}`}>
            <Title 
                title={t('dashboard.title') || 'Hotel Dashboard'} 
                align={'left'} 
                font={'outfit'} 
                subTitle={t('dashboard.subtitle') || 'Manage your hotel operations and track performance'}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {t('dashboard.totalBookings') || 'Total Bookings'}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {dashboardData.totalBookings}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <img src={assets.totalBookingIcon} className="w-6 h-6" alt="bookings" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {t('dashboard.totalRevenue') || 'Total Revenue'}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {currency} {dashboardData.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <img src={assets.totalRevenueIcon} className="w-6 h-6" alt="revenue" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {t('dashboard.pendingBookings') || 'Pending'}
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {dashboardData.pendingBookings}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">
                                {t('dashboard.confirmedBookings') || 'Confirmed'}
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {dashboardData.confirmedBookings}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('dashboard.recentBookings') || 'Recent Bookings'}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                        {t('dashboard.guest') || 'Guest'}
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                        {t('dashboard.room') || 'Room'}
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                        {t('dashboard.amount') || 'Amount'}
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                        {t('dashboard.status') || 'Status'}
                                    </th>
                                    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                        {t('dashboard.actions') || 'Actions'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashboardData.bookings.slice(0, 10).map((booking, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            <div className="flex items-center">
                                                <img 
                                                    className="h-8 w-8 rounded-full mr-3" 
                                                    src={booking.user.image || 'https://via.placeholder.com/32'} 
                                                    alt="user" 
                                                />
                                                <div>
                                                    <div className="font-medium">{booking.user.username}</div>
                                                    <div className="text-gray-500">{booking.guests} {t('dashboard.guests') || 'guests'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {booking.room.roomType}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {currency} {booking.totalPrice}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isRTL ? 'text-right' : ''}`}>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'text-right' : ''}`}>
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                onClick={() => {
                                                    setSelectedRoom(booking.room);
                                                    setShowCalendar(true);
                                                }}
                                            >
                                                {t('dashboard.viewCalendar') || 'Calendar'}
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                {t('dashboard.viewDetails') || 'Details'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('dashboard.quickActions') || 'Quick Actions'}
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                {t('dashboard.addRoom') || 'Add New Room'}
                            </button>
                            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                {t('dashboard.viewAllBookings') || 'View All Bookings'}
                            </button>
                            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                {t('dashboard.generateReport') || 'Generate Report'}
                            </button>
                        </div>
                    </div>

                    {/* Top Performing Rooms */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('dashboard.topRooms') || 'Top Performing Rooms'}
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.topRooms.map((room, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className={`font-medium ${isRTL ? 'font-arabic' : ''}`}>{room.roomType}</p>
                                        <p className="text-sm text-gray-500">{room.bookings} {t('dashboard.bookings') || 'bookings'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{currency} {room.revenue}</p>
                                        <p className="text-sm text-green-600">+{room.occupancyRate}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('dashboard.recentActivity') || 'Recent Activity'}
                        </h3>
                        <div className="space-y-3">
                            {dashboardData.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Calendar Modal */}
            {showCalendar && selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                                {t('dashboard.availabilityCalendar') || 'Availability Calendar'} - {selectedRoom.roomType}
                            </h3>
                            <button 
                                onClick={() => setShowCalendar(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <AvailabilityCalendar 
                            roomId={selectedRoom._id}
                            onDateSelect={(dates) => console.log('Selected dates:', dates)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedDashboard;
