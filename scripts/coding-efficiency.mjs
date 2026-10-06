import { mkdirSync, writeFileSync } from 'node:fs';

// Public rounded measurements, retrieved 2026-10-06. These are agent variants.
// https://artificialanalysis.ai/agents/coding-agents/comparisons/claude-code-vs-codex
// https://artificialanalysis.ai/methodology/coding-agents-benchmarking
// Subscription values read directly from the two public SemiAnalysis figures:
// https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x
const counts = [113, 66, 124];
const rows = [
  { name: 'GPT-6 Luna', effort: 'max', scores: [64, 15, 44], cost: 0.18, minutes: 21.4, budget: null },
  { name: 'GPT-6.1 Sol', effort: 'xhigh', scores: [73, 55, 61], cost: 1.04, minutes: 15.5, budget: 2084 },
  { name: 'Claude Opus 5.5', effort: 'max', scores: [68, 63, 66], cost: 13.04, minutes: 66, budget: 11726 },
  { name: 'Claude Sonnet 5.5', effort: 'max', scores: [72, 66, 67], cost: 14.19, minutes: 90, budget: 12529 },
].map(r => {
  const p = r.scores.reduce((s, v, i) => s + v / 100 * counts[i], 0) / 303;
  return { ...r, p, perDollar: p / r.cost, costPerSuccess: r.cost / p, perHour: p * 60 / r.minutes, monthly: r.budget === null ? null : r.budget * p / r.cost };
});
const dir = 'public/data/coding-efficiency';
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/measurements.json`, JSON.stringify({ retrieved: '2026-10-06', counts, note: 'Rounded published scores; pooled rate reconstructed assuming all attempts have cost telemetry. Monthly values are workload-transfer scenarios, not measured subscription throughput. Luna budget is unknown.', rows }, null, 2) + '\n');
writeFileSync(`${dir}/calculations.csv`, 'model,effort,pooled_success_rate,api_cost_per_attempt,api_successes_per_dollar,api_cost_per_success,serial_successes_per_hour,subscription_api_value,scenario_successes_per_month\n' + rows.map(r => [r.name, r.effort, r.p, r.cost, r.perDollar, r.costPerSuccess, r.perHour, r.budget ?? '', r.monthly ?? ''].join(',')).join('\n') + '\n');

function chart(file, title, subtitle, items, max, ticks, format, note) {
  const width = 760, height = 130 + items.length * 84 + 85;
  const left = 28, plot = 580, top = 125;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${title}</title><desc id="desc">${subtitle}。${items.map(r => `${r.label}: ${format(r.value)}`).join('、')}。${note}</desc><rect width="100%" height="100%" fill="#fff"/><g font-family="sans-serif" fill="#242424"><text x="28" y="37" font-size="24" font-weight="700">${title}</text><text x="28" y="68" font-size="16">${subtitle}</text>`;
  for (const t of ticks) {
    const x = left + t / max * plot;
    svg += `<path d="M${x} ${top}V${top + items.length * 84 - 16}" stroke="#e7e7e7"/><text x="${x}" y="${top + items.length * 84 + 12}" font-size="16" text-anchor="middle">${t}</text>`;
  }
  items.forEach((r, i) => {
    const y = 106 + i * 84, w = r.value / max * plot;
    svg += `<text x="28" y="${y}" font-size="19" font-weight="600">${r.label}</text><rect x="28" y="${y + 12}" width="${w}" height="26" fill="${r.assumed ? '#fff' : '#426e9b'}" stroke="#426e9b" ${r.assumed ? 'stroke-dasharray="6 4"' : ''}/><text x="${left + w + 12}" y="${y + 33}" font-size="19">${format(r.value)}</text>`;
  });
  svg += `<text x="28" y="${height - 16}" font-size="15">${note}</text></g></svg>`;
  writeFileSync(`${dir}/${file}.svg`, svg);
}
chart('api-successes', 'API費用 $1 あたりの成功タスク相当', 'AAの303タスク構成・公開値からの概算／高いほどよい', rows.map(r => ({ label: `${r.name} (${r.effort})`, value: r.perDollar })), 2.8, [0, .5, 1, 1.5, 2, 2.5], v => v.toFixed(3), '出典: Artificial Analysis / 2026-10-06 / 人の確認・修正費用を含まない');
chart('monthly-scenario', '月額 $200 の成功タスク相当：条件付き推計', 'API換算利用枠をAAタスクへ移せると仮定／実測件数ではない', [rows[0], rows[1], rows[3], rows[2]].map(r => ({ label: `${r.name}${r.budget === null ? '（枠を $2,084 と仮定）' : ''}`, value: r.monthly ?? 2084 * r.perDollar, assumed: r.budget === null })), 6000, [0, 1000, 2000, 3000, 4000, 5000], v => Math.round(v).toLocaleString('en-US'), 'Lunaの破線は仮定／全モデルで利用枠100%消化・負荷構成の移植を仮定');
console.table(rows);
