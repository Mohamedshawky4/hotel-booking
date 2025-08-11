import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const AvailabilityCalendar = ({ roomId, onDateSelect, selectedDates = {} }) => {
    const { t, isRTL } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);
    const [bookedDates, setBookedDates] = useState([]);

    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getMonthName = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const isDateBooked = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return bookedDates.includes(dateString);
    };

    const isDateSelected = (date) => {
        if (!selectedDates.checkIn || !selectedDates.checkOut) return false;
        const dateString = date.toISOString().split('T')[0];
        return dateString >= selectedDates.checkIn && dateString <= selectedDates.checkOut;
    };

    const isDateInRange = (date) => {
        if (!selectedDates.checkIn) return false;
        const dateString = date.toISOString().split('T')[0];
        return dateString >= selectedDates.checkIn;
    };

    const handleDateClick = (date) => {
        if (!date || isDateBooked(date)) return;

        const dateString = date.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        if (dateString < today) return;

        if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
            // Start new selection
            onDateSelect({ checkIn: dateString, checkOut: null });
        } else if (dateString > selectedDates.checkIn) {
            // Complete selection
            onDateSelect({ checkIn: selectedDates.checkIn, checkOut: dateString });
        }
    };

    const getDateClass = (date) => {
        if (!date) return 'calendar-day empty';
        
        const dateString = date.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        
        let classes = 'calendar-day';
        
        if (dateString < today) {
            classes += ' past';
        } else if (isDateBooked(date)) {
            classes += ' booked';
        } else if (isDateSelected(date)) {
            if (dateString === selectedDates.checkIn) {
                classes += ' selected check-in';
            } else if (dateString === selectedDates.checkOut) {
                classes += ' selected check-out';
            } else {
                classes += ' selected in-range';
            }
        } else if (isDateInRange(date)) {
            classes += ' in-range';
        } else {
            classes += ' available';
        }
        
        return classes;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const fetchAvailability = async () => {
        if (!roomId) return;
        
        setLoading(true);
        try {
            // This would be replaced with actual API call
            // const response = await axios.get(`/api/rooms/${roomId}/availability`);
            // setBookedDates(response.data.bookedDates);
            
            // Mock data for now
            const mockBookedDates = [
                '2024-12-25',
                '2024-12-26',
                '2024-12-27',
                '2025-01-15',
                '2025-01-16'
            ];
            setBookedDates(mockBookedDates);
        } catch (error) {
            console.error('Error fetching availability:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, [roomId, currentMonth]);

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={`availability-calendar ${isRTL ? 'rtl' : ''}`}>
            <div className="calendar-header">
                <button 
                    onClick={prevMonth}
                    className="calendar-nav-btn"
                    disabled={loading}
                >
                    ←
                </button>
                <h3 className={`calendar-title ${isRTL ? 'font-arabic' : ''}`}>
                    {getMonthName(currentMonth)}
                </h3>
                <button 
                    onClick={nextMonth}
                    className="calendar-nav-btn"
                    disabled={loading}
                >
                    →
                </button>
            </div>

            <div className="calendar-grid">
                {/* Week day headers */}
                {weekDays.map(day => (
                    <div key={day} className={`calendar-day-header ${isRTL ? 'font-arabic' : ''}`}>
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((date, index) => (
                    <div
                        key={index}
                        className={getDateClass(date)}
                        onClick={() => handleDateClick(date)}
                    >
                        {date ? date.getDate() : ''}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span className={isRTL ? 'font-arabic' : ''}>
                        {t('calendar.available') || 'Available'}
                    </span>
                </div>
                <div className="legend-item">
                    <div className="legend-color booked"></div>
                    <span className={isRTL ? 'font-arabic' : ''}>
                        {t('calendar.booked') || 'Booked'}
                    </span>
                </div>
                <div className="legend-item">
                    <div className="legend-color selected"></div>
                    <span className={isRTL ? 'font-arabic' : ''}>
                        {t('calendar.selected') || 'Selected'}
                    </span>
                </div>
            </div>

            {/* Selected dates display */}
            {(selectedDates.checkIn || selectedDates.checkOut) && (
                <div className="selected-dates">
                    <p className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                        {t('calendar.selectedDates') || 'Selected dates:'}
                    </p>
                    <div className={`flex gap-2 mt-1 ${isRTL ? 'rtl-flex-row-reverse' : ''}`}>
                        {selectedDates.checkIn && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {t('calendar.checkIn') || 'Check-in'}: {selectedDates.checkIn}
                            </span>
                        )}
                        {selectedDates.checkOut && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {t('calendar.checkOut') || 'Check-out'}: {selectedDates.checkOut}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityCalendar; 