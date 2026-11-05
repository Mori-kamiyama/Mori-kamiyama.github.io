# 最近の制作物の掲載根拠

記憶は候補探しに使い、本文は現在のソースで確認した内容に限定する。受賞、導入人数、精度、担当割合は確認できていないため掲載しない。クライアント案件の内部資料は追加しない。

| 作品 | 確認した根拠 | 使用画像 |
| --- | --- | --- |
| ホンノキ | 公開 `Mori-kamiyama/Booksearch` README・`docs/project_status.md`、ローカル `recovery/docs/about.md` | 本人の発表資料にある公開画面 `spark_awards_2026_pitch/assets/screenshots/public-home.png` |
| Transcrab | ローカルREADME、2026-08-20更新 `docs/product.md`。現行の目標は日本語会議支援で、古い英会話支援の説明だけを転記しない | `Resources/Transcrab.icns` をPNGへ形式変換した本来のアプリアイコン |
| NCA研究 | 現在のREADME、`docs/text2dino2code2nca_improvement_2026-07-30.md`。テキスト→DINO→code→NCAMを主対象とし、条件と形状の対応を改善中 | `docs/text_multicaption_2026-07-17/preview_130m_short.png`。本文・altに過去の実験出力であることを明記 |
| 右折だけナビ | 公開 `right-turn-only-gmap/src/App.tsx`、GitHub Pages公開画面 | 今回ブラウザで撮影した実画面。所在地入力・経路選択を行っていない初期状態 |
| PaperScrap | 公開 `paperscrap` の説明、`ContentView.swift`、検索・引用グラフ関連のソース構成 | 公開 `Assets.xcassets/AppIcon.appiconset/icon_1024x1024.png` |

5件を先頭に追加し、作品数は16件から21件へ。並び順は最近の取り組みを優先する掲載順であり、制作日順の断定ではない。

Homeの作品導線は一覧リンク1つに統合。記事の続きはタイトルから直接開けるが、独立した「続きを読む」ボタンはHomeから外し、Blog一覧だけに残す。Skills停止コントロールは通常表示から外し、タップとキーボード用の操作を保持する。OSの動きを減らす設定では静的表示を維持する。

## 2026-11-05に追加した叩き台

以下は当初 `draft: true` で追加した叩き台。後の公開判断は末尾に記載。事実として確認できる制作内容を中心に書き、未検証の成果・担当割合は補わない。

| 作品・活動 | 確認した根拠 | 画像・注意点 |
| --- | --- | --- |
| 声から画像を作るAIワークショップ教材 | このサイトの `src/content/blog/voice-image-ai-workshop.md` | 掲載済みの説明図を使用。開催実績や参加人数は未確認なので記載しない |
| 神山町の燃料アクセスを考える政策調査 | `~/Documents/地域創生 政策コンテスト/docs/problem-definition-memo-2026-10-28.md` | 聞き取り未実施、地区タンク案は仮説。実施や効果は断定しない。画像は未設定 |
| トラスジョイントの形状検討 | `~/Documents/Codex/2026-07-04/g/outputs/truss_joint_design_notes.md`、`clean_compact_joint_manifest.md` とSTL群 | 同フォルダの `cmp45nooff_iso1.png` を目視確認してコピー。検討途中の形状と明記。造形・強度試験の実施は未確認 |
| 議論を重ねる映像モンタージュ | `~/Documents/編集/docs/after-effects-montage.md`、`build_youtube_montage.jsx`、保存済みAEPの存在 | 実写素材や人物画像は転載しない。公開済み動画や納品実績とは記載しない |

既存の「学校給食パンフレット」は `~/Documents/エディトリアル前期最終_文章.txt` から、軽トラのモチーフ、グリッド、視線誘導、写真以外の制作担当を補足。メンバー名は新たに掲載しない。

## 共有されたFigma6件

以下の原本を読み取り、新規4件と既存2件への追記に反映した。追加時はすべて下書き。制作年が資料から確定しないため、新規4件では年を省略した。

