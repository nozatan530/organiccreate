/**
 * 有機クラフト工房 - ゲームエンジン＆UIコントローラー
 * 学習指導要領準拠・やさしいモード（Easy Mode）対応
 */
import {
  CLS, SHORT, S, DEX1, DEX2, DEXX, SOURCES, CATS, CATSHORT, TYPES, TYPE_INFO,
  RULES, RULE, QUESTS, QUESTS1, QUESTS2, ACH, RANKS, K, OY,
  POS1, POS2, RAWSRC1, RAWSRC2, MAPNAME1, MAPNAME2, REGIONS1, REGIONS2, CHAPTERS
} from './craft-data.js';
import {
  DETECTIVE_CASES, DETECTIVE_RANKS, REAGENTS_TEST_INFO
} from './detective-data.js';

const KEY = "organic-craft-ch1-v4";

function fresh() {
  return {
    found: { methane: true },
    rx: {},
    stars: 3,
    xp: 0,
    q: 0, // 後方互換
    q1: 0,
    q2: 0,
    chapter: 1, // 1: 炭化水素の森, 2: 官能基の工房, 'detective': 探偵モード
    prevChapter: 1,
    detective: {
      caseIdx: 0,
      solved: {},
      testsRun: {},
      eliminated: {},
      selectedCandidate: null,
      activeTest: null
    },
    hints: {},
    clue: {},
    src: { gas: true, salt: true, nature: true, shelf: true },
    cat: {},
    log: [],
    intro: true, // 初回チュートリアル表示フラグ
    tutStep: 1, // チュートリアル現在ステップ (1〜4)
    n: 0,
    fails: 0,
    predN: 0,
    flags: {},
    ach: {},
    mute: false,
    easy: true, // 学習サポート（やさしいモード）初期ON
    showEn: true, // 英語名表示
    mapMode: "both" // マップ表示モード: "both" (名称+化学式), "formula" (化学式のみ), "name" (名称のみ)
  };
}

let state = fresh();
const freshUI = () => ({
  a: "methane", b: "cl2", temp: 20, light: false, cat: "none",
  pred: "", result: null, sel: null, side: "look", tab: "dex", picking: null
});
let ui = freshUI();

const curChapter = () => state.chapter || 1;
const curQuests = () => curChapter() === 2 ? QUESTS2 : QUESTS1;
const curQIdx = () => curChapter() === 2 ? (state.q2 || 0) : (state.q1 ?? state.q ?? 0);
const setCurQIdx = (val) => {
  if (curChapter() === 2) state.q2 = val;
  else { state.q1 = val; state.q = val; }
};
const curPos = () => curChapter() === 2 ? POS2 : POS1;
const curRawSrc = () => curChapter() === 2 ? RAWSRC2 : RAWSRC1;
const curMapName = () => curChapter() === 2 ? MAPNAME2 : MAPNAME1;
const curRegions = () => curChapter() === 2 ? REGIONS2 : REGIONS1;

function getDetState() {
  if (!state.detective) {
    state.detective = {
      caseIdx: 0,
      solved: {},
      testsRun: {},
      eliminated: {},
      selectedCandidate: null,
      activeTest: null
    };
  }
  return state.detective;
}

function getDetRank(solved) {
  let rank = DETECTIVE_RANKS[0];
  DETECTIVE_RANKS.forEach(r => {
    if (solved >= r[0]) rank = r;
  });
  return rank;
}

function switchChapter(ch) {
  if (state.chapter !== "detective" && (ch === 1 || ch === 2)) {
    state.prevChapter = ch;
  }
  state.chapter = ch;
  if (ch === "detective") {
    getDetState();
    toast("🕵️ <b>探偵モード「構造決定事件簿」を開始しました</b><br>試薬で未知化合物の官能基を暴き、真の構造を特定しましょう！");
  } else if (ch === 2) {
    state.src.distill = true;
    state.src.oxidant = true;
    state.src.store = true;
    if (state.q2 && state.q2 >= 1) {
      state.src.reagents2 = true;
    }
    state.found.methanol = true;
    state.found.ethanol = true;
    state.found.isopropanol = true;
    if (ui.a === "methane" || !ui.a) ui.a = "ethanol";
    if (ui.b === "cl2" || !ui.b) ui.b = "kmno4";
    ui.temp = 60;
    ui.light = false;
    ui.cat = "none";
    ui.pred = "";
    toast("🧪 <b>第2章「官能基の工房」に切り替えました</b><br>アルコールやエステル、官能基の検出反応を体験しましょう！");
  } else {
    if (ui.a === "ethanol" || !ui.a) ui.a = "methane";
    if (ui.b === "kmno4" || !ui.b) ui.b = "cl2";
    ui.temp = 20;
    ui.light = false;
    ui.cat = "none";
    ui.pred = "";
    toast("🌲 <b>第1章「炭化水素の森」に切り替えました</b>");
  }
  ui.sel = null;
  save();
  renderAll();
  SFX.click();
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.found) {
        state = Object.assign(fresh(), s);
        if (!state.detective) {
          state.detective = {
            caseIdx: 0,
            solved: {},
            testsRun: {},
            eliminated: {},
            selectedCandidate: null,
            activeTest: null
          };
        }
        if (state.chapter === 2) {
          state.src.distill = true;
          state.src.oxidant = true;
          state.src.store = true;
          if (state.q2 && state.q2 >= 1) state.src.reagents2 = true;
          state.found.methanol = true;
          state.found.ethanol = true;
          state.found.isopropanol = true;
        }
      }
    }
  } catch (e) {}
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {}
}

const $ = id => document.getElementById(id);
const cc = id => "var(" + CLS[S[id].cls].c + ")";

function available() {
  const set = new Set();
  SOURCES.forEach(s => { if (state.src[s.id]) s.items.forEach(i => set.add(i)); });
  Object.keys(state.found).forEach(i => set.add(i));
  return set;
}

const ruleAvail = (r, av) => r.in.every(i => av.has(i));
function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const x = [...a].sort(), y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}
const tRange = r => r.t || [0, 300];
function rankIdx(xp) {
  let i = 0;
  RANKS.forEach((r, k) => { if (xp >= r[0]) i = k; });
  return i;
}

const mapRules = () => {
  const pos = curPos();
  return RULES.filter(r => !r.comb && (r.in.some(i => pos[i]) || r.out.some(o => pos[o])));
};
const P = id => {
  const p = curPos()[id] || [400, 300];
  return [p[0] * K, p[1] * K + OY];
};

const DEPTH = (function() {
  const d = {};
  SOURCES.forEach(s => s.items.forEach(i => d[i] = 0));
  let ch = true;
  while (ch) {
    ch = false;
    RULES.forEach(r => {
      if (r.in.every(i => d[i] !== undefined)) {
        const v = Math.max(...r.in.map(i => d[i])) + 1;
        r.out.forEach(o => {
          if (d[o] === undefined || d[o] > v) { d[o] = v; ch = true; }
        });
      }
    });
  }
  return d;
})();

const rarity = id => Math.max(1, Math.min(5, DEPTH[id] || 1));
const starsStr = n => "★".repeat(n) + "☆".repeat(5 - n);

function shortName(id) {
  const mn = curMapName();
  if (mn && mn[id]) return mn[id];
  return S[id] ? S[id].n.replace(/（.*）/, "") : id;
}

function condText(r) {
  const p = [];
  if (r.light) p.push("光（紫外線）を当てる");
  if (r.cat) p.push("触媒：" + r.cat.map(c => CATSHORT[c] || c).join(" または "));
  if (r.t) p.push(`温度 ${r.t[0]}〜${r.t[1]}℃`);
  return p.length ? p.join("／") : "特別な条件はいらない（室温でOK）";
}

function partnerText(r) {
  const pos = curPos();
  const others = r.in.filter(i => !pos[i]);
  return others.length ? others.map(i => `${S[i].n.replace(/（.*）/, "")} ${S[i].f}`).join("＋") : "なし（フラスコBは空のまま）";
}

function edgeChip(r) {
  const pos = curPos();
  const p = r.in.filter(i => !pos[i]).map(i => "+" + S[i].f);
  if (r.light) p.push("光");
  if (r.cat) p.push(r.cat.map(c => CATSHORT[c]).join("/"));
  if (r.t) p.push(r.t[0] + "℃〜");
  return p.join(" ") || "室温";
}

/* ---------- sound ---------- */
let actx = null;
function tone(freqs, opt) {
  if (state.mute) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = Object.assign({ type: "triangle", dur: 0.13, gap: 0.09, vol: 0.08 }, opt || {});
    freqs.forEach((f, i) => {
      const t0 = actx.currentTime + i * o.gap;
      const osc = actx.createOscillator(), g = actx.createGain();
      osc.type = o.type; osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(o.vol, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
      osc.connect(g).connect(actx.destination);
      osc.start(t0); osc.stop(t0 + o.dur + 0.02);
    });
  } catch (e) {}
}

const SFX = {
  ok: () => tone([523, 659, 784]),
  nw: () => tone([523, 659, 784, 1047], { dur: 0.2 }),
  fail: () => tone([196, 147], { type: "square", vol: 0.04, gap: 0.12 }),
  none: () => tone([330, 311], { type: "sine", vol: 0.05, gap: 0.12 }),
  star: () => tone([1175, 1568], { type: "sine", gap: 0.07 }),
  lvl: () => tone([523, 659, 784, 1047, 1319], { dur: 0.28, gap: 0.11, vol: 0.09 }),
  click: () => tone([880], { type: "sine", dur: 0.05, vol: 0.03 })
};

function toast(html) {
  const el = document.createElement("div");
  el.className = "toast"; el.innerHTML = html;
  $("toasts").appendChild(el);
  setTimeout(() => el.classList.add("out"), 3400);
  setTimeout(() => el.remove(), 3900);
}

/* ================= reaction engine ================= */
function resolve() {
  let ids = [ui.a, ui.b].filter(Boolean);
  if (ids.length === 2 && ids[0] === ids[1]) ids = [ids[0]];
  const cands = RULES.filter(r => sameSet(r.in, ids));
  const ok = r => {
    if (r.light && !ui.light) return false;
    if (r.cat && !r.cat.includes(ui.cat)) return false;
    const [lo, hi] = tRange(r);
    return ui.temp >= lo && ui.temp <= hi;
  };
  const hit = cands.find(ok);
  if (hit) return { kind: "ok", rule: hit };

  if (cands.length) {
    const dist = r => {
      const [lo, hi] = tRange(r);
      return ui.temp < lo ? lo - ui.temp : ui.temp > hi ? ui.temp - hi : 0;
    };
    const r = cands.slice().sort((p, q) => dist(p) - dist(q))[0];
    if (r.cat && !r.cat.includes(ui.cat)) {
      if (r.cat.includes("poly") && !state.cat.poly) {
        return { kind: "fail", rule: r, msg: "この反応には重合触媒が必要だが、まだ手に入っていない（依頼4で解放）。" };
      }
      return { kind: "fail", rule: r, msg: (ui.cat === "none" ? "何も起きない。" : "この触媒では反応が進まない。") + (r.catMsg || "") };
    }
    if (r.light && !ui.light) {
      return { kind: "fail", rule: r, msg: "暗いままでは何も起きない。アルカンと塩素の置換反応には、光（紫外線）が必要だ。" };
    }
    const [lo] = tRange(r);
    if (ui.temp < lo) return { kind: "fail", rule: r, msg: r.lowMsg || "温度が低すぎて、反応が進まない。" };
    return { kind: "fail", rule: r, msg: r.highMsg || "温度が高すぎた。分解や副反応が起きて、目的の物質は得られなかった。", hot: true };
  }

  const set = new Set(ids);
  const other = ids.find(i => !["br2", "h2", "cl2", "o2", "na", "tollens", "i2", "kmno4"].includes(i));
  const oc = other && S[other].cls;
  if (set.has("br2") && oc === "alkane") {
    state.flags.brNo = true;
    return { kind: "none", msg: "臭素水の赤褐色は消えなかった。アルカンは単結合だけ（飽和）なので、付加反応をしない。これが不飽和結合の見分け方になる。" };
  }
  if (set.has("h2") && oc === "alkane") return { kind: "none", msg: "アルカンは飽和しているため、水素が付加する場所がない。" };
  if (set.has("cl2") && other === "propane" && ids.length === 2) return { kind: "none", msg: "光を当てても、1-クロロプロパンと2-クロロプロパンなどが混ざってしまい、目的の物質を取り出せなかった。" };
  if (set.has("na") && (other === "ether" || other === "ethyl_acetate" || oc === "alkane")) {
    return { kind: "none", msg: "気体は発生しなかった。金属ナトリウムはヒドロキシ基（−OH）をもつアルコールと特異的に反応して水素H₂を発生するが、エーテルやエステルは反応しない。" };
  }
  if (set.has("tollens") && (other === "acetone" || oc === "alcohol" || oc === "acid")) {
    return { kind: "none", msg: "銀鏡は析出しなかった。アンモニア性硝酸銀を還元して銀鏡を析出できるのは、強い還元性をもつホルミル基（−CHO）をもつアルデヒド（およびギ酸）だけである。" };
  }
  if (set.has("i2") && (other === "methanol" || other === "formaldehyde" || other === "formic_acid")) {
    return { kind: "none", msg: "ヨードホルムの黄色沈殿は生じなかった。ヨードホルム反応は CH₃CO− または CH₃CH(OH)− の特異的構造をもつ分子（アセトンやエタノールなど）でのみ起こる。" };
  }
  if (set.has("kmno4") && (other === "acetone" || other === "acetic_acid")) {
    return { kind: "none", msg: "ケトンやカルボン酸はこれ以上穏やかな酸化剤では酸化されない。" };
  }
  if (oc === "polymer") return { kind: "none", msg: "高分子は安定で、この条件では反応しにくい。" };
  if (set.has("o2") && oc && ["halide", "alcohol"].includes(oc)) return { kind: "none", msg: "この工房では、炭化水素の完全燃焼だけを扱っている。" };
  if (ids.length === 1 && S[ids[0]].cls === "reagent") return { kind: "none", msg: "試薬だけでは何も起きない。反応させる相手の有機化合物を入れよう。" };
  return { kind: "none", msg: "何も起きなかった。組み合わせか条件を変えてみよう。マップの「？？？」に手がかりがある。" };
}

