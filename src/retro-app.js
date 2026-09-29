/**
 * 逆合成パズル（合成ルートビルダー）- ロジック＆UIコントローラー
 * 目標化合物（Target）から逆算し、最短手数で合成経路を構築する
 */
import { S, CLS, RULES, CATSHORT } from './craft-data.js';
import { RETRO_PUZZLES } from './retro-data.js';

export function getRetroState(state) {
  if (!state.retro) {
    state.retro = {
      puzzleIdx: 0,
      solved: {}, // { [puzzleId]: { moves: 3, stars: 3, route: [...] } }
      currentSubstance: RETRO_PUZZLES[0].start,
      routeSteps: [],
      currentReagent: RETRO_PUZZLES[0].reagents[0] || null,
      temp: 20,
      light: false,
      cat: "none",
      lastMsg: "出発物質から目標の化合物を目指して、必要な試薬と反応条件を選びましょう。",
      lastStatus: "idle",
      isClear: false
    };
  }
  return state.retro;
}

export function resetPuzzle(state, puzzleIdx) {
  const retro = getRetroState(state);
  retro.puzzleIdx = puzzleIdx;
  const p = RETRO_PUZZLES[puzzleIdx] || RETRO_PUZZLES[0];
  retro.currentSubstance = p.start;
  retro.routeSteps = [];
  retro.currentReagent = p.reagents[0] || null;
  retro.temp = 20;
  retro.light = false;
  retro.cat = "none";
  retro.lastMsg = `ステージ${puzzleIdx + 1}「${p.title}」を開始しました。目標：${p.targetName}（目標手数：${p.par}手）`;
  retro.lastStatus = "idle";
  retro.isClear = false;
}

function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const x = [...a].sort(), y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}

function tRange(r) {
  return r.t || [0, 300];
}

export function executeRetroStep(state) {
  const retro = getRetroState(state);
  const curP = RETRO_PUZZLES[retro.puzzleIdx] || RETRO_PUZZLES[0];
  if (retro.isClear) return;

  const a = retro.currentSubstance;
  const b = (retro.currentReagent === "none" || !retro.currentReagent) ? null : retro.currentReagent;
  let ids = [a, b].filter(Boolean);
  if (ids.length === 2 && ids[0] === ids[1]) ids = [ids[0]];

  const cands = RULES.filter(r => sameSet(r.in, ids));
  const ok = r => {
    if (r.light && !retro.light) return false;
    if (r.cat && !r.cat.includes(retro.cat)) return false;
    const [lo, hi] = tRange(r);
    return retro.temp >= lo && retro.temp <= hi;
  };

  const hit = cands.find(ok);
  if (hit) {
    const nextSub = hit.out[0];
    const prevSub = retro.currentSubstance;
    retro.currentSubstance = nextSub;
    retro.routeSteps.push({
      from: prevSub,
      reactant: b,
      temp: retro.temp,
      light: retro.light,
      cat: retro.cat,
      out: nextSub,
      eq: hit.eq,
      text: hit.text,
      ruleId: hit.id
    });

    if (nextSub === curP.target) {
      retro.isClear = true;
      retro.lastStatus = "clear";
      const totalMoves = retro.routeSteps.length;
      let stars = 1;
      if (totalMoves <= curP.par) stars = 3;
      else if (totalMoves === curP.par + 1) stars = 2;

      retro.solved[curP.id] = {
        moves: totalMoves,
        stars,
        route: retro.routeSteps.map(s => s.eq)
      };
      retro.lastMsg = `🎉 <b>目標達成！</b> 「${curP.targetName}」の合成に成功しました！（手数: ${totalMoves}手 / 目標: ${curP.par}手）`;
    } else {
      retro.lastStatus = "ok";
      retro.lastMsg = `✅ 反応成功！「${S[nextSub]?.n || nextSub}」が生成しました。<br><small>${hit.text}</small>`;
    }
    return;
  }

  // Failure analysis
  if (cands.length) {
    const dist = r => {
      const [lo, hi] = tRange(r);
      return retro.temp < lo ? lo - retro.temp : retro.temp > hi ? retro.temp - hi : 0;
    };
    const r = cands.slice().sort((p, q) => dist(p) - dist(q))[0];
    retro.lastStatus = "fail";
    if (r.cat && !r.cat.includes(retro.cat)) {
      retro.lastMsg = `⚠️ 触媒が適合しません。この反応には触媒（${r.cat.map(c => CATSHORT[c] || c).join(" / ")}）が必要です。`;
      return;
    }
    if (r.light && !retro.light) {
      retro.lastMsg = `⚠️ 光（紫外線）が必要です。光ボタンをONにしてください。`;
      return;
    }
    const [lo, hi] = tRange(r);
    if (retro.temp < lo) {
      retro.lastMsg = `⚠️ 温度が低すぎます（現在: ${retro.temp}℃、必要: ${lo}〜${hi}℃）。`;
      return;
    }
    retro.lastMsg = `⚠️ 温度が高すぎます（現在: ${retro.temp}℃、必要: ${lo}〜${hi}℃）。副反応や分解が起きました。`;
    return;
  }

  retro.lastStatus = "none";
  retro.lastMsg = `何も起きませんでした。組み合わせまたは反応条件を見直してください。`;
}

