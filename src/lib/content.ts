import { getCollection } from 'astro:content';

// 下書きはローカルの開発画面だけに表示し、公開ビルドには含めない。
export const getWorks = () => getCollection('works', ({ data }) => import.meta.env.DEV || !data.draft);
export const getPosts = () => getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
