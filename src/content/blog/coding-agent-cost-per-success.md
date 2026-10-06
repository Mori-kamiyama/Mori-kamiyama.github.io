---
title: Claudeは5倍お得？ そもそも、そのAPIが高すぎないか
ogTitle: "Claudeは5倍お得？\nそもそも、そのAPIが高すぎないか"
description: ClaudeのサブスクはChatGPTより5倍お得。でも、その換算に使ったAPI自体が高かったら？ 公開コーディング評価から、同じお金で何件の仕事を終えられるかを計算し直しました。
date: 2026-10-06
featured: false
---

**Claude、そもそも高すぎないか。**

[Artificial Analysisのコーディング評価](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex)を見ると、1タスクを実行する平均API費用はGPT-6.1 Solが$1.04、Claude Opus 5.5が$13.04。今回選んだ設定では、約12.5倍の差がある。

そんな中で、SemiAnalysisの[「AnthropicのサブスクはOpenAIより5倍以上の価値を提供する」](https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x)という記事を読んだ。

月額$200で、Claudeなら$11,726分、ChatGPTなら$2,084分のAPI利用に相当する。なるほど、API料金で換算すればClaudeの方がずっと大きい。

でも、ここで引っかかった。

**その「何ドル分」は、そもそも高いAPI料金で膨らんでいないか？**

たとえば、同じ仕事をするのにAは$1、Bは$10かかるとする。Aを$100分使えるプランと、Bを$500分使えるプランがあったら、API換算ではBが5倍お得だ。でも終わる仕事はAが100件、Bが50件になる。

もちろん、ClaudeとGPTが同じ仕事を同じ品質でこなすとは限らない。だから、料金だけでなく成功率も入れて比べたい。

僕が知りたいのは、**同じお金を払って、結局いくつ仕事が終わるのか**だ。

## 「5倍お得」を、成功した仕事の数で割り直す

まずはサブスクを離れ、API費用1ドルでどれだけのタスクが成功するかを計算した。すると、こうなる。

<div style="overflow-x:auto" tabindex="0" role="region" aria-label="API費用あたりの成功量グラフ。狭い画面では横にスクロールできます。"><img src="/data/coding-efficiency/api-successes.svg" style="min-width:640px;width:100%" alt="API費用1ドルあたりの成功タスク相当。Luna 2.508、Sol 0.617、Opus 0.051、Sonnet 0.048。" /></div>

使ったのは[Artificial Analysisのコーディングエージェント比較](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex)。各モデルの、公開表で総合スコアが最も高い設定を選んだ。**この選び方は最高性能の比較であり、最も安く仕事を終わらせる設定の比較とは限らない。**

評価対象はモデル単体ではなく、CodexまたはClaude Codeとモデル・推論設定の組み合わせだ。以下は2026年10月6日に確認した値。

<div style="overflow-x:auto" tabindex="0" role="region" aria-label="モデル別ベンチマーク結果。狭い画面では横にスクロールできます。">

| エージェント / モデル | 設定 | DeepSWE | Terminal | Atlas | API費用 / 試行 |
| --- | --- | ---: | ---: | ---: | ---: |
| Codex / GPT-6 Luna | max | 64% | 15% | 44% | $0.18 |
| Codex / GPT-6.1 Sol | xhigh | 73% | 55% | 61% | $1.04 |
| Claude Code / Opus 5.5 | max | 68% | 63% | 66% | $13.04 |
| Claude Code / Sonnet 5.5 | max | 72% | 66% | 67% | $14.19 |

</div>

<details class="article-accordion">
<summary>計算方法：成功率とコストの重みを揃える</summary>

[評価方法](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)によると、DeepSWE v1.1は113タスク、Terminal-Bench 4.0は66タスク、SWE-Atlas-QnAは124タスク。各タスクを3回評価している。

総合Indexは3評価の等重み平均。一方、費用は試行単位でまとめた平均なので、Indexをそのまま成功率として割ると重みが揃わない。ここでは303タスクを同じ割合で処理すると考え、公開された成功率から次のように再計算した。

