/**
 * 芳香族化合物の系統分離シミュレーター - データ定義
 * 高等学校学習指導要領「化学（有機化合物の性質・芳香族化合物の分離）」準拠
 */

export const SEP_SUBSTANCES = {
  benzoic_acid: {
    id: "benzoic_acid",
    n: "安息香酸",
    en: "Benzoic acid",
    f: "C₆H₅COOH",
    type: "carboxyl",
    typeLabel: "カルボン酸（酸性）",
    pKa: 4.2,
    color: "#047857",
    etherSoluble: true,
    waterSoluble: false,
    saltForm: {
      id: "sodium_benzoate",
      n: "安息香酸ナトリウム",
      f: "C₆H₅COONa",
      waterSoluble: true,
      etherSoluble: false,
      desc: "安息香酸が中和されて生じた水溶性の塩。水層に溶け込む。"
    },
    precipitate: {
      form: "白色針状結晶",
      reagent: "hcl",
      desc: "塩酸（強酸）を加えると、弱酸の遊離により安息香酸が白色沈殿として析出する。"
    }
  },
  phenol: {
    id: "phenol",
    n: "フェノール",
    en: "Phenol",
    f: "C₆H₅OH",
    type: "phenol",
    typeLabel: "フェノール類（極めて弱い酸性）",
    pKa: 10.0,
    color: "#0E7490",
    etherSoluble: true,
    waterSoluble: false, // エーテル層に優先して分配
    saltForm: {
      id: "sodium_phenoxide",
      n: "ナトリウムフェノキシド",
      f: "C₆H₅ONa",
      waterSoluble: true,
      etherSoluble: false,
      desc: "フェノールが強塩基NaOHで中和されて生じた水溶性の塩。"
    },
    precipitate: {
      form: "白濁・油状滴",
      reagent: "co2",
      altReagent: "hcl",
      desc: "炭酸ガスCO₂を吹き込むと、炭酸より弱い酸であるフェノールが遊離して白濁・油状滴として分離する。"
    }
  },
  aniline: {
    id: "aniline",
    n: "アニリン",
    en: "Aniline",
    f: "C₆H₅NH₂",
    type: "amine",
    typeLabel: "芳香族アミン（塩基性）",
    pKa: 4.6,
    color: "#7E22CE",
    etherSoluble: true,
    waterSoluble: false,
    saltForm: {
      id: "aniline_hydrochloride",
      n: "アニリン塩酸塩",
      f: "C₆H₅NH₃⁺Cl⁻",
      waterSoluble: true,
      etherSoluble: false,
      desc: "アニリンが塩酸で中和されて生じた水溶性のイオン結晶。"
    },
    precipitate: {
      form: "特異臭の赤褐色〜淡黄色油状滴",
      reagent: "naoh",
      desc: "NaOH（強塩基）を加えると、弱塩基の遊離によりアニリンが油状滴として遊離する。"
    }
  },
  nitrobenzene: {
    id: "nitrobenzene",
    n: "ニトロベンゼン",
    en: "Nitrobenzene",
    f: "C₆H₅NO₂",
    type: "neutral",
    typeLabel: "中性化合物（酸とも塩基とも不反応）",
    color: "#B45309",
    etherSoluble: true,
    waterSoluble: false,
    precipitate: {
      form: "苦扁桃油のにおいをもつ淡黄色油状液体",
      reagent: "evaporate",
      desc: "酸・塩基のいずれとも塩を作らず、エーテル層に残る。エーテルを加熱留去すると純品が得られる。"
    }
  },
  toluene: {
    id: "toluene",
    n: "トルエン",
    en: "Toluene",
    f: "C₆H₅CH₃",
    type: "neutral",
    typeLabel: "中性炭化水素",
    color: "#4B5B63",
    etherSoluble: true,
    waterSoluble: false,
    precipitate: {
      form: "無色揮発性液体",
      reagent: "evaporate",
      desc: "中性炭化水素のためエーテル層に残る。"
    }
  },
  salicylic_acid: {
    id: "salicylic_acid",
    n: "サリチル酸",
    en: "Salicylic acid",
    f: "C₆H₄(OH)COOH",
    type: "carboxyl_phenol",
    typeLabel: "ヒドロキシ酸（カルボキシ基＋フェノール性水酸基）",
    pKa: 3.0,
    color: "#047857",
    etherSoluble: true,
    waterSoluble: false,
    saltForm: {
      id: "sodium_salicylate",
      n: "サリチル酸ナトリウム",
      f: "C₆H₄(OH)COONa",
      waterSoluble: true,
      etherSoluble: false,
      desc: "NaHCO₃でカルボキシ基のみが選択的に中和されて生じる水溶性塩。"
    },
    precipitate: {
      form: "白色結晶（FeCl₃で赤紫色呈色）",
      reagent: "hcl",
      desc: "塩酸酸性にするとサリチル酸の白色結晶が析出する。"
    }
  }
};

