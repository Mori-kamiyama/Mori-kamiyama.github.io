import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const [slug, article, ...images] = process.argv.slice(2);
if (!slug || !article || !process.env.BLOG_PUBLISH_TOKEN) {
  console.error('Usage: npm run blog:post -- slug article.md [image.png ...]\nSet BLOG_PUBLISH_TOKEN; optional BLOG_PUBLISH_URL and BLOG_EXPECTED_SHA.'); process.exit(1);
}
const endpoint = new URL(process.env.BLOG_PUBLISH_URL || 'http://127.0.0.1:8787/posts');
if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(endpoint.hostname))) throw new Error('Use HTTPS for a remote publisher');
const form = new FormData();
form.set('slug', slug);
form.set('markdown', new Blob([await readFile(article)], { type: 'text/markdown' }), basename(article));
if (process.env.BLOG_EXPECTED_SHA) form.set('expectedSha', process.env.BLOG_EXPECTED_SHA);
for (const path of images) form.append('images', new Blob([await readFile(path)]), basename(path));
const res = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${process.env.BLOG_PUBLISH_TOKEN}` }, body: form, signal: AbortSignal.timeout(180000), redirect: 'error' });
console.log(await res.text());
if (!res.ok) process.exitCode = 1;
