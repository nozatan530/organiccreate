# プロジェクト規約

## 開発フロー

| 段階 | 誰が | コマンド | 成果物 |
| --- | --- | --- | --- |
| 1. 構想 | Claude Code | `/app-idea` | `docs/concept.md` |
| 2. AI Studio向け指示書 | Claude Code | `/studio-brief <機能名>` | `prompts/<機能名>/brief.md`, `cases.jsonl` |
| 3. プロンプト・スキーマ確定 | 人間（AI Studio） | — | `prompts/<機能名>/` に結果を保存 |
| 4. 取り込み・評価 | Claude Code | `/studio-import <機能名>` | `docs/spec.md` 更新、評価レポート |
| 5. 実装 | Claude Code | `/build` | `src/` |
| 6. 検証 | Claude Code | `/verify` | 検証レポート |

段階を飛ばさない。AI機能がないアプリは 2〜4 を省略してよい。

**このプロジェクトはAI機能がないので段階2〜4は省略する。段階1（構想）→ 段階5（実装）→ 段階6（検証）の流れで進める。**

## ルール

- `prompts/<機能名>/` の `system_prompt.md` `schema.json` `config.json` は AI Studio で確定した**正本**。実装側で勝手に書き換えない。変更が必要になったら理由を示して提案し、`/studio-brief` に戻る。
- 実装はプロンプトやスキーマを**コードにコピペせず、`prompts/` から読み込む**（正本を1か所に保つため）。
- Gemini の APIキーはフロントエンドに絶対に置かない。サーバー側（Firebase Functions / Cloud Run など）を経由させる。
- 生徒の個人情報（氏名・出席番号など）を API に送らない設計にする。
- 1機能ずつ実装し、動いたらコミットする。
- 利用者は中高生と教員。端末は Chromebook / iPad / スマホを想定し、狭い画面でも使えること。

### このプロジェクト固有のルール

#### 化学の正確さ（最優先）
- 反応・条件・生成物は、高校化学の教科書の範囲と記述に合わせる。発展内容（マルコフニコフ則など）には「発展」と明記する。
- 反応式は係数まで正しく書く。構造式のSMILESは、水素を明示する形 `[H]C([H])...` で書く。
- 危険な物質（水銀化合物、四塩化炭素など）は、毒性や規制について解説に一言入れる。
- 新しい反応を追加したら、根拠（教科書のどの記述か）を作者に確認してもらう。

#### ゲームデザイン
- 失敗したときは、必ず「なぜうまくいかなかったか」がわかるメッセージを返す。単に「失敗」とだけ出さない。
- 「どこから作るか」をマップで示すことをゲームの中心に据える。行き詰まらないように、「次の一歩」と依頼のヒントは必ず用意する。
- 答えをすぐ見せない。ひらめき★を使って段階的に開示する仕組みを保つ。

#### UI（v3でゴチャゴチャを整理した経緯があるため、特に注意）
- 常に表示する情報を増やさない。新しい機能はタブやダイアログ、サイドパネルの切り替えに収める。
- マップ上の文字（反応条件のラベルなど）は、選択中の物質の周りにだけ出す。
- スマートフォン幅（約400px）でも操作できるようにする。マップは横にスクロールできる。
- 色は既存のCSS変数（分類色 `--c-alkane` など）を使い、ダークモードでも読めることを確認する。

#### 実装
- 画面の骨組みとCSSは `index.html`、ロジックは `src/*-app.js`、データは `src/*-data.js` に分ける（下の「技術スタック」参照）。
- 反応・物質のデータは `src/*-data.js` にまとめ、画面側のコードに直接書かない。
- npm パッケージは Vite でまとめる（`jspdf` など）。CDN から読み込む外部スクリプトは jsDelivr / cdnjs からのみ、バージョンを固定する。
- データ構造を変えるときは、`localStorage` のキーの末尾の番号を上げる（古いセーブデータとの衝突を防ぐため）。
- `alert()` / `confirm()` は使わない（埋め込み先で動かないことがある）。確認はページ内で2段階押しにする。

## コマンド

- 開発サーバー: `npm run dev`（http://localhost:3000）
- 型チェック: `npm run lint`
- テスト: なし
- ビルド: `npm run build`（出力は `dist/`）
- 公開: `main` に push（マージ）すると `.github/workflows/static.yml` が Bun でビルドして GitHub Pages に公開する

## 技術スタック

Vite でビルドする素の JavaScript（ES モジュール）。画面に React は使っていない。

- `index.html`：画面の骨組みと CSS（分類色などの CSS 変数）。`src/craft-app.js` を読み込む
- `src/craft-app.js`：ゲーム本体（マップ・反応台・依頼）。`src/craft-data.js` が物質・反応・依頼のデータ
- `src/separation-app.js` / `separation-data.js`：芳香族化合物の分離パズル
- `src/retro-app.js` / `retro-data.js`：逆合成パズル
- `src/poster-app.js`：反応系統図ポスターの表示と PDF 出力（`jspdf`・`html2canvas`）
- `src/detective-data.js`：構造決定の謎解きデータ
- `smiles-drawer@2.1.7`（jsDelivr）：SMILES記法から構造式をSVGで描画
- `localStorage`（キー：`organic-craft-ch1-v4`）：進捗の保存

GitHub リポジトリは `nozatan530/organiccreate`（ローカルのフォルダ名は `organic-craft`）。
公開先：https://organiccraft.meetupsensei.com/（GitHub Pages。カスタムドメインは `public/CNAME`）。`vite.config.ts` は `base: './'`。

AI Studio の雛形から残っている不要物（仕上げで整理する候補）：
- `src/main.tsx` `src/App.tsx` `src/index.css`（`index.html` から読み込まれていない）
- `@google/genai` `express` `dotenv` `react` など（コードからは使っていない）
- `.env.example` の `GEMINI_API_KEY` / `APP_URL`、`metadata.json`
