---
title: 声から画像を作るAIワークショップ教材
description: 音声認識・文章生成・画像生成を一つずつ試してから組み合わせる教材。完成までの手順と、途中の出力を確かめる画面を用意しました。
year: 2026
order: 8
draft: false
categories: [Education, Design, Program]
cover: ../../assets/voice-image-workshop-flow.webp
coverAlt: 音声認識、文章生成、画像生成を順番につなぐ教材の説明図
imageFit: contain
technologies: [教材設計, Python, Gradio, 音声認識, 画像生成]
gallery:
  - image: ../../assets/ai-workshop-slides.png
    alt: 文字起こし、LLM、画像生成で今日作るものを説明するワークショップのスライド
    caption: 演習に入る前に、組み合わせる三つの機能と完成イメージを伝えるスライド。
links:
  - label: 教材を読む
    url: https://mori-kamiyama.github.io/blog/voice-image-ai-workshop/
  - label: Figmaの説明スライドを見る
    url: https://www.figma.com/slides/NaoCgmoO4TpupCAec0AoE8
---

## 三つのAIを、一つずつ理解する

声で伝えた内容から画像を作るアプリを題材に、AIを組み合わせる教材を制作しました。文章生成、音声認識、画像生成をそれぞれ動かし、最後に一つのアプリへつなぎます。

完成コードだけを渡すのではなく、ファイルの作成、実行、結果の確認までを演習ごとにまとめています。小さく動かしてから次へ進める構成です。

## 途中の文章も、見て直せる画面に

音声の書き起こしと、画像生成に使うプロンプトを画面に表示します。認識された文章を自分で直し、AIへの指示を変えながら、画像がどう変わるかを試せます。

一括実行の前に三つのボタンを順番に押す手順を用意し、どこで何が起きているかを追えるようにしました。

## 教材としてまとめたもの

各演習のコード、動作確認の例、プロンプトを変える課題を記事にまとめています。ここでは教材の制作を紹介しています。

## 導入のスライドも、演習につなげる

Figma Slidesでは、AIの役割を認識・予測・生成・行動に分けた導入資料も制作しました。今日使う文字起こし・LLM・画像生成がその中で何を担当するのかを示し、最後には自分で改造して作品をつくる課題へつなげています。
