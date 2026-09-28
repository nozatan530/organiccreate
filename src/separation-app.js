/**
 * 芳香族化合物の系統分離シミュレーター - ロジック＆UIコントローラー
 * 分液漏斗を用いた酸・塩基抽出実験
 */
import {
  SEP_SUBSTANCES, ACIDITY_ORDER, SEP_REAGENTS, SEP_STAGES
} from './separation-data.js';

export function getSeparationState(state) {
  if (!state.separation) {
    state.separation = {
      stageIdx: 0,
      solved: {},
      etherLayer: SEP_STAGES[0].mixture.slice(),
      waterLayer: null,
      shaken: false,
      isShaking: false,
      isDraining: false,
      cockOpen: false,
      drainedFlask: null,
      isolated: {},
      lastLog: "分液漏斗に有機化合物のエーテル混合溶液が入っています。試薬を加えて分離を始めましょう。",
      lastReaction: null
    };
  }
  return state.separation;
}

export function resetStage(state, stageIdx) {
  const sep = getSeparationState(state);
  sep.stageIdx = stageIdx;
  const stage = SEP_STAGES[stageIdx] || SEP_STAGES[0];
  sep.etherLayer = stage.mixture.slice();
  sep.waterLayer = null;
  sep.shaken = false;
  sep.isShaking = false;
  sep.isDraining = false;
  sep.cockOpen = false;
  sep.drainedFlask = null;
  sep.isolated = {};
  sep.lastLog = `ステージ${stageIdx + 1}「${stage.title}」を開始しました。まずは抽出試薬を加えましょう。`;
  sep.lastReaction = null;
}