export const ACIDITY_ORDER = [
  { group: "強酸", eg: "スルホン酸（R−SO₃H）や鉱酸（HCl, H₂SO₄）", desc: "塩酸や硫酸は完全電離。" },
  { group: "弱酸（中程度）", eg: "カルボン酸（R−COOH：安息香酸・酢酸）", desc: "炭酸より強い酸。NaHCO₃と反応してCO₂気泡を出し中和。" },
  { group: "炭酸", eg: "H₂CO₃（CO₂ + H₂O）", desc: "カルボン酸とフェノール類の中間の強さ。分別の境界線！" },
  { group: "極めて弱い酸", eg: "フェノール類（Ar−OH）", desc: "炭酸より弱いためNaHCO₃とは反応しないが、強塩基NaOHとは反応。" },
  { group: "中性", eg: "水（H₂O）、アルコール、エステル、ニトロ化合物、炭化水素", desc: "酸・塩基と塩を作らない。" }
];

export const SEP_REAGENTS = {
  hcl_dilute: {
    id: "hcl_dilute",
    n: "希塩酸",
    f: "HCl 水溶液",
    nature: "強酸水溶液",
    color: "#3B82F6",
    actionDesc: "塩基性物質（アニリン）を中和して塩酸塩として水層に抽出する。"
  },
  nahco3_aq: {
    id: "nahco3_aq",
    n: "炭酸水素ナトリウム水溶液",
    f: "NaHCO₃ 水溶液",
    nature: "弱アルカリ性（炭酸の酸性塩）",
    color: "#10B981",
    actionDesc: "炭酸より強い酸（カルボン酸：安息香酸）のみを中和して水層に抽出する。フェノールは反応しない！"
  },
  naoh_aq: {
    id: "naoh_aq",
    n: "水酸化ナトリウム水溶液",
    f: "NaOH 水溶液",
    nature: "強塩基水溶液",
    color: "#8B5CF6",
    actionDesc: "フェノール類（およびカルボン酸）を中和してナトリウム塩として水層に抽出する。"
  }
};

