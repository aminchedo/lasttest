// components/Header.jsx - نسخه اصلاح شده
import React, { useState } from 'react';
import { Search, Bell, Settings, User, Brain, Database, Cog, BarChart3 } from 'lucide-react';

function Header({ userData, systemStatus, currentPage }) {
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const titles = {
      dashboard: 'داشبورد',
      models: 'مدیریت مدل‌ها',
      training: 'آموزش مدل',
      settings: 'تنظیمات سیستم',
      datasets: 'مدیریت داده‌ها'
    };
    return titles[currentPage] || 'سیستم آموزش مدل فارسی';
  };

  const getPageIcon = () => {
    const icons = {
      dashboard: Brain,
      models: Database,
      training: Cog,
      settings: Settings,
      datasets: BarChart3
    };
    const IconComponent = icons[currentPage] || Brain;
    return <IconComponent size={20} />;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // جستجوی واقعی - می‌تواند به صفحه جستجو هدایت شود
      console.log('جستجو:', searchQuery);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="page-title">
          {getPageIcon()}
          {getPageTitle()}
        </div>
      </div>
      
      <div className="header-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="جستجو در مدل‌ها، داده‌ها، آموزش‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <Search size={16} />
          </button>
        </form>
      </div>
      
      <div className="header-right">
        <div className="user-actions">
          <div className="user-avatar">
            {userData ? (
              userData.avatar ? (
                <img src={userData.avatar} alt="پروفایل" />
              ) : (
                <User size={20} />
              )
            ) : (
              <div className="avatar-placeholder">
                <User size={20} />
              </div>
            )}
          </div>
          
          <div className="user-info">
            <div className="user-name">
              {userData?.name || 'در حال بارگذاری...'}
            </div>
            <div className="user-role">
              {userData?.role || 'کاربر'}
            </div>
          </div>
          
          <button className="action-btn" title="اعلان‌ها">
            <Bell size={16} />
            <span className="notification-badge">3</span>
          </button>
          
          <button className="action-btn" title="تنظیمات سریع">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;