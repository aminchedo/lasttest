// Enhanced Footer Component
import React from 'react';
import { 
  Heart, Github, Mail, Globe, Shield, 
  Zap, Database, Cloud, Users, BookOpen
} from 'lucide-react';

function Footer({ systemStatus = {} }) {
  const currentYear = new Date().getFullYear();
  const persianYear = currentYear - 621;

  return (
    <footer className="enhanced-footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-column brand-column">
            <div className="footer-brand">
              <div className="brand-icon">
                <Zap size={28} />
              </div>
              <div>
                <h3>Persian ML Trainer</h3>
                <p>سیستم پیشرفته آموزش مدل‌های فارسی</p>
              </div>
            </div>
            <p className="brand-description">
              پلتفرم حرفه‌ای برای آموزش، مدیریت و استقرار مدل‌های یادگیری ماشین با پشتیبانی کامل از زبان فارسی
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={20} />
              </a>
              <a href="mailto:support@persianml.ai" className="social-link">
                <Mail size={20} />
              </a>
              <a href="https://persianml.ai" target="_blank" rel="noopener noreferrer" className="social-link">
                <Globe size={20} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>محصولات</h4>
            <ul className="footer-links">
              <li><a href="/train">آموزش مدل</a></li>
              <li><a href="/models">مدیریت مدل‌ها</a></li>
              <li><a href="/datasets">دیتاست‌ها</a></li>
              <li><a href="/kitchen">آشپزخانه مدل</a></li>
              <li><a href="/exports">خروجی و صادرات</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>ابزارها</h4>
            <ul className="footer-links">
              <li><a href="/analysis">تحلیل مدل</a></li>
              <li><a href="/monitoring">مانیتورینگ</a></li>
              <li><a href="/tts">تبدیل متن به گفتار</a></li>
              <li><a href="/huggingface">Hugging Face Hub</a></li>
              <li><a href="/auto-tuner">تنظیم خودکار</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>منابع</h4>
            <ul className="footer-links">
              <li><a href="/docs">مستندات</a></li>
              <li><a href="/api-docs">مستندات API</a></li>
              <li><a href="/tutorials">آموزش‌ها</a></li>
              <li><a href="/blog">وبلاگ</a></li>
              <li><a href="/faq">سوالات متداول</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>پشتیبانی</h4>
            <ul className="footer-links">
              <li><a href="/support">مرکز پشتیبانی</a></li>
              <li><a href="/contact">تماس با ما</a></li>
              <li><a href="/community">انجمن کاربران</a></li>
              <li><a href="/feedback">ارسال بازخورد</a></li>
              <li><a href="/status">وضعیت سرویس</a></li>
            </ul>
          </div>
        </div>

        {/* Middle Section - Stats */}
        <div className="footer-stats">
          <div className="stat-item">
            <Database size={24} />
            <div>
              <strong>1000+</strong>
              <span>مدل آموزش داده شده</span>
            </div>
          </div>
          <div className="stat-item">
            <Users size={24} />
            <div>
              <strong>500+</strong>
              <span>کاربر فعال</span>
            </div>
          </div>
          <div className="stat-item">
            <Cloud size={24} />
            <div>
              <strong>10TB+</strong>
              <span>داده پردازش شده</span>
            </div>
          </div>
          <div className="stat-item">
            <Zap size={24} />
            <div>
              <strong>99.9%</strong>
              <span>آپتایم سیستم</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="copyright">
              © {persianYear} ({currentYear}) Persian ML Trainer. 
              Made with <Heart size={14} className="heart-icon" /> in Iran
            </p>
            {systemStatus.version && (
              <span className="version-badge">
                نسخه {systemStatus.version}
              </span>
            )}
          </div>

          <div className="footer-bottom-right">
            <a href="/privacy" className="footer-link">حریم خصوصی</a>
            <span className="separator">•</span>
            <a href="/terms" className="footer-link">شرایط استفاده</a>
            <span className="separator">•</span>
            <a href="/security" className="footer-link">امنیت</a>
            <span className="separator">•</span>
            <a href="/cookies" className="footer-link">کوکی‌ها</a>
          </div>

          <div className="system-status">
            {systemStatus.online !== false ? (
              <div className="status-badge online">
                <span className="status-dot"></span>
                <span>سیستم آنلاین</span>
              </div>
            ) : (
              <div className="status-badge offline">
                <span className="status-dot"></span>
                <span>سیستم آفلاین</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="security-notice">
          <Shield size={16} />
          <span>تمامی ارتباطات رمزنگاری شده و ایمن هستند</span>
        </div>
      </div>

      <style>{`
        .enhanced-footer {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          margin-top: 80px;
          padding: 60px 0 0 0;
          position: relative;
        }

        .enhanced-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #10b981 100%);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* Top Section */
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-column h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 20px 0;
          color: white;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #8b5cf6;
          transform: translateX(4px);
        }

        /* Brand Column */
        .brand-column {
          padding-left: 0;
        }

        .footer-brand {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          align-items: center;
        }

        .brand-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .footer-brand h3 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: white;
        }

        .footer-brand p {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }

        .brand-description {
          font-size: 14px;
          line-height: 1.6;
          color: #9ca3af;
          margin-bottom: 20px;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: all 0.3s;
          text-decoration: none;
        }

        .social-link:hover {
          background: #8b5cf6;
          color: white;
          transform: translateY(-2px);
        }

        /* Stats Section */
        .footer-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          padding: 40px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-item {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .stat-item svg {
          color: #8b5cf6;
          flex-shrink: 0;
        }

        .stat-item strong {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-item span {
          display: block;
          font-size: 13px;
          color: #9ca3af;
        }

        /* Bottom Section */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 0;
          flex-wrap: wrap;
          gap: 24px;
        }

        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .copyright {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .heart-icon {
          color: #ef4444;
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .version-badge {
          padding: 6px 12px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #a78bfa;
        }

        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #8b5cf6;
        }

        .separator {
          color: #4b5563;
          font-size: 14px;
        }

        /* System Status */
        .system-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.online {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .status-badge.offline {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Security Notice */
        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 0;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .security-notice svg {
          color: #10b981;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .footer-top {
            grid-template-columns: 2fr 1fr 1fr;
            gap: 32px;
          }

          .footer-top .footer-column:nth-child(4),
          .footer-top .footer-column:nth-child(5) {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 0 20px;
          }

          .footer-top {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .footer-bottom-left,
          .footer-bottom-right {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .separator {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