export const SEP_STAGES = [
  {
    id: "stage1",
    num: 1,
    title: "基礎編：酸と中性の2成分分離",
    sub: "安息香酸 ＋ ニトロベンゼン",
    desc: "カルボン酸と中性物質のエーテル混合物から、弱酸の中和反応を利用して両者をそれぞれ純粋に単離せよ。",
    mixture: ["benzoic_acid", "nitrobenzene"],
    idealSteps: [
      { action: "add_reagent", reagent: "nahco3_aq", note: "NaHCO₃（またはNaOH）で安息香酸を塩にして水層へ落とす" },
      { action: "drain_water", note: "水層を分取する" },
      { action: "precipitate", target: "benzoic_acid", reagent: "hcl", note: "水層に塩酸を加えて安息香酸結晶を析出回収" },
      { action: "evaporate_ether", target: "nitrobenzene", note: "エーテル層を加熱留去してニトロベンゼンを単離" }
    ],
    hints: [
      "安息香酸は酸性、ニトロベンゼンは中性です。",
      "塩基の水溶液（NaHCO₃ または NaOH）を加えると、安息香酸が塩（安息香酸ナトリウム）になって水層（下層）へ移ります。",
      "分取した水層に塩酸 HCl（強酸）を加えると、弱酸の遊離により安息香酸の白色結晶が析出します！",
      "エーテル層に残ったニトロベンゼンは、エーテルを揮発させるだけで単離できます。"
    ]
  },
  {
    id: "stage2",
    num: 2,
    title: "標準編：酸と塩基の2成分分離",
    sub: "安息香酸 ＋ アニリン",
    desc: "酸性物質と塩基性物質の混合物から、酸・塩基の液性を使い分けて両者を単離せよ。",
    mixture: ["benzoic_acid", "aniline"],
    idealSteps: [
      { action: "add_reagent", reagent: "hcl_dilute", note: "希塩酸でアニリンを中和して水層へ落とす" },
      { action: "drain_water", note: "水層を分取する" },
      { action: "precipitate", target: "aniline", reagent: "naoh", note: "アニリン塩酸塩水溶液にNaOHを加えてアニリン油滴を回収" },
      { action: "add_reagent", reagent: "nahco3_aq", note: "残ったエーテル層にNaHCO₃またはNaOHを加えて安息香酸を水層へ" }
    ],
    hints: [
      "アニリンは弱塩基、安息香酸は酸性です。",
      "希塩酸 HCl を加えると、アニリンがアニリン塩酸塩（水溶性）になって水層へ抽出されます。",
      "アニリン塩酸塩水溶液に強塩基 NaOH を加えると、弱塩基の遊離でアニリンが遊離します！"
    ]
  },
  {
    id: "stage3",
    num: 3,
    title: "発展編：酸の強弱を見極める3成分分離",
    sub: "安息香酸 ＋ フェノール ＋ ニトロベンゼン",
    desc: "カルボン酸とフェノール類はどちらも酸性だが強さが異なる。「NaHCO₃」の選択的作用を使い分けて完全分離せよ。",
    mixture: ["benzoic_acid", "phenol", "nitrobenzene"],
    idealSteps: [
      { action: "add_reagent", reagent: "nahco3_aq", note: "NaHCO₃でカルボン酸のみを選択的に水層へ" },
      { action: "drain_water", note: "安息香酸ナトリウム水層を分取" },
      { action: "precipitate", target: "benzoic_acid", reagent: "hcl", note: "HClで安息香酸を析出回収" },
      { action: "add_reagent", reagent: "naoh_aq", note: "残ったエーテル層にNaOHを加えてフェノールを水層へ" },
      { action: "drain_water", note: "ナトリウムフェノキシド水層を分取" },
      { action: "precipitate", target: "phenol", reagent: "co2", note: "CO₂通気でフェノールを遊離回収" },
      { action: "evaporate_ether", target: "nitrobenzene", note: "エーテル留去でニトロベンゼン回収" }
    ],
    hints: [
      "酸の強さの序列：安息香酸（カルボン酸） ＞ 炭酸 ＞ フェノール類",
      "最初から強塩基 NaOH を加えると、安息香酸とフェノールの両方が中和されて一緒に水層へ落ちてしまいます！",
      "弱アルカリの NaHCO₃ を加えると、炭酸より強い安息香酸だけが反応して水層へ移り、フェノールはエーテル層に残ります！"
    ]
  },
  {
    id: "stage4",
    num: 4,
    title: "最高峰：伝統の4成分完全系統分離",
    sub: "安息香酸 ＋ フェノール ＋ アニリン ＋ ニトロベンゼン",
    desc: "大学入試や高校実験の頂点。エーテル混合物から4種類の化合物を1つずつ過不足なく純粋単離せよ！",
    mixture: ["benzoic_acid", "phenol", "aniline", "nitrobenzene"],
    idealSteps: [
      { action: "add_reagent", reagent: "hcl_dilute", note: "希塩酸でアニリンを分離" },
      { action: "add_reagent", reagent: "nahco3_aq", note: "炭酸水素ナトリウムで安息香酸を分離" },
      { action: "add_reagent", reagent: "naoh_aq", note: "水酸化ナトリウムでフェノールを分離" },
      { action: "evaporate_ether", target: "nitrobenzene", note: "エーテル層に残ったニトロベンゼンを単離" }
    ],
    hints: [
      "ゴールは4物質すべてを独立して単離することです。",
      "王道ルート：①希塩酸でアニリンを抽出 $\\rightarrow$ ②炭酸水素ナトリウム水溶液で安息香酸を抽出 $\\rightarrow$ ③水酸化ナトリウム水溶液でフェノールを抽出 $\\rightarrow$ ④エーテル層にニトロベンゼンが残る！",
      "各水層から目的物を遊離させる試薬（アニリンにはNaOH、安息香酸にはHCl、フェノールにはCO₂）もお忘れなく！"
    ]
  }
];
