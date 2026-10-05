// AI Studio で確定したプロンプトを、cases.jsonl の全ケースで実行して結果を保存する。
// 使い方: node --env-file=.env scripts/eval-prompt.mjs <機能名>
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const feature = process.argv[2];
if (!feature) {
  console.error("機能名を指定してください: node --env-file=.env scripts/eval-prompt.mjs <機能名>");
  process.exit(1);
}
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(".env に GEMINI_API_KEY がありません");
  process.exit(1);
}

const dir = join("prompts", feature);
const systemPrompt = await readFile(join(dir, "system_prompt.md"), "utf8");
const schema = JSON.parse(await readFile(join(dir, "schema.json"), "utf8"));
const config = JSON.parse(await readFile(join(dir, "config.json"), "utf8"));
const cases = (await readFile(join(dir, "cases.jsonl"), "utf8"))
  .split("\n").map((l) => l.trim()).filter(Boolean).map((l) => JSON.parse(l));

const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;

// スキーマの required とトップレベルの型だけを簡易チェック（厳密な検証は実装側で行う）
function checkShape(value, s) {
  const problems = [];
  if (s.type === "object" || s.type === "OBJECT") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return ["object ではない"];
    for (const key of s.required ?? []) if (!(key in value)) problems.push(`必須項目 ${key} がない`);
  }
  if ((s.type === "array" || s.type === "ARRAY") && !Array.isArray(value)) problems.push("array ではない");
  return problems;
}

const results = [];
for (const c of cases) {
  const started = Date.now();
  let output = null, error = null, problems = [];
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: c.input }] }],
        generationConfig: {
          temperature: config.temperature ?? 1,
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error?.message ?? `HTTP ${res.status}`);
    const text = body.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
    output = JSON.parse(text);
    problems = checkShape(output, schema);
  } catch (e) {
    error = String(e.message ?? e);
  }
  const ms = Date.now() - started;
  const ok = !error && problems.length === 0;
  console.log(`${ok ? "OK " : "NG "} ${c.id}  ${ms}ms  ${error ?? problems.join(", ")}`);
  results.push({ id: c.id, input: c.input, expect: c.expect, output, error, problems, ms });
}

await writeFile(join(dir, "eval-result.json"), JSON.stringify({ feature, model: config.model, at: new Date().toISOString(), results }, null, 2));
console.log(`\n保存: ${join(dir, "eval-result.json")}（expect を満たすかの判定は Claude Code が行います）`);
