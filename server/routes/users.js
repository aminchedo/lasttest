import express from 'express';
import { runAsync, getAsync, allAsync, getDatabase } from '../db.js';

const router = express.Router();

// Initialize users table if it doesn't exist
async function initializeUsersTable() {
    try {
        // Wait for database to be ready
        const db = getDatabase();
        if (!db) {
            console.log('Database not ready yet, skipping users table initialization');
            return;
        }

        await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        avatar TEXT,
        last_login TEXT,
        join_date TEXT DEFAULT CURRENT_TIMESTAMP,
        permissions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Check if table is empty and add default admin user
        const userCount = await getAsync('SELECT COUNT(*) as count FROM users');
        if (userCount.count === 0) {
            await runAsync(
                `INSERT INTO users (name, email, role, status, avatar, permissions, last_login, join_date)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [
                    'مدیر سیستم',
                    'admin@persian-ai.ir',
                    'admin',
                    'active',
                    '👨‍💼',
                    JSON.stringify(['read', 'write', 'admin'])
                ]
            );
        }
    } catch (error) {
        console.error('Error initializing users table:', error);
    }
}

// Don't initialize on module load - will be called after DB is ready
export { initializeUsersTable };

// Initialize table on first request
let tableInitialized = false;
async function ensureTableInitialized() {
    if (!tableInitialized) {
        await initializeUsersTable();
        tableInitialized = true;
    }
}

// Get all users
router.get('/', async (req, res) => {
    await ensureTableInitialized();
    try {
        const users = await allAsync('SELECT * FROM users ORDER BY created_at DESC');

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
            lastLogin: user.last_login,
            joinDate: user.join_date,
            permissions: user.permissions ? JSON.parse(user.permissions) : []
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'خطا در دریافت کاربران' });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, role, status, avatar, permissions } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'نام و ایمیل الزامی هستند' });
        }

        // Check if email already exists
        const existingUser = await getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: 'این ایمیل قبلاً ثبت شده است' });
        }

        const result = await runAsync(
            `INSERT INTO users (name, email, role, status, avatar, permissions, join_date)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                name,
                email,
                role || 'user',
                status || 'active',
                avatar || '👤',
                JSON.stringify(permissions || ['read'])
            ]
        );

        res.json({
            success: true,
            message: 'کاربر با موفقیت ایجاد شد',
            user: {
                id: result.id,
                name,
                email,
                role: role || 'user',
                status: status || 'active'
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'خطا در ایجاد کاربر' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { name, email, role, status, avatar, permissions } = req.body;
        const userId = req.params.id;

        const user = await getAsync('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'کاربر پیدا نشد' });
        }

        await runAsync(
            `UPDATE users SET 
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        status = COALESCE(?, status),
        avatar = COALESCE(?, avatar),
        permissions = COALESCE(?, permissions),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
            [
                name,
                email,
                role,
                status,
                avatar,
                permissions ? JSON.stringify(permissions) : null,
                userId
            ]
        );

        res.json({ success: true, message: 'کاربر به‌روزرسانی شد' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'خطا در به‌روزرسانی کاربر' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await getAsync('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'کاربر پیدا نشد' });
        }

        await runAsync('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ success: true, message: 'کاربر حذف شد' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'خطا در حذف کاربر' });
    }
});

export default router;

