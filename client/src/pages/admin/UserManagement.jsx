import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const UserManagement = () => {
    const { t, isRTL } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams(filters);
            
            const response = await axios.get(`/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUsers(response.data.data.users);
                setPagination(response.data.data.pagination);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh the list
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            user: 'bg-blue-100 text-blue-800',
            hotelOwner: 'bg-green-100 text-green-800',
            admin: 'bg-purple-100 text-purple-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
                {role}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <AdminHeader />
                <div className="flex">
                    <AdminSidebar />
                    <div className="flex-1 p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                            <div className="h-64 bg-gray-300 rounded"></div>
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
                            {t('admin.users.title') || 'User Management'}
                        </h1>
                        <p className={`text-gray-600 mt-2 ${isRTL ? 'font-arabic' : ''}`}>
                            {t('admin.users.subtitle') || 'Manage platform users'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('admin.users.search') || 'Search'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t('admin.users.searchPlaceholder') || 'Search by name or email...'}
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('admin.users.role') || 'Role'}
                                </label>
                                <select
                                    value={filters.role}
                                    onChange={(e) => handleFilterChange('role', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                                >
                                    <option value="">{t('admin.users.allRoles') || 'All Roles'}</option>
                                    <option value="user">{t('admin.users.user') || 'User'}</option>
                                    <option value="hotelOwner">{t('admin.users.hotelOwner') || 'Hotel Owner'}</option>
                                    <option value="admin">{t('admin.users.admin') || 'Admin'}</option>
                                </select>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
                                    {t('admin.users.itemsPerPage') || 'Items per page'}
                                </label>
                                <select
                                    value={filters.limit}
                                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className={`text-lg font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                {t('admin.users.usersList') || 'Users List'}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {t('admin.users.name') || 'Name'}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {t('admin.users.email') || 'Email'}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {t('admin.users.role') || 'Role'}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {t('admin.users.joined') || 'Joined'}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'font-arabic text-right' : ''}`}>
                                            {t('admin.users.actions') || 'Actions'}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium text-sm">
                                                            {user.username?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                    <div className={`ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}>
                                                        <div className={`text-sm font-medium text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>
                                                            {user.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    {t('admin.users.delete') || 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className={`text-sm text-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                                        {t('admin.users.showing') || 'Showing'} {((pagination.currentPage - 1) * pagination.limit) + 1} {t('admin.users.to') || 'to'} {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} {t('admin.users.of') || 'of'} {pagination.totalUsers} {t('admin.users.results') || 'results'}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrev}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('admin.users.previous') || 'Previous'}
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNext}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('admin.users.next') || 'Next'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
