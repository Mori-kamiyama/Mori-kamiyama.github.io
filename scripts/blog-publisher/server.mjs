import { createServer } from 'node:http';
import { createHash, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { parse, stringify } from 'yaml';

const REPO = 'Mori-kamiyama/Mori-kamiyama.github.io';
const SITE = 'https://mori-kamiyama.github.io';
const MAX = 20 * 1024 * 1024;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const fail = (status, message) => { throw new HttpError(status, message); };
const hash = b => createHash('sha256').update(b).digest('hex');
const gitHash = b => createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const safeEqual = (a, b) => timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));

export async function prepare(form) {
  const slug = form.get('slug');
  if (typeof slug !== 'string' || slug.length > 100 || !slugPattern.test(slug)) fail(400, 'slug must use lowercase letters, numbers and hyphens');
  const file = form.get('markdown');
  const raw = typeof file === 'string' ? file : await file?.text();
  const markdown = raw?.replace(/\r\n?/g, '\n');
  if (!markdown || Buffer.byteLength(markdown) > 256 * 1024) fail(400, 'markdown is required (maximum 256 KiB)');
  const match = markdown.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) fail(400, 'Markdown must start with YAML frontmatter');
  let meta;
  try { meta = parse(match[1], { maxAliasCount: 0 }); } catch { fail(400, 'Invalid YAML frontmatter'); }
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) fail(400, 'Invalid frontmatter');
  for (const key of ['title', 'description']) if (typeof meta[key] !== 'string' || !meta[key].trim()) fail(400, `${key} is required`);
  if (meta.title.length > 160 || meta.description.length > 1000) fail(400, 'Title or description is too long');
  if (meta.date !== undefined && (typeof meta.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || !Number.isFinite(Date.parse(meta.date)) || new Date(meta.date).toISOString().slice(0,10) !== meta.date)) fail(400, 'date must be a valid YYYY-MM-DD');
  if (meta.featured !== undefined && typeof meta.featured !== 'boolean') fail(400, 'featured must be boolean');
  if (meta.ogTitle !== undefined && typeof meta.ogTitle !== 'string') fail(400, 'ogTitle must be text');
  for (const k of Object.keys(meta)) if (!['title','description','date','featured','ogTitle'].includes(k)) fail(400, `Unknown frontmatter field: ${k}`);
  let body = match[2];
  const images = form.getAll('images');
  if (images.length > 20) fail(400, 'Maximum 20 images');
  const names = new Set(), assets = [];
  for (const image of images) {
    if (typeof image === 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]*\.(png|jpe?g|webp|gif|svg)$/i.test(image.name) || image.name.length > 120 || image.size === 0 || image.size > 5 * 1024 * 1024) fail(400, 'Images must be PNG, JPEG, WebP, GIF or SVG; safe filenames; maximum 5 MiB each');
    if (names.has(image.name)) fail(400, 'Duplicate image filename');
    names.add(image.name);
    const bytes = Buffer.from(await image.arrayBuffer());
    const path = `public/blog-images/${slug}/${hash(bytes).slice(0,16)}-${image.name}`;
    const url = '/' + path.slice('public/'.length);
    const escaped = image.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Rewrite ordinary Markdown destinations, reference definitions and HTML image src.
    body = body.replace(new RegExp(`(\\]\\(<?)(?:\\./|images/)?${escaped}(?=>?[)\\s])`, 'g'), (_, prefix) => prefix + url);
    body = body.replace(new RegExp(`(^\\s*\\[[^\\]]+\\]:\\s*<?)(?:\\./|images/)?${escaped}(?=>?(?:\\s|$))`, 'gm'), (_, prefix) => prefix + url);
    body = body.replace(new RegExp(`(\\bsrc=["'])(?:\\./|images/)?${escaped}(?=["'])`, 'g'), (_, prefix) => prefix + url);
    assets.push({ path, bytes });
  }
  if (!body.trim()) fail(400, 'Article body is required');
  const expectedSha = form.get('expectedSha');
  if (expectedSha !== null && (typeof expectedSha !== 'string' || !/^[a-f0-9]{40}$/.test(expectedSha))) fail(400, 'expectedSha must be the current article blob SHA');
  const article = Buffer.from(`---\n${stringify(meta).trimEnd()}\n---\n${body}`);
  return { slug, title: meta.title, expectedSha, files: [{ path: `src/content/blog/${slug}.md`, bytes: article }, ...assets] };
}

