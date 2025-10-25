// components/Navigation.jsx - Enhanced Modern Persian Sidebar
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Settings, Brain, Database, TrendingUp, Download, Users, LogOut,
  LayoutDashboard, ChevronRight, ChevronLeft, Menu, X, Bell, Search,
  Zap, Shield, BarChart3, FileText, UserCheck, Home, Cpu, HardDrive,
  Activity, Monitor, Smartphone, Tablet, ChefHat, Volume2
} from 'lucide-react';
import api from '../api/endpoints';

function Navigation({ currentPage, onPageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hardwarePerformance, setHardwarePerformance] = useState(65);
  const [menuCounts, setMenuCounts] = useState({
    models: 0,
    training: 0,
    datasets: 0,
    tts: 0,
    users: 0,
    exports: 0
  });

  // Simplified menu items with Persian styling - badges will be populated from API
  const menuItems = useMemo(() => [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: LayoutDashboard,
      category: 'main',
      badge: null
    },
    {
      id: 'models',
      label: 'مدل‌ها',
      icon: Brain,
      category: 'main',
      badge: menuCounts.models > 0 ? String(menuCounts.models) : null
    },
    {
      id: 'training',
      label: 'آموزش',
      icon: Zap,
      category: 'main',
      badge: menuCounts.training > 0 ? String(menuCounts.training) : null
    },
    // Comment out these sidebar items as per requirement
    /*
    {
      id: 'datasets',
      label: 'داده‌ها',
      icon: Database,
      category: 'main',
      badge: menuCounts.datasets > 0 ? String(menuCounts.datasets) : null
    },
    {
      id: 'downloader',
      label: 'دانلود منابع',
      icon: Download,
      category: 'main',
      badge: null
    },
    {
      id: 'huggingface',
      label: '🤗 Hugging Face',
      icon: Brain,
      category: 'main',
      badge: null
    },
    {
      id: 'tts',
      label: 'تبدیل متن به گفتار',
      icon: Volume2,
      category: 'main',
      badge: menuCounts.tts > 0 ? String(menuCounts.tts) : null
    },
    */
    {
      id: 'analysis',
      label: 'آنالیز',
      icon: BarChart3,
      category: 'tools',
      badge: null
    },
    {
      id: 'exports',
      label: 'خروجی‌ها',
      icon: FileText,
      category: 'tools',
      badge: menuCounts.exports > 0 ? String(menuCounts.exports) : null
    },
    {
      id: 'users',
      label: 'کاربران',
      icon: UserCheck,
      category: 'system',
      badge: menuCounts.users > 0 ? String(menuCounts.users) : null
    },
    {
      id: 'kitchen',
      label: 'آشپزخانه',
      icon: ChefHat,
      category: 'system',
      badge: null
    },
    {
      id: 'settings',
      label: 'تنظیمات',
      icon: Settings,
      category: 'system',
      badge: null
    },
    {
      id: 'logout',
      label: 'خروج',
      icon: LogOut,
      category: 'system',
      badge: null
    }
  ], [menuCounts]);

  const categories = useMemo(() => ({
    main: 'منو اصلی',
    tools: 'ابزارهای تحلیل',
    system: 'مدیریت سیستم'
  }), []);

  // Load menu counts from API
  useEffect(() => {
    const loadMenuCounts = async () => {
      try {
        const result = await api.getMenuCounts();

        // Check if result exists and has ok property
        if (result && result.ok && result.data) {
          setMenuCounts(result.data);
        } else {
          // Set default counts if API fails
          setMenuCounts({
            models: 0,
            training: 0,
            datasets: 0,
            tts: 0,
            users: 0,
            exports: 0
          });
        }
      } catch (error) {
        console.error('Error loading menu counts:', error);
        // Set default counts on error
        setMenuCounts({
          models: 0,
          training: 0,
          datasets: 0,
          tts: 0,
          users: 0,
          exports: 0
        });
      }
    };

    loadMenuCounts();

    // Refresh counts every 30 seconds
    const interval = setInterval(loadMenuCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced responsive detection with device type and touch support
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Device type detection
      if (width <= 480) {
        setDeviceType('mobile');
        setIsMobile(true);
        setIsCollapsed(true);
      } else if (width <= 768) {
        setDeviceType('tablet');
        setIsMobile(true);
        setIsCollapsed(true);
      } else if (width <= 1024) {
        setDeviceType('laptop');
        setIsMobile(false);
        setIsCollapsed(false);
      } else {
        setDeviceType('desktop');
        setIsMobile(false);
        setIsCollapsed(false);
      }

      // Touch device detection
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    detectDevice();

    // Debounced resize handler for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Hardware performance simulation
  useEffect(() => {
    const updatePerformance = () => {
      // Simulate realistic hardware performance (CPU + RAM + GPU)
      const cpuUsage = Math.random() * 30 + 20; // 20-50%
      const ramUsage = Math.random() * 40 + 30; // 30-70%
      const gpuUsage = Math.random() * 25 + 15; // 15-40%

      // Calculate overall performance (inverse of usage)
      const overallPerformance = Math.max(10, 100 - ((cpuUsage + ramUsage + gpuUsage) / 3));
      setHardwarePerformance(overallPerformance);
    };

    // Initial update
    updatePerformance();

    // Update every 2-4 seconds for realistic fluctuation
    const performanceInterval = setInterval(updatePerformance, Math.random() * 2000 + 2000);

    return () => {
      clearInterval(performanceInterval);
    };
  }, []);

  // Optimized handlers with useCallback for better performance
  const navigateToModelsTab = useCallback((tabId) => {
    try {
      window.location.hash = `#tab=${tabId}`;
    } catch (error) {
      console.debug('hash update failed', error);
    }
    if (onPageChange) {
      onPageChange('models');
    }
  }, [onPageChange]);

  const handleItemClick = useCallback((itemId) => {
    if (itemId === 'logout') {
      // مدیریت خروج امن
      console.log('خروج از سیستم');
      return;
    }

    if (['datasets', 'tts', 'huggingface'].includes(itemId)) {
      navigateToModelsTab(itemId);
    } else {
      onPageChange(itemId);
    }

    // Close mobile menu after selection with animation
    if (isMobile) {
      setTimeout(() => setIsMobileMenuOpen(false), 100);
    }
  }, [onPageChange, isMobile, navigateToModelsTab]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  }, [isMobile, isMobileMenuOpen, isCollapsed]);


  // Get device icon based on device type
  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      case 'laptop': return <Monitor size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  return (
    <>
      {/* Enhanced Mobile Hamburger Button */}
      {isMobile && (
        <button
          className={`mobile-menu-toggle ${isTouchDevice ? 'touch-device' : ''}`}
          onClick={toggleSidebar}
          aria-label="باز کردن منو"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="hamburger-icon">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
          <span className="device-indicator">
            {getDeviceIcon()}
          </span>
        </button>
      )}

      {/* Enhanced Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Enhanced Sidebar */}
      <nav
        className={`app-sidebar sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''} ${deviceType} ${isTouchDevice ? 'touch-device' : ''}`}
        role="navigation"
        aria-label="منوی اصلی"
      >
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-box">
              <div className="logo-icon">
                <Brain size={24} />
              </div>
              <div className="logo-glow"></div>
            </div>
            {!isCollapsed && (
              <div className="logo-content">
                <div className="logo-title">Persian AI</div>
                <div className="logo-subtitle">سیستم آموزش مدل‌های فارسی</div>
                <div className="device-info">
                  {getDeviceIcon()}
                  <span>{deviceType === 'mobile' ? 'موبایل' : deviceType === 'tablet' ? 'تبلت' : deviceType === 'laptop' ? 'لپ‌تاپ' : 'دسکتاپ'}</span>
                </div>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              className="sidebar-toggle-btn"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? 'باز کردن منو' : 'بستن منو'}
              title={isCollapsed ? 'باز کردن منو' : 'بستن منو'}
            >
              {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        <div className="menu-container">
          {Object.entries(categories).map(([categoryKey, categoryLabel]) => (
            <div key={categoryKey} className="menu-section sidebar-section">
              {!isCollapsed && (
                <div className="menu-category sidebar-section-title">
                  <span className="category-label">{categoryLabel}</span>
                  <div className="category-line"></div>
                </div>
              )}
              <div className="menu-items">
                {menuItems
                  .filter(item => item.category === categoryKey)
                  .map(item => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                      <button
                        key={item.id}
                        className={`menu-item sidebar-item ${isActive ? 'active' : ''} ${isTouchDevice ? 'touch-device' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                        title={item.label}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="menu-icon sidebar-item-icon">
                          <Icon size={18} />
                          {isActive && <div className="active-indicator"></div>}
                        </span>
                        {!isCollapsed && (
                          <div className="menu-content">
                            <span className="menu-label sidebar-item-text">{item.label}</span>
                            {item.badge && (
                              <span className="menu-badge">{item.badge}</span>
                            )}
                          </div>
                        )}
                        {isCollapsed && item.badge && (
                          <span className="menu-badge-collapsed">{item.badge}</span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>



        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="system-info">
              <div className="status-section">
                <div className="status-indicator online">
                  <div className="status-dot"></div>
                  <span>سیستم آنلاین</span>
                </div>
                <div className="device-status">
                  {getDeviceIcon()}
                  <span>{deviceType === 'mobile' ? 'موبایل' : deviceType === 'tablet' ? 'تبلت' : deviceType === 'laptop' ? 'لپ‌تاپ' : 'دسکتاپ'}</span>
                </div>
              </div>
              <div className="quick-actions">
                <button
                  className="quick-action-btn"
                  title="جستجو در سیستم"
                  aria-label="جستجو"
                >
                  <Search size={16} />
                </button>
                <button
                  className="quick-action-btn"
                  title="اعلان‌های سیستم"
                  aria-label="اعلان‌ها"
                >
                  <Bell size={16} />
                  <span className="notification-count">3</span>
                </button>
                <button
                  className="quick-action-btn"
                  title="فعالیت سیستم"
                  aria-label="فعالیت"
                >
                  <Activity size={16} />
                </button>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="collapsed-footer">
              <div className="status-dot-mini"></div>
              <div className="quick-actions-mini">
                <button className="quick-action-mini" title="جستجو">
                  <Search size={14} />
                </button>
                <button className="quick-action-mini" title="اعلان‌ها">
                  <Bell size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navigation;