function react() {
  $("err").textContent = "";
  if (!ui.a && !ui.b) {
    $("err").textContent = "フラスコ A に物質を入れてください。";
    return;
  }
  const res = resolve();
  const pred = ui.pred;
  const rank0 = rankIdx(state.xp);
  let newSubs = [], newRx = false, predOk = null, star = 0, xp = 0;

  if (res.kind === "ok") {
    const r = res.rule;
    newRx = !state.rx[r.id];
    state.rx[r.id] = true;
    r.out.concat(r.give || []).forEach(id => {
      if (!state.found[id]) {
        state.found[id] = true;
        if (r.out.includes(id)) { newSubs.push(id); xp += 10 + rarity(id) * 10; }
      }
    });
    if (newRx) xp += 10;
    if (pred) {
      predOk = r.types.includes(pred);
      if (predOk && newRx) { star++; xp += 5; state.predN++; }
    }
    if (state.intro && r.id === "cl1") {
      state.intro = false;
      state.tutStep = 1;
      star++;
      xp += 20;
      setTimeout(() => {
        toast("🎉 チュートリアル達成！ メタンの光置換反応に成功しました！ <b>+20 XP ★+1</b>");
      }, 1200);
    }
  } else {
    state.fails++;
    if (pred) predOk = (pred === "反応しない");
  }

  state.stars += star;
  state.xp += xp;
  state.n++;

  const eqText = res.kind === "ok" ? res.rule.eq : [ui.a, ui.b].filter(Boolean).map(i => S[i].f).join(" + ") + " → ×";
  state.log.unshift({ n: state.n, eq: eqText, ok: res.kind === "ok" });
  state.log = state.log.slice(0, 30);

  const lvlUp = rankIdx(state.xp) > rank0 ? RANKS[rankIdx(state.xp)][1] : null;
  ui.result = { res, newSubs, newRx, predOk, star, pred, xp };
  if (newSubs.length) { ui.sel = newSubs[0]; }
  checkAch();
  save();
  animate(res);
  renderAll();

  if (res.kind === "ok") {
    (newSubs.length ? SFX.nw : SFX.ok)();
    if (star) setTimeout(SFX.star, 450);
  } else {
    (res.kind === "fail" ? SFX.fail : SFX.none)();
  }

  if (newSubs.length) showDiscovery(newSubs, { xp, star, lvlUp });
  else if (lvlUp) { SFX.lvl(); toast(`ランクアップ！ <b>${lvlUp}</b> になった`); }
}

function checkAch() {
  ACH.forEach(a => {
    if (!state.ach[a.id] && a.test(state)) {
      state.ach[a.id] = true;
      state.stars += 1;
      setTimeout(() => { toast(`称号「<b>${a.n}</b>」を手に入れた　★+1`); SFX.star(); }, 900);
    }
  });
}

/* ---------- discovery card ---------- */
let discQueue = [], discInfo = null;
function showDiscovery(list, info) {
  discQueue = list.slice();
  discInfo = info;
  nextDiscovery();
}

function nextDiscovery() {
  const dlg = $("disc");
  if (!discQueue.length) { if (dlg.open) dlg.close(); return; }
  const id = discQueue.shift();
  const s = S[id];
  const rr = rarity(id);
  const last = !discQueue.length;
  let h = `<div class="new">NEW!</div><span class="rar">${starsStr(rr)}</span>`;
  h += `<div class="mol">${s.smi ? `<svg id="disc-svg"></svg>` : `<div class="poly">${s.f}</div>`}</div>`;
  h += `<h3>${s.n}</h3>`;
  if (state.showEn && s.en) {
    h += `<div style="font-size:12.5px;color:var(--ink-2);font-family:var(--f-mono);margin-top:-2px;margin-bottom:4px">${s.en}</div>`;
  }
  h += `<div class="fm" style="--cc:${cc(id)}">${s.f}</div><span class="cl" style="--cc:${cc(id)}">${CLS[s.cls].label}</span>`;
  h += `<p>${s.note}</p>`;
  if (last && discInfo) {
    h += `<div class="gain"><span>+${discInfo.xp} XP</span>${discInfo.star ? `<span>ひらめき ★+${discInfo.star}</span>` : ""}</div>`;
    if (discInfo.lvlUp) h += `<div class="lvl">ランクアップ！「${discInfo.lvlUp}」になった</div>`;
  }
  h += `<button type="button" class="btn primary" id="disc-ok">${last ? "図鑑に登録する" : "次のカード"}</button>`;
  $("disc-body").innerHTML = h;

  if (s.smi) {
    const svg = $("disc-svg");
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface-2").trim();
    if (!drawMol(svg, s.smi, bg)) svg.outerHTML = `<div class="poly">${s.f}</div>`;
  }
  $("disc-ok").onclick = () => {
    if (last && discInfo && discInfo.lvlUp) SFX.lvl();
    else SFX.click();
    nextDiscovery();
  };
  if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
}

/* ---------- flask animations ---------- */
let animT = null;
function animate(res) {
  const fw = $("flask");
  const liq = $("liquid");
  fw.classList.remove("boil", "shake", "puff");
  void fw.offsetWidth;
  clearTimeout(animT);

  if (res.kind === "ok") {
    const main = res.rule.out[0];
    if (main === "silver") {
      liq.setAttribute("fill", "#e2e8f0");
      liq.setAttribute("opacity", "1");
    } else if (main === "iodoform") {
      liq.setAttribute("fill", "#facc15");
      liq.setAttribute("opacity", ".95");
    } else {
      liq.setAttribute("fill", res.rule.fade ? "var(--surface-2)" : cc(main));
      liq.setAttribute("opacity", res.rule.fade ? "1" : ".55");
    }
    fw.classList.add("boil");
    if (res.rule.comb || res.rule.t) fw.classList.add("puff");
    animT = setTimeout(() => fw.classList.remove("boil", "puff"), 1800);
  } else {
    fw.classList.add("shake");
    if (res.hot) { liq.setAttribute("fill", "var(--ink-2)"); liq.setAttribute("opacity", ".8"); }
    animT = setTimeout(() => fw.classList.remove("shake"), 500);
  }
}

function paintFlaskIdle() {
  const liq = $("liquid");
  const hasBr = ui.a === "br2" || ui.b === "br2";
  const hasKMnO4 = ui.a === "kmno4" || ui.b === "kmno4";
  const hasI2 = ui.a === "i2" || ui.b === "i2";
  if (hasKMnO4) {
    liq.setAttribute("fill", "#9333ea");
    liq.setAttribute("opacity", ".75");
  } else if (hasI2) {
    liq.setAttribute("fill", "#b45309");
    liq.setAttribute("opacity", ".7");
  } else if (hasBr) {
    liq.setAttribute("fill", "var(--mol-br)");
    liq.setAttribute("opacity", ".6");
  } else {
    liq.setAttribute("fill", "var(--liquid)");
    liq.setAttribute("opacity", "1");
  }
}

/* ---------- molecule drawing ---------- */
function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const g = v => cs.getPropertyValue(v).trim();
  const ink = g("--mol-c");
  return {
    C: ink, H: ink, O: g("--mol-o"), N: ink, CL: g("--mol-cl"),
    BR: g("--mol-br"), F: ink, I: ink, P: ink, S: ink, B: ink, SI: ink,
    BACKGROUND: g("--surface")
  };
}

function drawMol(svg, smi, bg) {
  if (!window.SmilesDrawer || !smi) return false;
  try {
    const t = themeColors();
    if (bg) t.BACKGROUND = bg;
    const d = new window.SmilesDrawer.SvgDrawer({
      width: 260, height: 180, explicitHydrogens: true,
      compactDrawing: false, bondThickness: 1.1, bondLength: 22,
      fontSizeLarge: 9, fontSizeSmall: 6, padding: 8, themes: { lab: t }
    });
    window.SmilesDrawer.parse(smi, tree => { d.draw(tree, svg, "lab", null, false); }, () => {});
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    return true;
  } catch (e) {
    return false;
  }
}

/* ================= guidance ================= */
function questTargetSub(q) {
  if (!q) return null;
  if (q.target) return q.target;
  return state.found[q.via] ? null : q.via;
}

function nextStep(target) {
  const av = available();
  if (!target || av.has(target)) return null;
  const reach = new Set(av), parent = {};
  let ch = true;
  while (ch) {
    ch = false;
    mapRules().forEach(r => {
      if (r.cat && r.cat.includes("poly") && !state.cat.poly) return;
      if (r.in.every(i => reach.has(i))) {
        r.out.forEach(o => {
          if (!reach.has(o)) { reach.add(o); parent[o] = r; ch = true; }
        });
      }
    });
  }
  if (!reach.has(target)) return null;
  let cur = target, guard = 0;
  while (guard++ < 20) {
    const r = parent[cur];
    if (!r) return null;
    const miss = r.in.find(i => !av.has(i));
    if (!miss) return { id: cur, rule: r };
    cur = miss;
  }
  return null;
}

/* ================= map rendering ================= */
function nodeState(id, av) {
  const rawSrc = curRawSrc();
  if (av.has(id)) return rawSrc[id] ? "raw" : "known";
  if (rawSrc[id]) {
    const src = SOURCES.find(z => z.id === rawSrc[id]);
    return src && src.by === "依頼" + (curQIdx() + 1) ? "locked" : "hidden";
  }
  if (mapRules().some(r => r.out.includes(id) && ruleAvail(r, av))) return "front";
  return "hidden";
}

let vb = null, vbAnim = null;
function targetViewBox(ids) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  ids.forEach(id => {
    const [x, y] = P(id);
    x0 = Math.min(x0, x - 100); x1 = Math.max(x1, x + 100);
    y0 = Math.min(y0, y - 60); y1 = Math.max(y1, y + 50);
  });
  let w = Math.max(x1 - x0, 620), h = Math.max(y1 - y0, 1);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ar = 1.6;
  if (w / h > ar) h = w / ar; else w = h * ar;
  if (h >= 740) { h = 740; w = h * ar; }
  const x = w >= 980 ? (980 - w) / 2 : Math.max(0, Math.min(980 - w, cx - w / 2));
  const y = h >= 740 ? 0 : Math.max(0, Math.min(740 - h, cy - h / 2));
  return [x, y, w, h];
}

function setViewBox(t) {
  const svg = $("map");
  let reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!vb || reduce) { vb = t; svg.setAttribute("viewBox", t.join(" ")); return; }
  if (vb.every((v, i) => Math.abs(v - t[i]) < 0.5)) return;
  const from = vb.slice(), t0 = performance.now();
  cancelAnimationFrame(vbAnim);
  const step = now => {
    const k = Math.min(1, (now - t0) / 650), e = 1 - Math.pow(1 - k, 3);
    vb = from.map((v, i) => v + (t[i] - v) * e);
    svg.setAttribute("viewBox", vb.join(" "));
    if (k < 1) vbAnim = requestAnimationFrame(step);
  };
  vbAnim = requestAnimationFrame(step);
}

