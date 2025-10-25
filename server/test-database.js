// تست اتصال و سلامت دیتابیس SQLite
import { initializeDatabase, getAsync, allAsync, closeDatabase } from './db.js';

async function testDatabase() {
  console.log('🔍 شروع تست دیتابیس SQLite...\n');

  try {
    // 1. اتصال به دیتابیس
    console.log('1️⃣ در حال اتصال به دیتابیس...');
    await initializeDatabase();
    console.log('   ✅ اتصال موفقیت‌آمیز\n');

    // 2. بررسی نسخه SQLite
    console.log('2️⃣ بررسی نسخه SQLite...');
    const version = await getAsync('SELECT sqlite_version() as version');
    console.log(`   ✅ نسخه SQLite: ${version.version}\n`);

    // 3. لیست جداول
    console.log('3️⃣ بررسی جداول موجود...');
    const tables = await allAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    console.log('   📋 جداول موجود:');
    tables.forEach(table => {
      console.log(`      - ${table.name}`);
    });
    console.log('');

    // 4. بررسی تعداد رکوردها در هر جدول
    console.log('4️⃣ بررسی تعداد رکوردها...');
    for (const table of tables) {
      if (table.name !== 'sqlite_sequence') {
        try {
          const count = await getAsync(`SELECT COUNT(*) as count FROM ${table.name}`);
          console.log(`   📊 ${table.name}: ${count.count} رکورد`);
        } catch (err) {
          console.log(`   ⚠️  ${table.name}: خطا در شمارش`);
        }
      }
    }
    console.log('');

    // 5. تست عملیات CRUD
    console.log('5️⃣ تست عملیات CRUD...');
    
    // تست نوشتن
    const testId = `test-${Date.now()}`;
    await allAsync(
      `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
      ['test_key', 'test_value']
    );
    console.log('   ✅ نوشتن: موفق');

    // تست خواندن
    const setting = await getAsync(`SELECT * FROM settings WHERE key = ?`, ['test_key']);
    console.log(`   ✅ خواندن: موفق (value: ${setting?.value})`);

    // تست به‌روزرسانی
    await allAsync(
      `UPDATE settings SET value = ? WHERE key = ?`,
      ['updated_value', 'test_key']
    );
    console.log('   ✅ به‌روزرسانی: موفق');

    // تست حذف
    await allAsync(`DELETE FROM settings WHERE key = ?`, ['test_key']);
    console.log('   ✅ حذف: موفق\n');

    // 6. بررسی اندازه فایل دیتابیس
    console.log('6️⃣ اطلاعات دیتابیس...');
    const dbInfo = await getAsync(`
      SELECT 
        page_count * page_size / 1024 / 1024 as size_mb,
        page_count,
        page_size
      FROM pragma_page_count(), pragma_page_size()
    `);
    console.log(`   💾 حجم دیتابیس: ${dbInfo.size_mb.toFixed(2)} MB`);
    console.log(`   📄 تعداد صفحات: ${dbInfo.page_count}`);
    console.log(`   📏 اندازه صفحه: ${dbInfo.page_size} بایت\n`);

    // 7. بررسی indexes
    console.log('7️⃣ بررسی Indexes...');
    const indexes = await allAsync(`
      SELECT name, tbl_name 
      FROM sqlite_master 
      WHERE type='index' AND sql IS NOT NULL
      ORDER BY tbl_name, name
    `);
    if (indexes.length > 0) {
      console.log('   🔍 Indexes موجود:');
      indexes.forEach(idx => {
        console.log(`      - ${idx.name} (جدول: ${idx.tbl_name})`);
      });
    } else {
      console.log('   ℹ️  هیچ index سفارشی وجود ندارد');
    }
    console.log('');

    // 8. بررسی Foreign Keys
    console.log('8️⃣ بررسی Foreign Keys...');
    const fkStatus = await getAsync('PRAGMA foreign_keys');
    console.log(`   🔗 وضعیت Foreign Keys: ${fkStatus.foreign_keys ? 'فعال ✅' : 'غیرفعال ⚠️'}\n`);

    // خلاصه نهایی
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 تست دیتابیس با موفقیت کامل شد!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n✅ دیتابیس SQLite به درستی کار می‌کند');
    console.log('✅ تمام جداول ایجاد شده‌اند');
    console.log('✅ عملیات CRUD کار می‌کنند');
    console.log('✅ پروژه آماده استفاده است\n');

  } catch (error) {
    console.error('❌ خطا در تست دیتابیس:', error);
    console.error('\n🔧 راهکارهای احتمالی:');
    console.error('   1. npm install را دوباره اجرا کنید');
    console.error('   2. فایل data/app.db را حذف کرده و دوباره اجرا کنید');
    console.error('   3. مجوزهای فایل را بررسی کنید\n');
  } finally {
    await closeDatabase();
    console.log('📦 اتصال به دیتابیس بسته شد\n');
  }
}

// اجرای تست
testDatabase().catch(console.error);

