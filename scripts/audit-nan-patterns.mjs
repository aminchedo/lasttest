import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const root = process.cwd();
const srcDirs = ['client/src'];
const risky = [
    /\.toFixed\s*\(/,
    /\{\s*[^}]*%\s*\}/,
    /style\s*=\s*\{\s*\{\s*width\s*:\s*[^}]*%\s*\}\s*\}/,
];

function walk(dir, out = []) {
    try {
        for (const n of readdirSync(dir)) {
            const p = join(dir, n);
            const st = statSync(p);
            if (st.isDirectory()) walk(p, out);
            else if (['.jsx', '.js', '.tsx', '.ts'].includes(extname(p))) out.push(p);
        }
    } catch (e) {
        console.warn(`Skipping ${dir}:`, e.message);
    }
    return out;
}

const files = srcDirs.flatMap(d => walk(join(root, d)));
let bad = 0;
let checked = 0;
for (const f of files) {
    const s = readFileSync(f, 'utf8');
    checked++;
    risky.forEach((re) => {
        if (re.test(s)) {
            const safe = /(clamp\(|pct\(|text\(|num\()/;
            if (!safe.test(s)) {
                console.log('⚠️  Potential risky pattern:', f, re);
                bad++;
            }
        }
    });
}
console.log(`\nChecked ${checked} files.`);
if (bad) {
    console.log(`\nFound ${bad} potential risky occurrences. Ensure usage of num()/text()/clamp()/pct().`);
    process.exitCode = 1;
} else {
    console.log('✅ No risky patterns detected.');
}

