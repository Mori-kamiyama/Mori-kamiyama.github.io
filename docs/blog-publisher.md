# Markdownと画像をPOSTして公開する

このリポジトリの投稿APIは、Markdownと画像を1コミットにまとめて `main` へ保存する小さなNode.jsサーバーです。GitHub Pagesの既存チェック・公開フローが続きます。ブログ自体は静的サイトのままです。

## 初回だけ設定

Node.jsはこのリポジトリの `.nvmrc` に合わせ、`npm ci` を実行します。

リポジトリ直下に `.env.blog` を作成します（git管理対象外）。

```dotenv
BLOG_GITHUB_TOKEN=YOUR_FINE_GRAINED_GITHUB_TOKEN
BLOG_PUBLISH_TOKEN=YOUR_RANDOM_SECRET_AT_LEAST_24_CHARACTERS
```

GitHubトークンは `Mori-kamiyama/Mori-kamiyama.github.io` のみに限定し、ContentsのRead and writeを付けます。投稿用の秘密文字列は、たとえば `openssl rand -hex 32` で生成します。トークンや `.env.blog` を記事・スキル・会話に貼らないでください。

```sh
npm run blog:server
```

既定の待受先は `http://127.0.0.1:8787`。常設する場合は既存サーバーでこのプロセスを起動し、HTTPSのリバースプロキシを前に置きます。`BLOG_HOST`・`BLOG_PORT` で待受を変更できます。遠隔クライアントにはGitHubトークンを配らず、投稿用トークンだけを渡します。

## ふだんの投稿

`article.md` を用意します。画像は `chart.png`、`./chart.png`、`images/chart.png` の形で参照します。

```markdown
---
title: 記事のタイトル
description: 記事の短い紹介
date: 2026-10-06
featured: false
---

ここに本文を書く。

![グラフの説明](chart.png)
```

同じディレクトリで、次の1コマンドを実行します。

```sh
npm run blog:post -- my-article article.md chart.png photo.webp
```

内部では `multipart/form-data` で送信しています。別のツールから直接POSTする場合も同じ形式です。以下の例では `BLOG_PUBLISH_TOKEN` をシェル環境へ安全に設定済みとします。

```sh
curl http://127.0.0.1:8787/posts \
  -H "Authorization: Bearer $BLOG_PUBLISH_TOKEN" \
  -F 'slug=my-article' \
  -F 'markdown=@article.md;type=text/markdown' \
  -F 'images=@chart.png' \
  -F 'images=@photo.webp'
```

画像は `public/blog-images/my-article/<内容ハッシュ>-chart.png` へ保存し、本文の画像パスを自動で置き換えます。Markdownと全画像は同時にコミットされるため、画像だけ欠けた途中状態を公開しません。通常のMarkdown画像、参照形式のリンク、HTMLの `src` に対応します。複雑な独自構文は公開パスを明示してください。

返却例：

```json
{
  "slug": "my-article",
  "commit": "...",
  "articleSha": "...",
  "url": "https://mori-kamiyama.github.io/blog/my-article/",
  "actionsUrl": "https://github.com/Mori-kamiyama/Mori-kamiyama.github.io/actions?query=branch%3Amain",
  "status": "committed"
}
```

`committed` はGitHubへの保存完了です。公開完了はActionsの成功と記事URLで確認します。ビルドが失敗すると既存の公開サイトが維持されます。

## 記事を更新する

まず `GET /posts/my-article` で現在のMarkdownと `sha` を取得します。変更後、同じPOSTへ `expectedSha` を追加します。

```sh
curl http://127.0.0.1:8787/posts/my-article \
  -H "Authorization: Bearer $BLOG_PUBLISH_TOKEN"

BLOG_EXPECTED_SHA=取得したsha npm run blog:post -- my-article article.md
```

送信した版とGitHub上の版が違えば409になり、上書きしません。同一内容の再送は新規コミットを作りません。本文取得後の同時更新やブランチ変更でも強制pushはしません。

## 入力と運用

- Markdown：YAML frontmatter付き、最大256 KiB。`title`・`description` 必須。任意項目は `date`・`featured`・`ogTitle`。
- 画像：PNG / JPEG / WebP / GIF / SVG、1枚5 MiB以下、最大20枚。全送信20 MiB以下。
- slug：英小文字・数字・ハイフン、最大100文字。
- 更新時に不要になった画像は削除しません。
- このAPIは所有者向けです。MarkdownにはHTMLも書けるため、投稿トークンを渡した人は公開コンテンツを変更できます。
- APIから書けるのは記事とその画像のみ。リポジトリやブランチはサーバー側で固定しています。
- 外部URLから画像を取得する機能はありません。画像の実体を送ってください。
- GitHub App等の既存コネクターの認証を、このサーバーへ自動転用することはありません。

ローカル検証：`npm run test:publisher`。実GitHubに書き込まないHTTPテストです。

実装根拠：[GitHub Git database API](https://docs.github.com/en/rest/guides/using-the-rest-api-to-interact-with-your-git-database)。