| 掲載先 | 原本・確認箇所 | 掲載の範囲 |
| --- | --- | --- |
| Idea Match | [ポスター](https://www.figma.com/design/agSC1pswKlhyUDPiQWmW8J/idea-Match?node-id=1-2) | 使い方、仕組み、マッチと炎の表現。画像は原本全体。現行の公開サービスや性能とは断定しない |
| 名刺デザイン | [名刺2.0](https://www.figma.com/design/Wyu6NbWEAdpfqxQ1ZrQMwh/?node-id=8-4) | 縦組み・横組み、配色案の検討。連絡先を含まない `8:4` だけを掲載用に書き出し、電話・住所・メール入りの面はリポジトリへ保存しない |
| AIワークショップ教材 | [説明スライド](https://www.figma.com/slides/NaoCgmoO4TpupCAec0AoE8) の `1:129` ほか | 既存下書きにスライド画像と導入の構成を追加。スライド中の計算費用や性能の概算は本文へ転載しない |
| TOROMINO公式サイト | [TOROMINO-WEB](https://www.figma.com/design/i7LApnaRa9oyxeOlYgpE71/TOROMINO-WEB?node-id=42-285) | 既存ページにレイアウト案を追加。仮画像を含む制作過程であることを明記 |
| Sparklish | [企画資料](https://www.figma.com/slides/zqWRvFiCugk7K1IBEOxAer) の `12075:114`、`14259:114` ほか | チームでのサービス企画と利用場面。表紙に本人の参加を確認。個人の担当範囲、受賞、効果は断定しない。現在のTranscrabの説明とは分ける |
| 給食ができるまで — Webデザイン | [本人の提出ページ](https://www.figma.com/design/AWHpw5hW2blT6maQaXeahv/?node-id=3028-488)、`3028:607`、`3354:221` | 本人の担当はクレジットの「Webサイト制作」で確認。表紙は `3028:582`、ギャラリーは `3028:488`。元リンク先の `4533:686` は空だったため、同じ本人ページの作品を確認した |

Figmaの原本は変更せず、書き出したPNGを `src/assets/` に保存した。期限付きの画像URLやフォントファイルは配布物へ含めない。

## 最近の制作物の公開と掲載順

「最近の作ったものを更新」の依頼を受け、上記の下書きから7件を公開。公開28件・下書き1件。映像モンタージュはAEPと生成スクリプトはあるが完成出力を確認できないため、下書きを維持する。本人の指定で掲載対象外にした紹介ファイルと出典は現行版から削除した。

Homeでは開発、デバイス、教材、グラフィックなどが続けて目に入るよう、最近の取り組みを先頭に混ぜて並べた。制作年が不明なFigma作品には年を補わず、掲載順と制作日順を区別する。開発以外の制作も一目で伝わるという仮説で、見た人の反応は今後確認する。

## TonightとEvoLife

本人の希望を受け、2件を追加。公開30件・下書き1件となる。実装と保存済みの実験結果から紹介し、アプリの実機動作やGPU実験は今回再実行していない。

| 作品 | 確認した根拠 | 掲載素材・表現 |
| --- | --- | --- |
| Tonight | `android/auto-mail/docs/product-vision.md`、`OcrParser.kt`、`GeminiFollowUpDraftGenerator.kt`、`FollowUpEditorScreen.kt`、`FollowUpReminderWorker.kt` | Androidの試作として掲載。画像は未設定で、連絡先や会話の実データは使わない。メール下書きの編集とメールアプリへの引き継ぎまでを説明し、自動送信とは記載しない |
| EvoLife | `Alife/EvoLife/docs/README.md`、`docs/experiments.md`、`src/kite_asal_search.py` と観察器の実装、`runs/20260430-165513-cpu1000-siglip2-target-prod/meta.json`・`summary.csv` | 表紙は同runの `frames/06_global_candidate-0045/gen-000240.ppm` をPNGへ形式変換。ギャラリーは `runs/snapshots-seed63-bec0139-cost14/timeline.png`。CPUシミュレーション＋GPU観察器の役割を明記。GPUによるシミュレーション全体の高速化や、zineの完成は主張しない |