export function undoRetroStep(state) {
  const retro = getRetroState(state);
  if (!retro.routeSteps.length) return;
  retro.routeSteps.pop();
  const curP = RETRO_PUZZLES[retro.puzzleIdx] || RETRO_PUZZLES[0];
  if (retro.routeSteps.length > 0) {
    retro.currentSubstance = retro.routeSteps[retro.routeSteps.length - 1].out;
  } else {
    retro.currentSubstance = curP.start;
  }
  retro.isClear = false;
  retro.lastStatus = "idle";
  retro.lastMsg = "1手前の状態に戻しました。";
}

export function renderRetroPuzzle(container, state, callbacks) {
  const retro = getRetroState(state);
  const curP = RETRO_PUZZLES[retro.puzzleIdx] || RETRO_PUZZLES[0];

  // Stage Selector Bar
  let stageTabs = "";
  RETRO_PUZZLES.forEach((p, idx) => {
    const isAct = retro.puzzleIdx === idx;
    const sol = retro.solved[p.id];
    const starStr = sol ? "★".repeat(sol.stars) : "";
    stageTabs += `
      <button type="button" class="sep-stage-tab${isAct ? " active" : ""}${sol ? " clear" : ""}" data-retro-stage="${idx}">
        Q${idx + 1} ${p.targetName}
        <small style="color:${sol ? "#b45309" : "inherit"}">${sol ? starStr : p.difficulty.split(" ")[0]}</small>
      </button>
    `;
  });

  const curSubObj = S[retro.currentSubstance] || { n: retro.currentSubstance, f: "" };
  const targetSubObj = S[curP.target] || { n: curP.targetName, f: curP.targetFormula };
  const movesUsed = retro.routeSteps.length;

  // Timeline HTML
  let timelineHtml = `
    <div class="retro-timeline-step start">
      <span class="step-num">出発</span>
      <b class="step-name">${curP.startName}</b>
    </div>
  `;
  retro.routeSteps.forEach((st, i) => {
    const rName = st.reactant ? (S[st.reactant]?.f || S[st.reactant]?.n || st.reactant) : "単独（重合/加熱）";
    timelineHtml += `
      <div class="retro-timeline-arrow">
        <span class="arrow-sym">→</span>
        <span class="arrow-cond">${st.reactant ? "+" + rName : rName} (${st.temp}℃${st.cat !== "none" ? " / " + (CATSHORT[st.cat] || st.cat) : ""}${st.light ? " / 光" : ""})</span>
      </div>
      <div class="retro-timeline-step${st.out === curP.target ? " goal" : ""}">
        <span class="step-num">Step ${i + 1}</span>
        <b class="step-name">${S[st.out]?.n || st.out}</b>
        <small style="font-family:var(--f-mono)">${S[st.out]?.f || ""}</small>
      </div>
    `;
  });

  // Reagent choices
  let reagentOptions = "";
  const isNoneSel = !retro.currentReagent || retro.currentReagent === "none";
  reagentOptions += `
    <button type="button" class="retro-reagent-btn${isNoneSel ? " selected" : ""}" data-retro-reagent="none">
      <b>単独（試薬なし）</b>
      <small>自己付加重合・単独反応</small>
    </button>
  `;

  // Merge puzzle default reagents with any intermediates synthesized in routeSteps
  const availableSet = new Set(curP.reagents);
  retro.routeSteps.forEach(st => {
    if (st.out && S[st.out] && st.out !== retro.currentSubstance) availableSet.add(st.out);
  });

  availableSet.forEach(rId => {
    const s = S[rId];
    if (!s) return;
    const isSel = retro.currentReagent === rId;
    reagentOptions += `
      <button type="button" class="retro-reagent-btn${isSel ? " selected" : ""}" data-retro-reagent="${rId}">
        <b>${s.f || s.n}</b>
        <small>${s.n}</small>
      </button>
    `;
  });

  // Catalyst choices
  let catOptions = "";
  curP.catAvailable.forEach(c => {
    const label = CATSHORT[c] || c;
    catOptions += `<option value="${c}"${retro.cat === c ? " selected" : ""}>${label}</option>`;
  });

  // Star status
  const currentSol = retro.solved[curP.id];
  let starSummary = "";
  if (currentSol) {
    starSummary = `<span style="color:#b45309;font-weight:700;margin-left:8px">クリア記録: ${"★".repeat(currentSol.stars)} (${currentSol.moves}手)</span>`;
  }

  let html = `
    <div class="sep-topbar">
      <div class="sep-stage-nav">
        ${stageTabs}
      </div>
      <div class="sep-topbar-actions">
        <button type="button" class="btn ghost" id="retro-toggle-clue" style="font-size:12.5px;padding:4px 10px">
          💡 逆合成のヒント
        </button>
        <button type="button" class="btn ghost" data-back-craft style="font-size:12.5px;padding:4px 10px">
          ← 工房へ戻る
        </button>
      </div>
    </div>

    <div class="retro-mission-banner">
      <div class="retro-mission-info">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="sep-stage-badge">パズル ${curP.num} / ${RETRO_PUZZLES.length}</span>
          <span style="font-size:12px;color:var(--ink-2)">${curP.difficulty}</span>
          ${starSummary}
        </div>
        <h2 style="font-size:19px;margin:4px 0 2px;color:var(--ink)">${curP.title}</h2>
        <div style="font-size:13.5px;color:var(--ink-2);line-height:1.5">${curP.desc}</div>
      </div>
      <div class="retro-target-card">
        <div class="retro-target-badge">目標生成物（Target）</div>
        <div class="retro-target-name">${targetSubObj.n}</div>
        <div class="retro-target-formula">${targetSubObj.f}</div>
        <div class="retro-target-par">目標手数: <b>${curP.par}手</b>（現在: <b>${movesUsed}手</b>）</div>
      </div>
    </div>

    <div id="retro-clue-box" class="retro-clue-box" style="display:none">
      <div style="font-weight:700;margin-bottom:4px;color:var(--flame)">💡 E. J. コーリーの逆合成思考ヒント</div>
      <div style="font-size:13px;line-height:1.6;color:var(--ink)">${curP.clue}</div>
      <div style="font-size:12px;color:var(--ink-3);margin-top:4px">ポイント：${curP.notes}</div>
    </div>

    <div class="retro-workspace">
      <!-- ルート進行タイムライン -->
      <div class="retro-timeline-wrapper">
        <div class="retro-section-label">📍 現在の合成ルート推移（${movesUsed}手）</div>
        <div class="retro-timeline-scroll">
          ${timelineHtml}
        </div>
      </div>

      <!-- 反応ベンチ（次のステップ） -->
      <div class="retro-bench-card">
        <div class="retro-bench-header">
          <span class="retro-section-label" style="margin:0">⚗️ Step ${movesUsed + 1} の反応を実行</span>
          <div style="display:flex;gap:6px">
            <button type="button" class="btn ghost" id="retro-undo-btn"${movesUsed === 0 ? " disabled" : ""} style="padding:3px 10px;font-size:12px">↩ 1手戻る</button>
            <button type="button" class="btn ghost" id="retro-reset-btn" style="padding:3px 10px;font-size:12px">🔄 リセット</button>
          </div>
        </div>

        <div class="retro-bench-grid">
          <!-- フラスコA（現在の物質） -->
          <div class="retro-flask-box">
            <span class="flask-label">フラスコ A（前駆体）</span>
            <div class="flask-name">${curSubObj.n}</div>
            <div class="flask-formula">${curSubObj.f}</div>
          </div>

          <div style="display:flex;align-items:center;font-size:22px;color:var(--ink-3);font-weight:700">＋</div>

          <!-- フラスコB（試薬選択） -->
          <div class="retro-flask-box reagent-box">
            <span class="flask-label">フラスコ B（加える試薬を選択）</span>
            <div class="retro-reagents-scroll">
              ${reagentOptions}
            </div>
          </div>
        </div>

        <!-- 条件設定バー -->
        <div class="retro-cond-bar">
          <div class="retro-cond-item">
            <label style="font-size:11.5px;font-weight:700;color:var(--ink-2)">温度設定</label>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span id="retro-temp-val" style="font-family:var(--f-mono);font-size:15px;font-weight:700;color:var(--flame);min-width:44px">${retro.temp}℃</span>
              <div class="retro-temp-presets">
                <button type="button" class="btn-preset${retro.temp === 0 ? " active" : ""}" data-retro-temp="0">0℃ (氷冷)</button>
                <button type="button" class="btn-preset${retro.temp === 20 ? " active" : ""}" data-retro-temp="20">20℃ (室温)</button>
                <button type="button" class="btn-preset${retro.temp === 60 ? " active" : ""}" data-retro-temp="60">60℃ (温水)</button>
                <button type="button" class="btn-preset${retro.temp === 140 ? " active" : ""}" data-retro-temp="140">140℃ (加熱)</button>
                <button type="button" class="btn-preset${retro.temp === 170 ? " active" : ""}" data-retro-temp="170">170℃ (強熱)</button>
                <button type="button" class="btn-preset${retro.temp === 300 ? " active" : ""}" data-retro-temp="300">300℃ (高圧/工業)</button>
                <button type="button" class="btn-preset${retro.temp === 500 ? " active" : ""}" data-retro-temp="500">500℃ (熱分解)</button>
              </div>
              <div style="display:inline-flex;align-items:center;gap:3px;margin-left:4px">
                <button type="button" class="btn-preset" id="retro-temp-down">−10℃</button>
                <input type="range" id="retro-temp-slider" min="0" max="600" step="10" value="${retro.temp}" style="width:85px;vertical-align:middle;cursor:pointer">
                <button type="button" class="btn-preset" id="retro-temp-up">＋10℃</button>
              </div>
            </div>
          </div>

          <div class="retro-cond-item">
            <label style="font-size:11.5px;font-weight:700;color:var(--ink-2)">触媒</label>
            <select id="retro-cat-select" style="font-size:12.5px;padding:3px 6px;border:1px solid var(--line);border-radius:6px;background:var(--surface)">
              ${catOptions}
            </select>
          </div>

          <div class="retro-cond-item">
            <label style="font-size:11.5px;font-weight:700;color:var(--ink-2)">光照射</label>
            <button type="button" class="btn${retro.light ? " hot" : " ghost"}" id="retro-light-toggle" style="padding:3px 10px;font-size:12px">
              ${retro.light ? "☀️ 光 ON" : "🌑 暗所 OFF"}
            </button>
          </div>

          <div style="margin-left:auto">
            <button type="button" class="btn primary" id="retro-step-btn"${retro.isClear ? " disabled" : ""} style="padding:7px 18px;font-size:13.5px;font-weight:700">
              ⚡ 反応させる！
            </button>
          </div>
        </div>

        <!-- 結果・フィードバックメッセージ -->
        <div class="retro-status-box status-${retro.lastStatus}">
          ${retro.lastMsg}
        </div>
      </div>
    </div>
  `;

  // Victory Overlay when cleared
  if (retro.isClear) {
    const sol = retro.solved[curP.id];
    const stars = sol ? sol.stars : 1;
    const isNext = retro.puzzleIdx + 1 < RETRO_PUZZLES.length;
    html += `
      <div class="retro-victory-overlay">
        <div class="retro-victory-card">
          <div style="font-size:32px;margin-bottom:4px">${stars === 3 ? "🏆 ★★★ 完璧！" : stars === 2 ? "🎉 ★★☆ 合格！" : "✨ ★☆☆ クリア！"}</div>
          <h2 style="margin:0 0 8px;font-size:22px">パズル達成：${curP.targetName}</h2>
          <p style="color:var(--ink-2);font-size:13.5px;margin:0 0 16px">
            目標手数: <b>${curP.par}手</b> ／ あなたの手数: <b>${movesUsed}手</b>
          </p>

          <div class="retro-victory-route">
            <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:8px">📝 完成した合成ルート・化学反応式</div>
            <ol style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.7;color:var(--ink)">
              ${retro.routeSteps.map(s => `<li><b>${s.eq}</b><br><span style="color:var(--ink-2)">${s.text}</span></li>`).join("")}
            </ol>
          </div>

          <div style="display:flex;justify-content:center;gap:10px;margin-top:20px">
            ${isNext ? `<button type="button" class="btn hot" id="retro-next-stage-btn" style="padding:8px 20px;font-size:14px">次のパズルへ進む →</button>` : `<button type="button" class="btn hot" data-back-craft style="padding:8px 20px;font-size:14px">全パズル制覇！工房へ戻る 🏆</button>`}
            <button type="button" class="btn ghost" id="retro-retry-btn" style="padding:8px 16px;font-size:13px">もう一度挑戦する</button>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  // Bind Events
  container.querySelectorAll("[data-retro-stage]").forEach(btn => {
    btn.onclick = () => {
      const idx = +btn.dataset.retroStage;
      resetPuzzle(state, idx);
      renderRetroPuzzle(container, state, callbacks);
    };
  });

  container.querySelectorAll("[data-retro-reagent]").forEach(btn => {
    btn.onclick = () => {
      retro.currentReagent = btn.dataset.retroReagent;
      renderRetroPuzzle(container, state, callbacks);
    };
  });

  container.querySelectorAll("[data-retro-temp]").forEach(btn => {
    btn.onclick = () => {
      retro.temp = +btn.dataset.retroTemp;
      renderRetroPuzzle(container, state, callbacks);
    };
  });

  const tempSlider = container.querySelector("#retro-temp-slider");
  if (tempSlider) {
    tempSlider.oninput = e => {
      retro.temp = +e.target.value;
      const valSpan = container.querySelector("#retro-temp-val");
      if (valSpan) valSpan.textContent = `${retro.temp}℃`;
    };
    tempSlider.onchange = () => {
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const tempDown = container.querySelector("#retro-temp-down");
  if (tempDown) {
    tempDown.onclick = () => {
      retro.temp = Math.max(0, retro.temp - 10);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const tempUp = container.querySelector("#retro-temp-up");
  if (tempUp) {
    tempUp.onclick = () => {
      retro.temp = Math.min(600, retro.temp + 10);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const catSelect = container.querySelector("#retro-cat-select");
  if (catSelect) {
    catSelect.onchange = e => {
      retro.cat = e.target.value;
    };
  }

  const lightToggle = container.querySelector("#retro-light-toggle");
  if (lightToggle) {
    lightToggle.onclick = () => {
      retro.light = !retro.light;
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const stepBtn = container.querySelector("#retro-step-btn");
  if (stepBtn) {
    stepBtn.onclick = () => {
      executeRetroStep(state);
      if (callbacks.onStepExecute) callbacks.onStepExecute(retro);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const undoBtn = container.querySelector("#retro-undo-btn");
  if (undoBtn) {
    undoBtn.onclick = () => {
      undoRetroStep(state);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const resetBtn = container.querySelector("#retro-reset-btn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      resetPuzzle(state, retro.puzzleIdx);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const retryBtn = container.querySelector("#retro-retry-btn");
  if (retryBtn) {
    retryBtn.onclick = () => {
      resetPuzzle(state, retro.puzzleIdx);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const nextBtn = container.querySelector("#retro-next-stage-btn");
  if (nextBtn) {
    nextBtn.onclick = () => {
      resetPuzzle(state, retro.puzzleIdx + 1);
      renderRetroPuzzle(container, state, callbacks);
    };
  }

  const toggleClueBtn = container.querySelector("#retro-toggle-clue");
  const clueBox = container.querySelector("#retro-clue-box");
  if (toggleClueBtn && clueBox) {
    toggleClueBtn.onclick = () => {
      const isHidden = clueBox.style.display === "none";
      clueBox.style.display = isHidden ? "block" : "none";
      toggleClueBtn.textContent = isHidden ? "✕ ヒントを閉じる" : "💡 逆合成のヒント";
    };
  }
}
