---
title: AIのコスパを「成功した仕事の量」で比べる
ogTitle: "AIのコスパを\n成功した仕事の量で比べる"
description: ClaudeとChatGPTを、API換算利用枠だけでなく成功タスクあたりの費用で比較する。4つのコーディングエージェントの公開評価から、処理量・待ち時間・月額プランの条件付き推計を考えます。
date: 2026-10-06
featured: false
---

AIの料金を比べるとき、僕が知りたいのは「同じお金で、どれだけ仕事を終わらせられるか」だ。

きっかけは、SemiAnalysisが2026年10月5日に公開した[サブスクの利用上限を比較する記事](https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x)。ClaudeはChatGPTより約5倍のAPI換算価値を提供する、という内容だった。

これは利用枠を測る指標として意味がある。ただ、高いAPI料金で換算した利用枠が大きくても、そのモデルが一つの仕事に多くのトークンを使うなら、終わらせられる仕事は増えない。

そこで、**費用あたりの成功タスク量**へ換算してみた。結論から言えば、今回の公開評価ではLunaがAPI費用あたりの成功量、Solが逐次実行の時間あたりの成功量で優位になる。ただし、これをそのまま実務やサブスクの月間処理件数だとは言えない。

## まず、API費用あたりの成功量を見る

<div style="overflow-x:auto" tabindex="0" role="region" aria-label="API費用あたりの成功量グラフ。狭い画面では横にスクロールできます。"><img src="/data/coding-efficiency/api-successes.svg" style="min-width:640px;width:100%" alt="API費用1ドルあたりの成功タスク相当。Luna 2.508、Sol 0.617、Opus 0.051、Sonnet 0.048。" /></div>

使ったのは[Artificial Analysisのコーディングエージェント比較](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex)。各モデルの、公開表で総合スコアが最も高い設定を選んだ。**この選び方は最高性能の比較であり、最も安く仕事を終わらせる設定の比較とは限らない。**

評価対象はモデル単体ではなく、CodexまたはClaude Codeとモデル・推論設定の組み合わせだ。以下は2026年10月6日に確認した値。

<div style="overflow-x:auto">

| エージェント / モデル | 設定 | DeepSWE | Terminal | Atlas | API費用 / 試行 |
| --- | --- | ---: | ---: | ---: | ---: |
| Codex / GPT-6 Luna | max | 64% | 15% | 44% | $0.18 |
| Codex / GPT-6.1 Sol | xhigh | 73% | 55% | 61% | $1.04 |
| Claude Code / Opus 5.5 | max | 68% | 63% | 66% | $13.04 |
| Claude Code / Sonnet 5.5 | max | 72% | 66% | 67% | $14.19 |

</div>

### 成功率とコストの重みを揃える

[評価方法](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)によると、DeepSWE v1.1は113タスク、Terminal-Bench 4.0は66タスク、SWE-Atlas-QnAは124タスク。各タスクを3回評価している。

総合Indexは3評価の等重み平均。一方、費用は試行単位でまとめた平均なので、Indexをそのまま成功率として割ると重みが揃わない。ここでは303タスクを同じ割合で処理すると考え、公開された成功率から次のように再計算した。

```text
p = (113 × DeepSWE成功率 + 66 × Terminal成功率 + 124 × Atlas成功率) / 303
成功タスク相当 / $ = p / 平均API費用
成功1件あたりのAPI費用 = 平均API費用 / p
```

成功率には小数を使う。たとえばSolなら、`(113×0.73 + 66×0.55 + 124×0.61) / 303 ≈ 0.6417`。

公開率と費用は丸められているため、結果も概算だ。また、費用の計測が欠けた試行は元データの平均から除外される。全試行に費用計測があると仮定した再構成であり、厳密な成功件数÷総費用の実測値ではない。

| モデル | 再計算した成功率 | 成功タスク相当 / $ | 成功1件あたりのAPI費用 |
| --- | ---: | ---: | ---: |
| Luna | 約45.1% | 約2.508 | 約$0.40 |
| Sol | 約64.2% | 約0.617 | 約$1.62 |
| Opus | 約66.1% | 約0.051 | 約$19.73 |
| Sonnet | 約68.6% | 約0.048 | 約$20.67 |

