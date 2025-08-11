import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import AvailabilityCalendar from './AvailabilityCalendar';

const BookingManagement = () => {
    const { user, getToken, axios, toast, currency } = useAppContext();
    const { t, isRTL } = useTranslation();
    
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [modifyData, setModifyData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: 1
    });

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/bookings/user', {
                headers: { authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                setBookings(data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModifyBooking = async () => {
        try {
            const { data } = await axios.put(`/api/bookings/${selectedBooking._id}/modify`, modifyData, {
                headers: { authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                toast.success(t('bookingManagement.modifySuccess') || 'Booking modified successfully');
                setShowModifyModal(false);
                fetchBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancelBooking = async () => {
        try {
            const { data } = await axios.put(`/api/bookings/${selectedBooking._id}/cancel`, {}, {
                headers: { authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                toast.success(t('bookingManagement.cancelSuccess') || 'Booking cancelled successfully');
                setShowCancelModal(false);
                fetchBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
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
            case 'confirmed': return t('bookingManagement.confirmed') || 'Confirmed';
            case 'pending': return t('bookingManagement.pending') || 'Pending';
            case 'cancelled': return t('bookingManagement.cancelled') || 'Cancelled';
            default: return status;
        }
    };

    const canModifyBooking = (booking) => {
        const checkInDate = new Date(booking.checkInDate);
        const today = new Date();
        const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
        return booking.status === 'confirmed' && daysUntilCheckIn > 1;
    };

    const canCancelBooking = (booking) => {
        const checkInDate = new Date(booking.checkInDate);
        const today = new Date();
        const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
        return booking.status === 'confirmed' && daysUntilCheckIn > 0;
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className={`p-6 ${isRTL ? 'font-arabic' : ''}`}>
            <div className="mb-8">
                <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('bookingManagement.title') || 'My Bookings'}
                </h1>
                <p className={`text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('bookingManagement.subtitle') || 'Manage your hotel bookings and reservations'}
                </p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('bookingManagement.noBookings') || 'No bookings found'}
                    </h3>
                    <p className={`text-gray-500 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('bookingManagement.noBookingsText') || 'You haven\'t made any bookings yet. Start exploring hotels!'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                {/* Booking Info */}
                                <div className="flex-1">
                                    <div className="flex items-start space-x-4">
                                        <img 
                                            src={booking.room.images[0]} 
                                            alt={booking.hotel.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                                {booking.hotel.name}
                                            </h3>
                                            <p className={`text-gray-600 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                                {booking.room.roomType} • {booking.guests} {t('bookingManagement.guests') || 'guests'}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>
                                                    {t('bookingManagement.checkIn') || 'Check-in'}: {new Date(booking.checkInDate).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    {t('bookingManagement.checkOut') || 'Check-out'}: {new Date(booking.checkOutDate).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    {t('bookingManagement.total') || 'Total'}: {currency} {booking.totalPrice}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status and Actions */}
                                <div className="mt-4 lg:mt-0 lg:ml-6">
                                    <div className="flex flex-col items-end space-y-3">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                        
                                        <div className="flex space-x-2">
                                            {canModifyBooking(booking) && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setModifyData({
                                                            checkInDate: booking.checkInDate.split('T')[0],
                                                            checkOutDate: booking.checkOutDate.split('T')[0],
                                                            guests: booking.guests
                                                        });
                                                        setShowModifyModal(true);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    {t('bookingManagement.modify') || 'Modify'}
                                                </button>
                                            )}
                                            
                                            {canCancelBooking(booking) && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowCancelModal(true);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    {t('bookingManagement.cancel') || 'Cancel'}
                                                </button>
                                            )}
                                            
                                            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                {t('bookingManagement.viewDetails') || 'Details'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modify Booking Modal */}
            {showModifyModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('bookingManagement.modifyBooking') || 'Modify Booking'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('bookingManagement.checkInDate') || 'Check-in Date'}
                                </label>
                                <input
                                    type="date"
                                    value={modifyData.checkInDate}
                                    onChange={(e) => setModifyData({...modifyData, checkInDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('bookingManagement.checkOutDate') || 'Check-out Date'}
                                </label>
                                <input
                                    type="date"
                                    value={modifyData.checkOutDate}
                                    onChange={(e) => setModifyData({...modifyData, checkOutDate: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min={modifyData.checkInDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('bookingManagement.guests') || 'Number of Guests'}
                                </label>
                                <input
                                    type="number"
                                    value={modifyData.guests}
                                    onChange={(e) => setModifyData({...modifyData, guests: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="1"
                                    max="10"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowModifyModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('common.cancel') || 'Cancel'}
                            </button>
                            <button
                                onClick={handleModifyBooking}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {t('bookingManagement.confirmModify') || 'Confirm Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('bookingManagement.cancelBooking') || 'Cancel Booking'}
                        </h3>
                        
                        <p className={`text-gray-600 mb-6 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('bookingManagement.cancelConfirmation') || 'Are you sure you want to cancel this booking? This action cannot be undone.'}
                        </p>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm text-red-700 ${isRTL ? 'font-arabic' : ''}`}>
                                        {t('bookingManagement.cancelWarning') || 'Cancellation fees may apply based on the hotel\'s cancellation policy.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {t('common.keep') || 'Keep Booking'}
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {t('bookingManagement.confirmCancel') || 'Cancel Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;
