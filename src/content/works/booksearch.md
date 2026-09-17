---
title: "ホンノキ — 育つ図書館検索"
description: "本の検索と図書室マップ、本棚の画像認識をつなぐWebアプリ。スキャンした情報を、本がある場所の案内に活かします。"
year: 2026
order: 1
categories: ["Program", "Design"]
cover: "../../assets/booksearch-home.png"
coverAlt: "ホンノキの検索画面と本棚スキャンへの入口"
imageFit: "contain"
technologies: ["React", "TypeScript", "Go", "Python", "AWS", "OCR", "AprilTag"]
links:
  - label: "ソースコード"
    url: "https://github.com/Mori-kamiyama/Booksearch"
---

## 本が見つかっても、場所がわからない

図書館で本を探すとき、書名がわかっていても棚のどこにあるのかを見つけるのは大変です。ホンノキは、検索した本と実際の本棚をつなぐための図書館検索アプリです。

## 検索から、本棚の案内へ

書名やキーワードによる検索に加え、図書室のマップから本がありそうな棚を確認できます。本棚の画像をスキャンし、背表紙の検出・OCR・蔵書データとの照合をつなぎます。AprilTagを使った撮影位置の特定も組み合わせ、棚の情報を蓄積する仕組みを開発しています。

## 画像認識とWebアプリをつなぐ

ReactとTypeScriptの画面、GoのAPI、Pythonの画像認識処理、AWSの非同期処理を組み合わせました。認識できない画像や場所が未登録の本もあるため、結果の見せ方と処理状態の扱いを改善しながら制作しています。
