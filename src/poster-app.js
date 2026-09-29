/**
 * オリジナル有機反応大系統図（Organic Reaction Master Chart）
 * ポスタープレビュー＆PDFエクスポートエンジン
 * 高等学校学習指導要領（化学・有機化合物）完全準拠
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { S, RULES, DEX1, DEX2, DEX3, DEX4, ACH, RANKS } from './craft-data.js';

let currentOptions = {
  mode: 'player', // 'player': 自分の研究記録, 'complete': 受験対策・完全制覇版
  format: 'a4',   // 'a4' or 'a3'
  showCondition: true // 反応条件（温度・触媒）を表示
};

export function openPosterModal(state) {
  const dlg = document.getElementById('poster-dlg');
  if (!dlg) return;

  renderPosterDialog(state, dlg);
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
}

export function renderPosterDialog(state, dlg) {
  const rankIdx = getPlayerRankIdx(state.xp || 0);
  const rankTitle = RANKS[rankIdx] ? RANKS[rankIdx][1] : "研究者";

  const totalD = DEX1.length + DEX2.length + DEX3.length + DEX4.length;
  const foundD = DEX1.filter(i => state.found[i]).length +
                 DEX2.filter(i => state.found[i]).length +
                 DEX3.filter(i => state.found[i]).length +
                 DEX4.filter(i => state.found[i]).length;
  const pctD = Math.round((foundD / totalD) * 100);

  const totalRx = RULES.length;
  const foundRx = RULES.filter(r => state.rx[r.id]).length;
  const pctRx = Math.round((foundRx / totalRx) * 100);

  const todayStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const isComplete = currentOptions.mode === 'complete';

  dlg.innerHTML = `
    <div class="poster-modal-wrapper">
      <!-- ツールバー -->
      <div class="poster-toolbar">
        <div class="poster-toolbar-title">
          <span style="font-size:20px">📜</span>
          <div>
            <b>オリジナル有機反応大系統図</b>
            <span style="font-size:12px;color:var(--ink-2);margin-left:8px">学習指導要領 準拠・高校有機化学 全体系</span>
          </div>
        </div>

        <div class="poster-toolbar-controls">
          <div class="poster-btn-group">
            <button type="button" class="btn ${!isComplete ? 'hot' : 'ghost'}" id="poster-mode-player" style="font-size:12px;padding:3px 10px">
              👤 自分の研究記録 (${pctD}%発見)
            </button>
            <button type="button" class="btn ${isComplete ? 'hot' : 'ghost'}" id="poster-mode-complete" style="font-size:12px;padding:3px 10px">
              🎓 入試対策・全載せ完全版
            </button>
          </div>

          <div class="poster-btn-group">
            <button type="button" class="btn ${currentOptions.format === 'a4' ? 'primary' : 'ghost'}" id="poster-fmt-a4" style="font-size:12px;padding:3px 8px">
              A4 横
            </button>
            <button type="button" class="btn ${currentOptions.format === 'a3' ? 'primary' : 'ghost'}" id="poster-fmt-a3" style="font-size:12px;padding:3px 8px">
              A3 ポスター
            </button>
          </div>

          <div style="display:flex;gap:6px;align-items:center">
            <button type="button" class="btn hot" id="poster-export-pdf-btn" style="font-size:13px;padding:5px 14px;font-weight:700">
              📥 PDF保存
            </button>
            <button type="button" class="btn" id="poster-print-btn" style="font-size:13px;padding:5px 12px">
              🖨️ 印刷
            </button>
            <button type="button" class="btn ghost" id="poster-close-btn" style="font-size:15px;padding:4px 10px">
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- プレビューエリア（スクロール可能） -->
      <div class="poster-preview-scroll">
        <div id="poster-canvas" class="poster-sheet ${currentOptions.format === 'a3' ? 'size-a3' : 'size-a4'}">
          <!-- ポスターヘッダー -->
          <div class="poster-hdr">
            <div class="poster-hdr-left">
              <span class="poster-tag">文部科学省 学習指導要領「化学」準拠・研究系統樹</span>
              <h1 class="poster-main-title">有機化合物 反応大系統図</h1>
              <div class="poster-sub-title">Organic Chemical Reaction Master Chart & Synthesis Network</div>
            </div>
            <div class="poster-hdr-user">
              <div class="poster-badge-row">
                <span class="poster-seal-badge">${isComplete ? '★ 模範完全版' : '★ 認定学習証書'}</span>
                <span class="poster-rank-text">称号：<b>${rankTitle}</b></span>
              </div>
              <div class="poster-meta-grid">
                <div>物質発見：<b>${foundD}/${totalD}種 (${pctD}%)</b></div>
                <div>反応習得：<b>${foundRx}/${totalRx}種 (${pctRx}%)</b></div>
                <div>獲得XP：<b>${state.xp || 0} XP</b></div>
                <div>発行日：<b>${todayStr}</b></div>
              </div>
            </div>
          </div>

          <!-- 4大体系グリッド -->
          <div class="poster-grid-4">
            <!-- 1. 脂肪族炭化水素 -->
            <div class="poster-sec sec-ch1">
              <div class="poster-sec-hdr">
                <span class="sec-num">第1編</span>
                <span class="sec-title">脂肪族炭化水素（アルカン・アルケン・アルキン）</span>
              </div>
              <div class="poster-sec-body">
                ${renderChapter1Content(state, isComplete)}
              </div>
            </div>

            <!-- 2. 酸素官能基 -->
            <div class="poster-sec sec-ch2">
              <div class="poster-sec-hdr">
                <span class="sec-num">第2編</span>
                <span class="sec-title">酸素官能基（アルコール・アルデヒド・ケトン・エステル）</span>
              </div>
              <div class="poster-sec-body">
                ${renderChapter2Content(state, isComplete)}
              </div>
            </div>

            <!-- 3. 芳香族化合物 -->
            <div class="poster-sec sec-ch3">
              <div class="poster-sec-hdr">
                <span class="sec-num">第3編</span>
                <span class="sec-title">芳香族化合物（置換反応・フェノール・アゾ染料・医薬品）</span>
              </div>
              <div class="poster-sec-body">
                ${renderChapter3Content(state, isComplete)}
              </div>
            </div>

            <!-- 4. 高分子化合物 -->
            <div class="poster-sec sec-ch4">
              <div class="poster-sec-hdr">
                <span class="sec-num">第4編</span>
                <span class="sec-title">高分子化合物・生体分子（合成繊維・ゴム・糖・タンパク質）</span>
              </div>
              <div class="poster-sec-body">
                ${renderChapter4Content(state, isComplete)}
              </div>
            </div>
          </div>

          <!-- フッター：重要入試理論＆特異反応まとめ -->
          <div class="poster-ftr">
            <div class="poster-ftr-box">
              <b style="color:#b45309">⚖️ 酸性度の強弱序列と遊離則</b>
              <span>スルホン酸 R−SO₃H ＞ カルボン酸 R−COOH ＞ 炭酸 H₂CO₃ ＞ フェノール類 Ar−OH（弱酸の塩＋強酸 → 弱酸遊離）</span>
            </div>
            <div class="poster-ftr-box">
              <b style="color:#0369a1">🧪 特異的鑑識・検出反応の極意</b>
              <span><b>金属Na</b>：H₂発生（-OH）｜<b>銀鏡・フェーリング</b>：Ag析出/赤沈（-CHO還元性）｜<b>ヨードホルム</b>：黄色沈殿 CHI₃（CH₃CO- / CH₃CH(OH)-）｜<b>FeCl₃</b>：赤紫〜紫色（フェノール類）｜<b>ヨウ素</b>：深青紫（デンプン）</span>
            </div>
            <div class="poster-ftr-sign">
              <span>有機クラフト工房 研究総監府 印</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  const closeBtn = dlg.querySelector('#poster-close-btn');
  if (closeBtn) closeBtn.onclick = () => dlg.close();

  const btnPlayer = dlg.querySelector('#poster-mode-player');
  if (btnPlayer) {
    btnPlayer.onclick = () => {
      currentOptions.mode = 'player';
      renderPosterDialog(state, dlg);
    };
  }

  const btnComplete = dlg.querySelector('#poster-mode-complete');
  if (btnComplete) {
    btnComplete.onclick = () => {
      currentOptions.mode = 'complete';
      renderPosterDialog(state, dlg);
    };
  }

  const btnA4 = dlg.querySelector('#poster-fmt-a4');
  if (btnA4) {
    btnA4.onclick = () => {
      currentOptions.format = 'a4';
      renderPosterDialog(state, dlg);
    };
  }

  const btnA3 = dlg.querySelector('#poster-fmt-a3');
  if (btnA3) {
    btnA3.onclick = () => {
      currentOptions.format = 'a3';
      renderPosterDialog(state, dlg);
    };
  }

  const printBtn = dlg.querySelector('#poster-print-btn');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }

  const pdfBtn = dlg.querySelector('#poster-export-pdf-btn');
  if (pdfBtn) {
    pdfBtn.onclick = async () => {
      const canvasEl = dlg.querySelector('#poster-canvas');
      if (!canvasEl) return;
      pdfBtn.disabled = true;
      pdfBtn.textContent = '⏳ PDF生成中...';

      try {
        await exportPosterPdf(canvasEl, currentOptions.format);
      } catch (err) {
        console.error('PDF export error:', err);
        alert('PDF生成中にエラーが発生しました。印刷ボタンから「PDFに保存」もお試しください。');
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.textContent = '📥 PDF保存';
      }
    };
  }
}

async function exportPosterPdf(element, format = 'a4') {
  // Capture DOM to canvas with high pixel ratio for print sharpness
  // The sheet lives inside a scrollable dialog; capture its full height,
  // not just the part currently visible in the preview.
  const fullWidth = element.scrollWidth;
  const fullHeight = element.scrollHeight;
  const canvas = await html2canvas(element, {
    scale: 2.2,
    useCORS: true,
    backgroundColor: '#ffffff',
    width: fullWidth,
    height: fullHeight,
    windowWidth: Math.max(document.documentElement.clientWidth, fullWidth),
    windowHeight: fullHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: doc => {
      const sheet = doc.getElementById(element.id);
      for (let el = sheet && sheet.parentElement; el && el !== doc.body; el = el.parentElement) {
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      }
    }
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.96);
  const isA3 = format === 'a3';
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: isA3 ? 'a3' : 'a4'
  });

  const pageWidth = isA3 ? 420 : 297;
  const pageHeight = isA3 ? 297 : 210;

  // Fit the whole sheet on the page without distorting its aspect ratio.
  const fit = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const w = canvas.width * fit;
  const h = canvas.height * fit;
  pdf.addImage(imgData, 'JPEG', (pageWidth - w) / 2, (pageHeight - h) / 2, w, h);
  const dateStr = new Date().toISOString().slice(0, 10);
  pdf.save(`有機化学_反応大系統図_${dateStr}.pdf`);
}

function getPlayerRankIdx(xp) {
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (xp >= r[0]) idx = i;
  });
  return idx;
}

function subBadge(state, id, isComplete) {
  const isFound = isComplete || !!state.found[id];
  const s = S[id] || { n: id, f: id };
  if (!isFound) {
    return `<span class="p-sub unk">？？？<small>未発見</small></span>`;
  }
  return `
    <span class="p-sub found">
      <b class="p-sub-f">${s.f}</b>
      <span class="p-sub-n">${s.n}</span>
    </span>
  `;
}

function rxArrow(state, ruleId, cond, isComplete) {
  const isKnown = isComplete || !!state.rx[ruleId];
  return `
    <div class="p-arrow ${isKnown ? 'known' : 'unk'}">
      <span class="p-arrow-cond">${cond}</span>
      <span class="p-arrow-line">→</span>
    </div>
  `;
}

/* ================= 4大編のコンテンツ生成 ================= */
function renderChapter1Content(state, isComplete) {
  return `
    <div class="p-flow-group">
      <div class="p-flow-title">① メタンの光置換反応系列（アルカンの置換）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'methane', isComplete)}
        ${rxArrow(state, 'cl1', '+Cl₂ (光hν)', isComplete)}
        ${subBadge(state, 'ch3cl', isComplete)}
        ${rxArrow(state, 'cl2', '+Cl₂ (光)', isComplete)}
        ${subBadge(state, 'ch2cl2', isComplete)}
        ${rxArrow(state, 'cl3', '+Cl₂ (光)', isComplete)}
        ${subBadge(state, 'chcl3', isComplete)}
        ${rxArrow(state, 'cl4', '+Cl₂ (光)', isComplete)}
        ${subBadge(state, 'ccl4', isComplete)}
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">② アセチレンの発生と不飽和結合の付加・重合</div>
      <div class="p-flow-row">
        ${subBadge(state, 'cac2', isComplete)}
        ${rxArrow(state, 'carb', '+H₂O (注水)', isComplete)}
        ${subBadge(state, 'acetylene', isComplete)}
        ${rxArrow(state, 'hAc', '+H₂ (Ni触媒)', isComplete)}
        ${subBadge(state, 'ethylene', isComplete)}
        ${rxArrow(state, 'hEt', '+H₂ (Ni触媒)', isComplete)}
        ${subBadge(state, 'ethane', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        <span style="font-size:11px;color:#64748b">└ アセチレン環化:</span>
        ${subBadge(state, 'acetylene', isComplete)}
        ${rxArrow(state, 'bz', '3分子 重合 (赤熱Fe, 400℃)', isComplete)}
        ${subBadge(state, 'benzene', isComplete)}
        <span style="font-size:11px;color:#64748b;margin-left:8px">（第3編 芳香族へ接続）</span>
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">③ エチレン・プロペンと付加重合高分子（石油化学の基礎）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'ethylene', isComplete)}
        ${rxArrow(state, 'pe', '付加重合 (触媒)', isComplete)}
        ${subBadge(state, 'polyethylene', isComplete)}
        <span style="width:12px"></span>
        ${subBadge(state, 'propene', isComplete)}
        ${rxArrow(state, 'pp', '付加重合 (触媒)', isComplete)}
        ${subBadge(state, 'pp', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        <span style="font-size:11px;color:#64748b">└ 臭素水脱色:</span>
        ${subBadge(state, 'ethylene', isComplete)}
        ${rxArrow(state, 'brEt', '+Br₂ (赤褐色脱色)', isComplete)}
        ${subBadge(state, 'dibromoethane', isComplete)}
      </div>
    </div>
  `;
}