function renderMap() {
  const av = available();
  const pos = curPos();
  const rawSrc = curRawSrc();
  const st = {};
  Object.keys(pos).forEach(id => st[id] = nodeState(id, av));
  const quests = curQuests();
  const q = quests[curQIdx()];
  const qt = questTargetSub(q);
  const nx = nextStep(qt);
  const sel = ui.sel;

  let edges = "", chips = "", nodes = "";
  const bend = (a, b, k) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    return [mx - dy * k, my + dx * k];
  };

  mapRules().forEach(r => {
    const disc = !!state.rx[r.id], avl = ruleAvail(r, av);
    r.in.filter(i => pos[i]).forEach(i => {
      r.out.filter(o => pos[o]).forEach(o => {
        if (st[i] === "hidden" || st[o] === "hidden" || st[i] === "locked") return;
        let cls;
        if (disc) cls = "";
        else if (avl) cls = av.has(o) ? "alt" : "front";
        else return;

        const touch = sel && (sel === i || sel === o);
        const a = P(i), b = P(o), c = bend(a, b, r.id === "vc1" ? -0.35 : 0.12);
        edges += `<path class="ed ${cls}${touch && !cls ? " hl" : ""}" d="M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}"/>`;

        if (touch) {
          const mx = 0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0];
          const my = 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1] - (Math.abs(b[1] - a[1]) < 40 ? 27 : 0);
          const lv = (state.easy ? 2 : (state.clue[r.id] || 0));
          const label = disc || lv >= 2 ? edgeChip(r) : lv >= 1 ? (r.in.filter(x => !pos[x]).map(x => "+" + S[x].f).join(" ") || "単独") + " …" : "？";
          const w = Math.max(24, [...label].length * 7.4 + 14);
          chips += `<g><rect class="chip-bg" x="${mx - w / 2}" y="${my - 11}" width="${w}" height="22" rx="11"/><text class="chip-t" x="${mx}" y="${my + 4}" text-anchor="middle">${label}</text></g>`;
        }
      });
    });
  });

  const shown = [];
  Object.keys(pos).forEach(id => {
    const s = st[id];
    if (s === "hidden") return;
    shown.push(id);
    const [x, y] = P(id);
    const src = rawSrc[id] && SOURCES.find(z => z.id === rawSrc[id]);
    const isSpecial = s === "front" || s === "locked";
    const mode = state.mapMode || "both";

    let w = 88, h = 32, textMarkup = "";
    if (s === "front") {
      w = 88; h = 32;
      textMarkup = `<text class="t-single" x="${x}" y="${y + 5.5}" text-anchor="middle">？？？</text>`;
    } else if (s === "locked") {
      const lockLabel = `${src ? src.by : "依頼"}で解放`;
      w = Math.max(68, lockLabel.length * 13 + 20); h = 32;
      textMarkup = `<text class="t-single" x="${x}" y="${y + 5.5}" text-anchor="middle">${lockLabel}</text>`;
    } else if (mode === "formula") {
      const f = S[id].f;
      w = Math.max(72, f.length * 9 + 20); h = 32;
      textMarkup = `<text class="t-formula-only" x="${x}" y="${y + 5.5}" text-anchor="middle">${f}</text>`;
    } else if (mode === "name") {
      const nm = shortName(id);
      w = Math.max(66, nm.length * 14 + 22); h = 32;
      textMarkup = `<text class="t-single" x="${x}" y="${y + 5.5}" text-anchor="middle">${nm}</text>`;
    } else {
      // "both" - 名称と示性式（化学式）の2段表示
      const nm = shortName(id);
      const f = S[id].f;
      w = Math.max(78, Math.max(nm.length * 12.5, f.length * 8) + 22);
      h = 42;
      textMarkup = `<text class="t-name" x="${x}" y="${y - 3.5}" text-anchor="middle">${nm}</text>` +
                   `<text class="t-formula" x="${x}" y="${y + 11.5}" text-anchor="middle">${f}</text>`;
    }

    const isNext = nx && nx.id === id;
    const cls = ["mn", s === "raw" ? "raw" : "", s === "front" ? "front" : "", s === "locked" ? "locked" : "", sel === id ? "sel" : "", isNext ? "next" : ""].join(" ");
    const rx = s === "raw" || s === "locked" ? 5 : (h === 42 ? 14 : 16);
    const halfH = h / 2;

    nodes += `<g class="${cls}" data-node="${id}" tabindex="0" role="button" aria-label="${s === "front" ? "未発見の物質" : S[id].n}" style="--cc:${s === "front" ? "var(--accent)" : cc(id)}">`;
    nodes += `<rect class="halo" x="${x - w / 2 - 6}" y="${y - halfH - 6}" width="${w + 12}" height="${h + 12}" rx="${rx + 5}"/>`;
    nodes += `<rect class="body" x="${x - w / 2}" y="${y - halfH}" width="${w}" height="${h}" rx="${rx}"/>`;
    nodes += `${textMarkup}</g>`;

    const flagTxt = qt === id ? "依頼" : isNext ? "次の一歩" : "";
    if (flagTxt) {
      const fw = flagTxt.length * 12 + 16;
      const flagY = y - halfH - 22;
      nodes += `<g class="flag"><rect x="${x - fw / 2}" y="${flagY}" width="${fw}" height="19" rx="4"/><text x="${x}" y="${flagY + 13.5}" text-anchor="middle">${flagTxt}</text></g>`;
    }
  });

  const regions = curRegions().map(r => `<text class="region" x="${r[1] * K}" y="${r[2] * K + OY}">${r[0]}</text>`).join("");
  $("map").innerHTML = `${regions}<g>${edges}</g><g>${nodes}</g><g>${chips}</g>`;
  setViewBox(targetViewBox(shown));
  const nf = Object.values(st).filter(v => v === "front").length;
  $("map-sub").textContent = nf ? `作れそうな「？」が ${nf}個` : "";
}

/* ================= side rendering ================= */
function renderLook() {
  const el = $("look");
  const av = available();
  const id = ui.sel;
  const quests = curQuests();
  const q = quests[curQIdx()];
  const qt = questTargetSub(q);
  const nx = nextStep(qt);
  const s = id ? nodeState(id, av) : "hidden";
  const rawSrc = curRawSrc();
  const pos = curPos();
  let h = "";

  if (s === "hidden") {
    h += `<div class="eyebrow">調べる</div><h3>次はどこへ？</h3>`;
    h += `<p>マップで点線の<b style="color:var(--accent)">「？？？」</b>は、いまの手持ちから作れそうな物質です。押すと作り方の手がかりが出ます。</p>`;
    h += nextHTML(q, qt, nx);
  } else if (s === "locked") {
    const src = rawSrc[id] && SOURCES.find(z => z.id === rawSrc[id]);
    h += `<div class="eyebrow">未開拓の原料</div><h3>${src ? src.n : "原料"}</h3><p>${src ? src.by : "依頼"}をこなすと、ここから原料を調達できます。</p>`;
  } else if (s === "front") {
    const routes = mapRules().filter(r => r.out.includes(id) && ruleAvail(r, av));
    h += `<div class="eyebrow">未発見の物質</div><h3>？？？ <span class="rar">${starsStr(rarity(id))}</span></h3>`;
    h += `<p class="muted">${CLS[S[id].cls].label}らしい</p>`;
    routes.forEach((r, k) => h += routeHTML(r, routes.length > 1 ? `ルート${k + 1}` : "手がかり"));
    if (nx && nx.id === id && q) h += `<div class="nextbox"><b>次の一歩</b>：依頼「${q.title}」への近道です。</div>`;
  } else {
    const sub = S[id];
    const fronts = new Set();
    mapRules().forEach(r => {
      if (r.in.includes(id) && ruleAvail(r, av)) {
        r.out.forEach(o => { if (!av.has(o) && pos[o]) fronts.add(o); });
      }
    });
    h += `<div class="eyebrow">${s === "raw" ? "原料" : "発見済み"}${s === "raw" ? "" : `　<span class="rar">${starsStr(rarity(id))}</span>`}</div>`;
    h += `<h3>${sub.n}</h3>`;
    if (state.showEn && sub.en) {
      h += `<div style="font-size:12.5px;color:var(--ink-2);font-family:var(--f-mono);margin-top:-2px;margin-bottom:3px">${sub.en}</div>`;
    }
    h += `<div class="fm" style="--cc:${cc(id)}">${sub.f}</div>`;
    h += fronts.size ? `<p>ここから作れそうな「？」が <b style="color:var(--accent)">${fronts.size}個</b> あります。</p>` : `<p class="muted">いまの手持ちでは、ここから先の道は見えていません。</p>`;
    h += `<div class="btns"><button type="button" class="btn primary" data-toa="${id}">フラスコAに入れる</button><button type="button" class="btn" data-open="${id}">構造式と解説</button></div>`;
  }
  el.innerHTML = h;
}

function nextHTML(q, qt, nx) {
  const ch = curChapter();
  if (!q) return `<div class="nextbox"><b>第${ch}章クリア！</b> 残りの「？」を探して図鑑を完成させよう。</div>`;
  if (q.rx && state.found[q.via]) return `<div class="nextbox"><b>依頼</b>：必要な物質はそろった。反応台で試そう。</div>`;
  if (qt && available().has(qt)) return `<div class="nextbox"><b>依頼</b>：目的の物質は手元にある。上の「納品する」を押そう。</div>`;
  if (nx) {
    const pos = curPos();
    const from = nx.rule.in.filter(i => pos[i]).map(shortName).join("・");
    return `<div class="nextbox"><b>次の一歩</b>：「${from}」から伸びる、オレンジに光る「？？？」を調べよう。</div>`;
  }
  return `<div class="nextbox"><b>依頼</b>：道が見えないときは、上の「ヒント」を見てみよう。</div>`;
}

function routeHTML(r, title) {
  const pos = curPos();
  const lv = (state.easy ? 2 : (state.clue[r.id] || 0));
  const from = r.in.filter(i => pos[i]).map(i => `<b style="color:${cc(i)}">${shortName(i)}</b>`).join("・");
  const costLabel = state.easy ? "無料" : "★1で見る";
  const btn = `<button type="button" class="spend" data-clue="${r.id}" ${!state.easy && state.stars < 1 ? "disabled" : ""}>${costLabel}</button>`;

  let h = `<div class="route"><div class="rh">${title}</div><dl>`;
  h += `<dt>出発点</dt><dd>${from}</dd>`;
  h += `<dt>相手</dt><dd>${lv >= 1 ? partnerText(r) : `<span class="hid">？？？</span>${btn}`}</dd>`;
  h += `<dt>条件</dt><dd>${lv >= 2 ? condText(r) : `<span class="hid">？？？</span>${lv >= 1 ? btn : ""}`}</dd>`;
  h += `</dl><div class="btns"><button type="button" class="btn hot" data-set="${r.id}">反応台で試す</button></div></div>`;
  return h;
}

function slotHTML(k) {
  const id = ui[k];
  const lab = k === "a" ? "A" : "B（空でもよい）";
  if (!id) return `<span class="lab">${lab}</span><span class="empty">押して選ぶ</span>`;
  const sub = S[id];
  const enLine = state.showEn && sub.en ? `<span style="font-family:var(--f-mono);font-size:10.5px;color:var(--ink-3);line-height:1;margin-bottom:2px">${sub.en}</span>` : "";
  return `<span class="lab">${lab}</span><span class="nm" style="color:${cc(id)}">${shortName(id)}</span>${enLine}<span class="sf">${sub.f}</span>`;
}

function tagHTML(id) {
  const on = ui[ui.picking] === id;
  return `<button type="button" class="tag${on ? " on" : ""}" data-pick="${id}" style="--cc:${cc(id)}"><span class="dot"></span>${shortName(id)}<span class="tf">${S[id].f}</span></button>`;
}

function renderPicker() {
  const el = $("picker");
  const k = ui.picking;
  if (!k) { el.innerHTML = ""; return; }
  const srcItems = [];
  SOURCES.forEach(s => { if (state.src[s.id]) s.items.forEach(i => { if (!srcItems.includes(i)) srcItems.push(i); }); });
  const made = Object.keys(S).filter(i => state.found[i] && !srcItems.includes(i));
  const extra = made.filter(i => S[i].cls === "reagent" || S[i].cls === "inorg");
  const org = made.filter(i => !extra.includes(i));
  let h = `<div class="picker"><div class="ph"><span>フラスコ${k.toUpperCase()}に入れる物質</span><span>${k === "b" ? `<button type="button" class="btn ghost" data-pick="">空にする</button>` : ""}<button type="button" class="btn ghost" data-pick-close>閉じる</button></span></div>`;
  h += `<h4>原料・試薬</h4><div class="tags">${srcItems.concat(extra).map(tagHTML).join("")}</div>`;
  h += `<h4>つくった物質</h4><div class="tags">${org.length ? org.map(tagHTML).join("") : '<span class="muted" style="font-size:12.5px">まだありません</span>'}</div></div>`;
  el.innerHTML = h;
}

