import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تابع اسکن کامل پروژه
function scanProject(rootPath, maxDepth = 10, currentDepth = 0) {
    const results = {
        files: [],
        directories: [],
        dependencies: {},
        structure: {},
        imports: {},
        exports: {},
        relationships: []
    };

    if (currentDepth > maxDepth) return results;

    try {
        const items = fs.readdirSync(rootPath, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(rootPath, item.name);
            const relativePath = path.relative(process.cwd(), fullPath);

            if (item.isDirectory()) {
                // پوشه‌ها
                results.directories.push({
                    name: item.name,
                    path: fullPath,
                    relativePath: relativePath,
                    depth: currentDepth
                });

                // اسکن بازگشتی
                const subResults = scanProject(fullPath, maxDepth, currentDepth + 1);
                results.files.push(...subResults.files);
                results.directories.push(...subResults.directories);
                Object.assign(results.dependencies, subResults.dependencies);
                Object.assign(results.imports, subResults.imports);
                Object.assign(results.exports, subResults.exports);
                results.relationships.push(...subResults.relationships);
            } else {
                // فایل‌ها
                const ext = path.extname(item.name);
                const stats = fs.statSync(fullPath);

                const fileInfo = {
                    name: item.name,
                    path: fullPath,
                    relativePath: relativePath,
                    extension: ext,
                    size: stats.size,
                    modified: stats.mtime,
                    depth: currentDepth,
                    type: getFileType(ext, item.name)
                };

                // تحلیل محتوای فایل‌های کد
                if (isCodeFile(ext)) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        const analysis = analyzeCodeFile(content, relativePath);
                        fileInfo.analysis = analysis;

                        // ذخیره وابستگی‌ها
                        if (analysis.imports.length > 0) {
                            results.imports[relativePath] = analysis.imports;
                        }
                        if (analysis.exports.length > 0) {
                            results.exports[relativePath] = analysis.exports;
                        }
                    } catch (error) {
                        console.warn(`خطا در خواندن ${fullPath}:`, error.message);
                    }
                }

                results.files.push(fileInfo);
            }
        }
    } catch (error) {
        console.warn('خطا در اسکن:', error.message);
    }

    return results;
}

// تعیین نوع فایل
function getFileType(ext, filename) {
    const codeExts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h'];
    const configExts = ['.json', '.yaml', '.yml', '.toml', '.ini', '.cfg'];
    const docExts = ['.md', '.txt', '.rst'];

    if (codeExts.includes(ext)) return 'code';
    if (configExts.includes(ext)) return 'config';
    if (docExts.includes(ext)) return 'document';
    if (['.css', '.scss', '.sass', '.less'].includes(ext)) return 'style';
    if (['.html', '.htm'].includes(ext)) return 'html';
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) return 'image';
    return 'other';
}

// بررسی فایل کد
function isCodeFile(ext) {
    return ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h'].includes(ext);
}

// تحلیل فایل کد
function analyzeCodeFile(content, filePath) {
    const analysis = {
        imports: [],
        exports: [],
        functions: [],
        classes: [],
        components: [],
        dependencies: [],
        lines: content.split('\n').length
    };

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Import statements
        if (line.startsWith('import ') || (line.startsWith('const ') && line.includes('require('))) {
            const importMatch = line.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
            const requireMatch = line.match(/require\(['"]([^'"]+)['"]\)/);

            if (importMatch) {
                analysis.imports.push({
                    module: importMatch[1],
                    line: i + 1,
                    type: 'es6'
                });
            } else if (requireMatch) {
                analysis.imports.push({
                    module: requireMatch[1],
                    line: i + 1,
                    type: 'commonjs'
                });
            }
        }

        // Export statements
        if (line.startsWith('export ')) {
            analysis.exports.push({
                name: line.replace('export ', '').split(' ')[1] || 'default',
                line: i + 1,
                type: 'es6'
            });
        }

        // Function definitions
        const funcMatch = line.match(/function\s+(\w+)/);
        if (funcMatch) {
            analysis.functions.push({
                name: funcMatch[1],
                line: i + 1
            });
        }

        // Class definitions
        const classMatch = line.match(/class\s+(\w+)/);
        if (classMatch) {
            analysis.classes.push({
                name: classMatch[1],
                line: i + 1
            });
        }

        // React components
        const componentMatch = line.match(/(?:function|const)\s+(\w+)\s*[=\(]/);
        if (componentMatch && /[A-Z]/.test(componentMatch[1][0])) {
            analysis.components.push({
                name: componentMatch[1],
                line: i + 1
            });
        }
    }

    return analysis;
}

// شروع اسکن
console.log('🔍 شروع اسکن کامل پروژه...');
const projectRoot = process.cwd();
const scanResults = scanProject(projectRoot);

console.log('\n📊 نتایج اسکن:');
console.log('='.repeat(50));
console.log('📁 پوشه‌ها:', scanResults.directories.length);
console.log('📄 فایل‌ها:', scanResults.files.length);
console.log('🔗 وابستگی‌ها:', Object.keys(scanResults.imports).length);

// نمایش ساختار پروژه
console.log('\n🏗️ ساختار پروژه:');
console.log('='.repeat(50));
scanResults.directories.forEach(dir => {
    const indent = '  '.repeat(dir.depth);
    console.log(indent + '📁 ' + dir.name);
});

// نمایش فایل‌های مهم
console.log('\n📄 فایل‌های مهم:');
console.log('='.repeat(50));
scanResults.files
    .filter(f => f.type === 'code' || f.type === 'config')
    .forEach(file => {
        const indent = '  '.repeat(file.depth);
        const icon = file.type === 'code' ? '💻' : '⚙️';
        console.log(indent + icon + ' ' + file.name + ' (' + file.size + ' bytes)');
    });

// نمایش وابستگی‌ها
console.log('\n🔗 وابستگی‌های اصلی:');
console.log('='.repeat(50));
Object.entries(scanResults.imports).forEach(([file, imports]) => {
    if (imports.length > 0) {
        console.log('\n📄 ' + file + ':');
        imports.forEach(imp => {
            console.log('  └── ' + imp.module + ' (' + imp.type + ')');
        });
    }
});

// ذخیره نتایج
const outputPath = path.join(projectRoot, 'project-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(scanResults, null, 2));
console.log('\n💾 نتایج در فایل project-analysis.json ذخیره شد');