```text
p = (113 × DeepSWE成功率 + 66 × Terminal成功率 + 124 × Atlas成功率) / 303
成功タスク相当 / $ = p / 平均API費用
成功1件あたりのAPI費用 = 平均API費用 / p
```

成功率には小数を使う。たとえばSolなら、`(113×0.73 + 66×0.55 + 124×0.61) / 303 ≈ 0.6417`。

公開率と費用は丸められているため、結果も概算だ。また、費用の計測が欠けた試行は元データの平均から除外される。全試行に費用計測があると仮定した再構成であり、厳密な成功件数÷総費用の実測値ではない。

</details>

| モデル | 再計算した成功率 | 成功タスク相当 / $ | 成功1件あたりのAPI費用 |
| --- | ---: | ---: | ---: |
| Luna | 約45.1% | 約2.508 | 約$0.40 |
| Sol | 約64.2% | 約0.617 | 約$1.62 |
| Opus | 約66.1% | 約0.051 | 約$19.73 |
| Sonnet | 約68.6% | 約0.048 | 約$20.67 |

成功1件あたりに直すと、Solは約$1.62、Opusは約$19.73。**成功率の差を入れても、約12.2倍の開きが残る。** Sonnetとの比較では約12.8倍だ。

Claudeの方が多くのタスクに成功している。それでも、この設定では増えた成功量に対して費用の増え方がかなり大きい。「Claudeが高い」と感じた理由はここにある。

一方、Lunaは成功率が低くても、1試行が$0.18なので費用あたりの成功量はSolの約4.1倍になる。安さが効く仕事は、確かにありそうだ。

ここでの「成功量」は、ベンチマークと同じ構成の仕事を多数投入した場合の期待値だ。**同じ難問を繰り返せば解けるという意味ではない。** 解けない仕事が特定の種類に偏れば、再試行の結果も相関する。

## Claudeの大きな利用枠で、この差は埋まるか

SemiAnalysisの公開図で確認した、月額$200プランのAgentic負荷における月間API換算利用枠は、Solが$2,084、Opusが$11,726、Sonnetが$12,529だった。

次の棒グラフは、その枠をコーディング評価へそのまま移せると仮定した**条件付きシナリオ**だ。

```text
月間成功タスク相当 = 月間API換算利用枠 × p / 平均API費用
```

<div style="overflow-x:auto" tabindex="0" role="region" aria-label="月額プランの条件付き推計グラフ。狭い画面では横にスクロールできます。"><img src="/data/coding-efficiency/monthly-scenario.svg" style="min-width:640px;width:100%" alt="月額200ドルの条件付き推計。Sol約1286件、Sonnet約606件、Opus約594件。Lunaは利用枠を2084ドルと仮定した場合のみ約5226件。" /></div>

| モデル | 月間API換算利用枠 | 条件付き成功タスク相当 |
| --- | ---: | ---: |
| Luna | 未確認。$2,084と仮定 | 約5,226 |
| Sol | $2,084 | 約1,286 |
| Sonnet | $12,529 | 約606 |
| Opus | $11,726 | 約594 |

**今度はSolが約2.1〜2.2倍になる。**

Opusの場合、API換算の利用枠はSolの約5.6倍。しかし、成功1件あたりの費用は約12.2倍かかる。前者の大きさを後者が上回るので、終わる仕事の数へ換算すると順序が逆になる。

SemiAnalysisの数字を使っても、「何ドル分使えるか」と「何件成功するか」では、ここまで見え方が変わる。

ここで「ChatGPTの圧勝」と書きたくなるが、そこまで言うと同じ落とし穴にはまる。**これは月間処理件数の実測ではない。** SemiAnalysisの利用枠は特定の入力・キャッシュ・出力比率を前提としている。AAのタスクが同じ比率とは限らず、サブスクの消費とAPI価格の対応もトークン種類ごとに変わり得る。利用枠を100%使い切れること、料金時点やコンテキスト条件が揃うことも仮定している。

