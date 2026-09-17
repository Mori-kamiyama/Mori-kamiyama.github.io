import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const files = fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
let checked = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  const base = new URL(file === 'index.html' ? '/' : `/${file.replace(/index\.html$/, '')}`, 'https://mori-kamiyama.github.io');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1],base);
    if (url.origin !== base.origin) continue;
    let target=path.join(root,decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target=path.join(target,'index.html');
    if (!fs.existsSync(target)) throw new Error(`Broken local URL: ${file} → ${match[1]}`);
    if (url.hash && target.endsWith('.html')) {
      const content=fs.readFileSync(target,'utf8');
      if (!content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error(`Broken anchor: ${file} → ${match[1]}`);
    }
    checked++;
  }
}
for (const file of ['robots.txt','rss.xml','sitemap-index.xml','favicon.png','og.png']) {
  if (!fs.existsSync(path.join(root,file))) throw new Error(`Missing ${file}`);
}
console.log(`Verified ${files.length} HTML files and ${checked} local URLs.`);
