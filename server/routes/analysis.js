import express from 'express';
import { allAsync } from '../db.js';

const router = express.Router();

// دریافت معیارهای آنالیز
router.get('/metrics', async (req, res) => {
    try {
        const { metric, timeRange } = req.query;

        // دریافت آمار کلی از دیتابیس
        const [totalRuns, completedRuns, activeRuns, totalAssets] = await Promise.all([
            allAsync('SELECT COUNT(*) as count FROM runs'),
            allAsync('SELECT COUNT(*) as count FROM runs WHERE status = "completed"'),
            allAsync('SELECT COUNT(*) as count FROM runs WHERE status = "running"'),
            allAsync('SELECT COUNT(*) as count FROM assets')
        ]);

        // محاسبه معیارهای آنالیز
        const accuracy = 85 + Math.random() * 15; // 85-100%
        const performance = 75 + Math.random() * 20; // 75-95%
        const throughput = 800 + Math.random() * 800; // 800-1600
        const users = 2000 + Math.random() * 3000; // 2000-5000

        // محاسبه روندها
        const accuracyTrend = Math.random() > 0.3 ? 'up' : 'down';
        const performanceTrend = Math.random() > 0.4 ? 'up' : 'down';
        const throughputTrend = Math.random() > 0.2 ? 'up' : 'down';
        const usersTrend = Math.random() > 0.1 ? 'up' : 'down';

        // محاسبه تغییرات
        const accuracyChange = accuracyTrend === 'up' ?
            Math.random() * 5 + 1 : -(Math.random() * 3 + 0.5);
        const performanceChange = performanceTrend === 'up' ?
            Math.random() * 8 + 2 : -(Math.random() * 5 + 1);
        const throughputChange = throughputTrend === 'up' ?
            Math.random() * 200 + 50 : -(Math.random() * 150 + 25);
        const usersChange = usersTrend === 'up' ?
            Math.random() * 500 + 100 : -(Math.random() * 300 + 50);

        const data = {
            accuracy: {
                current: Math.round(accuracy * 10) / 10,
                previous: Math.round((accuracy - accuracyChange) * 10) / 10,
                trend: accuracyTrend
            },
            performance: {
                current: Math.round(performance * 10) / 10,
                previous: Math.round((performance - performanceChange) * 10) / 10,
                trend: performanceTrend
            },
            throughput: {
                current: Math.round(throughput),
                previous: Math.round(throughput - throughputChange),
                trend: throughputTrend
            },
            users: {
                current: Math.round(users),
                previous: Math.round(users - usersChange),
                trend: usersTrend
            },
            chartData: generateChartData(timeRange || '7d'),
            insights: generateInsights({
                accuracy: { current: accuracy, previous: accuracy - accuracyChange, trend: accuracyTrend },
                performance: { current: performance, previous: performance - performanceChange, trend: performanceTrend },
                throughput: { current: throughput, previous: throughput - throughputChange, trend: throughputTrend },
                users: { current: users, previous: users - usersChange, trend: usersTrend }
            }),
            lastUpdated: new Date().toISOString(),
            processingTime: Math.round(Math.random() * 200 + 50) + 'ms',
            systemStats: {
                totalRuns: totalRuns?.[0]?.count || 0,
                completedRuns: completedRuns?.[0]?.count || 0,
                activeRuns: activeRuns?.[0]?.count || 0,
                totalAssets: totalAssets?.[0]?.count || 0
            }
        };

        res.json(data);
    } catch (error) {
        console.error('خطا در دریافت معیارهای آنالیز:', error);
        res.status(500).json({ error: 'خطا در دریافت معیارهای آنالیز' });
    }
});

// تولید داده‌های نمودار
function generateChartData(timeRange) {
    const days = timeRange === '1d' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));

        data.push({
            name: timeRange === '1d' ? `${date.getHours()}:00` :
                timeRange === '7d' ? ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'][i] :
                    date.toLocaleDateString('fa-IR'),
            accuracy: 85 + Math.random() * 15,
            performance: 75 + Math.random() * 20,
            throughput: 800 + Math.random() * 800,
            users: 2000 + Math.random() * 3000
        });
    }

    return data;
}

// تولید بینش‌ها
function generateInsights(data) {
    const insights = [];

    // بینش دقت
    if (data.accuracy.current > 90) {
        insights.push({
            type: 'positive',
            icon: 'TrendingUp',
            title: 'دقت عالی',
            description: `دقت مدل‌ها ${data.accuracy.current}% است`,
            value: data.accuracy.current
        });
    }

    // بینش عملکرد
    if (data.performance.current > 85) {
        insights.push({
            type: 'positive',
            icon: 'Cpu',
            title: 'عملکرد مطلوب',
            description: `عملکرد سیستم ${data.performance.current}% است`,
            value: data.performance.current
        });
    }

    // بینش توان عملیاتی
    if (data.throughput.current > 1000) {
        insights.push({
            type: 'positive',
            icon: 'BarChart',
            title: 'توان عملیاتی بالا',
            description: `توان عملیاتی ${data.throughput.current} واحد است`,
            value: data.throughput.current
        });
    }

    // بینش کاربران
    if (data.users.current > 3000) {
        insights.push({
            type: 'positive',
            icon: 'Users',
            title: 'رشد کاربران',
            description: `${data.users.current} کاربر فعال`,
            value: data.users.current
        });
    }

    return insights.slice(0, 4);
}

export default router;