/**
 * やさしいモード用の2択予想オプションを生成する
 */
function getPredictionOptions() {
  let ids = [ui.a, ui.b].filter(Boolean);
  if (ids.length === 2 && ids[0] === ids[1]) ids = [ids[0]];
  const matched = RULES.filter(r => sameSet(r.in, ids));

  if (!state.easy) {
    // 通常モード：全種類一覧
    return `<option value="">予想しない</option>` + TYPES.map(t => {
      return `<option value="${t}"${ui.pred === t ? " selected" : ""}>${t}</option>`;
    }).join("");
  }

  // やさしいモード：該当候補＋ダミー1つの2択
  let correctType = "置換";
  if (matched.length > 0) {
    correctType = matched[0].types[0];
  } else {
    // 該当なしの場合は「反応しない」が正解
    correctType = "反応しない";
  }

  const candidatePool = TYPES.filter(t => t !== correctType);
  // 固定ダミーを決定（ランダムにフラフラしないよう、ハッシュ的または代表値）
  const dummyType = correctType === "置換" ? "付加" :
                    correctType === "付加" ? "置換" :
                    correctType === "脱離" ? "縮合" :
                    correctType === "縮合" ? "加水分解" :
                    correctType === "加水分解" ? "縮合" :
                    correctType === "酸化" ? "縮合" :
                    correctType === "検出" ? "置換" :
                    correctType === "重合" ? "付加" :
                    correctType === "熱分解" ? "脱離" :
                    correctType === "燃焼" ? "置換" :
                    correctType === "反応しない" ? "付加" : candidatePool[0];

  const choices = [correctType, dummyType].sort();

  let html = `<option value="">予想しない</option>`;
  choices.forEach(ch => {
    const info = TYPE_INFO[ch];
    const simple = info ? `（${info.simple}）` : "";
    html += `<option value="${ch}"${ui.pred === ch ? " selected" : ""}>${ch} ${simple}</option>`;
  });
  return html;
}

function tempZoneInfo(t) {
  // 実験ノート（智慧）: 発見済みの反応がある場合のみ注記を表示
  let note = "";
  if (t <= 40) {
    note = "常温（加熱なし）での実験";
  } else if (t <= 90) {
    if (state.rx.ester_et || state.rx.test_silver || state.rx.test_iodo_ac) {
      note = "📖 実験ノート：温水による穏やかな加熱反応（60〜80℃）";
    } else {
      note = "おだやかな温水加熱（湯せん）";
    }
  } else if (t >= 130 && t <= 140) {
    if (state.rx.dhEther) {
      note = "📖 実験ノート：分子間脱水（エーテル生成）を確認した温度帯";
    }
  } else if (t >= 160 && t <= 170) {
    if (state.rx.dhEt) {
      note = "📖 実験ノート：分子内脱水（エチレン生成）を確認した温度帯";
    }
  } else if (t >= 280 && t <= 320) {
    if (state.rx.h2oEt || state.rx.h2oPr) {
      note = "📖 実験ノート：気相水和反応を確認した温度帯";
    }
  } else if (t >= 500 && t <= 600) {
    if (state.rx.iron) {
      note = "📖 実験ノート：三分子重合（赤熱鉄管）を確認した温度帯";
    }
  } else if (t >= 750) {
    if (state.rx.crack) {
      note = "📖 実験ノート：ナフサの高温クラッキングを確認した温度帯";
    }
  }

  // ゾーン分類（実験室の自然な分類、ネタバレなし）
  if (t <= 40) {
    return { name: "室温", color: "var(--ok)", bg: "var(--ok-soft)", desc: note };
  }
  if (t <= 90) {
    return { name: "湯せん", color: "var(--flame)", bg: "var(--flame-soft)", desc: note };
  }
  if (t <= 250) {
    return { name: "加熱", color: "#ea580c", bg: "rgba(234, 88, 12, 0.15)", desc: note };
  }
  if (t <= 650) {
    return { name: "強熱", color: "#dc2626", bg: "rgba(220, 38, 38, 0.15)", desc: note };
  }
  return { name: "高温熱分解", color: "#7e22ce", bg: "rgba(126, 34, 206, 0.18)", desc: note };
}

function updateTempUI(temp) {
  const t = Math.max(20, Math.min(900, Math.round(temp / 10) * 10));
  ui.temp = t;

  const tempInput = $("temp");
  if (tempInput && +tempInput.value !== t) tempInput.value = t;

  const tempVal = $("temp-v");
  if (tempVal) tempVal.textContent = t + "℃";

  const info = tempZoneInfo(t);
  const zoneEl = $("temp-zone");
  if (zoneEl) {
    zoneEl.textContent = info.name;
    zoneEl.style.borderColor = info.color;
    zoneEl.style.color = info.color;
    zoneEl.style.background = info.bg;
  }

  const hintEl = $("temp-hint");
  if (hintEl) {
    hintEl.textContent = info.desc;
    hintEl.style.display = info.desc ? "block" : "none";
  }

  // プリセットボタンのアクティブ表示切替
  document.querySelectorAll(".t-pre").forEach(btn => {
    const pt = +btn.dataset.temp;
    const isAct = (pt === 20 && t <= 40) ||
                  (pt === 60 && t >= 50 && t <= 90) ||
                  (pt === 140 && t >= 120 && t <= 150) ||
                  (pt === 170 && t >= 155 && t <= 190) ||
                  (pt === 300 && t >= 250 && t <= 350) ||
                  (pt === 500 && t >= 400 && t <= 650) ||
                  (pt === 800 && t >= 700);
    btn.classList.toggle("active", isAct);
  });

  const fw = $("flask");
  if (fw) {
    fw.classList.toggle("warm", t >= 50 && t < 100);
    fw.classList.toggle("hot", t >= 100 && t < 400);
    fw.classList.toggle("blaze", t >= 400);
  }
}

function renderBench() {
  ["a", "b"].forEach(k => {
    const el = $("slot-" + k);
    el.innerHTML = slotHTML(k);
    el.classList.toggle("active", ui.picking === k);
    el.classList.toggle("filled", !!ui[k]);
  });
  renderPicker();

  updateTempUI(ui.temp);

  // 実験ノート（智慧）が備わっている場合、140℃/170℃にアイコン付与
  const b140 = $("t-pre-140");
  if (b140) {
    b140.innerHTML = state.rx.dhEther ? "140℃ <small style='font-size:9.5px;color:var(--ink-2)'>📖</small>" : "140℃";
    b140.title = state.rx.dhEther ? "実験ノート：エーテル生成の確認温度" : "加熱 140℃";
  }
  const b170 = $("t-pre-170");
  if (b170) {
    b170.innerHTML = state.rx.dhEt ? "170℃ <small style='font-size:9.5px;color:var(--ink-2)'>📖</small>" : "170℃";
    b170.title = state.rx.dhEt ? "実験ノート：エチレン生成の確認温度" : "加熱 170℃";
  }

  $("light").setAttribute("aria-pressed", ui.light);
  $("light-t").textContent = ui.light ? "当てる" : "当てない";

  $("cat").innerHTML = CATS.map(c => {
    const locked = c.lock && !state.cat[c.id];
    return `<option value="${c.id}"${locked ? " disabled" : ""}${ui.cat === c.id ? " selected" : ""}>${c.n}${locked ? `（${c.lock}で解放）` : ""}</option>`;
  }).join("");

  $("pred").innerHTML = getPredictionOptions();

  // やさしいモード表示の更新
  const easyBadge = $("easy-badge");
  if (easyBadge) {
    easyBadge.style.display = state.easy ? "inline-flex" : "none";
  }

  renderResult();
}

function renderResult() {
  const el = $("result");
  const R = ui.result;
  if (!R) { el.innerHTML = ""; return; }
  const { res, newSubs, newRx, predOk, star, pred, xp } = R;
  let h = "";

  if (res.kind === "ok") {
    const r = res.rule;
    h += `<div class="result ok"><h4>${newSubs.length ? "新しい物質ができた！" : newRx ? "新しい反応を発見！" : "反応した"}`;
    r.types.forEach(t => h += `<button type="button" class="chip type" data-explain-type="${t}">${t} ❓</button>`);
    if (predOk === true) h += `<span class="chip good">予想的中${star ? " ★+1" : ""}</span>`;
    if (predOk === false) h += `<span class="chip miss">予想はずれ</span>`;
    if (xp) h += `<span class="chip xp">+${xp} XP</span>`;
    h += `</h4><div class="eq">${r.eq}</div><p>${r.text}</p><p class="tn">${TYPE_INFO[r.types[0]] ? TYPE_INFO[r.types[0]].guide : ""}</p></div>`;
  } else {
    h += `<div class="result ${res.kind === "fail" ? "fail" : ""}"><h4>${res.kind === "fail" ? "おしい！" : "変化なし"}`;
    if (predOk === true) h += `<span class="chip good">予想どおり</span>`;
    h += `</h4><p>${res.msg}</p>${res.kind === "fail" ? `<p class="tn">組み合わせは合っている。温度・光・触媒を見直そう。</p>` : ""}`;
    if (pred && TYPE_INFO[pred]) {
      h += `<p class="tn"><button type="button" class="btn ghost" style="padding:2px 8px;font-size:12px;text-decoration:underline" data-explain-type="${pred}">「${pred}」とは？</button></p>`;
    }
    h += `</div>`;
  }
  el.innerHTML = h;
}

function renderSide() {
  const b = ui.side === "bench";
  $("look").hidden = b;
  $("bench").hidden = !b;
  $("seg-look").setAttribute("aria-selected", !b);
  $("seg-bench").setAttribute("aria-selected", b);
  if (b) renderBench(); else renderLook();
}

/* ================= header & quest & tabs ================= */
function renderHUD() {
  $("st-star").textContent = "★" + state.stars;
  const ri = rankIdx(state.xp);
  $("st-rank").textContent = RANKS[ri][1];
  const lo = RANKS[ri][0], hi = RANKS[ri + 1] ? RANKS[ri + 1][0] : null;
  $("st-xpbar").style.width = hi ? Math.round((state.xp - lo) / (hi - lo) * 100) + "%" : "100%";
  $("st-xp").textContent = hi ? `${state.xp} / ${hi} XP` : `${state.xp} XP`;
  $("mute").textContent = "効果音：" + (state.mute ? "なし" : "あり");

  const easyBtn = $("toggle-easy");
  if (easyBtn) {
    easyBtn.textContent = "学習サポート（やさしいモード）：" + (state.easy ? "ON" : "OFF");
  }

  const enBtn = $("toggle-en");
  if (enBtn) {
    enBtn.textContent = "物質の英語名表示：" + (state.showEn ? "あり" : "なし");
  }

  const mapModeLabels = {
    both: "表示: 名称＋化学式",
    formula: "表示: 化学式のみ",
    name: "表示: 名称のみ"
  };
  const modeKey = state.mapMode || "both";
  const mapModeText = mapModeLabels[modeKey] || mapModeLabels.both;

  const mapModeBtn = $("toggle-map-mode");
  if (mapModeBtn) {
    mapModeBtn.textContent = mapModeText;
  }
  const mapModeMenuBtn = $("toggle-map-mode-menu");
  if (mapModeMenuBtn) {
    mapModeMenuBtn.textContent = "マップ" + mapModeText;
  }

  // 章ナビゲーションの表示更新
  const ch = curChapter();
  const subTitle = $("ch-sub-title");
  if (subTitle) {
    subTitle.textContent = ch === "detective" ? "🔍 探偵モード：未知化合物の構造決定事件簿（高校化学）" :
                           ch === 2 ? "第2章 官能基の工房（学習指導要領 準拠）" :
                           "第1章 炭化水素の森（学習指導要領 準拠）";
  }
  const q1Done = (state.q1 ?? state.q ?? 0) >= QUESTS1.length;
  const q2Done = (state.q2 || 0) >= QUESTS2.length;
  const detDone = Object.keys(state.detective?.solved || {}).length;

  const tab1 = $("ch-tab-1"), tab2 = $("ch-tab-2"), tabDet = $("ch-tab-det");
  if (tab1) {
    tab1.setAttribute("aria-selected", ch === 1);
    tab1.textContent = `第1章 炭化水素${q1Done ? " 🏆" : ""}`;
    tab1.style.background = ch === 1 ? "var(--accent-soft)" : "transparent";
    tab1.style.borderColor = ch === 1 ? "var(--accent)" : "var(--line-2)";
    tab1.style.color = ch === 1 ? "var(--accent)" : "var(--ink-2)";
    tab1.style.fontWeight = ch === 1 ? "700" : "500";
  }
  if (tab2) {
    tab2.setAttribute("aria-selected", ch === 2);
    tab2.textContent = `第2章 官能基${q2Done ? " 🏆" : ""}`;
    tab2.style.background = ch === 2 ? "var(--accent-soft)" : "transparent";
    tab2.style.borderColor = ch === 2 ? "var(--accent)" : "var(--line-2)";
    tab2.style.color = ch === 2 ? "var(--accent)" : "var(--ink-2)";
    tab2.style.fontWeight = ch === 2 ? "700" : "500";
  }
  if (tabDet) {
    const isDet = ch === "detective";
    tabDet.setAttribute("aria-selected", isDet);
    tabDet.textContent = `🕵️ 探偵モード${detDone >= DETECTIVE_CASES.length ? " 🏆" : (detDone > 0 ? ` (${detDone}/${DETECTIVE_CASES.length})` : "")}`;
    tabDet.style.background = isDet ? "var(--flame-soft)" : "transparent";
    tabDet.style.borderColor = isDet ? "var(--flame)" : "var(--line-2)";
    tabDet.style.color = isDet ? "var(--flame)" : "var(--ink-2)";
    tabDet.style.fontWeight = isDet ? "700" : "500";
  }
}