function renderChapter2Content(state, isComplete) {
  return `
    <div class="p-flow-group">
      <div class="p-flow-title">① アルコールの段階的酸化系列（第1級・第2級）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'methanol', isComplete)}
        ${rxArrow(state, 'ox_me1', '+[O] (温水浴/Cu)', isComplete)}
        ${subBadge(state, 'formaldehyde', isComplete)}
        ${rxArrow(state, 'ox_me2', '+[O] (KMnO₄)', isComplete)}
        ${subBadge(state, 'formic_acid', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'ethanol', isComplete)}
        ${rxArrow(state, 'ox_et1', '+[O] (脱水素)', isComplete)}
        ${subBadge(state, 'acetaldehyde', isComplete)}
        ${rxArrow(state, 'ox_et2', '+[O] (KMnO₄)', isComplete)}
        ${subBadge(state, 'acetic_acid', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'isopropanol', isComplete)}
        ${rxArrow(state, 'ox_pr', '+[O] (第2級酸化)', isComplete)}
        ${subBadge(state, 'acetone', isComplete)}
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">② エタノールの温度による分子内・分子間脱水</div>
      <div class="p-flow-row">
        ${subBadge(state, 'ethanol', isComplete)}
        ${rxArrow(state, 'dhEther', '130〜140℃ (濃H₂SO₄)', isComplete)}
        ${subBadge(state, 'ether', isComplete)}
        <span style="font-size:11px;color:#64748b;margin-left:6px">（ジエチルエーテル・分子間脱水）</span>
      </div>
      <div class="p-flow-row" style="margin-top:3px">
        ${subBadge(state, 'ethanol', isComplete)}
        ${rxArrow(state, 'dhEt', '160〜170℃ (濃H₂SO₄)', isComplete)}
        ${subBadge(state, 'ethylene', isComplete)}
        <span style="font-size:11px;color:#64748b;margin-left:6px">（エチレン・分子内脱水）</span>
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">③ エステル化とけん化（不可逆加水分解）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'acetic_acid', isComplete)}
        <span style="font-size:12px;margin:0 2px">＋</span>
        ${subBadge(state, 'ethanol', isComplete)}
        ${rxArrow(state, 'ester_et', '濃H₂SO₄ (温水浴) ⇄', isComplete)}
        ${subBadge(state, 'ethyl_acetate', isComplete)}
        ${rxArrow(state, 'sapon_et', '+NaOH (けん化)', isComplete)}
        ${subBadge(state, 'sodium_acetate', isComplete)}
      </div>
    </div>
  `;
}

