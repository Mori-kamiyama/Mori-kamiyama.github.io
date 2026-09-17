# 森川結太のポートフォリオ

FigmaとStudioで制作したデザインをもとに、Astroで構築した静的ポートフォリオです。

公開URL: https://mori-kamiyama.github.io/

## 開発

Node.jsは `.nvmrc` のバージョンを使用します。

```sh
nvm use
npm ci
npm run dev
```

## 検証

```sh
npm run check
npm run build
node scripts/verify-build.mjs
npx playwright install chromium
npm test
```

ブラウザテストはビルド済みサイトを使います。公開サイトを確認する場合:

```sh
PLAYWRIGHT_BASE_URL=https://mori-kamiyama.github.io npm test
```

## 内容を更新する

- 作品: `src/content/works/*.md`
- 記事: `src/content/blog/*.md`
- プロフィール: `src/pages/profile.astro`
- SNSリンク: `src/data/site.ts`
- デザイン: `src/styles/global.css`
- 画像: `src/assets/`

作品はMarkdownファイルの追加で一覧と詳細ページが生成されます。例:

```yaml
---
title: 作品名
description: 作品の短い説明
year: 2026
order: 17
categories: [Program, Design]
cover: ../../assets/example.webp
coverAlt: 画像の説明
imageFit: cover
technologies: [TypeScript]
---
```

この後に本文をMarkdownで書きます。カテゴリーは `Program`、`Design`、`Management` です。記事の `date` は任意、`featured: true` はBlogのRecommend欄に表示します。RSSには日付付き記事を掲載します。

記事のSNSカードはビルド時にタイトルから自動生成します（1200 × 630 PNG、`/og/blog/記事ID.png`）。白地に `<portfolio/>`、`#記事タイトル`、`森川結太 / Blog` を配置します。改行を指定したい場合だけ、記事のfrontmatterに `ogTitle: "1行目\n2行目"` を追加してください。通常は `title` がそのまま使われます。フォントとOFLライセンスは `src/assets/og-fonts/` に同梱し、ビルド時の外部フォント取得は不要です。

## 公開

`main` へのpushで、型チェック・ビルド・リンク検証・ブラウザテストを実行し、通過した成果物をGitHub Pagesに公開します。Pull Requestでは検証のみ行います。

公開後、GitHub Actionsの実行結果のSummaryに「サイトを開く」リンクが表示されます。公開URLは毎回同じです: [ポートフォリオを開く](https://mori-kamiyama.github.io/)。

設計判断と参照元は [docs/architecture.md](docs/architecture.md) に記載しています。
