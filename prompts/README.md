# prompts/

AI機能ごとに1フォルダ。フォルダ名は docs/concept.md の「機能名」と同じにする。

| ファイル | 作る人 | 中身 |
| --- | --- | --- |
| `brief.md` | Claude Code（/studio-brief） | AI Studio での作業手順と初稿 |
| `cases.jsonl` | Claude Code（/studio-brief） | テストケース |
| `system_prompt.md` | 人間（AI Studio で確定） | **正本** System instructions |
| `schema.json` | 人間（AI Studio で確定） | **正本** 出力スキーマ |
| `config.json` | 人間（AI Studio で確定） | **正本** モデル名・temperature・選んだ理由 |
| `studio_code.txt` | 人間（任意） | AI Studio「Get code」の出力 |
| `eval-result.json` | scripts/eval-prompt.mjs | 評価結果 |

`_example/` は書き方の見本。
