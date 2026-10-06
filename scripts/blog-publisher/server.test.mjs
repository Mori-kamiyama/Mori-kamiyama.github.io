import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { prepare, makeHandler } from './server.mjs';
const token = 'test-publish-token-at-least-24-characters';
const markdown = '---\ntitle: Test\ndescription: Test article\ndate: 2026-10-06\n---\n![chart](chart.svg)\n';
function form(text = markdown, slug = 'new-post') {
  const f = new FormData(); f.set('slug',slug); f.set('markdown',text); return f;
}
async function running(t, tree = [], rejectRef = false) {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    const path = new URL(url).pathname.split('/Mori-kamiyama.github.io')[1];
    const body = opts.body ? JSON.parse(opts.body) : undefined;
    calls.push({ path, method: opts.method, body });
    let value;
    if (path === '/git/ref/heads/main') value = { object: { sha: 'parent' } };
    else if (path === '/git/commits/parent') value = { tree: { sha: 'base-tree' } };
    else if (path === '/git/trees/base-tree') value = { tree, truncated: false };
    else if (path === '/git/blobs') value = { sha: `blob-${calls.length}` };
    else if (path === '/git/trees') value = { sha: 'new-tree' };
    else if (path === '/git/commits') value = { sha: 'new-commit' };
    else if (path === '/git/refs/heads/main') return Response.json({}, { status: rejectRef ? 422 : 200 });
    else throw new Error(`Unexpected path: ${path}`);
    return Response.json(value);
  };
  const server = createServer(makeHandler({ githubToken: 'fake-github-token', publishToken: token, fetchImpl }));
  server.listen(0,'127.0.0.1'); await once(server,'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return { url: `http://127.0.0.1:${server.address().port}/posts`, calls, send: (body, auth = token) => fetch(`http://127.0.0.1:${server.address().port}/posts`, { method:'POST',headers:{Authorization:`Bearer ${auth}`},body }) };
}
test('rewrites image destinations and keeps bytes intact', async () => {
  const f=form(); f.append('images',new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>']),'chart.svg');
  const p=await prepare(f);
  assert.equal(p.files.length,2);
  assert.match(p.files[0].bytes.toString(), /!\[chart\]\(\/blog-images\/new-post\/[a-f0-9]{16}-chart.svg\)/);
  assert.equal(p.files[1].bytes.toString(),'<svg xmlns="http://www.w3.org/2000/svg"/>');
});
test('rejects traversal, malformed metadata, invalid date and duplicate filenames', async () => {
  await assert.rejects(prepare(form(markdown,'../workflows')), {status:400});
  await assert.rejects(prepare(form('plain markdown')), {status:400});
  await assert.rejects(prepare(form(markdown.replace('2026-10-06','2026-99-99'))), {status:400});
  const f=form(); for(let i=0;i<2;i++)f.append('images',new Blob(['x']),'chart.png');
  await assert.rejects(prepare(f), {status:400});
});
test('auth fails before GitHub calls', async t => {
  const {send,calls}=await running(t); assert.equal((await send(form(),'wrong')).status,401); assert.equal(calls.length,0);
});
test('article and binary image commit atomically over the existing tree', async t => {
  const {send,calls}=await running(t);
  const f=form();f.append('images',new Blob([new Uint8Array([137,80,78,71,0,255])]),'chart.png');
  const r=await send(f); assert.equal(r.status,201);
  assert.equal((await r.json()).status,'committed');
  assert.equal(calls.find(c=>c.path==='/git/trees').body.base_tree,'base-tree');
  assert.equal(calls.find(c=>c.path==='/git/trees').body.tree.length,2);
  assert.deepEqual(calls.find(c=>c.path==='/git/commits').body.parents,['parent']);
  assert.deepEqual(calls.at(-1).body,{sha:'new-commit',force:false});
  assert.equal(calls.filter(c=>c.path==='/git/blobs')[1].body.content,Buffer.from([137,80,78,71,0,255]).toString('base64'));
});
test('existing articles require their current blob SHA', async t => {
  const {send,calls}=await running(t,[{path:'src/content/blog/new-post.md',sha:'a'.repeat(40)}]);
  assert.equal((await send(form())).status,409);
  assert.ok(calls.every(c=>c.method==='GET'));
  const f=form();f.set('expectedSha','a'.repeat(40));assert.equal((await send(f)).status,201);
});
test('non-fast-forward update returns a conflict without force', async t => {
  const {send,calls}=await running(t,[],true);assert.equal((await send(form())).status,409);assert.equal(calls.at(-1).body.force,false);
});
test('oversized image rejected before upload', async () => {
  const f=form();f.append('images',new Blob([Buffer.alloc(5*1024*1024+1)]),'big.png');await assert.rejects(prepare(f),{status:400});
});

test('identical retry returns without another commit', async t => {
  const post=await prepare(form());
  const tree=post.files.map(f=>({path:f.path,sha:createHash('sha1').update(`blob ${f.bytes.length}\0`).update(f.bytes).digest('hex')}));
  const {send,calls}=await running(t,tree);
  const r=await send(form());assert.equal(r.status,200);assert.equal((await r.json()).unchanged,true);assert.ok(calls.every(c=>c.method==='GET'));
});
test('CLI sends a Markdown file and returns the committed URL', async t => {
  const {url}=await running(t);
  const dir=await mkdtemp(join(tmpdir(),'blog-post-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
  const file=join(dir,'article.md');await writeFile(file,markdown);
  const {stdout}=await promisify(execFile)(process.execPath,['scripts/blog-publisher/post.mjs','new-post',file],{env:{...process.env,BLOG_PUBLISH_URL:url,BLOG_PUBLISH_TOKEN:token,BLOG_EXPECTED_SHA:''}});
  assert.equal(JSON.parse(stdout).url,'https://mori-kamiyama.github.io/blog/new-post/');
});
