// scripts/archive-old-files.mjs
// Usage:
//  node scripts/archive-old-files.mjs --dry
//  node scripts/archive-old-files.mjs
//
// Safe archiving of old/legacy files with Git awareness and extension remapping

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

// ---------- CONFIGURE ----------
const ROOT = process.cwd();
const GLOBS = [
    'client/src/pages/**/*.jsx',
    'client/src/components/**/*.jsx',
    'client/src/styles/**/*.css',
    'client/src/api/**/*.js',
    'server/routes/**/*.js'
];

const EXCLUDES = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/out/**',
    '**/.git/**',
    '**/_archive/**',
    '**/_temp/**',
    '**/package.json',
    '**/package-lock.json'
];

// Optional extension remap on archive (left side is original extension, right side is archived extension)
const EXT_REMAP = {
    '.jsx': '.jsx.bak',
    '.js': '.js.bak',
    '.css': '.css.bak',
    '.ts': '.ts.bak',
    '.tsx': '.tsx.bak'
};

// Custom "old/legacy" filter: by filename keywords
// Files with these keywords in their name will be archived
const FILENAME_KEYWORDS = [
    'old', 'legacy', 'deprecated', 'backup', 'bak',
    '_OLD', '_LEGACY', '_DEPRECATED', '_BACKUP',
    '.old', '.legacy', '.deprecated', '.backup'
];

// Archive files not modified in last N days (null = ignore time filter)
const MAX_MTIME_DAYS = null; // e.g. 180 → archive files older than 6 months

// --------------------------------

const DRY = process.argv.includes('--dry');

function toPosix(p) { return p.split(path.sep).join('/'); }

function isGitRepo() {
    const r = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'pipe', cwd: ROOT });
    return r.status === 0 && String(r.stdout).trim() === 'true';
}

function isGitTracked(fp) {
    const r = spawnSync('git', ['ls-files', '--error-unmatch', fp], { stdio: 'ignore', cwd: ROOT });
    return r.status === 0;
}

function gitMv(src, dest) {
    const r = spawnSync('git', ['mv', '--force', src, dest], { stdio: 'inherit', cwd: ROOT });
    return r.status === 0;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function tsStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// Walk directory tree
function walk(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    try {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const p = path.join(dir, entry.name);
            const posixPath = toPosix(path.relative(ROOT, p));

            // Check exclusions
            const isExcluded = EXCLUDES.some(ex => {
                const pattern = ex.replace(/^\*\*\//, '').replace(/\/\*\*$/, '');
                return posixPath.includes(pattern) || posixPath.startsWith(pattern);
            });

            if (isExcluded) continue;

            if (entry.isDirectory()) {
                walk(p, files);
            } else {
                files.push(p);
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
    }
    return files;
}

// Naive glob matcher supporting ** and *
function matchGlob(p, g) {
    const posixPath = toPosix(p);
    const posixGlob = toPosix(g);

    // Escape regex special chars, but preserve * for glob matching
    let pattern = posixGlob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&');  // Escape special chars except *

    // Replace glob patterns
    pattern = pattern
        .replace(/\\\*\\\*\\\//g, '(?:.*/)?')    // **/ → match any path
        .replace(/\\\*\\\*/g, '.*')              // ** → match anything
        .replace(/\\\*/g, '[^/]*');              // * → match within segment

    try {
        const re = new RegExp('^' + pattern + '$');
        return re.test(posixPath);
    } catch (error) {
        console.warn(`Invalid glob pattern: ${g}`);
        return false;
    }
}

function anyMatch(globs, p) {
    const posixPath = toPosix(path.relative(ROOT, p));
    return globs.some(g => {
        const fullGlob = g.startsWith('/') ? g.slice(1) : g;
        return matchGlob(posixPath, fullGlob);
    });
}

function pickCandidates() {
    const all = walk(ROOT, []);
    return all
        .filter(p => anyMatch(GLOBS, p))
        .filter(p => !toPosix(p).includes('/_archive/'))
        .filter(p => !toPosix(p).includes('/_temp/'));
}

function looksOld(fp) {
    const name = path.basename(fp).toLowerCase();

    // Check filename keywords
    const hasKeyword = FILENAME_KEYWORDS.some(k => name.includes(k.toLowerCase()));
    if (hasKeyword) return true;

    // Check file age
    if (MAX_MTIME_DAYS != null) {
        try {
            const st = fs.statSync(fp);
            const ageDays = (Date.now() - st.mtimeMs) / (1000 * 60 * 60 * 24);
            if (ageDays >= MAX_MTIME_DAYS) return true;
        } catch (error) {
            console.warn(`Warning: Could not stat ${fp}: ${error.message}`);
        }
    }

    return false;
}

function archivedPathFor(fp, archiveRoot) {
    const rel = path.relative(ROOT, fp);
    const ext = path.extname(rel);
    const baseNoExt = rel.slice(0, -ext.length);
    const newExt = EXT_REMAP[ext] || ext; // remap or keep
    return path.join(archiveRoot, `${baseNoExt}${newExt}`);
}

function moveFile(src, dest) {
    ensureDir(path.dirname(dest));

    if (DRY) {
        console.log(`[DRY] move: ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
        return true;
    }

    try {
        // Prefer git mv if repo & tracked
        if (isGitRepo() && isGitTracked(src)) {
            const success = gitMv(src, dest);
            if (success) {
                console.log(`[GIT] moved: ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
                return true;
            }
        }

        // Fallback to fs.rename
        fs.renameSync(src, dest);
        console.log(`[FS] moved: ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
        return true;
    } catch (error) {
        console.error(`Error moving ${src}: ${error.message}`);
        return false;
    }
}

(function main() {
    console.log('='.repeat(60));
    console.log('Archive Old Files Script');
    console.log('='.repeat(60));
    console.log('');

    if (DRY) {
        console.log('🔍 DRY RUN MODE - No changes will be made');
        console.log('');
    }

    const archiveRoot = path.join(ROOT, '_archive', tsStamp());
    const candidates = pickCandidates().filter(looksOld);

    if (candidates.length === 0) {
        console.log('✅ No old files matched – nothing to archive.');
        console.log('');
        console.log('Searched patterns:');
        GLOBS.forEach(g => console.log(`  - ${g}`));
        console.log('');
        console.log('Keywords:');
        FILENAME_KEYWORDS.forEach(k => console.log(`  - ${k}`));
        return;
    }

    console.log(`📁 Archive folder: ${path.relative(ROOT, archiveRoot)}`);
    console.log(`📝 Found ${candidates.length} file(s) to archive:`);
    console.log('');

    let moved = 0;
    let failed = 0;

    for (const src of candidates) {
        const dest = archivedPathFor(src, archiveRoot);
        const success = moveFile(src, dest);
        if (success) moved++;
        else failed++;
    }

    console.log('');
    console.log('-'.repeat(60));

    if (DRY) {
        console.log('');
        console.log('🔍 [DRY RUN] Completed preview. Re-run without --dry to apply.');
        console.log('');
        console.log('To apply changes:');
        console.log('  npm run archive:run');
        console.log('  or: node scripts/archive-old-files.mjs');
    } else {
        console.log('');
        console.log(`✅ Archive completed: ${moved} file(s) moved, ${failed} failed`);
        console.log('');
        console.log('Next steps:');
        console.log('  1. Review the archived files in: ' + path.relative(ROOT, archiveRoot));
        console.log('  2. Test your application');
        console.log('  3. Commit changes: git add -A && git commit -m "chore: archive old files"');
    }

    console.log('');
    console.log('='.repeat(60));
})();