export function renderSeparationStage(container, state, callbacks) {
  const sep = getSeparationState(state);
  const curStage = SEP_STAGES[sep.stageIdx] || SEP_STAGES[0];
  const allSolved = Object.keys(sep.solved).length;

  // Header stage tabs
  let stageTabs = "";
  SEP_STAGES.forEach((stg, idx) => {
    const isAct = sep.stageIdx === idx;
    const isCl = !!sep.solved[stg.id];
    stageTabs += `<button type="button" class="sep-stage-tab${isAct ? " active" : ""}${isCl ? " clear" : ""}" data-sep-stage="${idx}">
      ステージ${idx + 1}${isCl ? " ✓" : ""}
      <small>${stg.mixture.map(m => SEP_SUBSTANCES[m]?.n).join("・")}</small>
    </button>`;
  });

  // Funnel visual attributes
  const etherItems = sep.etherLayer.map(id => SEP_SUBSTANCES[id]).filter(Boolean);
  const waterReagent = sep.waterLayer ? SEP_REAGENTS[sep.waterLayer.reagent] : null;
  const waterIons = sep.waterLayer ? sep.waterLayer.ions : [];

  // Check stage completion
  const requiredSubstances = curStage.mixture;
  const isStageComplete = requiredSubstances.every(id => sep.isolated[id]);
  if (isStageComplete && !sep.solved[curStage.id]) {
    sep.solved[curStage.id] = true;
    if (callbacks.onStageClear) {
      callbacks.onStageClear(curStage);
    }
  }

  let html = `
    <div class="sep-topbar">
      <div class="sep-stage-nav">
        ${stageTabs}
      </div>
      <div class="sep-topbar-actions">
        <button type="button" class="btn ghost" id="sep-open-theory" style="font-size:12.5px;padding:4px 10px">
          📖 酸性度の序列と遊離の法則
        </button>
        <button type="button" class="btn ghost" data-back-craft style="font-size:12.5px;padding:4px 10px">
          ← 工房へ戻る
        </button>
      </div>
    </div>

    <div class="sep-stage-header">
      <div class="sep-stage-meta">
        <span class="sep-stage-badge">ステージ ${curStage.num} / ${SEP_STAGES.length}</span>
        <h2 class="sep-stage-title">${curStage.title}</h2>
        <div class="sep-stage-sub">混合物：<b>${curStage.sub}</b></div>
      </div>
      <p class="sep-stage-desc">${curStage.desc}</p>
    </div>

    <div class="sep-main-grid">
      <!-- 左カラム：分液漏斗＆受器フラスコの実機シミュレーション -->
      <div class="sep-lab-card">
        <div class="sep-lab-head">
          <h3 class="sep-card-title">🧪 分液漏斗（Separatory Funnel）</h3>
          <span class="sep-cock-indicator ${sep.cockOpen ? "open" : "closed"}">活栓：${sep.cockOpen ? "開（流出中）" : "閉"}</span>
        </div>

        <div class="sep-funnel-bench">
          <!-- スタンドと分液漏斗のSVGイラスト -->
          <div class="sep-funnel-wrap ${sep.isShaking ? "shaking" : ""}">
            <svg viewBox="0 0 240 380" class="sep-funnel-svg">
              <!-- スタンド（鉄脚・支柱・リング） -->
              <rect x="25" y="360" width="190" height="12" rx="4" fill="var(--line-2)"/>
              <rect x="35" y="10" width="8" height="350" fill="var(--line-2)"/>
              <!-- リングクランプ -->
              <rect x="43" y="130" width="60" height="6" fill="var(--line-2)"/>
              <ellipse cx="120" cy="133" rx="45" ry="10" fill="none" stroke="var(--line-2)" stroke-width="4"/>

              <!-- 分液漏斗クリップパス（球状〜洋ナシ型） -->
              <defs>
                <clipPath id="funnelBodyClip">
                  <path d="M 98 40 L 142 40 L 142 65 C 175 90 175 160 142 220 L 126 250 L 126 280 L 114 280 L 114 250 L 98 220 C 65 160 65 90 98 65 Z"/>
                </clipPath>
              </defs>

              <!-- 上部ガラス栓（すり合わせ栓） -->
              <polygon points="105,15 135,15 128,40 112,40" fill="rgba(203, 213, 225, 0.8)" stroke="var(--ink-2)" stroke-width="2"/>
              <rect x="110" y="8" width="20" height="7" rx="2" fill="var(--ink-2)"/>

              <!-- 漏斗内の液体層（クリップ内部） -->
              <g clip-path="url(#funnelBodyClip)">
                <!-- 空白背景 -->
                <rect x="40" y="40" width="160" height="260" fill="var(--surface-2)" opacity="0.4"/>

                <!-- 上層：ジエチルエーテル層（密度 0.71 g/cm³：常に上） -->
                <rect x="40" y="65" width="160" height="${sep.waterLayer ? "85" : "165"}" fill="rgba(254, 240, 138, 0.35)"/>
                <line x1="60" y1="65" x2="180" y2="65" stroke="rgba(202, 138, 4, 0.4)" stroke-width="1.5" stroke-dasharray="4 2"/>

                <!-- エーテル層の気泡アニメーション -->
                <circle cx="100" cy="95" r="3" fill="#fff" opacity="0.6"/>
                <circle cx="135" cy="110" r="2" fill="#fff" opacity="0.6"/>

                <!-- 下層：水層（密度 1.0 g/cm³：常に下） -->
                ${sep.waterLayer ? `
                  <rect x="40" y="150" width="160" height="110" fill="rgba(186, 230, 253, 0.55)"/>
                  <!-- 界面（相分離境界） -->
                  <line x1="65" y1="150" x2="175" y2="150" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="6 3"/>
                  <circle cx="115" cy="175" r="2.5" fill="#fff" opacity="0.7"/>
                  <circle cx="130" cy="205" r="3" fill="#fff" opacity="0.8"/>
                ` : ""}

                <!-- 滴下中の液柱アニメーション -->
                ${sep.isDraining ? `
                  <rect x="117" y="250" width="6" height="50" fill="#0284c7" opacity="0.8"/>
                ` : ""}
              </g>

              <!-- 分液漏斗の外郭ガラスライン -->
              <path d="M 98 40 L 142 40 L 142 65 C 175 90 175 160 142 220 L 126 250 L 126 280 L 114 280 L 114 250 L 98 220 C 65 160 65 90 98 65 Z" fill="none" stroke="var(--ink-2)" stroke-width="2.5"/>

              <!-- 活栓（コック） -->
              <g transform="translate(120, 270)">
                <ellipse cx="0" cy="0" rx="10" ry="7" fill="var(--line-2)" stroke="var(--ink-2)" stroke-width="2"/>
                <line x1="${sep.cockOpen ? "0" : "-16"}" y1="${sep.cockOpen ? "-16" : "0"}" x2="${sep.cockOpen ? "0" : "16"}" y2="${sep.cockOpen ? "16" : "0"}" stroke="var(--flame)" stroke-width="4" stroke-linecap="round"/>
              </g>

              <!-- コック下の脚管・滴下ノズル -->
              <rect x="117" y="280" width="6" height="35" fill="none" stroke="var(--ink-2)" stroke-width="2"/>

              <!-- 滴下する水滴 -->
              ${sep.isDraining ? `
                <circle cx="120" cy="325" r="3" fill="#0284c7"/>
                <circle cx="120" cy="340" r="2.5" fill="#0284c7"/>
              ` : ""}
            </svg>

            <!-- 漏斗の層内物質バッジ（オーバーレイ） -->
            <div class="sep-funnel-layers-overlay">
              <div class="sep-layer-box ether-layer">
                <div class="sep-layer-label">上層：ジエチルエーテル層（有機相）</div>
                <div class="sep-layer-contents">
                  ${etherItems.length ? etherItems.map(item => `
                    <span class="sep-item-tag" style="--tag-c:${item.color}">${item.n}</span>
                  `).join("") : `<span class="sep-empty-text">溶質なし（エーテルのみ）</span>`}
                </div>
              </div>

              <div class="sep-layer-box water-layer">
                <div class="sep-layer-label">下層：水層（水相）</div>
                <div class="sep-layer-contents">
                  ${sep.waterLayer ? `
                    <span class="sep-reagent-tag">${waterReagent?.n || "抽出水溶液"}</span>
                    ${waterIons.map(ionId => {
                      const saltSub = Object.values(SEP_SUBSTANCES).find(s => s.saltForm?.id === ionId);
                      return saltSub ? `<span class="sep-salt-tag">${saltSub.saltForm.n}</span>` : "";
                    }).join("")}
                  ` : `<span class="sep-empty-text">水層なし（試薬未投入）</span>`}
                </div>
              </div>
            </div>
          </div>

          <!-- 下部の受器（三角フラスコ）：分取した水層を受け取る -->
          <div class="sep-flask-card">
            <div class="sep-flask-head">
              <span class="sep-flask-title">受器（三角フラスコ）</span>
              ${sep.drainedFlask ? `<span class="chip good">水層を分取済</span>` : `<span class="chip unk">受器は空</span>`}
            </div>

            <div class="sep-flask-body">
              ${sep.drainedFlask ? `
                <div class="sep-flask-info">
                  <div class="sep-flask-fluid-name">${sep.drainedFlask.label}</div>
                  <div class="sep-flask-ions">
                    含まれる成分：${sep.drainedFlask.ions.length ? sep.drainedFlask.ions.map(ionId => {
                      const saltSub = Object.values(SEP_SUBSTANCES).find(s => s.saltForm?.id === ionId);
                      return `<b>${saltSub ? saltSub.saltForm.n : ionId}</b>`;
                    }).join("、") : "（塩は含まれていません）"}
                  </div>
                </div>

                ${sep.drainedFlask.precipitate ? `
                  <div class="sep-precipitate-banner">
                    <div class="sep-precip-icon">✨</div>
                    <div class="sep-precip-text">
                      <b>単離成功！</b>
                      <span>${sep.drainedFlask.precipitate.n} が【${sep.drainedFlask.precipitate.form}】として析出・回収されました！</span>
                      <code class="sep-eq-text">${sep.drainedFlask.precipitate.eq}</code>
                    </div>
                  </div>
                ` : `
                  <div class="sep-flask-actions">
                    <span class="sep-flask-act-label">試薬を加えて目的物を遊離・析出させる：</span>
                    <div class="sep-flask-act-btns">
                      <button type="button" class="btn" data-sep-flask-add="hcl">＋ 希塩酸（強酸）を加える</button>
                      <button type="button" class="btn" data-sep-flask-add="naoh">＋ 水酸化ナトリウム（強塩基）を加える</button>
                      <button type="button" class="btn" data-sep-flask-add="co2">＋ 二酸化炭素 CO₂ を吹き込む</button>
                    </div>
                  </div>
                `}
              ` : `
                <div class="sep-flask-placeholder">
                  分液漏斗のコックを開けると、下層の水層がここに流れ込みます。
                </div>
              `}
            </div>
          </div>
        </div>
      </div>

      <!-- 右カラム：操作パネル・試薬棚・分離進捗フローチャート -->
      <div class="sep-control-column">
        <!-- 抽出試薬の投入パネル -->
        <div class="sep-card">
          <div class="sep-card-head">
            <h3 class="sep-card-title">① 抽出試薬を分液漏斗に注ぐ</h3>
          </div>
          <div class="sep-reagent-btns">
            ${Object.values(SEP_REAGENTS).map(r => `
              <button type="button" class="sep-reagent-action-btn" data-sep-add-reagent="${r.id}" ${sep.waterLayer ? "disabled" : ""}>
                <span class="sep-reagent-btn-title">${r.n}</span>
                <span class="sep-reagent-btn-sub">${r.f}（${r.nature}）</span>
                <span class="sep-reagent-btn-desc">${r.actionDesc}</span>
              </button>
            `).join("")}
          </div>
        </div>

        <!-- 分液操作（振とう・分液・留去） -->
        <div class="sep-card">
          <div class="sep-card-head">
            <h3 class="sep-card-title">② 分液漏斗の操作</h3>
          </div>
          <div class="sep-ops-grid">
            <button type="button" class="btn primary" id="sep-btn-shake" ${(!sep.waterLayer || sep.shaken || sep.isShaking) ? "disabled" : ""}>
              🫨 よく振り混ぜて静置する（振とう）
            </button>
            <button type="button" class="btn hot" id="sep-btn-drain" ${(!sep.waterLayer || !sep.shaken || sep.isDraining) ? "disabled" : ""}>
              🚰 コックを開けて下層（水層）を流し出す
            </button>
            <button type="button" class="btn" id="sep-btn-evap" ${(!sep.etherLayer.length || sep.etherLayer.some(id => SEP_SUBSTANCES[id]?.type !== "neutral")) ? "disabled" : ""}>
              ♨️ エーテル層を加熱留去する（中性物質を単離）
            </button>
            <button type="button" class="btn ghost" id="sep-btn-reset">
              🔄 このステージを最初からやり直す
            </button>
          </div>

          <!-- 操作フィードバック・実験ログ -->
          <div class="sep-log-box">
            <div class="sep-log-icon">💬</div>
            <div class="sep-log-content">${sep.lastLog}</div>
          </div>
        </div>

        <!-- 系統分離フローチャート（進捗ツリー） -->
        <div class="sep-card">
          <div class="sep-card-head">
            <h3 class="sep-card-title">③ 系統分離進捗（単離状況）</h3>
            <span class="chip">${Object.keys(sep.isolated).length} / ${requiredSubstances.length} 物質単離</span>
          </div>

          <div class="sep-progress-list">
            ${requiredSubstances.map(subId => {
              const sub = SEP_SUBSTANCES[subId];
              const isIso = !!sep.isolated[subId];
              return `
                <div class="sep-progress-item ${isIso ? "done" : "pending"}">
                  <div class="sep-progress-status">${isIso ? "✅ 単離完了" : "⏳ 未単離"}</div>
                  <div class="sep-progress-info">
                    <span class="sep-progress-name">${sub.n}（${sub.f}）</span>
                    <span class="sep-progress-type">${sub.typeLabel}</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          ${isStageComplete ? `
            <div class="sep-stage-clear-card">
              <div class="sep-clear-stamp">🏆 STAGE CLEAR!</div>
              <p>素晴らしい！酸・塩基の性質と遊離の法則を巧みに操り、すべての化合物を純粋に分離・単離しました！</p>
              ${sep.stageIdx < SEP_STAGES.length - 1 ? `
                <button type="button" class="btn primary" data-sep-next-stage="${sep.stageIdx + 1}" style="padding:10px 16px;font-size:14px;font-weight:700">
                  次のステージへ進む →
                </button>
              ` : `
                <div style="font-weight:700;color:var(--ok)">全4ステージ完全制覇！ 芳香族化合物の系統分離の達人です！</div>
              `}
            </div>
          ` : ""}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * 試薬を分液漏斗に加える
 */
export function addReagentToFunnel(state, reagentId) {
  const sep = getSeparationState(state);
  if (sep.waterLayer) {
    sep.lastLog = "⚠️ すでに分液漏斗内に水層があります。振り混ぜて分液するか、コックを開けて水層を流し出してから次の試薬を加えてください。";
    return false;
  }
  const r = SEP_REAGENTS[reagentId];
  sep.waterLayer = {
    reagent: reagentId,
    name: r.n,
    ions: []
  };
  sep.shaken = false;
  sep.lastLog = `分液漏斗に【${r.n}】を注ぎ入れました。上層（エーテル相）と下層（水相）に分かれています。「振り混ぜる（振とう）」を行って試薬と有機化合物を十分に反応させましょう。`;
  return true;
}

/**
 * 分液漏斗を振り混ぜる（振とう・静置）
 */
export function shakeFunnel(state, callbacks) {
  const sep = getSeparationState(state);
  if (!sep.waterLayer) {
    sep.lastLog = "⚠️ 水層が入っていません。まず抽出試薬を注ぎ入れてください。";
    return false;
  }
  if (sep.shaken) {
    sep.lastLog = "すでに振り混ぜて平衡に達しています。コックを開けて下層（水層）を流し出しましょう。";
    return false;
  }

  sep.isShaking = true;
  if (callbacks.onUpdate) callbacks.onUpdate();

  setTimeout(() => {
    sep.isShaking = false;
    sep.shaken = true;

    const rId = sep.waterLayer.reagent;
    const remainingEther = [];
    const extractedIons = [];
    let logMsg = "";

    // 1. 希塩酸抽出（アニリンなど弱塩基の抽出）
    if (rId === "hcl_dilute") {
      sep.etherLayer.forEach(id => {
        if (id === "aniline") {
          extractedIons.push("aniline_hydrochloride");
        } else {
          remainingEther.push(id);
        }
      });
      if (extractedIons.includes("aniline_hydrochloride")) {
        logMsg = "【振とう完了・静置】弱塩基のアニリンが塩酸と中和反応して水溶性の「アニリン塩酸塩（C₆H₅NH₃⁺Cl⁻）」になり、下層の水層へ移動しました！ 中性・酸性物質はエーテル層に残っています。";
      } else {
        logMsg = "【振とう完了・静置】エーテル層に塩基性物質（アニリン）が存在しないため、塩酸との反応は起きず、変化はありませんでした。";
      }
    }
    // 2. 炭酸水素ナトリウム水溶液（弱アルカリ・炭酸の塩）
    else if (rId === "nahco3_aq") {
      let co2gas = false;
      sep.etherLayer.forEach(id => {
        if (id === "benzoic_acid") {
          extractedIons.push("sodium_benzoate");
          co2gas = true;
        } else if (id === "salicylic_acid") {
          extractedIons.push("sodium_salicylate");
          co2gas = true;
        } else {
          remainingEther.push(id);
        }
      });
      if (extractedIons.length) {
        logMsg = `【振とう完了・静置】酸の強さの序列（安息香酸 ＞ 炭酸 ＞ フェノール類）により、炭酸より強い酸である安息香酸のみが選択的に中和され「安息香酸ナトリウム」として水層へ抽出されました！ 二酸化炭素 CO₂ の気泡が発生したため、コックを開けて内圧を逃がしました。フェノールは炭酸より弱いためエーテル層に残っています！`;
      } else {
        logMsg = "【振とう完了・静置】エーテル層にカルボン酸が存在しないため、反応は起きませんでした（フェノールは炭酸水素ナトリウムとは反応しません）。";
      }
    }
    // 3. 水酸化ナトリウム水溶液（強塩基）
    else if (rId === "naoh_aq") {
      const hasBenzoic = sep.etherLayer.includes("benzoic_acid");
      const hasPhenol = sep.etherLayer.includes("phenol");

      if (hasBenzoic && hasPhenol) {
        // ミスケース：安息香酸とフェノールの両方が同時に落ちてしまう！
        extractedIons.push("sodium_benzoate", "sodium_phenoxide");
        sep.etherLayer.forEach(id => {
          if (id !== "benzoic_acid" && id !== "phenol") remainingEther.push(id);
        });
        logMsg = "⚠️【注意！分離失敗の兆候】水酸化ナトリウムは強塩基のため、安息香酸（カルボン酸）とフェノール（フェノール類）の両方が同時に中和されて水層に落ちてしまいました！ 両者を分けるには、炭酸より強い酸だけと反応する弱塩基「NaHCO₃」を先に使う必要があります。";
      } else {
        sep.etherLayer.forEach(id => {
          if (id === "phenol") {
            extractedIons.push("sodium_phenoxide");
          } else if (id === "benzoic_acid") {
            extractedIons.push("sodium_benzoate");
          } else {
            remainingEther.push(id);
          }
        });
        if (extractedIons.includes("sodium_phenoxide")) {
          logMsg = "【振とう完了・静置】フェノールが強塩基NaOHと中和して水溶性の「ナトリウムフェノキシド（C₆H₅ONa）」となり、下層の水層へ抽出されました！ 中性物質はエーテル層に残っています。";
        } else {
          logMsg = "【振とう完了・静置】強塩基NaOH水溶液と振り混ぜて静置しました。";
        }
      }
    }

    sep.etherLayer = remainingEther;
    sep.waterLayer.ions = extractedIons;
    sep.lastLog = logMsg;

    if (callbacks.onUpdate) callbacks.onUpdate();
  }, 900);

  return true;
}

/**
 * コックを開けて下層（水層）を流し出す
 */
export function drainWaterLayer(state, callbacks) {
  const sep = getSeparationState(state);
  if (!sep.waterLayer) {
    sep.lastLog = "⚠️ 分液漏斗内に水層がありません。";
    return false;
  }
  if (!sep.shaken) {
    sep.lastLog = "⚠️ まだ振り混ぜていません。試薬を加えて振とう・静置してからコックを開けましょう。";
    return false;
  }

  sep.isDraining = true;
  sep.cockOpen = true;
  if (callbacks.onUpdate) callbacks.onUpdate();

  setTimeout(() => {
    sep.isDraining = false;
    sep.cockOpen = false;

    sep.drainedFlask = {
      label: `分取した水層（${sep.waterLayer.name}抽出液）`,
      reagent: sep.waterLayer.reagent,
      ions: sep.waterLayer.ions.slice(),
      precipitate: null
    };
    sep.waterLayer = null;
    sep.lastLog = "活栓を開き、下層の水層を受器（三角フラスコ）へ分取しました。受器の塩溶液に試薬を加えて目的物質を遊離・析出させましょう！";

    if (callbacks.onUpdate) callbacks.onUpdate();
  }, 750);

  return true;
}

/**
 * 受器フラスコに試薬を加えて遊離・析出させる
 */
export function addReagentToFlask(state, reagentId, callbacks) {
  const sep = getSeparationState(state);
  if (!sep.drainedFlask) {
    sep.lastLog = "受器に水層が分取されていません。";
    return false;
  }

  const ions = sep.drainedFlask.ions;
  let successSub = null;

  // 1. アニリン塩酸塩にNaOHを加える（強塩基による弱塩基の遊離）
  if (ions.includes("aniline_hydrochloride") && reagentId === "naoh") {
    successSub = {
      id: "aniline",
      n: "アニリン",
      form: "特異臭のある淡黄色油状滴",
      eq: "C₆H₅NH₃⁺Cl⁻ + NaOH → C₆H₅NH₂↓ + NaCl + H₂O"
    };
    sep.lastLog = "🎉【弱塩基の遊離】強塩基NaOHを加えると、弱塩基のアニリンが遊離して特異臭をもつ油状滴が析出・回収されました！";
  }
  // 2. 安息香酸ナトリウムにHClを加える（強酸による弱酸の遊離）
  else if (ions.includes("sodium_benzoate") && reagentId === "hcl") {
    successSub = {
      id: "benzoic_acid",
      n: "安息香酸",
      form: "純白の針状結晶",
      eq: "C₆H₅COONa + HCl → C₆H₅COOH↓ + NaCl"
    };
    sep.lastLog = "🎉【弱酸の遊離】強酸HClを加えると、弱酸の安息香酸が遊離して美しい白色針状結晶が一面に析出・回収されました！";
  }
  // 3. サリチル酸ナトリウムにHClを加える
  else if (ions.includes("sodium_salicylate") && reagentId === "hcl") {
    successSub = {
      id: "salicylic_acid",
      n: "サリチル酸",
      form: "白色結晶（FeCl₃で赤紫色呈色）",
      eq: "C₆H₄(OH)COONa + HCl → C₆H₄(OH)COOH↓ + NaCl"
    };
    sep.lastLog = "🎉【弱酸の遊離】塩酸を加えると、サリチル酸の白色結晶が析出・回収されました！";
  }
  // 4. ナトリウムフェノキシドにCO2を吹き込む（炭酸による弱酸の遊離）
  else if (ions.includes("sodium_phenoxide") && (reagentId === "co2" || reagentId === "hcl")) {
    successSub = {
      id: "phenol",
      n: "フェノール",
      form: "消毒薬臭のある白濁・油状滴",
      eq: reagentId === "co2" ? "C₆H₅ONa + CO₂ + H₂O → C₆H₅OH↓ + NaHCO₃" : "C₆H₅ONa + HCl → C₆H₅OH↓ + NaCl"
    };
    sep.lastLog = reagentId === "co2" ?
      "🎉【弱酸の遊離】炭酸ガスCO₂を吹き込むと、炭酸よりさらに弱い酸であるフェノールが遊離して白濁・単離されました！" :
      "🎉【弱酸の遊離】塩酸を加えることでフェノールが遊離しました！";
  } else {
    sep.lastLog = "変化なし。この水層に含まれる塩を遊離させるには、酸・塩基の強弱関係に合った適切な試薬を選択してください。";
    return false;
  }

  if (successSub) {
    sep.isolated[successSub.id] = true;
    sep.drainedFlask.precipitate = successSub;
    if (callbacks.onSubstanceIsolated) {
      callbacks.onSubstanceIsolated(successSub);
    }
  }

  return true;
}

/**
 * 残ったエーテル層を加熱留去する
 */
export function evaporateEtherLayer(state, callbacks) {
  const sep = getSeparationState(state);
  if (!sep.etherLayer.length) {
    sep.lastLog = "エーテル層に物質が残っていません。";
    return false;
  }
  // 中性物質以外が残っているかチェック
  const hasNonNeutral = sep.etherLayer.some(id => SEP_SUBSTANCES[id]?.type !== "neutral");
  if (hasNonNeutral) {
    sep.lastLog = "⚠️ まだ酸性または塩基性の物質がエーテル層に残っています。酸・塩基の試薬で水層へ抽出してからエーテルを留去してください。";
    return false;
  }

  // 中性物質の単離成功
  const isolatedNames = [];
  sep.etherLayer.forEach(id => {
    sep.isolated[id] = true;
    isolatedNames.push(SEP_SUBSTANCES[id]?.n || id);
  });

  sep.etherLayer = [];
  sep.lastLog = `♨️【エーテル留去】沸点の低いジエチルエーテル（沸点34.5℃）を湯せんで穏やかに蒸発させ、中性物質【${isolatedNames.join("、")}】の単離に成功しました！`;

  if (callbacks.onSubstanceIsolated) {
    callbacks.onSubstanceIsolated({ n: isolatedNames.join("・") });
  }

  return true;
}

/**
 * 酸性度の強弱と遊離の原理の理論モーダルHTML
 */
export function getTheoryModalHtml() {
  return `
    <div style="padding:16px 20px;max-width:620px;display:flex;flex-direction:column;gap:16px;">
      <div style="border-bottom:2px solid var(--line);padding-bottom:10px;">
        <span style="font-size:12px;font-weight:700;color:var(--accent);letter-spacing:.08em">高校化学・有機化合物の性質</span>
        <h2 style="margin:4px 0 0;font-size:20px;font-weight:700;color:var(--ink)">📖 芳香族化合物の酸性度の序列と系統分離の原理</h2>
      </div>

      <div style="background:var(--surface-2);border-radius:10px;padding:12px 14px;">
        <h4 style="margin:0 0 8px;font-size:14px;color:var(--ink);font-weight:700">1. 酸の強さの絶対序列（超重要！）</h4>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13.5px;font-weight:700;padding:8px 0;">
          <span style="color:#b91c1c">スルホン酸 (R−SO₃H)</span>
          <span>＞</span>
          <span style="color:#047857">カルボン酸 (R−COOH)</span>
          <span>＞</span>
          <span style="color:#2563eb">炭酸 (H₂CO₃)</span>
          <span>＞</span>
          <span style="color:#0e7490">フェノール類 (Ar−OH)</span>
          <span>＞</span>
          <span style="color:#6b7280">水・中性物質</span>
        </div>
        <p style="font-size:12.5px;color:var(--ink-2);margin:4px 0 0;line-height:1.6">
          カルボン酸（安息香酸）は炭酸より強い酸ですが、フェノール類は炭酸より弱い酸です。この<b>「炭酸を挟んだ強さの違い」</b>が、系統分離における最大の急所です。
        </p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px;">
          <h5 style="margin:0 0 6px;font-size:13px;font-weight:700;color:#047857">① 弱酸の遊離の法則</h5>
          <p style="font-size:12px;color:var(--ink-2);margin:0;line-height:1.5">
            <b>「弱酸の塩 ＋ 強酸 → 弱酸（遊離）＋ 強酸の塩」</b><br>
            より強い酸が相手から陽イオン（Na⁺等）を奪い、より弱い酸を押し出します。<br>
            例：C₆H₅COONa ＋ HCl → C₆H₅COOH↓ ＋ NaCl
          </p>
        </div>

        <div style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px;">
          <h5 style="margin:0 0 6px;font-size:13px;font-weight:700;color:#7e22ce">② 弱塩基の遊離の法則</h5>
          <p style="font-size:12px;color:var(--ink-2);margin:0;line-height:1.5">
            <b>「弱塩基の塩 ＋ 強塩基 → 弱塩基（遊離）＋ 強塩基の塩」</b><br>
            アニリン塩酸塩に強塩基NaOHを加えると、弱塩基のアニリンが遊離します。<br>
            例：C₆H₅NH₃Cl ＋ NaOH → C₆H₅NH₂↓ ＋ NaCl ＋ H₂O
          </p>
        </div>
      </div>

      <div style="background:var(--flame-soft);border:1px solid var(--flame);border-radius:10px;padding:12px 14px;">
        <h4 style="margin:0 0 4px;font-size:13px;color:var(--flame);font-weight:700">💡 なぜ NaHCO₃ を先に使うのか？</h4>
        <p style="font-size:12px;color:var(--ink);margin:0;line-height:1.6">
          強塩基の NaOH を最初に入れると、カルボン酸もフェノールも両方とも中和されて水層に落ちてしまいます。<br>
          弱アルカリ性の <b>NaHCO₃</b>（炭酸の酸性塩）を使うことで、<b>炭酸より強いカルボン酸だけを中和し、フェノールをエーテル層に残す</b>という鮮やかな選別が可能になります。
        </p>
      </div>

      <div style="display:flex;justify-content:flex-end">
        <button type="button" class="btn primary" id="sep-close-theory" style="padding:8px 18px">閉じる</button>
      </div>
    </div>
  `;
}