Lunaの$2,084は測定値でも、公式に確認した枠でもない。図では破線にした。一般には、Lunaの枠をBドルと置けば月間成功量は約`2.508 × B`。このシナリオのSolと並ぶ境界は約$513だ。

## では、安いLunaを回し続ければいいのか

Lunaの棒がこれだけ長いと、全部Lunaに任せたくなる。でも、仕事には締切がある。

AAが掲載する平均実行時間も使って、1本ずつ逐次実行した場合の成功量を計算してみる。

| モデル | 平均実行時間 / 試行 | 成功タスク相当 / 時間 |
| --- | ---: | ---: |
| Luna | 21.4分 | 約1.27 |
| Sol | 15.5分 | 約2.48 |
| Opus | 約66分 | 約0.60 |
| Sonnet | 約90分 | 約0.46 |

**財布に優しいのはLuna、待ち時間まで考えるとSol。** 今回の評価では、Solの時間あたりの成功量はLunaの約2倍になる。並列数、実行環境、利用制限によってこの関係は変わる。これは人の作業時間や、実際の月間処理能力を測った値ではない。

さらに、失敗したコードを読んで、原因を探して、指示を書き直すのは人間だ。API料金を数ドル節約しても、そのために自分の時間を30分使ったら、得したとは言いにくい。

実務で測りたい費用効率は、ここまで含めたものになる。

```text
実務の費用効率 = 受け入れ可能な完了件数
                / (AI費用 + 実行環境費用 + 人の確認・修正費用)
```

安いモデルでも、失敗の判定や手直しに時間がかかれば総費用は増える。逆に、高いモデルでも難しい仕事を一度で終わらせ、人の時間を減らせるなら価値がある。再試行・別モデルへの切り替えを含む、ワークフロー全体で測る必要がある。

Claude側にも、設定を変える余地は大きい。公開表ではSonnet 5.5 highはIndex 55・$1.24、mediumは46・$0.62。「Claudeはいつでも12倍高い」という話ではなく、今回選んだ最高スコアの設定に大きな費用差があった、という話だ。

Lunaにも苦手な仕事がある。Terminalの成功率は15%。自分の仕事がそこに近いなら、全体平均の安さを見ても仕方がない。

## 「何ドル分もらえるか」だけでは選べない

SemiAnalysisの利用上限の調査は、比較の土台になる。同記事も、API価格自体の割高・割安やトークン効率によって、換算価値が実用上の価値からずれることを認めている。

僕が疑問に思うのは、そのAPI換算額をサブスクの「お得さ」の中心に置くことだ。高いAPIを大量に使えるプランは、安いAPIなら少ない消費で終わる仕事を、豪華にこなしているだけかもしれない。

今回の数字は、Claudeの価値を否定するものではない。ただ、**「5倍のAPI価値がある」から「5倍お得」へ進む前に、1件の仕事を終わらせるのにいくら使っているのかを見たい。**

$11,726分もらえる、と言われるとすごく見える。でも僕が月額料金を払う理由は、API料金表の上で得をするためではない。自分の仕事を終わらせるためだ。

## 出典と再計算

- [SemiAnalysis：Anthropic Subscriptions Offer 5x+ More Value Than OpenAI](https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x)（2026-10-05公開。月間枠は公開図から確認）
- [Artificial Analysis：Claude Code vs. Codex](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex)
- [Artificial Analysis：Coding Agent Index v1.5の評価方法](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)
- [入力値・計算結果のJSON](/data/coding-efficiency/measurements.json) / [CSV](/data/coding-efficiency/calculations.csv)
- [グラフ生成・再計算スクリプト](https://github.com/Mori-kamiyama/Mori-kamiyama.github.io/blob/main/scripts/coding-efficiency.mjs)（リポジトリで `node scripts/coding-efficiency.mjs` を実行）

データ確認日：2026年10月6日。ベンチマークの点推定を使った概算で、信頼区間や順位の統計的有意性は計算していない。
