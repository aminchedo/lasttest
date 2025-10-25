import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon, UserPlus, Shield, Clock, CheckCircle,
    Search, Filter, Eye, Edit, Trash2, Mail, Calendar, Crown
} from 'lucide-react';
import api from '../api/endpoints';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const result = await api.getUsers();
            if (result.ok && result.data) {
                setUsers(result.data);
            } else {
                console.error('Error loading users:', result.error);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
            return;
        }
        try {
            const result = await api.deleteUser(id);
            if (result.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                alert('خطا در حذف کاربر');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('خطا در حذف کاربر');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle size={16} className="text-green-500" />;
            case 'inactive': return <Clock size={16} className="text-gray-500" />;
            case 'banned': return <Clock size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-gray-500" />;
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Crown size={20} className="text-yellow-500" />;
            case 'moderator': return <Shield size={20} className="text-blue-500" />;
            case 'user': return <UsersIcon size={20} className="text-green-500" />;
            default: return <UsersIcon size={20} className="text-gray-500" />;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'مدیر';
            case 'moderator': return 'ناظر';
            case 'user': return 'کاربر';
            default: return 'نامشخص';
        }
    };

    if (loading) {
        return (
            <div className="users-page animate-fadeInUp">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            👥 مدیریت کاربران
                        </h1>
                        <p className="helper">مدیریت کاربران و دسترسی‌ها</p>
                    </div>
                </div>

                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">در حال بارگذاری کاربران...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-12 animate-fadeInUp">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        👥 مدیریت کاربران
                    </h1>
                    <p className="helper">مدیریت کاربران و دسترسی‌ها</p>
                </div>
                <div className="page-actions">
                    <button className="glass-button">
                        <UserPlus size={16} />
                        افزودن کاربر
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card metric-purple animate-fadeInUp animation-delay-100">
                    <div className="stat-header">
                        <div className="stat-icon">👥</div>
                        <span className="stat-trend">↑</span>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{users.length}</p>
                        <p className="stat-label">کل کاربران</p>
                        <p className="stat-sublabel">ثبت‌نام شده</p>
                    </div>
                </div>

                <div className="stat-card metric-blue animate-fadeInUp animation-delay-200">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                        <span className="stat-trend">↑</span>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{users.filter(u => u.status === 'active').length}</p>
                        <p className="stat-label">کاربران فعال</p>
                        <p className="stat-sublabel">آنلاین</p>
                    </div>
                </div>

                <div className="stat-card metric-green animate-fadeInUp animation-delay-300">
                    <div className="stat-header">
                        <div className="stat-icon">👑</div>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{users.filter(u => u.role === 'admin').length}</p>
                        <p className="stat-label">مدیران</p>
                        <p className="stat-sublabel">دسترسی کامل</p>
                    </div>
                </div>

                <div className="stat-card metric-orange animate-fadeInUp animation-delay-400">
                    <div className="stat-header">
                        <div className="stat-icon">🛡️</div>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{users.filter(u => u.role === 'moderator').length}</p>
                        <p className="stat-label">ناظران</p>
                        <p className="stat-sublabel">دسترسی محدود</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Filters */}
            <div className="filters-section glass-card animate-fadeInUp animation-delay-500">
                <div className="search-container">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="جستجو در کاربران..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterRole('all')}
                    >
                        <UsersIcon size={16} />
                        همه
                    </button>
                    <button
                        className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                        onClick={() => setFilterRole('admin')}
                    >
                        <Crown size={16} />
                        مدیران
                    </button>
                    <button
                        className={`filter-btn ${filterRole === 'moderator' ? 'active' : ''}`}
                        onClick={() => setFilterRole('moderator')}
                    >
                        <Shield size={16} />
                        ناظران
                    </button>
                    <button
                        className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
                        onClick={() => setFilterRole('user')}
                    >
                        <UsersIcon size={16} />
                        کاربران
                    </button>
                </div>
            </div>

            {/* Enhanced Users Grid */}
            <div className="users-grid">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="user-card interactive-card animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="user-header">
                                <div className="user-avatar">
                                    <span className="avatar-text">{user.avatar}</span>
                                </div>
                                <div className="user-info">
                                    <h3 className="user-name">{user.name}</h3>
                                    <p className="user-email">{user.email}</p>
                                    <div className="user-role">
                                        {getRoleIcon(user.role)}
                                        <span>{getRoleLabel(user.role)}</span>
                                    </div>
                                </div>
                                <div className="user-status">
                                    {getStatusIcon(user.status)}
                                    <span className="status-text">
                                        {user.status === 'active' && 'فعال'}
                                        {user.status === 'inactive' && 'غیرفعال'}
                                        {user.status === 'banned' && 'مسدود'}
                                    </span>
                                </div>
                            </div>

                            <div className="user-details">
                                <div className="user-metrics">
                                    <div className="metric-item">
                                        <Calendar size={14} />
                                        <span>عضویت: {user.joinDate}</span>
                                    </div>
                                    <div className="metric-item">
                                        <Clock size={14} />
                                        <span>آخرین ورود: {user.lastLogin}</span>
                                    </div>
                                </div>

                                <div className="user-permissions">
                                    <div className="permissions-label">دسترسی‌ها:</div>
                                    <div className="permissions-list">
                                        {user.permissions.map((permission, idx) => (
                                            <span key={idx} className="permission-tag">
                                                {permission === 'read' && 'خواندن'}
                                                {permission === 'write' && 'نوشتن'}
                                                {permission === 'moderate' && 'نظارت'}
                                                {permission === 'admin' && 'مدیریت'}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="user-footer">
                                    <div className="user-actions">
                                        <button className="action-btn">
                                            <Eye size={16} />
                                        </button>
                                        <button className="action-btn">
                                            <Edit size={16} />
                                        </button>
                                        <button className="action-btn">
                                            <Mail size={16} />
                                        </button>
                                        <button className="action-btn danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-users glass-card">
                        <UsersIcon size={64} />
                        <h3>هیچ کاربری یافت نشد</h3>
                        <p>برای شروع، کاربر جدید اضافه کنید</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