function renderChapter3Content(state, isComplete) {
  return `
    <div class="p-flow-group">
      <div class="p-flow-title">① ベンゼン環の親電子置換反応＆トルエン側鎖酸化</div>
      <div class="p-flow-row">
        ${subBadge(state, 'benzene', isComplete)}
        ${rxArrow(state, 'nitro_bz', '+HNO₃/H₂SO₄ (混酸 50〜60℃)', isComplete)}
        ${subBadge(state, 'nitrobenzene', isComplete)}
        <span style="width:10px"></span>
        ${subBadge(state, 'toluene', isComplete)}
        ${rxArrow(state, 'ox_tol', '+[O] (KMnO₄側鎖酸化)', isComplete)}
        ${subBadge(state, 'benzoic_acid', isComplete)}
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">② アニリン・ジアゾ化・アゾカップリング（合成染料ルート）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'nitrobenzene', isComplete)}
        ${rxArrow(state, 'red_ani', 'Sn + HCl 還元', isComplete)}
        ${subBadge(state, 'aniline', isComplete)}
        ${rxArrow(state, 'acet_ani', '+(CH₃CO)₂O', isComplete)}
        ${subBadge(state, 'acetanilide', isComplete)}
        <span style="font-size:10.5px;color:#64748b">（解熱薬）</span>
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'aniline', isComplete)}
        ${rxArrow(state, 'diazo', 'NaNO₂+HCl (0〜5℃ 氷冷)', isComplete)}
        ${subBadge(state, 'diazonium', isComplete)}
        ${rxArrow(state, 'coupling', '+フェノール (カップリング)', isComplete)}
        ${subBadge(state, 'azo_dye', isComplete)}
        <span style="font-size:10.5px;color:#c2410c">（橙赤色染料）</span>
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">③ フェノール・サリチル酸・医薬品合成ルート</div>
      <div class="p-flow-row">
        ${subBadge(state, 'chlorobenzene', isComplete)}
        ${rxArrow(state, 'dow_phenol', '+NaOH (ダウ法 300℃)', isComplete)}
        ${subBadge(state, 'phenol', isComplete)}
        ${rxArrow(state, 'kolbe', '+CO₂ (コルベ・シュミット 140℃)', isComplete)}
        ${subBadge(state, 'salicylic_acid', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'salicylic_acid', isComplete)}
        ${rxArrow(state, 'synth_aspirin', '+(CH₃CO)₂O (アセチル化)', isComplete)}
        ${subBadge(state, 'aspirin', isComplete)}
        <span style="font-size:10.5px;color:#047857;margin-right:12px">（アスピリン・解熱鎮痛）</span>
        ${subBadge(state, 'salicylic_acid', isComplete)}
        ${rxArrow(state, 'synth_salicylate', '+CH₃OH (濃H₂SO₄)', isComplete)}
        ${subBadge(state, 'methyl_salicylate', isComplete)}
        <span style="font-size:10.5px;color:#0369a1">（サリチル酸メチル・湿布薬）</span>
      </div>
    </div>
  `;
}