この設定・タスク構成では、Solの費用あたりの成功量はOpusの約12.2倍、Sonnetの約12.8倍。LunaはSolの約4.1倍になる。

ここでの「成功量」は、ベンチマークと同じ構成の仕事を多数投入した場合の期待値だ。**同じ難問を繰り返せば解けるという意味ではない。** 解けない仕事が特定の種類に偏れば、再試行の結果も相関する。

## 月額プランに換算するとどうなるか

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

この仮定では、Solの成功量はClaudeの2モデルの約2.1〜2.2倍になる。API換算利用枠だけで見たときと、順序が逆になる。

ただし、**この計算だけで「ChatGPTのサブスクは実務で2倍使える」と結論づけることはできない。** SemiAnalysisの利用枠は特定の入力・キャッシュ・出力比率を前提としている。AAのタスクが同じ比率とは限らず、サブスクの消費とAPI価格の対応もトークン種類ごとに変わり得る。利用枠を100%使い切れること、料金時点やコンテキスト条件が揃うことも仮定している。

Lunaの$2,084は測定値でも、公式に確認した枠でもない。図では破線にした。一般には、Lunaの枠をBドルと置けば月間成功量は約`2.508 × B`。このシナリオのSolと並ぶ境界は約$513だ。

## 実務では、人の時間も費用になる

費用効率と待ち時間の効率は別だ。AAが掲載する平均実行時間も同じタスク構成へ当てはめると、1本ずつ逐次実行する場合は次の概算になる。

| モデル | 平均実行時間 / 試行 | 成功タスク相当 / 時間 |
| --- | ---: | ---: |
| Luna | 21.4分 | 約1.27 |
| Sol | 15.5分 | 約2.48 |
| Opus | 約66分 | 約0.60 |
| Sonnet | 約90分 | 約0.46 |

LunaはAPI費用あたりの成功量が多いが、今回の評価では時間あたりの成功量はSolの方が多い。並列数、実行環境、利用制限によってこの関係は変わる。これは人の作業時間や、実際の月間処理能力を測った値ではない。

実務で本当に測りたいのは、次の指標だ。

```text
実務の費用効率 = 受け入れ可能な完了件数
                / (AI費用 + 実行環境費用 + 人の確認・修正費用)
```

安いモデルでも、失敗の判定や手直しに時間がかかれば総費用は増える。逆に、高いモデルでも難しい仕事を一度で終わらせ、人の時間を減らせるなら価値がある。再試行・別モデルへの切り替えを含む、ワークフロー全体で測る必要がある。

また、最大設定だけでClaude全体の効率を判断するのも早い。公開表ではSonnet 5.5 highはIndex 55・$1.24、mediumは46・$0.62。推論設定を下げた比較も必要だ。LunaのTerminal成功率15%からも、平均の安さだけでは仕事の適性を判断できないことが分かる。

僕がAIの料金比較で見たいのは、利用枠の大きさに加えて、**自分の仕事を、人の手直しまで含めて何件完了できるか**だ。今回の計算はその入口になるが、最終的には自分のタスクで測りたい。

## 出典と再計算

- [SemiAnalysis：Anthropic Subscriptions Offer 5x+ More Value Than OpenAI](https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x)（2026-10-05公開。月間枠は公開図から確認）
- [Artificial Analysis：Claude Code vs. Codex](https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex)
- [Artificial Analysis：Coding Agent Index v1.5の評価方法](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)
- [入力値・計算結果のJSON](/data/coding-efficiency/measurements.json) / [CSV](/data/coding-efficiency/calculations.csv)
- [グラフ生成・再計算スクリプト](https://github.com/Mori-kamiyama/Mori-kamiyama.github.io/blob/main/scripts/coding-efficiency.mjs)（リポジトリで `node scripts/coding-efficiency.mjs` を実行）

データ確認日：2026年10月6日。ベンチマークの点推定を使った概算で、信頼区間や順位の統計的有意性は計算していない。