export function makeHandler({ githubToken, publishToken, fetchImpl = fetch }) {
  if (!githubToken || !publishToken || publishToken.length < 24) throw new Error('Set BLOG_GITHUB_TOKEN and BLOG_PUBLISH_TOKEN (at least 24 characters)');
  async function gh(path, method = 'GET', data) {
    const res = await fetchImpl(`https://api.github.com/repos/${REPO}${path}`, {
      method, headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) fail(res.status === 422 || res.status === 409 ? 409 : 502, res.status === 422 || res.status === 409 ? 'Branch changed or update rejected; read current article SHA and retry' : `GitHub request failed (${res.status})`);
    return res.json();
  }
  return async (req, res) => {
    const json = (code, data) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
    try {
      if (!safeEqual(req.headers.authorization || '', `Bearer ${publishToken}`)) fail(401, 'Unauthorized');
      const url = new URL(req.url, 'http://localhost');
      if (req.method === 'GET' && /^\/posts\/[a-z0-9-]+$/.test(url.pathname)) {
        const slug = url.pathname.split('/').pop();
        const data = await gh(`/contents/src/content/blog/${slug}.md?ref=main`);
        return json(200, { slug, sha: data.sha, markdown: Buffer.from(data.content, 'base64').toString('utf8'), url: `${SITE}/blog/${slug}/` });
      }
      if (url.pathname !== '/posts' || req.method !== 'POST') fail(404, 'Use POST /posts or GET /posts/:slug');
      if (Number(req.headers['content-length']) > MAX) fail(413, 'Maximum request size is 20 MiB');
      const chunks = []; let size = 0;
      for await (const chunk of req) { size += chunk.length; if (size > MAX) fail(413, 'Maximum request size is 20 MiB'); chunks.push(chunk); }
      let form;
      try { form = await new Request('http://localhost/posts', { method: 'POST', headers: { 'Content-Type': req.headers['content-type'] || '' }, body: Buffer.concat(chunks) }).formData(); }
      catch { fail(400, 'Use multipart/form-data'); }
      const post = await prepare(form);
      const ref = await gh('/git/ref/heads/main');
      const parent = ref.object.sha;
      const commit = await gh(`/git/commits/${parent}`);
      const tree = await gh(`/git/trees/${commit.tree.sha}?recursive=1`);
      if (tree.truncated) fail(502, 'Repository tree is too large to safely inspect');
      const entries = new Map(tree.tree.map(e => [e.path, e]));
      const previous = entries.get(post.files[0].path);
      const unchanged = post.files.every(f => entries.get(f.path)?.sha === gitHash(f.bytes));
      const result = sha => ({ slug: post.slug, commit: sha, articleSha: gitHash(post.files[0].bytes), url: `${SITE}/blog/${post.slug}/`, actionsUrl: `https://github.com/${REPO}/actions?query=branch%3Amain`, status: 'committed', note: 'Publication follows successful GitHub Actions; this response is not deployment confirmation.' });
      if (unchanged) return json(200, { ...result(parent), unchanged: true });
      if (previous && post.expectedSha !== previous.sha) fail(409, 'Article exists or changed. GET /posts/:slug and supply expectedSha to update');
      if (!previous && post.expectedSha) fail(409, 'Article no longer exists');
      const newEntries = [];
      for (const f of post.files) {
        const blob = await gh('/git/blobs', 'POST', { content: f.bytes.toString('base64'), encoding: 'base64' });
        newEntries.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
      }
      const nextTree = await gh('/git/trees', 'POST', { base_tree: commit.tree.sha, tree: newEntries });
      const nextCommit = await gh('/git/commits', 'POST', { message: `${previous ? 'Update' : 'Publish'} blog: ${post.title}`, tree: nextTree.sha, parents: [parent] });
      await gh('/git/refs/heads/main', 'PATCH', { sha: nextCommit.sha, force: false });
      json(201, result(nextCommit.sha));
    } catch (e) { json(e.status || 500, { error: e.status ? e.message : 'Publishing failed; check server configuration and GitHub connectivity' }); }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const handler = makeHandler({ githubToken: process.env.BLOG_GITHUB_TOKEN, publishToken: process.env.BLOG_PUBLISH_TOKEN });
  const host = process.env.BLOG_HOST || '127.0.0.1';
  const port = Number(process.env.BLOG_PORT || 8787);
  const server = createServer(handler);
  server.requestTimeout = 60000;
  server.listen(port, host, () => console.log(`Blog publisher listening on http://${host}:${port}`));
}