function questReady(q) {
  if (!q) return false;
  return q.rx ? !!state.rx[q.rx] : !!state.found[q.target];
}

function deliver() {
  const quests = curQuests();
  const done = curQIdx();
  const q = quests[done];
  if (!q || !questReady(q)) return;

  const rank0 = rankIdx(state.xp);
  SFX.lvl();
  const nextQ = done + 1;
  setCurQIdx(nextQ);
  state.stars += 2;
  state.xp += 50;

  if (q.reward) {
    if (q.reward.src) q.reward.src.forEach(s => state.src[s] = true);
    if (q.reward.cat) q.reward.cat.forEach(c => state.cat[c] = true);
  }

  ui.sel = null;
  checkAch();
  save();
  renderAll();
  showSide("look");

  if (nextQ >= quests.length) {
    if (curChapter() === 1) {
      toast("🏆 <b>第1章クリア！</b> 「第2章 官能基の工房」へ進めるようになりました！ ★+2 +50 XP");
    } else {
      toast("🎉 <b>第2章クリア！</b> 全ての依頼を達成しました！ おめでとうございます！ ★+2 +50 XP");
    }
  } else {
    toast(`依頼「<b>${q.title}</b>」を納品しました！ ★+2 +50 XP<br><small>${q.rewardText || ""}</small>`);
  }
  if (rankIdx(state.xp) > rank0) {
    setTimeout(() => toast(`ランクアップ！ <b>${RANKS[rankIdx(state.xp)][1]}</b> になった`), 700);
  }
}

function renderTutorial() {
  const el = $("tut-bar");
  if (!el) return;
  if (!state.intro || curChapter() !== 1) {
    el.style.display = "none";
    return;
  }
  el.style.display = "grid";
  const step = state.tutStep || 1;

  let badge = `チュートリアル ${step}/4`;
  let title = "";
  let desc = "";
  let acts = "";

  if (step === 1) {
    title = "① 原料を確認しよう";
    desc = "町の人からの依頼「クロロホルム」を目指します。まずは原料の「メタン CH₄」がフラスコAに入っていることを確認してください。";
    acts = `<button type="button" class="btn primary" id="tut-step1-next">次へ（塩素を入れる）</button><button type="button" class="btn ghost" id="tut-skip">スキップ</button>`;
  } else if (step === 2) {
    title = "② もう一方の物質（塩素）を入れよう";
    desc = "メタンと反応させる「塩素 Cl₂」をフラスコBに入れます。下のボタンでセットするか、フラスコBを押して塩素を選んでください。";
    acts = `<button type="button" class="btn primary" id="tut-step2-set">塩素 Cl₂ をセット</button><button type="button" class="btn ghost" id="tut-skip">スキップ</button>`;
  } else if (step === 3) {
    title = "③ 反応の条件（光）を整えよう";
    desc = "アルカンと塩素は暗い場所では反応しません。「光」ボタンを押して紫外線を照射し、塩素ラジカルを発生させましょう！";
    acts = `<button type="button" class="btn hot" id="tut-step3-light">光を当てる（点灯）</button><button type="button" class="btn ghost" id="tut-skip">スキップ</button>`;
  } else if (step === 4) {
    title = "④ 反応させてみよう！";
    desc = "準備完了！「反応させる」ボタンを押して、メタンのH原子がCl原子に置き換わる「置換反応」を起こしましょう！";
    acts = `<button type="button" class="btn primary" id="tut-step4-react">反応させる！</button><button type="button" class="btn ghost" id="tut-skip">スキップ</button>`;
  }

  el.innerHTML = `<div><div class="tut-badge">${badge}</div><h3>${title}</h3><p>${desc}</p></div><div class="tut-acts">${acts}</div>`;
}

function renderQuest() {
  const el = $("qbar");
  const quests = curQuests();
  const done = curQIdx();
  const ch = curChapter();

  if (done >= quests.length) {
    el.className = "panel qbar clear";
    let nextBtn = "";
    if (ch === 1) {
      nextBtn = `<div class="acts" style="margin-top:8px"><button type="button" class="btn hot" id="goto-ch2">第2章「官能基の工房」へ進む →</button></div>`;
    }
    el.innerHTML = `<div><div class="eyebrow">第${ch}章の依頼 全達成！</div><h2>第${ch}章クリア</h2><p class="say">${ch === 1 ? "炭化水素の森を開拓しました！第2章「官能基の工房」へ進んで、アルコールやエステル、検出反応を探究しましょう！" : "すべての官能基の探究を完遂しました！おめでとうございます！"}</p>${nextBtn}</div>`;
    return;
  }
  el.className = "panel qbar";
  const q = quests[done];
  const nh = state.hints[q.id] || 0;
  const ready = questReady(q);
  let h = `<div><div class="eyebrow">第${ch}章 依頼 ${done + 1}/${quests.length}　${q.who}より</div><h2>${q.title}</h2><p class="say">${q.say}</p></div>`;
  h += `<div class="acts"><button type="button" class="btn" id="hint"${nh >= q.hints.length ? " disabled" : ""}>ヒント ${nh}/${q.hints.length}</button>`;
  h += `<button type="button" class="btn hot" id="deliver"${ready ? "" : " disabled"}>納品する</button></div>`;
  if (nh) h += `<ol>${q.hints.slice(0, nh).map(x => `<li>${x}</li>`).join("")}</ol>`;
  el.innerHTML = h;
}

function renderTabs() {
  const d1 = DEX1.filter(i => state.found[i]).length;
  const d2 = DEX2.filter(i => state.found[i]).length;
  const foundRx = RULES.filter(r => state.rx[r.id]).length;
  $("t-dex").textContent = `${d1 + d2}/${DEX1.length + DEX2.length}`;
  const tRx = $("t-rx");
  if (tRx) tRx.textContent = `${foundRx}/${RULES.length}`;
  $("t-ach").textContent = `${ACH.filter(a => state.ach[a.id]).length}/${ACH.length}`;
  $("t-log").textContent = state.log.length ? String(state.n) : "";
  const tDet = $("t-det");
  if (tDet) tDet.textContent = `${Object.keys(state.detective?.solved || {}).length}/${DETECTIVE_CASES.length}`;
  document.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === ui.tab));

  let h = "";
  if (ui.tab === "dex") {
    const item = id => {
      if (!state.found[id]) {
        return `<div class="dex-i unk" title="未発見の${SHORT[S[id].cls]}"><span class="df">？？？</span><span class="dn">${SHORT[S[id].cls]}</span>${state.showEn ? `<span class="den">—</span>` : ""}</div>`;
      }
      const s = S[id];
      const jName = shortName(id);
      const enTxt = state.showEn && s.en ? `<span class="den">${s.en}</span>` : "";
      const fullTitle = `${s.n} (${s.en || ""})\n化学式: ${s.f}\n分類: ${CLS[s.cls].label}`;
      return `<button type="button" class="dex-i" data-open="${id}" title="${fullTitle}" style="--cc:${cc(id)}"><span class="df">${s.f}</span><span class="dn">${jName}</span>${enTxt}</button>`;
    };
    h += `<div class="dex-sec"><span>第1章の物質（炭化水素・高分子）</span><span>${d1}/${DEX1.length}</span></div><div class="dex">${DEX1.map(item).join("")}</div>`;
    h += `<div class="dex-sec"><span>第2章の物質（官能基・エステル・検出）</span><span>${d2}/${DEX2.length}</span></div><div class="dex">${DEX2.map(item).join("")}</div>`;
    h += `<div class="dex-sec"><span>他章・副産物</span><span>${DEXX.filter(i => state.found[i]).length}/${DEXX.length}</span></div><div class="dex">${DEXX.map(item).join("")}</div>`;
  } else if (ui.tab === "rx") {
    // 反応図鑑（学習指導要領の分類ごと）
    const groups = ["置換", "付加", "脱離", "縮合", "重合", "酸化", "加水分解", "検出", "燃焼", "熱分解", "その他"];
    groups.forEach(g => {
      const list = RULES.filter(r => r.types[0] === g);
      if (!list.length) return;
      const gFound = list.filter(r => state.rx[r.id]).length;
      h += `<div class="dex-sec"><span>${g}反応（学習指導要領）</span><span>${gFound}/${list.length}</span></div>`;
      h += `<div class="rx-grid">`;
      list.forEach(r => {
        const disc = !!state.rx[r.id];
        if (disc) {
          h += `<div class="rx-card">`;
          h += `<div class="rxh"><button type="button" class="chip type" data-explain-type="${r.types[0]}">${r.types[0]} ❓</button><span class="rx-cond">${condText(r)}</span></div>`;
          h += `<div class="rx-eq">${r.eq}</div>`;
          h += `<p class="rx-desc">${r.text}</p>`;
          h += `</div>`;
        } else {
          h += `<div class="rx-card unk">`;
          h += `<div class="rxh"><span class="chip miss">${g}</span><span style="font-size:11px;color:var(--ink-3)">未発見</span></div>`;
          h += `<div class="rx-eq">？？？ → ？？？</div>`;
          h += `<p class="rx-desc">まだこの反応を起こしていません。合成マップの「？？？」から手がかりを探しましょう。</p>`;
          h += `</div>`;
        }
      });
      h += `</div>`;
    });
  } else if (ui.tab === "ach") {
    h += `<div class="ach">${ACH.map(a => `<div class="badge ${state.ach[a.id] ? "on" : "off"}"><b>${state.ach[a.id] ? a.n : "？？？"}</b><span>${a.d}</span></div>`).join("")}</div>`;
  } else if (ui.tab === "det") {
    // 事件簿一覧
    const det = getDetState();
    const solvedCount = Object.keys(det.solved || {}).length;
    const rank = getDetRank(solvedCount);
    h += `<div class="dex-sec"><span>🕵️ 探偵事務所 事件調書録</span><span>解決: ${solvedCount}/${DETECTIVE_CASES.length}</span></div>`;
    h += `<div style="background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
      <div>
        <span class="det-rank-badge">🕵️ ${rank[1]}</span>
        <span style="font-size:12.5px;color:var(--ink-2);margin-left:8px">${rank[2]}</span>
      </div>
      <button type="button" class="btn primary" id="goto-det-mode" style="font-size:12px;padding:4px 12px">探偵モードで捜査を開始する →</button>
    </div>`;
    h += `<div class="rx-grid">`;
    DETECTIVE_CASES.forEach((c, idx) => {
      const isSol = !!det.solved[c.id];
      const hasCombust = (det.testsRun[c.id] || []).includes("combust");
      const fDisplay = isSol || hasCombust ? c.formula : "？（未分析）";
      h += `
        <div class="rx-card ${isSol ? "" : "unk"}" style="cursor:pointer" data-det-case-open="${idx}">
          <div class="rxh">
            <span class="chip ${isSol ? "good" : "miss"}">${isSol ? "解決済 ✅" : c.diff}</span>
            <span style="font-family:var(--f-mono);font-size:12px;font-weight:700">${fDisplay}</span>
          </div>
          <div class="rx-eq" style="font-size:14px;color:var(--ink)">File 0${idx + 1}：${c.title.replace(/事件調書 File \d+：/, "")}</div>
          <p class="rx-desc">${c.physical}</p>
          <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:11.5px;color:var(--ink-3)">依頼：${c.who}</span>
            <button type="button" class="btn ghost" style="padding:2px 8px;font-size:11.5px">${isSol ? "解説を見る" : "捜査する →"}</button>
          </div>
        </div>
      `;
    });
    h += `</div>`;
  } else {
    h += state.log.length ? `<ol class="log">${state.log.map(l => `<li><span class="n">#${l.n}</span><span class="e">${l.eq}</span><span class="r ${l.ok ? "ok" : "no"}">${l.ok ? "成功" : "—"}</span></li>`).join("")}</ol>` : `<p class="muted" style="margin:0;font-size:13.5px">まだ実験していません。</p>`;
  }
  $("tabbody").innerHTML = h;
}

