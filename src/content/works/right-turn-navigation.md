---
title: "右折だけナビ"
description: "左折を避ける条件で経路を探す地図アプリ。出発・到着の方位やUターンのペナルティを指定して経路を探索します。"
year: 2026
order: 4
categories: ["Program", "Design"]
cover: "../../assets/right-turn-app.png"
coverAlt: "右折だけナビの公開画面。地図と経路探索の設定パネル"
imageFit: "contain"
technologies: ["React", "TypeScript", "Leaflet", "OpenStreetMap"]
links:
  - label: "アプリを開く"
    url: "https://mori-kamiyama.github.io/right-turn-only-gmap/"
  - label: "ソースコード"
    url: "https://github.com/Mori-kamiyama/right-turn-only-gmap"
---

## 曲がり方を条件にする経路探索

出発地と目的地だけでなく、左折やUターンへの制約を指定できる地図アプリです。地図上で地点を選び、左折を禁止する設定や、曲がり方に応じたペナルティを使って経路を探索します。

## 地図と探索条件を同じ画面に

ReactとTypeScriptで設定パネルをつくり、Leafletで地図を表示しました。出発時の発進方位と到着時の進入方位も指定できます。OpenStreetMapの道路情報を使い、曲がり方を考慮する経路探索を実装しています。

公開版とソースコードをリンクから確認できます。掲載画像は公開版の初期画面です。
