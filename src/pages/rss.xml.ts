import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).filter(p=>p.data.date);
  return rss({ title:'森川結太のBlog', description:'つくることと学ぶことの記録。', site:context.site!, items:posts.map(p=>({title:p.data.title,description:p.data.description,pubDate:p.data.date!,link:`/blog/${p.id}/`})), customData:'<language>ja</language>' });
}