function renderAll() {
  renderHUD();
  const isDet = curChapter() === "detective";
  const craftStage = $("craft-stage");
  const qbar = $("qbar");
  const tutBar = $("tut-bar");
  const detStage = $("detective-stage");

  if (isDet) {
    if (craftStage) craftStage.style.display = "none";
    if (qbar) qbar.style.display = "none";
    if (tutBar) tutBar.style.display = "none";
    if (detStage) {
      detStage.style.display = "flex";
      renderDetective();
    }
  } else {
    if (craftStage) craftStage.style.display = "grid";
    if (qbar) qbar.style.display = "grid";
    if (detStage) detStage.style.display = "none";
    renderTutorial();
    renderQuest();
    renderMap();
    renderSide();
    if (!ui.result) paintFlaskIdle();
  }
  renderTabs();
}

/* ================= 探偵モード（構造決定）描画＆ロジック ================= */
function renderDetective() {
  const el = $("detective-stage");
  if (!el) return;
  const det = getDetState();
  const solvedCount = Object.keys(det.solved || {}).length;
  const rank = getDetRank(solvedCount);
  const curCase = DETECTIVE_CASES[det.caseIdx] || DETECTIVE_CASES[0];
  const caseId = curCase.id;
  const testsRun = det.testsRun[caseId] || [];
  const eliminated = det.eliminated[caseId] || [];
  const isSolved = !!det.solved[caseId];

  // Case navigation carousel
  let casePills = "";
  DETECTIVE_CASES.forEach((c, idx) => {
    const isAct = idx === det.caseIdx;
    const isSol = !!det.solved[c.id];
    const hasCombust = (det.testsRun[c.id] || []).includes("combust");
    const formulaDisplay = isSol || hasCombust ? c.formula : "？（未分析）";
    casePills += `<button type="button" class="det-case-pill${isAct ? " active" : ""}${isSol ? " solved" : ""}" data-det-case="${idx}">
      <span>${isSol ? "✅" : "📁"}</span>
      <span>File 0${idx + 1}</span>
      <span style="font-family:var(--f-mono);font-size:11px">${formulaDisplay}</span>
    </button>`;
  });

  // Reagent buttons (combustion + 6 test reagents)
  const reagentKeys = ["combust", "na", "tollens", "iodo", "br2", "kmno4", "sapon"];
  let reagentGrid = "";
  reagentKeys.forEach(k => {
    const rInfo = REAGENTS_TEST_INFO[k];
    const isTested = testsRun.includes(k);
    const isAct = det.activeTest === k;
    reagentGrid += `<button type="button" class="det-reagent-btn${isAct ? " active" : ""}${isTested ? " tested" : ""}" data-det-reagent="${k}">
      <span class="det-reagent-icon">${rInfo.icon}</span>
      <span class="det-reagent-name">${rInfo.name}</span>
      <span class="det-reagent-target">${rInfo.target}</span>
    </button>`;
  });

  // Active test result visualization
  let visHtml = "";
  if (det.activeTest) {
    const actKey = det.activeTest;
    const tData = curCase.tests[actKey];

    // Tube visual attributes
    let tubeLiquidFill = "var(--liquid)";
    let tubeEffect = "";
    if (actKey === "combust") {
      tubeLiquidFill = "#f97316";
      tubeEffect = `<path d="M 22 85 Q 30 50 30 35 Q 35 60 38 85 Z" fill="#ef4444" opacity="0.9"/>
        <path d="M 26 85 Q 30 65 30 55 Q 33 70 34 85 Z" fill="#facc15" opacity="0.95"/>
        <circle cx="28" cy="30" r="1.5" fill="#f59e0b" opacity="0.8"/>
        <circle cx="33" cy="22" r="1.2" fill="#f59e0b" opacity="0.7"/>`;
    } else if (actKey === "tollens") {
      if (tData.ok) {
        tubeLiquidFill = "#e2e8f0";
        tubeEffect = `<rect x="15" y="40" width="30" height="60" fill="url(#silverGrad)" opacity="0.9" rx="4"/>
          <circle cx="24" cy="55" r="2.5" fill="#fff" opacity="0.9"/>
          <circle cx="36" cy="75" r="3" fill="#fff" opacity="0.9"/>
          <circle cx="28" cy="90" r="2" fill="#fff" opacity="0.8"/>`;
      } else {
        tubeLiquidFill = "#fef08a";
      }
    } else if (actKey === "iodo") {
      if (tData.ok) {
        tubeLiquidFill = "#fef9c3";
        tubeEffect = `<path d="M 16 95 Q 30 90 44 95 L 44 105 A 14 14 0 0 1 16 105 Z" fill="#facc15" opacity="0.95"/>
          <circle cx="25" cy="85" r="2" fill="#eab308"/>
          <circle cx="35" cy="82" r="2.5" fill="#eab308"/>
          <circle cx="30" cy="72" r="1.5" fill="#ca8a04"/>`;
      } else {
        tubeLiquidFill = "#fde047";
      }
    } else if (actKey === "na") {
      tubeLiquidFill = "var(--liquid)";
      if (tData.ok) {
        tubeEffect = `<rect x="26" y="90" width="8" height="6" fill="#94a3b8" rx="1"/>
          <circle cx="28" cy="75" r="2.5" fill="#fff" opacity="0.8"/>
          <circle cx="32" cy="60" r="3.5" fill="#fff" opacity="0.85"/>
          <circle cx="27" cy="45" r="2" fill="#fff" opacity="0.75"/>
          <circle cx="33" cy="30" r="3" fill="#fff" opacity="0.9"/>`;
      }
    } else if (actKey === "br2") {
      tubeLiquidFill = tData.ok ? "rgba(201, 211, 245, 0.5)" : "#b45309";
    } else if (actKey === "kmno4") {
      tubeLiquidFill = tData.ok ? "rgba(241, 244, 241, 0.6)" : "#9333ea";
    } else if (actKey === "sapon") {
      tubeLiquidFill = "var(--liquid)";
      if (tData.ok) {
        tubeEffect = `<line x1="15" y1="65" x2="45" y2="65" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3,2"/>`;
      }
    }

    visHtml = `
      <div class="det-tube-wrap">
        <svg viewBox="0 0 60 130" class="det-tube-svg">
          <defs>
            <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#cbd5e1"/>
              <stop offset="50%" stop-color="#f8fafc"/>
              <stop offset="100%" stop-color="#94a3b8"/>
            </linearGradient>
          </defs>
          <path d="M 15 35 L 15 105 A 15 15 0 0 0 45 105 L 45 35 Z" fill="${tubeLiquidFill}" opacity="0.85"/>
          ${tubeEffect}
          <path d="M 14 10 L 14 105 A 16 16 0 0 0 46 105 L 46 10" fill="none" stroke="var(--ink-2)" stroke-width="2"/>
          <ellipse cx="30" cy="10" rx="17" ry="3.5" fill="none" stroke="var(--ink-2)" stroke-width="2"/>
        </svg>
      </div>
      <div class="det-result-box">
        <div class="det-result-badge ${tData.ok ? "react" : "none"}">${tData.ok ? "✓ 陽性・反応あり" : "— 陰性・変化なし"}</div>
        <div class="det-result-label">${tData.label}</div>
        <p class="det-result-desc">${tData.desc}</p>
        <div class="det-result-clue">💡 推理の手がかり：${tData.clue}</div>
      </div>
    `;
  } else {
    visHtml = `
      <div class="det-tube-wrap">
        <svg viewBox="0 0 60 130" class="det-tube-svg">
          <path d="M 15 45 L 15 105 A 15 15 0 0 0 45 105 L 45 45 Z" fill="var(--surface-2)" opacity="0.5"/>
          <path d="M 14 10 L 14 105 A 16 16 0 0 0 46 105 L 46 10" fill="none" stroke="var(--ink-3)" stroke-width="2"/>
          <ellipse cx="30" cy="10" rx="17" ry="3.5" fill="none" stroke="var(--ink-3)" stroke-width="2"/>
        </svg>
      </div>
      <div class="det-result-box">
        <div class="det-result-label" style="color:var(--ink-2)">試験・試薬を選んでテスト</div>
        <p class="det-result-desc">上のボタンを押すと、この試料に対して元素分析や試薬滴下テストを行い、官能基の手がかりを入手できます。</p>
      </div>
    `;
  }

  // Clues list
  let cluesListHtml = "";
  if (testsRun.length > 0) {
    cluesListHtml = testsRun.map(tk => {
      const t = curCase.tests[tk];
      return `<li class="${t.ok ? "found" : "not"}">
        <span class="bullet">${t.ok ? "✓" : "×"}</span>
        <span><b>${REAGENTS_TEST_INFO[tk].name}</b>：${t.clue}</span>
      </li>`;
    }).join("");
  } else {
    cluesListHtml = `<li style="color:var(--ink-3);font-size:12px">まだ鑑識試験を行っていません。「🔥 元素分析」や試薬試験を行って手がかりを集めましょう。</li>`;
  }

  // Candidate cards
  let candidatesHtml = "";
  curCase.candidates.forEach(cand => {
    const isSel = det.selectedCandidate === cand.id;
    const isElim = eliminated.includes(cand.id);
    candidatesHtml += `
      <div class="det-cand-card${isSel ? " selected" : ""}${isElim ? " eliminated" : ""}" data-det-cand="${cand.id}">
        <div class="det-cand-head">
          <span class="det-cand-name">${cand.name}</span>
          <span class="det-cand-cls">${cand.cls}</span>
        </div>
        <div class="det-cand-f">${cand.f}</div>
        <svg class="det-cand-svg" data-smi="${cand.smi || ""}"></svg>
        <button type="button" class="det-cand-elim-btn" data-det-elim="${cand.id}">${isElim ? "除外を解除" : "× 候補から除外"}</button>
      </div>
    `;
  });

  const selectedCandObj = curCase.candidates.find(c => c.id === det.selectedCandidate);
  const submitMsg = isSolved ? `✅ この事件は既に解決済みです（特定物質: ${curCase.candidates.find(c => c.id === curCase.answer)?.name}）` :
                    selectedCandObj ? `「<b>${selectedCandObj.name}</b>」として鑑定書を提出します` :
                    "候補から特定した化合物を選択してください";

  const hasCombustionDone = testsRun.includes("combust");
  const formulaLabel = isSolved || hasCombustionDone ?
    `<div class="det-sample-formula">${curCase.formula}</div><span style="font-size:10.5px;color:var(--ok)">✓ 元素分析完了</span>` :
    `<div class="det-sample-formula" style="color:var(--ink-3);letter-spacing:2px">？（未知）</div><span style="font-size:11px;color:var(--flame)">🔥「元素分析」で分子式を特定可能</span>`;

  let html = `
    <div class="det-topbar">
      <div class="det-status">
        <span class="det-rank-badge">🕵️ ${rank[1]}</span>
        <span style="font-size:13px;font-weight:700">解決事件：${solvedCount} / ${DETECTIVE_CASES.length}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${isSolved ? `<button type="button" class="btn" data-det-report="${curCase.id}" style="font-size:12px;padding:3px 10px">📖 事件解説調書を開く</button>` : ""}
        <button type="button" class="btn" data-back-craft style="font-size:12px;padding:3px 10px">← 工房に戻る</button>
      </div>
      <div class="det-cases-scroll">
        ${casePills}
      </div>
    </div>

    <div class="det-main-grid">
      <!-- Left: Sample Evidence & Reagents Lab -->
      <div class="det-card">
        <div class="det-card-head">
          <h3 class="det-card-title">🔍 ${curCase.title}</h3>
          <span class="chip ${isSolved ? "good" : "type"}">${curCase.diff}</span>
        </div>

        <div class="det-sample-row">
          <div class="det-bottle-wrap">
            <svg viewBox="0 0 70 80" class="det-bottle-svg">
              <rect x="22" y="4" width="26" height="12" fill="var(--ink-2)" rx="2"/>
              <rect x="28" y="16" width="14" height="6" fill="var(--ink-3)"/>
              <path d="M 12 28 C 12 22 24 22 28 22 L 42 22 C 46 22 58 22 58 28 L 58 72 C 58 76 54 78 50 78 L 20 78 C 16 78 12 76 12 72 Z" fill="#b45309" opacity="0.85"/>
              <rect x="18" y="34" width="34" height="34" fill="#fff" opacity="0.92" rx="3"/>
              <text x="35" y="49" font-size="12" text-anchor="middle" font-weight="bold" fill="#17232a">${curCase.sampleCode || "SAMPLE"}</text>
              <text x="35" y="61" font-size="7.5" text-anchor="middle" font-family="monospace" fill="#4b5b63">UNKNOWN</text>
            </svg>
          </div>
          <div class="det-sample-info">
            <span style="font-size:11px;font-weight:700;color:var(--ink-3)">証拠品ボトル（分子式）</span>
            ${formulaLabel}
            <div class="det-sample-meta">${curCase.physical}</div>
          </div>
        </div>

        <div class="det-story-quote">
          <b>依頼人（${curCase.who}）より：</b><br>
          ${curCase.story}
        </div>

        <div>
          <div class="det-reagents-head" style="margin-bottom:8px">
            <span>🧪 鑑識・反応試験（タップして試験管で反応を観察）</span>
          </div>
          <div class="det-reagents-grid">
            ${reagentGrid}
          </div>
        </div>

        <div class="det-chamber">
          <div style="font-size:12px;font-weight:700;color:var(--ink-2)">試験管 鑑識結果チャンバー</div>
          <div class="det-chamber-vis">
            ${visHtml}
          </div>
        </div>
      </div>

      <!-- Right: Deduction Board & Candidates -->
      <div class="det-card">
        <div class="det-card-head">
          <h3 class="det-card-title">📝 推理調書・構造異性体の特定</h3>
          <span style="font-size:12px;color:var(--ink-2)">候補：${curCase.candidates.length}種</span>
        </div>

        <div class="det-clues-box">
          <div class="det-clues-title">
            <span>これまでに判明した手がかり（${testsRun.length}件）</span>
          </div>
          <ul class="det-clues-list">
            ${cluesListHtml}
          </ul>
        </div>

        <div>
          <div class="det-cand-head" style="margin-bottom:8px">
            <span style="font-size:13px;font-weight:700;color:var(--ink)">構造異性体の候補</span>
            <span style="font-size:11.5px;color:var(--ink-3)">クリックで選択 / 除外トグル</span>
          </div>
          <div class="det-cand-grid">
            ${candidatesHtml}
          </div>
        </div>

        <div class="det-submit-bar">
          <button type="button" class="det-submit-btn" id="det-submit" style="${!selectedCandObj ? "opacity:0.65;background:var(--surface-2);color:var(--ink-2);border:1px solid var(--line-2);box-shadow:none" : ""}">
            <span>🔍</span>
            <span>この物質と特定して鑑定書を提出する</span>
          </button>
          <div class="det-submit-msg">${submitMsg}</div>
        </div>
      </div>
    </div>
  `;

  el.innerHTML = html;

  // Render SMILES molecular structures on candidate cards
  setTimeout(() => {
    el.querySelectorAll(".det-cand-svg").forEach(svg => {
      const smi = svg.dataset.smi;
      if (smi) {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim();
        drawMol(svg, smi, bg);
      }
    });
  }, 10);
}

