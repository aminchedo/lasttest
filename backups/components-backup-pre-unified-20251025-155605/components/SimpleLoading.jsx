// SimpleLoading.jsx - Simple and reliable loading component
import React from 'react';

const SimpleLoading = ({ message = "در حال بارگذاری..." }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            direction: 'rtl'
        }}>
            <div style={{
                textAlign: 'center',
                color: 'white',
                zIndex: 10,
                position: 'relative'
            }}>
                {/* Logo/Icon */}
                <div style={{
                    marginBottom: '2rem',
                    animation: 'spin 2s linear infinite'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '24px'
                    }}>
                        🧠
                    </div>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '2rem',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    سیستم آموزش مدل‌های فارسی
                </h1>

                {/* Progress Bar */}
                <div style={{
                    width: '300px',
                    margin: '0 auto 2rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    height: '8px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                        borderRadius: '4px',
                        animation: 'progress 2s ease-in-out infinite'
                    }} />
                </div>

                {/* Message */}
                <p style={{
                    fontSize: '1rem',
                    opacity: '0.8',
                    marginBottom: '2rem'
                }}>
                    {message}
                </p>

                {/* Loading Dots */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                background: 'white',
                                borderRadius: '50%',
                                animation: `pulse 1s infinite ${i * 0.2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
};

export default SimpleLoading;