function renderChapter4Content(state, isComplete) {
  return `
    <div class="p-flow-group">
      <div class="p-flow-title">① 合成繊維・重縮合（ナイロン66・PET・ビニロン）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'adipic_acid', isComplete)}
        <span style="font-size:11px;margin:0 2px">＋</span>
        ${subBadge(state, 'hda', isComplete)}
        ${rxArrow(state, 'nylon66_rx', '脱水縮合重合 (-CO-NH-)', isComplete)}
        ${subBadge(state, 'nylon66', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'terephthalic_acid', isComplete)}
        <span style="font-size:11px;margin:0 2px">＋</span>
        ${subBadge(state, 'ethylene_glycol', isComplete)}
        ${rxArrow(state, 'pet_rx', 'エステル重縮合 (140〜170℃)', isComplete)}
        ${subBadge(state, 'pet', isComplete)}
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'vinyl_acetate', isComplete)}
        ${rxArrow(state, 'poly_vAc', '重合触媒', isComplete)}
        ${subBadge(state, 'pvac', isComplete)}
        ${rxArrow(state, 'sapon_vAc', '+NaOH (けん化)', isComplete)}
        ${subBadge(state, 'pva', isComplete)}
        ${rxArrow(state, 'vinylon_rx', '+HCHO (アセタール化)', isComplete)}
        ${subBadge(state, 'vinylon', isComplete)}
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">② 合成樹脂＆ジエン系加硫ゴム（硫黄架橋）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'styrene', isComplete)}
        ${rxArrow(state, 'poly_styrene', '付加重合', isComplete)}
        ${subBadge(state, 'polystyrene', isComplete)}
        <span style="width:12px"></span>
        ${subBadge(state, 'isoprene', isComplete)}
        ${rxArrow(state, 'poly_isoprene', 'シス付加重合', isComplete)}
        ${subBadge(state, 'natural_rubber', isComplete)}
        ${rxArrow(state, 'vulcanize', '+S (加硫 140℃ -S-S-)', isComplete)}
        ${subBadge(state, 'vulcanized_rubber', isComplete)}
      </div>
    </div>

    <div class="p-flow-group">
      <div class="p-flow-title">③ 天然糖類・アミノ酸・タンパク質（生命高分子）</div>
      <div class="p-flow-row">
        ${subBadge(state, 'glucose', isComplete)}
        ${rxArrow(state, 'maltose_rx', '脱水縮合 (二糖)', isComplete)}
        ${subBadge(state, 'maltose', isComplete)}
        ${rxArrow(state, 'starch_rx', '縮合重合 (多糖)', isComplete)}
        ${subBadge(state, 'starch', isComplete)}
        <span style="font-size:10.5px;color:#1d4ed8">（ヨウ素デンプン 青紫）</span>
      </div>
      <div class="p-flow-row" style="margin-top:4px">
        ${subBadge(state, 'glycine', isComplete)}
        <span style="font-size:11px;margin:0 2px">＋</span>
        ${subBadge(state, 'alanine', isComplete)}
        ${rxArrow(state, 'peptide_rx', 'ペプチド結合 (-CO-NH-)', isComplete)}
        ${subBadge(state, 'gly_ala', isComplete)}
        ${rxArrow(state, 'protein_rx', 'ポリペプチド重縮合', isComplete)}
        ${subBadge(state, 'protein', isComplete)}
      </div>
    </div>
  `;
}