function submitDetectiveDeduction() {
  const det = getDetState();
  const curCase = DETECTIVE_CASES[det.caseIdx];
  if (!curCase) return;

  if (!det.selectedCandidate) {
    SFX.click();
    toast("💡 <b>特定した物質を選択してください</b><br>右の「構造異性体の候補」から1つクリックして選んだ状態で提出してください。");
    return;
  }

  const cand = curCase.candidates.find(c => c.id === det.selectedCandidate);
  if (!cand) return;

  if (cand.id === curCase.answer) {
    // 正解！
    const wasAlreadySolved = !!det.solved[curCase.id];
    det.solved[curCase.id] = true;
    if (!wasAlreadySolved) {
      state.xp += 100;
      state.stars += 3;
    }
    const solvedCount = Object.keys(det.solved).length;
    const rank = getDetRank(solvedCount);

    save();
    SFX.lvl();
    renderAll();
    openCaseSolvedDialog(curCase, rank, !wasAlreadySolved);
  } else {
    // 不正解時の教育的フィードバック
    SFX.click();
    let hintReason = "";
    if (cand.cls === "カルボン酸" && curCase.tests.na && !curCase.tests.na.ok) {
      hintReason = "この物質はカルボン酸のため金属Naと反応して気体を発生するはずですが、実験では気体が発生していません。";
    } else if (cand.cls === "アルデヒド" && curCase.tests.tollens && !curCase.tests.tollens.ok) {
      hintReason = "この物質はホルミル基をもつため銀鏡反応を示すはずですが、実験では銀鏡が析出していません。";
    } else if (curCase.tests.sapon && curCase.tests.sapon.ok && cand.cls !== "エステル") {
      hintReason = "実験では加水分解（けん化）が進行していますが、この物質はエステル結合をもっていません。";
    } else if (curCase.tests.iodo && curCase.tests.iodo.ok) {
      hintReason = "実験ではヨードホルム反応が陽性でしたが、この物質の構造式を見直してみましょう。";
    } else if (curCase.tests.br2 && curCase.tests.br2.ok && cand.cls !== "アルケン" && cand.cls !== "アルキン") {
      hintReason = "実験では臭素水が脱色されていますが、この物質には不飽和二重結合がありません。";
    } else {
      hintReason = "実験で得られた手がかりと構造式をもう一度見比べてみましょう。";
    }
    toast(`⚠️ <b>惜しい！ 推理に矛盾があります</b><br>「${cand.name}」ではありません。<br><small>${hintReason}</small>`);
  }
}

function openCaseSolvedDialog(curCase, rank, isFirst) {
  const dlg = $("dlg");
  if (!dlg) return;
  let h = `
    <div class="det-report-box">
      <div class="det-report-header">
        <span class="det-report-stamp">🎉 CASE SOLVED!</span>
        <h3 style="margin:4px 0;font-size:18px">${curCase.title}</h3>
        <span class="badge" style="background:var(--ok-soft);color:var(--ok);border:1px solid var(--ok);font-size:12px">真犯人（特定物質）：${curCase.candidates.find(c => c.id === curCase.answer)?.name} （${curCase.formula}）</span>
        ${isFirst ? `<div style="font-size:13px;font-weight:700;color:var(--flame);margin-top:4px">+100 XP 獲得！ ★+3（ひらめき獲得）</div>` : ""}
        <div style="font-size:12px;color:var(--ink-2);margin-top:2px">現在の称号：<b>${rank[1]}</b>（${rank[2]}）</div>
      </div>
      <div class="det-report-logic">
        <b>🕵️ 鑑識・推理プロセスの全貌：</b>
        <p style="margin:4px 0 8px;font-size:13px;color:var(--ink)">${curCase.explanation.summary}</p>
        <ol>
          ${curCase.explanation.logic.map(step => `<li>${step}</li>`).join("")}
        </ol>
      </div>
      <div class="det-report-tip">
        <b>💡 大学入試・共通テスト対策のツボ：</b><br>
        ${curCase.explanation.examTip}
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px">
        <button type="button" class="btn primary" id="det-next-case">次の事件へ進む →</button>
        <button type="button" class="btn" id="dlg-x">閉じる</button>
      </div>
    </div>
  `;
  $("dlg-body").innerHTML = h;
  if (!dlg.open) {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }

  const nextBtn = $("det-next-case");
  if (nextBtn) {
    nextBtn.onclick = () => {
      if (dlg.close) dlg.close(); else dlg.removeAttribute("open");
      const det = getDetState();
      det.caseIdx = (det.caseIdx + 1) % DETECTIVE_CASES.length;
      det.selectedCandidate = null;
      det.activeTest = null;
      renderAll();
    };
  }
}

/* ---------- detail dialog ---------- */
function openDetail(id) {
  const s = S[id];
  const dlg = $("dlg");
  const made = RULES.filter(r => state.rx[r.id] && r.out.includes(id));
  const used = RULES.filter(r => state.rx[r.id] && r.in.includes(id));
  let h = `<div class="dlg-h"><div><h3>${s.n}</h3>${s.en ? `<div style="font-size:13px;color:var(--ink-2);font-family:var(--f-mono);margin-top:-2px">${s.en}</div>` : ""}<div class="fm" style="--cc:${cc(id)}">${s.f}</div></div><button type="button" class="btn" id="dlg-x">閉じる</button></div>`;
  h += `<div class="mol">${s.smi ? `<svg id="dlg-svg"></svg>` : `<div class="poly">${s.f}</div>`}</div>`;
  h += `<dl><dt>分類</dt><dd>${CLS[s.cls].label}（${CLS[s.cls].desc}）</dd>`;
  if (s.en) h += `<dt>英語名</dt><dd style="font-family:var(--f-mono)">${s.en}</dd>`;
  if (DEPTH[id]) h += `<dt>レア度</dt><dd class="rar">${starsStr(rarity(id))}（原料から${DEPTH[id]}段階）</dd>`;
  h += `<dt>解説</dt><dd>${s.note}</dd>`;
  if (s.use) h += `<dt>主な用途</dt><dd>${s.use}</dd>`;
  if (made.length) h += `<dt>つくり方</dt><dd><ul>${made.map(r => `<li>${r.eq}</li>`).join("")}</ul></dd>`;
  if (used.length) h += `<dt>使った反応</dt><dd><ul>${used.map(r => `<li>${r.eq}</li>`).join("")}</ul></dd>`;
  h += `</dl>`;
  $("dlg-body").innerHTML = h;
  if (s.smi) {
    const svg = $("dlg-svg");
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--surface-2").trim();
    if (!drawMol(svg, s.smi, bg)) svg.outerHTML = `<div class="poly">${s.f}</div>`;
  }
  $("dlg-x").onclick = () => dlg.close();
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
}

/* ---------- reaction type explainer dialog ---------- */
function openTypeExplain(typeKey) {
  const info = TYPE_INFO[typeKey];
  if (!info) return;
  const dlg = $("dlg");
  let h = `<div class="dlg-h"><div><h3>${info.name}</h3><span class="chip type">${typeKey}</span></div><button type="button" class="btn" id="dlg-x">閉じる</button></div>`;
  h += `<div style="margin:14px 0 8px;font-size:15px;font-weight:700;color:var(--accent);">${info.simple}</div>`;
  h += `<p style="font-size:14px;line-height:1.7;margin-bottom:12px;">${info.guide}</p>`;
  h += `<div style="background:var(--surface-2);border-radius:8px;padding:8px 12px;font-family:var(--f-mono);font-size:13px;"><b style="font-size:11px;color:var(--ink-3);display:block;margin-bottom:3px">代表的な反応式</b>${info.eg}</div>`;
  $("dlg-body").innerHTML = h;
  $("dlg-x").onclick = () => dlg.close();
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
}

