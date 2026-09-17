import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { resolve } from 'node:path';

export async function getStaticPaths() {
  return (await getCollection('blog')).map(post => ({
    params: { id: post.id }, props: { title: post.data.ogTitle ?? post.data.title },
  }));
}

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const fonts = resolve('src/assets/og-fonts');

export const GET: APIRoute = async ({ props }) => {
  const textLayer = async (text: string, font: string, file: string, size: number, width?: number) =>
    sharp({ text: {
      text: `<span foreground="#111111" letter_spacing="${Math.round((font === 'Figtree' ? -0.04 : width ? -0.035 : 0) * size * 1024)}">${escape(text)}</span>`,
      font: `${font} Bold ${size}`, fontfile: resolve(fonts, file),
      rgba: true, dpi: 72, ...(width ? { width, wrap: 'word-char' as const, spacing: 32 } : {}),
    } }).png().toBuffer({ resolveWithObject: true });

  const brand = await textLayer('<portfolio/>', 'Figtree', 'Figtree.ttf', 48);
  const author = await textLayer('森川結太 / Blog', 'Noto Sans JP', 'NotoSansJP.ttf', 23);
  let size = 70;
  let headline = await textLayer(`#${props.title}`, 'Noto Sans JP', 'NotoSansJP.ttf', size, 1075);
  // Long future titles stay complete rather than being clipped or shortened.
  while (headline.info.height > 300 && size > 28) {
    size -= 2;
    headline = await textLayer(`#${props.title}`, 'Noto Sans JP', 'NotoSansJP.ttf', size, 1075);
  }
  const png = await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#ffffff' } })
    .composite([
      { input: brand.data, left: 62, top: 54 },
      { input: headline.data, left: 62, top: Math.round(327 - headline.info.height / 2) },
      { input: author.data, left: 62, top: 576 - author.info.height },
    ]).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
