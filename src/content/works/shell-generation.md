---
draft: false
title: 数式からつくる貝殻
description: 貝殻の巻き方や広がりをパラメータで扱う形態模倣の実験。Raupモデルや指数螺旋の表現を手がかりに、Pythonで立体のメッシュを生成しました。
order: 9
categories: [Program, Design, Research]
cover: ../../assets/shell-generation-preview.png
coverAlt: 指数螺旋をもとにPythonで生成した、縞と突起を持つ貝殻のメッシュ
imageFit: contain
technologies: [Python, trimesh, Raupモデル, 3Dモデリング]
---

## 巻き方を変えると、形も変わる

貝殻の形をパラメータで表すRaupモデルを手がかりに、自然の形をプログラムでつくる実験を行いました。形を直接彫り込む代わりに、成長や巻き方を変えて、立体の違いを確かめています。

## 螺旋を、立体のメッシュにする

POV-Rayの貝殻表現を参考に、指数螺旋に沿う断面をPythonとtrimeshでメッシュ化しました。中空の殻、表面の縞、外側へ滑らかに伸びる突起を組み合わせています。掲載画像は、この実装から保存したプレビューです。

## 自然の形を、つくるための観察

数式とパラメータから、どこまで生き物らしい形を表せるのかを試しています。見た目の模倣と、形を生む仕組みの理解を行き来する制作です。