/* ================= events ================= */
function showSide(which) {
  ui.side = which;
  renderSide();
  if (window.matchMedia("(max-width:979px)").matches) {
    const s = $("side");
    if (s.scrollIntoView) s.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setFromRule(r) {
  const lv = (state.easy ? 2 : (state.clue[r.id] || 0));
  const pos = curPos();
  const main = r.in.find(i => pos[i]) || r.in[0];
  const other = r.in.find(i => i !== main) || null;
  ui.a = main;
  ui.b = lv >= 1 ? other : null;
  ui.picking = lv >= 1 ? null : (other ? "b" : null);
  if (lv >= 2) {
    ui.light = !!r.light;
    ui.cat = r.cat ? r.cat[0] : "none";
    ui.temp = r.t ? Math.round((r.t[0] + r.t[1]) / 20) * 10 : 20;
  }
  ui.pred = "";
  ui.result = null;
  SFX.click();
  renderAll();
  showSide("bench");
}

document.addEventListener("click", e => {
  const t = e.target;
  const node = t.closest("[data-node]");
  if (node) {
    ui.sel = node.dataset.node;
    SFX.click();
    renderMap();
    showSide("look");
    return;
  }
  const sd = t.closest("[data-side]");
  if (sd) { showSide(sd.dataset.side); return; }

  const tb = t.closest("[data-tab]");
  if (tb) { ui.tab = tb.dataset.tab; renderTabs(); return; }

  const slot = t.closest(".slot");
  if (slot) {
    const k = slot.dataset.slot;
    ui.picking = ui.picking === k ? null : k;
    renderBench();
    return;
  }
  if (t.closest("[data-pick-close]")) { ui.picking = null; renderBench(); return; }

  const pk = t.closest("[data-pick]");
  if (pk) {
    const k = ui.picking;
    const id = pk.dataset.pick || null;
    ui[k] = id;
    if (k === "a" && ui.b === id) ui.b = null;
    if (k === "b" && ui.a === id) ui.b = null;
    ui.picking = (k === "a" && !ui.b) ? "b" : null;
    ui.result = null;
    $("err").textContent = "";
    SFX.click();
    renderBench();
    paintFlaskIdle();
    return;
  }

  const toA = t.closest("[data-toa]");
  if (toA) {
    ui.a = toA.dataset.toa;
    if (ui.b === ui.a) ui.b = null;
    ui.picking = ui.b ? null : "b";
    ui.result = null;
    SFX.click();
    renderAll();
    showSide("bench");
    return;
  }

  const clue = t.closest("[data-clue]");
  if (clue) {
    const id = clue.dataset.clue;
    if (!state.easy) {
      if (state.stars < 1) return;
      state.stars--;
    }
    state.clue[id] = (state.clue[id] || 0) + 1;
    save();
    SFX.star();
    renderHUD();
    renderMap();
    renderLook();
    return;
  }

  const set = t.closest("[data-set]");
  if (set) { setFromRule(RULE[set.dataset.set]); return; }

  const preBtn = t.closest("[data-temp]");
  if (preBtn) {
    updateTempUI(+preBtn.dataset.temp);
    SFX.click();
    return;
  }

  const op = t.closest("[data-open]");
  if (op) { openDetail(op.dataset.open); return; }

  const expl = t.closest("[data-explain-type]");
  if (expl) {
    openTypeExplain(expl.dataset.explainType);
    return;
  }

  if (t.id === "hint") {
    const quests = curQuests();
    const q = quests[curQIdx()];
    if (q) {
      state.hints[q.id] = (state.hints[q.id] || 0) + 1;
      save();
      renderQuest();
    }
    return;
  }

  if (t.id === "deliver") { deliver(); return; }

  if (t.id === "ch-tab-1" || t.id === "switch-to-ch1-menu") {
    switchChapter(1);
    const m = $("menu");
    if (m) m.open = false;
    return;
  }
  if (t.id === "ch-tab-2" || t.id === "goto-ch2" || t.id === "switch-to-ch2-menu") {
    switchChapter(2);
    const m = $("menu");
    if (m) m.open = false;
    return;
  }
  if (t.id === "ch-tab-det" || t.id === "switch-to-det-menu" || t.id === "goto-det-mode") {
    switchChapter("detective");
    const m = $("menu");
    if (m) m.open = false;
    return;
  }
  if (t.closest("[data-back-craft]")) {
    switchChapter(state.prevChapter || 1);
    return;
  }

  // Detective Mode Events
  const detCaseBtn = t.closest("[data-det-case]");
  if (detCaseBtn) {
    const det = getDetState();
    det.caseIdx = +detCaseBtn.dataset.detCase;
    det.selectedCandidate = null;
    det.activeTest = null;
    SFX.click();
    save();
    renderDetective();
    return;
  }

  const detCaseOpen = t.closest("[data-det-case-open]");
  if (detCaseOpen) {
    const det = getDetState();
    det.caseIdx = +detCaseOpen.dataset.detCaseOpen;
    det.selectedCandidate = null;
    det.activeTest = null;
    switchChapter("detective");
    return;
  }

  const detReagent = t.closest("[data-det-reagent]");
  if (detReagent) {
    const det = getDetState();
    const curCase = DETECTIVE_CASES[det.caseIdx] || DETECTIVE_CASES[0];
    const rk = detReagent.dataset.detReagent;
    det.activeTest = rk;
    if (!det.testsRun[curCase.id]) det.testsRun[curCase.id] = [];
    if (!det.testsRun[curCase.id].includes(rk)) det.testsRun[curCase.id].push(rk);

    // Candidates elimination: Player can also manually eliminate with button
    if (!det.eliminated[curCase.id]) det.eliminated[curCase.id] = [];
    const testResult = curCase.tests[rk];
    curCase.candidates.forEach(cand => {
      let contradict = false;
      if (rk === "na") {
        if (!testResult.ok && (cand.cls === "アルコール" || cand.cls === "カルボン酸")) contradict = true;
        if (testResult.ok && cand.cls === "エーテル") contradict = true;
      } else if (rk === "tollens") {
        if (!testResult.ok && (cand.cls === "アルデヒド" || cand.id === "formic_acid")) contradict = true;
        if (testResult.ok && cand.cls === "ケトン") contradict = true;
      } else if (rk === "sapon") {
        if (testResult.ok && cand.cls !== "エステル") contradict = true;
        if (!testResult.ok && cand.cls === "エステル") contradict = true;
      } else if (rk === "br2") {
        if (testResult.ok && cand.cls !== "アルケン" && cand.cls !== "アルキン") contradict = true;
        if (!testResult.ok && (cand.cls === "アルケン" || cand.cls === "アルキン")) contradict = true;
      } else if (rk === "iodo") {
        if (!testResult.ok && cand.id === "acetone") contradict = true;
      }
      if (contradict && !det.eliminated[curCase.id].includes(cand.id)) {
        det.eliminated[curCase.id].push(cand.id);
      }
    });

    SFX.lvl();
    save();
    renderDetective();
    return;
  }

  const detElim = t.closest("[data-det-elim]");
  if (detElim) {
    const det = getDetState();
    const curCase = DETECTIVE_CASES[det.caseIdx] || DETECTIVE_CASES[0];
    const elId = detElim.dataset.detElim;
    if (!det.eliminated[curCase.id]) det.eliminated[curCase.id] = [];
    const idx = det.eliminated[curCase.id].indexOf(elId);
    if (idx >= 0) det.eliminated[curCase.id].splice(idx, 1);
    else det.eliminated[curCase.id].push(elId);
    SFX.click();
    save();
    renderDetective();
    return;
  }

  const detCand = t.closest("[data-det-cand]");
  if (detCand) {
    const det = getDetState();
    const cid = detCand.dataset.detCand;
    // Allow clicking/selecting even if eliminated (un-eliminates or allows selection)
    det.selectedCandidate = (det.selectedCandidate === cid) ? null : cid;
    SFX.click();
    renderDetective();
    return;
  }

  const detSubmitBtn = t.closest("#det-submit");
  if (detSubmitBtn) {
    submitDetectiveDeduction();
    return;
  }

  const detReport = t.closest("[data-det-report]");
  if (detReport) {
    const cId = detReport.dataset.detReport;
    const cObj = DETECTIVE_CASES.find(c => c.id === cId);
    if (cObj) {
      const det = getDetState();
      const rank = getDetRank(Object.keys(det.solved || {}).length);
      openCaseSolvedDialog(cObj, rank, false);
    }
    return;
  }

  // Tutorial event handlers
  if (t.id === "tut-step1-next") {
    state.tutStep = 2;
    save();
    renderTutorial();
    SFX.click();
    return;
  }
  if (t.id === "tut-step2-set") {
    ui.b = "cl2";
    state.tutStep = 3;
    save();
    renderBench();
    renderTutorial();
    paintFlaskIdle();
    SFX.click();
    return;
  }
  if (t.id === "tut-step3-light") {
    ui.light = true;
    state.tutStep = 4;
    save();
    renderBench();
    renderTutorial();
    SFX.click();
    return;
  }
  if (t.id === "tut-step4-react") {
    react();
    return;
  }
  if (t.id === "tut-skip") {
    state.intro = false;
    save();
    renderTutorial();
    toast("チュートリアルを終了しました");
    return;
  }
  if (t.id === "start-tut") {
    state.intro = true;
    state.tutStep = 1;
    ui.a = "methane";
    ui.b = null;
    ui.light = false;
    ui.temp = 20;
    ui.cat = "none";
    ui.pred = "";
    showSide("bench");
    save();
    renderAll();
    const menu = $("menu");
    if (menu) menu.open = false;
    toast("チュートリアルを開始しました");
    return;
  }

  const menu = $("menu");
  if (menu && menu.open && !t.closest("#menu")) menu.open = false;
});

document.addEventListener("keydown", e => {
  const node = e.target.closest && e.target.closest("[data-node]");
  if (node && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    ui.sel = node.dataset.node;
    renderMap();
    showSide("look");
  }
});

export function initCraftApp() {
  load();

  $("go").addEventListener("click", () => { ui.picking = null; react(); });
  const tempSlider = $("temp");
  if (tempSlider) {
    tempSlider.addEventListener("input", e => {
      updateTempUI(+e.target.value);
    });
  }

  const tempDown = $("temp-down");
  if (tempDown) {
    tempDown.addEventListener("click", () => {
      updateTempUI(ui.temp - 10);
      SFX.click();
    });
  }

  const tempUp = $("temp-up");
  if (tempUp) {
    tempUp.addEventListener("click", () => {
      updateTempUI(ui.temp + 10);
      SFX.click();
    });
  }
  $("light").addEventListener("click", () => {
    ui.light = !ui.light;
    SFX.click();
    $("light").setAttribute("aria-pressed", ui.light);
    $("light-t").textContent = ui.light ? "当てる" : "当てない";
    $("flask").classList.toggle("uvon", ui.light);
  });
  $("cat").addEventListener("change", e => { ui.cat = e.target.value; });
  $("pred").addEventListener("change", e => { ui.pred = e.target.value; });

  $("mute").addEventListener("click", () => {
    state.mute = !state.mute;
    save();
    renderHUD();
    if (!state.mute) SFX.click();
  });

  const toggleEasy = $("toggle-easy");
  if (toggleEasy) {
    toggleEasy.addEventListener("click", () => {
      state.easy = !state.easy;
      save();
      renderHUD();
      renderSide();
      renderMap();
      SFX.click();
      toast(state.easy ? "学習サポート（やさしいモード）を<b>ON</b>にしました" : "学習サポートを<b>OFF</b>にしました（自習マスターモード）");
    });
  }

  const toggleEn = $("toggle-en");
  if (toggleEn) {
    toggleEn.addEventListener("click", () => {
      state.showEn = !state.showEn;
      save();
      renderHUD();
      renderSide();
      renderTabs();
      SFX.click();
      toast(state.showEn ? "物質の英語名表示を<b>ON</b>にしました" : "物質の英語名表示を<b>OFF</b>にしました");
    });
  }

  const cycleMapMode = () => {
    const modes = ["both", "formula", "name"];
    const curIdx = modes.indexOf(state.mapMode || "both");
    state.mapMode = modes[(curIdx + 1) % modes.length];
    save();
    renderHUD();
    renderMap();
    SFX.click();
    const modeNames = { both: "「名称＋化学式」", formula: "「化学式のみ」", name: "「名称のみ」" };
    toast(`マップ表示を <b>${modeNames[state.mapMode]}</b> に切り替えました`);
  };

  const toggleMapModeBtn = $("toggle-map-mode");
  if (toggleMapModeBtn) {
    toggleMapModeBtn.addEventListener("click", cycleMapMode);
  }
  const toggleMapModeMenuBtn = $("toggle-map-mode-menu");
  if (toggleMapModeMenuBtn) {
    toggleMapModeMenuBtn.addEventListener("click", cycleMapMode);
  }

  const explainTermBtn = $("explain-terms-btn");
  if (explainTermBtn) {
    explainTermBtn.addEventListener("click", () => {
      openTypeExplain(ui.pred || "置換");
    });
  }

  let resetArmed = false, resetT = null;
  $("reset").addEventListener("click", e => {
    if (!resetArmed) {
      resetArmed = true;
      e.target.textContent = "本当に消す？もう一度押す";
      resetT = setTimeout(() => { resetArmed = false; e.target.textContent = "最初からやり直す"; }, 4000);
      return;
    }
    clearTimeout(resetT);
    resetArmed = false;
    e.target.textContent = "最初からやり直す";
    $("menu").open = false;
    state = fresh();
    ui = freshUI();
    vb = null;
    try { localStorage.removeItem(KEY); } catch (err) {}
    renderAll();
    toast("セーブデータを初期化しました");
  });

  renderAll();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCraftApp);
  } else {
    initCraftApp();
  }
}
