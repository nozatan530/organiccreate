/**
 * 有機クラフト工房 - 学習指導要領準拠データ定義
 * 高等学校化学「有機化合物（脂肪族炭化水素・官能基・高分子）」
 */

export const CLS = {
  alkane: { label: "アルカン", c: "--c-alkane", desc: "単結合のみの飽和炭化水素。置換反応を起こしやすい。" },
  alkene: { label: "アルケン", c: "--c-alkene", desc: "C=C二重結合をもつ不飽和炭化水素。付加反応を起こしやすい。" },
  alkyne: { label: "アルキン", c: "--c-alkyne", desc: "C≡C三重結合をもつ不飽和炭化水素。2段階の付加反応を起こす。" },
  halide: { label: "ハロゲン化合物", c: "--c-halide", desc: "ハロゲン原子（Cl, Br, Iなど）を含む化合物。" },
  polymer: { label: "高分子", c: "--c-polymer", desc: "単量体が多数重合してできた巨大分子。" },
  alcohol: { label: "アルコール・エーテル", c: "--c-alcohol", desc: "ヒドロキシ基 −OH やエーテル結合をもつ化合物。" },
  aldehyde: { label: "アルデヒド", c: "--c-aldehyde", desc: "ホルミル基 −CHO をもつ。還元性を示す（銀鏡反応・フェーリング反応）。" },
  ketone: { label: "ケトン", c: "--c-ketone", desc: "カルボニル基 −CO− をもつ化合物。酸化されにくい。" },
  acid: { label: "カルボン酸", c: "--c-acid", desc: "カルボキシ基 −COOH をもつ有機酸。弱酸性を示す。" },
  ester: { label: "エステル・塩", c: "--c-ester", desc: "エステル結合 −COO− をもつ芳香性の液体やカルボン酸の塩。" },
  aroma: { label: "芳香族", c: "--c-aroma", desc: "ベンゼン環をもつ環状不飽和炭化水素およびその誘導体。" },
  reagent: { label: "試薬・原料", c: "--c-reagent", desc: "合成に用いる試薬や天然原料。" },
  inorg: { label: "無機物", c: "--c-inorg", desc: "水や二酸化炭素、水素などの無機化合物。" }
};

export const SHORT = {
  alkane: "アルカン", alkene: "アルケン", alkyne: "アルキン", halide: "ハロゲン化物",
  polymer: "高分子", alcohol: "アルコール", aldehyde: "アルデヒド", ketone: "ケトン",
  acid: "カルボン酸", ester: "エステル", aroma: "芳香族", inorg: "無機物", reagent: "試薬"
};

export const S = {
  methane: { n: "メタン", en: "Methane", f: "CH₄", cls: "alkane", smi: "[H]C([H])([H])[H]", note: "天然ガスの主成分。炭素1個に水素4個が正四面体の向きに結合している。すべて単結合の「飽和」炭化水素で、付加反応はしない。", use: "都市ガス、燃料" },
  ethane: { n: "エタン", en: "Ethane", f: "CH₃−CH₃", cls: "alkane", smi: "[H]C([H])([H])C([H])([H])[H]", note: "C−C単結合は、結合を軸にして自由に回転できる。", use: "天然ガスに少量含まれる" },
  propane: { n: "プロパン", en: "Propane", f: "CH₃−CH₂−CH₃", cls: "alkane", smi: "[H]C([H])([H])C([H])([H])C([H])([H])[H]", note: "加圧すると常温でも液体になりやすい。", use: "LPガス（家庭用ボンベ）" },
  ethylene: { n: "エチレン（エテン）", en: "Ethylene (Ethene)", f: "CH₂=CH₂", cls: "alkene", smi: "[H]C([H])=C([H])[H]", note: "C=C二重結合をもち、6個の原子がすべて同一平面上にある。二重結合のうち1本が切れやすく、付加反応を起こす。果実の成熟を促す植物ホルモンでもある。", use: "ポリエチレン、エタノールなど石油化学製品の出発点" },
  propene: { n: "プロペン（プロピレン）", en: "Propene (Propylene)", f: "CH₂=CH−CH₃", cls: "alkene", smi: "[H]C([H])=C([H])C([H])([H])[H]", note: "二重結合を1つもつ非対称アルケン。付加反応では主生成物と副生成物が生じる（マルコフニコフ則：発展）。", use: "ポリプロピレンの原料" },
  acetylene: { n: "アセチレン（エチン）", en: "Acetylene (Ethyne)", f: "CH≡CH", cls: "alkyne", smi: "[H]C#C[H]", note: "C≡C三重結合をもつ直線形の分子。付加反応を2段階起こせる。酸素とともに燃やすと約3000℃の高温になる。", use: "溶接・切断用の酸素アセチレン炎" },
  ch3cl: { n: "クロロメタン（塩化メチル）", en: "Chloromethane", f: "CH₃Cl", cls: "halide", smi: "[H]C([H])([H])Cl", note: "メタンのH原子1個がCl原子に置換された。", use: "シリコーン樹脂などの原料" },
  ch2cl2: { n: "ジクロロメタン（塩化メチレン）", en: "Dichloromethane", f: "CH₂Cl₂", cls: "halide", smi: "ClC([H])([H])Cl", note: "水に難溶で油をよく溶かす不燃性の有機溶媒。", use: "溶媒、塗装のはく離剤" },
  chcl3: { n: "クロロホルム（トリクロロメタン）", en: "Chloroform", f: "CHCl₃", cls: "halide", smi: "ClC([H])(Cl)Cl", note: "甘い芳香のある揮発性液体。19世紀には麻酔薬として用いられたが、肝毒性のため現在は溶媒として使用。", use: "実験用溶媒" },
  ccl4: { n: "四塩化炭素（テトラクロロメタン）", en: "Carbon tetrachloride", f: "CCl₄", cls: "halide", smi: "ClC(Cl)(Cl)Cl", note: "H原子が全てClに置換された正四面体構造。燃えない液体だが、毒性とオゾン層破壊のため製造規制。", use: "かつての消火剤・溶媒" },
  chloroethane: { n: "クロロエタン（塩化エチル）", en: "Chloroethane", f: "CH₃−CH₂Cl", cls: "halide", smi: "[H]C([H])([H])C([H])([H])Cl", note: "沸点が低く気化熱が大きいため、かつて局所麻酔・冷却スプレーに利用された。", use: "局所冷却剤" },
  dibromoethane: { n: "1,2-ジブロモエタン", en: "1,2-Dibromoethane", f: "CH₂Br−CH₂Br", cls: "halide", smi: "BrC([H])([H])C([H])([H])Br", note: "エチレンに臭素が1分子付加した化合物。臭素水の赤褐色が消える現象は不飽和結合の検出に不可欠。", use: "不飽和結合の検出（臭素水の脱色）" },
  dichloroethane: { n: "1,2-ジクロロエタン", en: "1,2-Dichloroethane", f: "CH₂Cl−CH₂Cl", cls: "halide", smi: "ClC([H])([H])C([H])([H])Cl", note: "加熱熱分解するとHClが外れて塩化ビニルになる工業中間体。", use: "塩化ビニルの原料" },
  vinylchloride: { n: "塩化ビニル（クロロエテン）", en: "Vinyl chloride", f: "CH₂=CHCl", cls: "halide", smi: "[H]C([H])=C([H])Cl", note: "二重結合が残っている単量体。付加重合によりポリ塩化ビニルになる。", use: "ポリ塩化ビニル（塩ビ）の単量体" },
  dibromoethene: { n: "1,2-ジブロモエテン", en: "1,2-Dibromoethene", f: "CHBr=CHBr", cls: "halide", smi: "BrC([H])=C([H])Br", note: "アセチレンに臭素が1分子付加した段階。まだ二重結合が残っておりシス・トランス異性体が存在。", use: "付加反応の段階的進行の確認" },
  tetrabromoethane: { n: "1,1,2,2-テトラブロモエタン", en: "1,1,2,2-Tetrabromoethane", f: "CHBr₂−CHBr₂", cls: "halide", smi: "BrC(Br)([H])C([H])(Br)Br", note: "三重結合に臭素が2分子付加し、不飽和結合が完全に飽和された。", use: "鉱物の比重分離液" },
  dibromopropane: { n: "1,2-ジブロモプロパン", en: "1,2-Dibromopropane", f: "CH₂Br−CHBr−CH₃", cls: "halide", smi: "BrC([H])([H])C([H])(Br)C([H])([H])[H]", note: "プロペンの二重結合に臭素が付加した化合物。", use: "不飽和結合の確認" },
  polyethylene: { n: "ポリエチレン", en: "Polyethylene (PE)", f: "−[CH₂−CH₂]ₙ−", cls: "polymer", note: "エチレンが多数付加重合した高分子。二重結合が開いて単結合の鎖になっている。", use: "ポリ袋、包装フィルム、容器" },
  pvc: { n: "ポリ塩化ビニル", en: "Polyvinyl chloride (PVC)", f: "−[CH₂−CHCl]ₙ−", cls: "polymer", note: "塩化ビニルが付加重合した高分子。難燃性・耐薬品性に優れる。", use: "水道管（塩ビ管）、雨どい、消しゴム" },
  pp: { n: "ポリプロピレン", en: "Polypropylene (PP)", f: "−[CH₂−CH(CH₃)]ₙ−", cls: "polymer", note: "プロペンが付加重合した高分子。軽量で耐熱性に優れる。", use: "食品容器、ペットボトルキャップ" },
  ethanol: { n: "エタノール", en: "Ethanol", f: "CH₃−CH₂−OH", cls: "alcohol", smi: "[H]C([H])([H])C([H])([H])O[H]", note: "親水性のヒドロキシ基 −OH をもつ代表的アルコール。酸化するとアセトアルデヒドを経て酢酸になる。", use: "消毒液、酒類、溶媒、燃料" },
  ether: { n: "ジエチルエーテル", en: "Diethyl ether", f: "C₂H₅−O−C₂H₅", cls: "alcohol", smi: "[H]C([H])([H])C([H])([H])OC([H])([H])C([H])([H])[H]", note: "エタノール2分子から分子間脱水（縮合）して生じる。極めて引火しやすい揮発性液体。", use: "有機溶媒、かつての全身麻酔薬" },
  acetaldehyde: { n: "アセトアルデヒド", en: "Acetaldehyde (Ethanal)", f: "CH₃−CHO", cls: "aldehyde", smi: "[H]C([H])([H])C([H])=O", note: "還元性を示すホルミル基 −CHO をもつ。酸化されると酢酸になり、銀鏡反応やフェーリング反応を示す。", use: "酢酸原料、還元性試験（銀鏡反応）" },
  isopropanol: { n: "2-プロパノール", en: "2-Propanol (Isopropanol)", f: "CH₃−CH(OH)−CH₃", cls: "alcohol", smi: "[H]C([H])([H])C([H])(O[H])C([H])([H])[H]", note: "第2級アルコール。酸化するとケトン（アセトン）になる。", use: "消毒用アルコール、洗浄剤" },
  methanol: { n: "メタノール", en: "Methanol", f: "CH₃OH", cls: "alcohol", smi: "[H]C([H])([H])O[H]", note: "最も単純な第1級アルコール。有毒（誤飲で失明や致死）。酸化するとホルムアルデヒドを経てギ酸になる。", use: "燃料、溶媒、ホルマリン原料" },
  formaldehyde: { n: "ホルムアルデヒド", en: "Formaldehyde", f: "HCHO", cls: "aldehyde", smi: "[H]C([H])=O", note: "刺激臭をもつ有毒気体。水溶液は約37%で「ホルマリン」と呼ばれる。強い還元性をもつ。", use: "ホルマリン（防腐剤）、合成樹脂原料" },
  formic_acid: { n: "ギ酸", en: "Formic acid", f: "HCOOH", cls: "acid", smi: "OC([H])=O", note: "刺激臭のある液体。カルボキシ基とホルミル基の両方を併せもち、カルボン酸でありながら銀鏡反応を示す。", use: "染料固定剤、防腐剤" },
  acetic_acid: { n: "酢酸", en: "Acetic acid", f: "CH₃COOH", cls: "acid", smi: "[H]C([H])([H])C(O[H])=O", note: "食酢に約4〜5%含まれる弱酸。純度が高いものは16.7℃で凍結するため「氷酢酸」と呼ばれる。", use: "食酢、酢酸エチル原料、合成繊維原料" },
  acetone: { n: "アセトン", en: "Acetone", f: "CH₃COCH₃", cls: "ketone", smi: "[H]C([H])([H])C(=O)C([H])([H])[H]", note: "最も単純なケトン。水にも有機溶媒にも溶ける揮発性液体。CH₃CO−構造をもちヨードホルム反応を示す。", use: "除光液、実験用洗浄溶媒" },
  ethyl_acetate: { n: "酢酸エチル", en: "Ethyl acetate", f: "CH₃COOC₂H₅", cls: "ester", smi: "[H]C([H])([H])C(=O)OCC([H])([H])[H]", note: "甘い果実臭をもつエステル。酢酸とエタノールを濃硫酸とともに加熱（エステル化）して合成する。", use: "香料、接着剤、塗料用有機溶媒" },
  sodium_acetate: { n: "酢酸ナトリウム", en: "Sodium acetate", f: "CH₃COONa", cls: "ester", note: "弱酸の酢酸と強塩基のNaOHからなる塩。酢酸エチルのけん化や中和で得られる。水溶液は加水分解で弱塩基性。", use: "緩衝液、発熱カイロ、食品保存料" },
  iodoform: { n: "ヨードホルム", en: "Iodoform", f: "CHI₃", cls: "halide", smi: "IC(I)(I)[H]", note: "特異臭のある黄色結晶。アセトンやエタノールにヨウ素とNaOHを加えて温めると生じる（ヨードホルム反応）。", use: "消毒薬、CH₃CO− / CH₃CH(OH)−の検出" },
  silver: { n: "銀（銀鏡）", en: "Silver (mirror)", f: "Ag", cls: "inorg", note: "アルデヒドの還元作用により、アンモニア性硝酸銀水溶液からガラス壁に析出した純銀の薄膜。", use: "鏡、装飾" },
  benzene: { n: "ベンゼン", en: "Benzene", f: "C₆H₆", cls: "aroma", smi: "[H]C1=C([H])C([H])=C([H])C([H])=C1[H]", note: "正六角形の環状構造をもつ芳香族化合物の母体。炭素間の結合は単結合と二重結合の中間（共鳴混成体）。付加反応より置換反応が起こりやすい。", use: "医薬品、染料、プラスチック原料" },
  nitrobenzene: { n: "ニトロベンゼン", en: "Nitrobenzene", f: "C₆H₅NO₂", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(N(=O)=O)C([H])=C1[H]", note: "ベンゼンを濃硝酸と濃硫酸の混酸で温めると得られる（ニトロ化）。苦扁桃油（アーモンド）様の香気をもつ黄色油状液体。水より重い。", use: "アニリンの製造原料、有機溶媒" },
  aniline: { n: "アニリン", en: "Aniline", f: "C₆H₅NH₂", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(N([H])[H])C([H])=C1[H]", note: "ニトロベンゼンをスズと塩酸で還元して得られる。特異臭をもつ弱塩基性無色液体。空気中で酸化されて赤褐色になる。さらし粉で赤紫色に呈色。", use: "アゾ染料、医薬品（解熱鎮痛薬）、合成樹脂原料" },
  acetanilide: { n: "アセトアニリド", en: "Acetanilide", f: "C₆H₅NHCOCH₃", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(NC(=O)C)C([H])=C1[H]", note: "アニリンに無水酢酸を作用させてアミノ基をアセチル化すると得られる白色結晶。かつて世界最初の合成解熱鎮痛薬「アンチフェブリン」として市販された。", use: "解熱鎮痛薬（歴史的医薬）、染料中間体" },
  diazonium: { n: "塩化ベンゼンジアゾニウム", en: "Benzenediazonium chloride", f: "C₆H₅N₂⁺Cl⁻", cls: "aroma", smi: "[H]C1=C([H])C([H])=C([N+]#N)C([H])=C1[H].[Cl-]", note: "アニリンを塩酸酸性下、亜硝酸ナトリウムとともに氷冷（0〜5℃）すると生じるジアゾ化合物。不安定で室温放置や加熱で窒素を放出してフェノールに分解する。", use: "アゾ染料合成の重要中間体" },
  azo_dye: { n: "p-ヒドロキシアゾベンゼン", en: "p-Hydroxyazobenzene", f: "C₆H₅−N=N−C₆H₄OH", cls: "aroma", smi: "[H]C1=C([H])C(O[H])=C([H])C([H])=C1N=NC1=C([H])C([H])=C([H])C([H])=C1[H]", note: "塩化ベンゼンジアゾニウム水溶液にナトリウムフェノキシド（アルカリ性フェノール水溶液）を注ぐと速やかにカップリングして生じる鮮やかな橙赤色沈殿。代表的なアゾ染料。", use: "アゾ系合成染料・顔料" },
  chlorobenzene: { n: "クロロベンゼン", en: "Chlorobenzene", f: "C₆H₅Cl", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(Cl)C([H])=C1[H]", note: "ベンゼンに鉄触媒の存在下で塩素を作用させると得られる置換生成物。芳香環に直結した塩素原子は脱離しにくく安定。", use: "農薬、染料、医薬中間体" },
  toluene: { n: "トルエン", en: "Toluene", f: "C₆H₅CH₃", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(C)C([H])=C1[H]", note: "ベンゼンの水素1個がメチル基に置換された芳香族炭化水素。水に不溶で引火性がある。側鎖メチル基は過マンガン酸カリウムで容易に酸化される。", use: "塗料用有機溶媒、安息香酸原料、TNT火薬原料" },
  benzoic_acid: { n: "安息香酸", en: "Benzoic acid", f: "C₆H₅COOH", cls: "acid", smi: "[H]C1=C([H])C([H])=C(C(=O)O[H])C([H])=C1[H]", note: "トルエンの側鎖メチル基を強酸化剤（KMnO₄）で酸化すると得られる芳香族カルボン酸。白色結晶。加熱すると昇華する。炭酸水素ナトリウム水溶液に気泡（CO₂）を出して溶ける。", use: "防腐剤・食品保存料（安息香酸ナトリウム）、染料中間体" },
  phenol: { n: "フェノール（石炭酸）", en: "Phenol", f: "C₆H₅OH", cls: "aroma", smi: "[H]C1=C([H])C([H])=C(O[H])C([H])=C1[H]", note: "ベンゼン環にヒドロキシ基が直結した化合物。弱酸性（炭酸より弱くアルコールより強い）。塩化鉄(III)水溶液で紫色に呈色する。皮膚を侵す有毒な白色結晶。", use: "消毒殺菌剤、フェノール樹脂（ベークライト）原料、医薬原料" },
  tribromophenol: { n: "2,4,6-トリブロモフェノール", en: "2,4,6-Tribromophenol", f: "C₆H₂Br₃OH", cls: "halide", smi: "Oc1c(Br)cc(Br)cc1Br", note: "フェノール水溶液に臭素水を加えると、o-位およびp-位の3箇所が一気に臭素置換されて直ちに生じる白色沈殿。フェノールの鋭敏な検出に用いられる。", use: "フェノールの検出試薬、難燃剤" },
  picric_acid: { n: "ピクリン酸", en: "Picric acid", f: "C₆H₂(NO₂)₃OH", cls: "acid", smi: "Oc1c([N+](=O)[O-])cc([N+](=O)[O-])cc1[N+](=O)[O-]", note: "フェノールに濃硝酸と濃硫酸を加えて加熱すると、o-位とp-位が激しくニトロ化されて生じる黄色結晶。3つのニトロ基の強い電子求引性によりカルボン酸に匹敵する強酸性を示す。衝撃で爆発する。", use: "かつての軍用黄色火薬（下瀬火薬）、黄色染料" },
  salicylic_acid: { n: "サリチル酸", en: "Salicylic acid", f: "C₆H₄(OH)COOH", cls: "acid", smi: "OC(=O)c1ccccc1O", note: "フェノール性ヒドロキシ基とカルボキシ基の両方を隣接（オルト位）にもつ化合物。フェノールナトリウムに高温高圧でCO₂を反応（コルベ・シュミット反応）させて工業合成。塩化鉄(III)で赤紫色呈色。", use: "アスピリンやサリチル酸メチルなど医薬品の万能原料" },
  aspirin: { n: "アセチルサリチル酸（アスピリン）", en: "Acetylsalicylic acid (Aspirin)", f: "C₆H₄(OCOCH₃)COOH", cls: "ester", smi: "CC(=O)Oc1ccccc1C(=O)O", note: "サリチル酸のフェノール性−OHを無水酢酸でアセチル化したエステル。フェノール性−OHが塞がれているため塩化鉄(III)で呈色しない。世界で最も普及した消炎解熱鎮痛薬。", use: "アスピリン（解熱鎮痛薬、血栓予防薬）" },
  methyl_salicylate: { n: "サリチル酸メチル", en: "Methyl salicylate", f: "C₆H₄(OH)COOCH₃", cls: "ester", smi: "COC(=O)c1ccccc1O", note: "サリチル酸のカルボキシ基−COOHをメタノールと濃硫酸触媒でエステル化した化合物。湿布薬特有の清涼感ある芳香をもつ液体。フェノール性−OHが残っているため塩化鉄(III)で赤紫色に呈色する。", use: "湿布薬（外用消炎鎮痛剤）、香料" },
  co2: { n: "二酸化炭素", en: "Carbon dioxide", f: "CO₂", cls: "inorg", smi: "O=C=O", note: "完全燃焼やアルコール発酵で生成する無機化合物。", use: "炭酸飲料、ドライアイス" },
  cl2: { n: "塩素", en: "Chlorine", f: "Cl₂", cls: "reagent", smi: "ClCl", note: "黄緑色の有毒気体。光照射によりラジカル置換反応を起こす。" },
  h2: { n: "水素", en: "Hydrogen", f: "H₂", cls: "reagent", smi: "[H][H]", note: "触媒下で不飽和結合に付加する。またアルコールとNaの反応で発生する。" },
  h2o: { n: "水", en: "Water", f: "H₂O", cls: "reagent", smi: "[H]O[H]", note: "触媒下で付加反応や、エステルの加水分解に用いる。" },
  o2: { n: "酸素", en: "Oxygen", f: "O₂", cls: "reagent", smi: "O=O", note: "点火・加熱すると激しい酸化反応（完全燃焼）を起こす。" },
  br2: { n: "臭素水", en: "Bromine water", f: "Br₂", cls: "reagent", smi: "BrBr", note: "赤褐色の臭素水溶液。炭素間不飽和結合（C=C, C≡C）に速やかに付加して脱色する。" },
  hcl: { n: "塩化水素", en: "Hydrogen chloride", f: "HCl", cls: "reagent", smi: "[H]Cl", note: "極性気体。アルケンやアルキンに付加してハロゲン化アルキルを与える。" },
  h2so4: { n: "濃硫酸", en: "Sulfuric acid (conc.)", f: "H₂SO₄", cls: "reagent", note: "強い酸性と脱水作用をもつ。脱水反応やエステル化、混酸ニトロ化の触媒。" },
  hno3: { n: "濃硝酸", en: "Nitric acid (conc.)", f: "HNO₃", cls: "reagent", note: "強力な酸化力をもつ強酸。濃硫酸と混ぜて混酸をつくり、芳香環をニトロ化（−NO₂置換）する試薬。" },
  sn: { n: "スズ（金属粉末）", en: "Tin (metal)", f: "Sn", cls: "reagent", note: "還元剤。濃塩酸とともに用いることで、ニトロベンゼンのニトロ基を還元してアニリン塩酸塩にする。" },
  nano2: { n: "亜硝酸ナトリウム", en: "Sodium nitrite", f: "NaNO₂", cls: "reagent", note: "ジアゾ化試薬。塩酸酸性下、氷冷（0〜5℃）でアニリンに作用させると塩化ベンゼンジアゾニウムを生成する。" },
  ac2o: { n: "無水酢酸", en: "Acetic anhydride", f: "(CH₃CO)₂O", cls: "reagent", note: "酢酸2分子から脱水した刺激臭のある液体。アミノ基やヒドロキシ基を強力にアセチル化（−COCH₃基を導入）する試薬。" },
  fecl3: { n: "塩化鉄(III)水溶液", en: "Iron(III) chloride", f: "FeCl₃", cls: "reagent", note: "黄褐色の水溶液。フェノール性水酸基（ベンゼン環に直結した−OH）と錯体を形成し、特有の紫色〜赤紫色に呈色する検出試薬。" },
  na: { n: "金属ナトリウム", en: "Sodium (metal)", f: "Na", cls: "reagent", note: "軟らかいアルカリ金属。アルコール（−OH）と穏やかに反応して水素H₂を発生する（エーテルは反応しない）。" },
  kmno4: { n: "酸化剤 [O]", en: "Oxidizing agent", f: "[O]", cls: "reagent", note: "過マンガン酸カリウムや二クロム酸カリウム。アルコールやアルキルベンゼンの側鎖を段階的に酸化する試薬。" },
  naoh: { n: "水酸化ナトリウム", en: "Sodium hydroxide", f: "NaOH", cls: "reagent", note: "強塩基。エステルのけん化や、フェノールの溶解、カップリング反応のアルカリ条件に用いる。" },
  i2: { n: "ヨウ素液", en: "Iodine solution", f: "I₂", cls: "reagent", note: "褐色液。NaOHとともに加えることでヨードホルム反応を起こす検出試薬。" },
  tollens: { n: "アンモニア性硝酸銀", en: "Tollens' reagent", f: "[Ag(NH₃)₂]⁺", cls: "reagent", note: "ジアンミン銀(I)イオンを含む無色の錯イオン水溶液。アルデヒドにより銀鏡が析出する。" },
  cac2: { n: "炭化カルシウム（カーバイド）", en: "Calcium carbide", f: "CaC₂", cls: "reagent", note: "水を加えると激しく加水分解してアセチレンを発生する無機物質。" },
  glucose: { n: "ブドウ糖（グルコース）", en: "Glucose", f: "C₆H₁₂O₆", cls: "reagent", note: "酵母（チマーゼ）によるアルコール発酵でエタノールと二酸化炭素に分解される単糖類。" },
  naphtha: { n: "ナフサ（粗製ガソリン）", en: "Naphtha", f: "C₅〜C₁₀の混合物", cls: "reagent", note: "原油の常圧蒸留で得られる炭化水素混合物。高温熱分解（クラッキング）で低級アルケンを製造する。" }
};

export const DEX1 = ["methane","ethane","propane","ethylene","propene","acetylene","ch3cl","ch2cl2","chcl3","ccl4","chloroethane","dibromoethane","dichloroethane","vinylchloride","dibromoethene","tetrabromoethane","dibromopropane","polyethylene","pvc","pp"];
export const DEX2 = ["methanol","formaldehyde","formic_acid","ethanol","acetaldehyde","acetic_acid","ethyl_acetate","sodium_acetate","isopropanol","acetone","ether","iodoform","silver","h2"];
export const DEX3 = ["benzene","chlorobenzene","toluene","benzoic_acid","phenol","tribromophenol","picric_acid","salicylic_acid","aspirin","methyl_salicylate","nitrobenzene","aniline","acetanilide","diazonium","azo_dye"];
export const DEXX = ["co2"];

export const SOURCES = [
  { id: "gas", n: "天然ガス田", items: ["methane"], start: true },
  { id: "salt", n: "食塩水の電気分解工場", items: ["cl2", "h2"], start: true },
  { id: "nature", n: "井戸と空気", items: ["h2o", "o2"], start: true },
  { id: "shelf", n: "鑑定用の試薬棚", items: ["br2"], start: true },
  { id: "quarry", n: "石灰岩の採石場", items: ["cac2"], by: "依頼1" },
  { id: "farm", n: "サトウキビ畑", items: ["glucose"], by: "依頼2" },
  { id: "store", n: "薬品問屋", items: ["h2so4", "hcl"], by: "依頼2" },
  { id: "refinery", n: "製油所", items: ["naphtha"], by: "依頼3" },
  { id: "distill", n: "アルコール蒸留室", items: ["ethanol", "methanol", "isopropanol"], ch: 2, start: true },
  { id: "oxidant", n: "試薬棚（酸化剤）", items: ["kmno4"], ch: 2, start: true },
  { id: "reagents2", n: "第2章 分析・合成試薬棚", items: ["na", "tollens", "i2", "naoh", "h2so4"], ch: 2, by: "依頼1" },
  { id: "aroma_lab", n: "芳香族実験室", items: ["benzene", "toluene"], ch: 3, start: true },
  { id: "acids_ch3", n: "第3章 強酸・混酸棚", items: ["hno3", "h2so4", "hcl", "cl2", "br2"], ch: 3, start: true },
  { id: "reagents3", n: "第3章 芳香族・医薬合成試薬", items: ["sn", "nano2", "ac2o", "fecl3", "naoh", "kmno4"], ch: 3, by: "依頼1" }
];

export const CATS = [
  { id: "none", n: "なし" },
  { id: "Ni", n: "ニッケル Ni" },
  { id: "Pt", n: "白金 Pt" },
  { id: "Cu", n: "赤熱銅線 Cu" },
  { id: "HgSO4", n: "硫酸水銀(II) HgSO₄" },
  { id: "HgCl2", n: "塩化水銀(II) HgCl₂" },
  { id: "H3PO4", n: "リン酸 H₃PO₄" },
  { id: "H2SO4_cat", n: "濃硫酸 H₂SO₄（酸触媒）" },
  { id: "Fe", n: "鉄 Fe" },
  { id: "yeast", n: "酵母（チマーゼ）" },
  { id: "poly", n: "重合触媒（チーグラー・ナッタ触媒）", lock: "依頼4" }
];

export const CATSHORT = {
  Ni: "Ni", Pt: "Pt", Cu: "Cu", HgSO4: "HgSO₄", HgCl2: "HgCl₂",
  H3PO4: "H₃PO₄", H2SO4_cat: "濃硫酸", Fe: "Fe", yeast: "酵母", poly: "重合触媒"
};

export const TYPES = ["置換", "付加", "脱離", "縮合", "重合", "酸化", "加水分解", "検出", "燃焼", "熱分解", "その他", "反応しない"];

export const TYPE_INFO = {
  "置換": {
    name: "置換反応（ちかんはんのう）",
    simple: "原子や原子団が別の原子と入れかわる反応",
    guide: "【学習指導要領の要点】アルカン（メタンなど）に光を当てると、水素原子がハロゲン原子（塩素など）に段階的に置き換わります。",
    eg: "CH₄ + Cl₂ → CH₃Cl + HCl"
  },
  "付加": {
    name: "付加反応（ふかはんのう）",
    simple: "二重結合や三重結合が開き、別の原子がくっつく反応",
    guide: "【学習指導要領の要点】アルケンやアルキンの切れやすい不飽和結合が開き、水素やハロゲン、水が結合します。臭素水（赤褐色）の脱色が特徴的です。",
    eg: "CH₂=CH₂ + Br₂ → CH₂Br−CH₂Br"
  },
  "脱離": {
    name: "脱離反応（だつりはんのう）",
    simple: "1つの分子から水やHClなどの小さな分子が取れて、二重結合ができる反応",
    guide: "【学習指導要領の要点】エタノールに濃硫酸を加えて約160〜170℃に加熱すると分子内脱水が起こり、エチレンが得られます。",
    eg: "CH₃CH₂OH → CH₂=CH₂ + H₂O"
  },
  "縮合": {
    name: "縮合反応（しゅくごうはんのう）",
    simple: "2つの分子から水などの小さな分子が外れて結合する反応",
    guide: "【学習指導要領の要点】エステル化（カルボン酸＋アルコール）やエーテル生成（アルコールの分子間脱水）が代表例です。",
    eg: "CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ + H₂O"
  },
  "酸化": {
    name: "酸化反応（さんかはんのう）",
    simple: "水素原子が奪われるか、酸素原子が結合する反応",
    guide: "【学習指導要領の要点】第1級アルコールは酸化されてアルデヒドを経てカルボン酸になり、第2級アルコールはケトンになります。",
    eg: "C₂H₅OH + [O] → CH₃CHO + H₂O"
  },
  "加水分解": {
    name: "加水分解・けん化",
    simple: "水や強塩基が作用してエステルなどの結合が開裂する反応",
    guide: "【学習指導要領の要点】エステルにNaOHを加えて加熱すると不可逆的に分解してカルボン酸の塩とアルコールになります（けん化）。",
    eg: "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH"
  },
  "検出": {
    name: "官能基の検出反応",
    simple: "特定の官能基（−OH, −CHO, CH₃CO−など）に特異的な沈殿や気体、呈色",
    guide: "【学習指導要領の要点】Naとの水素発生（−OH）、銀鏡反応（−CHOの還元性）、ヨードホルム反応（CH₃CO−等の黄色沈殿）など。",
    eg: "CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃↓ + CH₃COONa + 3NaI + 3H₂O"
  },
  "重合": {
    name: "重合（じゅうごう）",
    simple: "多数の小さな分子（単量体）が次々につながって巨大分子になる反応",
    guide: "【学習指導要領の要点】二重結合が開いて連鎖的につながる「付加重合」により、ポリエチレンやポリ塩化ビニルが合成されます。",
    eg: "n CH₂=CH₂ → −[CH₂−CH₂]ₙ−"
  },
  "燃焼": {
    name: "燃焼（ねんしょう）",
    simple: "酸素と激しく反応して熱と光を出す酸化反応",
    guide: "【学習指導要領の要点】炭素と水素からなる炭化水素は、完全燃焼すると二酸化炭素（CO₂）と水（H₂O）になります。",
    eg: "CH₄ + 2O₂ → CO₂ + 2H₂O"
  },
  "熱分解": {
    name: "熱分解（ねつぶんかい）",
    simple: "高熱によって大きな分子が切れて小さな分子に分かれる反応",
    guide: "【学習指導要領の要点】石油のナフサ留分を700℃以上の高温で熱分解（クラッキング）し、エチレンやプロペンを工業生産します。",
    eg: "長鎖炭化水素 → CH₂=CH₂ + CH₂=CHCH₃ など"
  },
  "その他": {
    name: "その他の反応（発酵・加水分解など）",
    simple: "酵素の働きによる発酵や、無機化合物と水の反応",
    guide: "【学習指導要領の要点】炭化カルシウム（カーバイド）への注水によるアセチレン発生や、酵母によるアルコール発酵などが含まれます。",
    eg: "CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂"
  },
  "反応しない": {
    name: "反応しない（変化なし）",
    simple: "条件や分子の性質（飽和性など）により反応が進行しない",
    guide: "【学習指導要領の要点】アルカンは単結合のみで飽和しているため、臭素水を加えても付加反応を起こさず、赤褐色は脱色しません。",
    eg: "CH₄ + Br₂ → 変化なし（脱色しない）"
  }
};

const HYDRO_CAT = "水素は触媒なしではほとんど付加しない。Ni や Pt の金属表面で反応が進む。";
const POLY_CAT = "単量体を高分子につなぐには、重合触媒が必要だ。";

export const RULES = [
  { id: "cl1", in: ["methane", "cl2"], light: true, out: ["ch3cl"], give: ["hcl"], types: ["置換"], eq: "CH₄ + Cl₂ → CH₃Cl + HCl", text: "メタンのH原子1個がCl原子に置き換わった。光（紫外線）がCl₂分子を切断して塩素ラジカルを生じ、連鎖置換反応が始まる。副産物の塩化水素も得られた。" },
  { id: "cl2", in: ["ch3cl", "cl2"], light: true, out: ["ch2cl2"], give: ["hcl"], types: ["置換"], eq: "CH₃Cl + Cl₂ → CH₂Cl₂ + HCl", text: "さらにH原子がもう1個Cl原子に置き換わった（ジクロロメタンの生成）。" },
  { id: "cl3", in: ["ch2cl2", "cl2"], light: true, out: ["chcl3"], give: ["hcl"], types: ["置換"], eq: "CH₂Cl₂ + Cl₂ → CHCl₃ + HCl", text: "3段階目の置換反応。クロロホルムが生成した。" },
  { id: "cl4", in: ["chcl3", "cl2"], light: true, out: ["ccl4"], give: ["hcl"], types: ["置換"], eq: "CHCl₃ + Cl₂ → CCl₄ + HCl", text: "メタンのH原子がすべてCl原子に置換され、四塩化炭素になった。" },
  { id: "clEt", in: ["ethane", "cl2"], light: true, out: ["chloroethane"], give: ["hcl"], types: ["置換"], eq: "C₂H₆ + Cl₂ → C₂H₅Cl + HCl", text: "エタンでもメタンと同様に、光照射により置換反応が進行する。" },
  { id: "carb", in: ["cac2", "h2o"], out: ["acetylene"], types: ["その他"], eq: "CaC₂ + 2H₂O → CH≡CH + Ca(OH)₂", text: "炭化カルシウム（カーバイド）に水を滴下すると、アセチレン気体が激しく発生した。高校化学の定番実験。" },
  { id: "hAc", in: ["acetylene", "h2"], cat: ["Ni", "Pt"], catMsg: HYDRO_CAT, out: ["ethylene"], types: ["付加"], eq: "CH≡CH + H₂ → CH₂=CH₂", text: "三重結合に水素が1分子付加し、二重結合をもつエチレンになった。" },
  { id: "hEt", in: ["ethylene", "h2"], cat: ["Ni", "Pt"], catMsg: HYDRO_CAT, out: ["ethane"], types: ["付加"], eq: "CH₂=CH₂ + H₂ → CH₃−CH₃", text: "二重結合に水素が付加し、単結合だけの飽和アルカン（エタン）になった。" },
  { id: "hPr", in: ["propene", "h2"], cat: ["Ni", "Pt"], catMsg: HYDRO_CAT, out: ["propane"], types: ["付加"], eq: "CH₂=CH−CH₃ + H₂ → CH₃−CH₂−CH₃", text: "プロペンの二重結合に水素が付加してプロパンになった。" },
  { id: "brEt", in: ["ethylene", "br2"], out: ["dibromoethane"], types: ["付加"], eq: "CH₂=CH₂ + Br₂ → CH₂Br−CH₂Br", text: "赤褐色の臭素水がすっと脱色した！ 二重結合への臭素の付加反応。炭素間の不飽和結合の検出に用いられる。", fade: true },
  { id: "brAc", in: ["acetylene", "br2"], out: ["dibromoethene"], types: ["付加"], eq: "CH≡CH + Br₂ → CHBr=CHBr", text: "臭素水が脱色した。三重結合に臭素が1分子付加し、まだ二重結合が1本残っている。", fade: true },
  { id: "brAc2", in: ["dibromoethene", "br2"], out: ["tetrabromoethane"], types: ["付加"], eq: "CHBr=CHBr + Br₂ → CHBr₂−CHBr₂", text: "残っていた二重結合にも臭素が付加した。アルキンは2段階の付加反応を起こす。", fade: true },
  { id: "brPr", in: ["propene", "br2"], out: ["dibromopropane"], types: ["付加"], eq: "CH₂=CH−CH₃ + Br₂ → CH₂Br−CHBr−CH₃", text: "プロペンの二重結合に臭素が付加し、臭素水の色が消えた。", fade: true },
  { id: "hclEt", in: ["ethylene", "hcl"], out: ["chloroethane"], types: ["付加"], eq: "CH₂=CH₂ + HCl → CH₃−CH₂Cl", text: "二重結合にHとClが1個ずつ付加した。" },
  { id: "cl2Et", in: ["ethylene", "cl2"], out: ["dichloroethane"], types: ["付加"], eq: "CH₂=CH₂ + Cl₂ → CH₂Cl−CH₂Cl", text: "二重結合に塩素が付加した。光がなくても、二重結合があれば室温で付加反応が速やかに進む。" },
  { id: "vc1", in: ["dichloroethane"], t: [400, 600], lowMsg: "加熱が足りない。400℃以上に熱するとHClが脱離する。", out: ["vinylchloride"], give: ["hcl"], types: ["脱離", "熱分解"], eq: "CH₂Cl−CH₂Cl → CH₂=CHCl + HCl", text: "高温加熱によりHClが脱離し、二重結合が再生して塩化ビニルができた。工業的な塩化ビニルモノマー製造法。" },
  { id: "vc2", in: ["acetylene", "hcl"], cat: ["HgCl2"], catMsg: "アセチレンへのHCl付加には塩化水銀(II)触媒が必要。", out: ["vinylchloride"], types: ["付加"], eq: "CH≡CH + HCl → CH₂=CHCl", text: "三重結合にHClが1分子付加して塩化ビニルになった。" },
  { id: "hyAc", in: ["acetylene", "h2o"], cat: ["HgSO4"], catMsg: "アセチレンへの水付加には硫酸水銀(II)触媒が必要。", out: ["acetaldehyde"], types: ["付加"], eq: "CH≡CH + H₂O → [CH₂=CH−OH] → CH₃−CHO", text: "水が付加して生じた中間体ビニルアルコールは極めて不安定で、速やかに互変異性化してアセトアルデヒドになる。" },
  { id: "hyEt", in: ["ethylene", "h2o"], cat: ["H3PO4"], catMsg: "エチレンへの水付加にはリン酸触媒を用いる。", t: [250, 350], lowMsg: "温度が低い。リン酸触媒を用い約300℃の高温高圧下で反応させる。", out: ["ethanol"], types: ["付加"], eq: "CH₂=CH₂ + H₂O → CH₃−CH₂−OH", text: "二重結合にHとOHが付加してエタノールが生成した。石油化学による合成エタノール製法。" },
  { id: "hyPr", in: ["propene", "h2o"], cat: ["H3PO4"], catMsg: "プロペンへの水付加にはリン酸触媒を用いる。", t: [250, 350], lowMsg: "温度が低い。高温高圧（約300℃）が必要。", out: ["isopropanol"], types: ["付加"], eq: "CH₂=CH−CH₃ + H₂O → CH₃−CH(OH)−CH₃", text: "プロペンに水が付加して2-プロパノールが主生成物として得られた（マルコフニコフ則：発展）。" },
  { id: "ferm", in: ["glucose"], cat: ["yeast"], catMsg: "糖をアルコールに変えるには酵母（チマーゼ）の生体触媒作用を利用する。", t: [25, 40], lowMsg: "温度が低く酵母の酵素活性が低い。30〜35℃付近が最適。", highMsg: "温度が高すぎて酵母の酵素が熱変性（失活）してしまった。", out: ["ethanol", "co2"], types: ["その他"], eq: "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂", text: "酵母のチマーゼによるアルコール発酵でエタノールと二酸化炭素（気泡）が生じた。" },
  { id: "dhEt", in: ["ethanol", "h2so4"], t: [160, 170], lowMsg: "エチレンの分子内脱水には160〜170℃の加熱が必要。130〜140℃付近だとエーテルが主になる。", highMsg: "170℃を超えて加熱しすぎた。濃硫酸の強い脱水・酸化作用により有機物が炭化して黒色化した。", out: ["ethylene"], types: ["脱離"], eq: "CH₃−CH₂−OH → CH₂=CH₂ + H₂O", text: "エタノール1分子から水が外れる「分子内脱水」が起こり、C=C二重結合をもつエチレンが得られた。" },
  { id: "dhEther", in: ["ethanol", "h2so4"], t: [130, 140], lowMsg: "温度が低く脱水反応がほとんど進行しない。", highMsg: "温度が高すぎる（160℃以上）。エチレンが混成してエーテルを単離できない。", out: ["ether"], types: ["縮合"], eq: "2CH₃−CH₂−OH → C₂H₅−O−C₂H₅ + H₂O", text: "エタノール2分子の間から水1分子が取れる「分子間脱水（縮合）」が起こり、ジエチルエーテルが得られた。" },
  { id: "crack", in: ["naphtha"], t: [700, 900], lowMsg: "ナフサの熱分解（クラッキング）には700℃以上の超高温が必要。", out: ["ethylene", "propene"], types: ["熱分解"], eq: "ナフサ →（熱分解）→ CH₂=CH₂ + CH₂=CH−CH₃ 等", text: "長鎖炭化水素が高温で熱分解開裂し、エチレンとプロペンが生成した。石油化学コンビナートの中核反応。" },
  { id: "pe", in: ["ethylene"], cat: ["poly"], catMsg: POLY_CAT, out: ["polyethylene"], types: ["重合"], eq: "n CH₂=CH₂ → −[CH₂−CH₂]ₙ−", text: "エチレンの二重結合が次々に開いて結合する「付加重合」により、高分子ポリエチレンが合成された。" },
  { id: "pvc", in: ["vinylchloride"], cat: ["poly"], catMsg: POLY_CAT, out: ["pvc"], types: ["重合"], eq: "n CH₂=CHCl → −[CH₂−CHCl]ₙ−", text: "塩化ビニルモノマーが付加重合し、ポリ塩化ビニル（塩ビ樹脂）ができた。" },
  { id: "pp", in: ["propene"], cat: ["poly"], catMsg: POLY_CAT, out: ["pp"], types: ["重合"], eq: "n CH₂=CH−CH₃ → −[CH₂−CH(CH₃)]ₙ−", text: "プロペンが付加重合してポリプロピレンができた。" },
  { id: "bz", in: ["acetylene"], cat: ["Fe"], catMsg: "アセチレンを赤熱した鉄管に通してみよう。", t: [400, 700], lowMsg: "鉄を赤熱させる（400℃以上）必要がある。", out: ["benzene"], types: ["重合"], eq: "3 CH≡CH → C₆H₆", text: "アセチレン3分子が重合（環化三分子重合）して芳香環を形成し、ベンゼンが生成した。第3章への架け橋。" },

  // ===== 第2章 官能基の工房 =====
  // 1. アルコールの酸化
  { id: "ox_me1", in: ["methanol", "kmno4"], cat: ["none", "Cu"], t: [50, 100], lowMsg: "温水浴（50〜100℃）で加熱しよう。", out: ["formaldehyde"], types: ["酸化"], eq: "CH₃OH + [O] → HCHO + H₂O", text: "第1級アルコールであるメタノールが酸化され、刺激臭のホルムアルデヒドが生じた。" },
  { id: "ox_me2", in: ["formaldehyde", "kmno4"], t: [20, 70], out: ["formic_acid"], types: ["酸化"], eq: "HCHO + [O] → HCOOH", text: "ホルムアルデヒドがさらに酸化され、ギ酸が生成した。ギ酸は還元性をもつ唯一のカルボン酸。" },
  { id: "ox_et1", in: ["ethanol", "kmno4"], cat: ["none", "Cu"], t: [50, 100], lowMsg: "温水浴（50〜100℃）で加熱しよう。赤熱銅線を通してもよい。", out: ["acetaldehyde"], types: ["酸化"], eq: "CH₃CH₂OH + [O] → CH₃CHO + H₂O", text: "エタノールが酸化（脱水素）され、刺激臭のアセトアルデヒドが生じた。第1級アルコールの第1段階の酸化。" },
  { id: "ox_et2", in: ["acetaldehyde", "kmno4"], t: [20, 70], out: ["acetic_acid"], types: ["酸化"], eq: "CH₃CHO + [O] → CH₃COOH", text: "アセトアルデヒドがさらに酸化され、食酢の成分である酢酸が得られた。" },
  { id: "ox_pr", in: ["isopropanol", "kmno4"], t: [50, 100], lowMsg: "温水浴（50〜100℃）で加熱しよう。", out: ["acetone"], types: ["酸化"], eq: "CH₃CH(OH)CH₃ + [O] → CH₃COCH₃ + H₂O", text: "第2級アルコールの2-プロパノールが酸化（脱水素）され、ケトンであるアセトンが生じた。ケトンはこれ以上酸化されにくい。" },

  // 2. エステル化とけん化
  { id: "ester_et", in: ["acetic_acid", "ethanol"], cat: ["H2SO4_cat"], catMsg: "エステル化には触媒兼脱水剤として濃硫酸が必要だ。", t: [60, 90], lowMsg: "温水浴（60〜80℃）で加熱しよう。", out: ["ethyl_acetate"], types: ["縮合"], eq: "CH₃COOH + C₂H₅OH ⇄ CH₃COOC₂H₅ + H₂O", text: "カルボン酸とアルコールが脱水縮合（エステル化）し、爽やかな果実臭をもつ酢酸エチルが生成した！" },
  { id: "sapon_et", in: ["ethyl_acetate", "naoh"], t: [60, 90], lowMsg: "温水浴（60〜80℃）で加熱しよう。", out: ["sodium_acetate", "ethanol"], types: ["加水分解"], eq: "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH", text: "強塩基（水酸化ナトリウム）によりエステルが不可逆的に加水分解（けん化）され、酢酸ナトリウムとエタノールになった。" },

  // 3. 官能基の検出反応（鑑定）
  { id: "test_na_et", in: ["ethanol", "na"], t: [10, 40], out: ["h2"], types: ["検出", "置換"], eq: "2 C₂H₅OH + 2 Na → 2 C₂H₅ONa + H₂↑", text: "ナトリウム片が気泡を出しながら静かに溶解した！ ヒドロキシ基 −OH の水素がNaに置換され、水素 H₂ 気体が発生した（エーテルは反応しない）。" },
  { id: "test_na_me", in: ["methanol", "na"], t: [10, 40], out: ["h2"], types: ["検出", "置換"], eq: "2 CH₃OH + 2 Na → 2 CH₃ONa + H₂↑", text: "メタノールもヒドロキシ基 −OH をもつため、金属ナトリウムと激しく反応して水素 H₂ が発生した！" },
  { id: "test_na_pr", in: ["isopropanol", "na"], t: [10, 40], out: ["h2"], types: ["検出", "置換"], eq: "2 (CH₃)₂CHOH + 2 Na → 2 (CH₃)₂CHONa + H₂↑", text: "第2級アルコールの2-プロパノールも −OH をもつため、Naと反応して水素 H₂ を発生する。" },
  { id: "test_silver", in: ["acetaldehyde", "tollens"], t: [50, 70], lowMsg: "約60℃の温水浴で温めよう。直火加熱は危険。", out: ["silver", "acetic_acid"], types: ["検出", "酸化"], eq: "CH₃CHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → CH₃COO⁻ + NH₄⁺ + 2Ag↓ + 3NH₃ + H₂O", text: "試験管の内壁にまばゆい純銀の鏡が析出した！ ホルミル基 −CHO が銀イオンを単体銀に還元する「銀鏡反応」。" },
  { id: "test_silver_formic", in: ["formic_acid", "tollens"], t: [50, 70], lowMsg: "約60℃の温水浴で温めよう。", out: ["silver", "co2"], types: ["検出", "酸化"], eq: "HCOOH + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → 2Ag↓ + CO₂ + 4NH₃ + 2H₂O", text: "ギ酸はカルボン酸でありながらホルミル基をもつため、銀鏡反応を示して銀が析出した！" },
  { id: "test_silver_formald", in: ["formaldehyde", "tollens"], t: [50, 70], lowMsg: "約60℃の温水浴で温めよう。", out: ["silver", "formic_acid"], types: ["検出", "酸化"], eq: "HCHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → HCOO⁻ + NH₄⁺ + 2Ag↓ + 3NH₃ + H₂O", text: "ホルムアルデヒドの強い還元力により、美しい銀鏡が試験管壁に析出した！" },
  { id: "test_iodo_ac", in: ["acetone", "i2"], cat: ["none"], t: [50, 70], lowMsg: "温水浴（約60℃）で温めよう。", out: ["iodoform", "sodium_acetate"], types: ["検出"], eq: "CH₃COCH₃ + 3I₂ + 4NaOH → CHI₃↓ + CH₃COONa + 3NaI + 3H₂O", text: "特異臭（消毒薬のにおい）をもつ黄色のヨードホルム沈殿が析出した！ CH₃CO−構造をもつケトンの特異的検出。" },
  { id: "test_iodo_et", in: ["ethanol", "i2"], t: [50, 70], lowMsg: "温水浴（約60℃）で温めよう。", out: ["iodoform"], types: ["検出"], eq: "CH₃CH₂OH + 4I₂ + 6NaOH → CHI₃↓ + HCOONa + 5NaI + 5H₂O", text: "エタノールからも黄色沈殿のヨードホルムが生じた！ CH₃CH(OH)−構造が酸化されてCH₃CO−となり、ヨードホルム反応を示す。" },

  // ===== 第3章 芳香族の迷宮 =====
  // 1. ベンゼンからの置換反応
  { id: "nitro_bz", in: ["benzene", "hno3"], cat: ["H2SO4_cat"], catMsg: "ニトロ化には触媒兼脱水剤として濃硫酸が必要（混酸）。", t: [50, 60], lowMsg: "温水浴（50〜60℃）で温めよう。", highMsg: "60℃を超えるとジニトロベンゼン等の副生物が増えてしまう。", out: ["nitrobenzene"], types: ["置換"], eq: "C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O", text: "濃硝酸と濃硫酸の混酸により、ベンゼン環のHがニトロ基 −NO₂ に置換された！ 苦扁桃油のにおいをもつ黄色油状のニトロベンゼンが沈んだ。" },
  { id: "cl_bz", in: ["benzene", "cl2"], cat: ["Fe"], catMsg: "ベンゼン環のハロゲン置換には鉄（Fe）触媒が必要。", t: [20, 50], out: ["chlorobenzene"], give: ["hcl"], types: ["置換"], eq: "C₆H₆ + Cl₂ → C₆H₅Cl + HCl", text: "鉄触媒の作用で塩素置換が進行し、クロロベンゼンが生じた。副産物のHClも得られた。" },
  
  // 2. トルエンと側鎖酸化
  { id: "ox_tol", in: ["toluene", "kmno4"], t: [70, 100], lowMsg: "温水浴〜沸騰水浴（70〜100℃）で加熱しよう。", out: ["benzoic_acid"], types: ["酸化"], eq: "C₆H₅CH₃ + 3[O] → C₆H₅COOH + H₂O", text: "強酸化剤によりトルエンの側鎖メチル基 −CH₃ が酸化され、カルボキシ基をもつ安息香酸（白色結晶）が析出した！" },

  // 3. アニリンの還元とアセチル化
  { id: "red_ani", in: ["nitrobenzene", "sn"], cat: ["none"], t: [60, 90], lowMsg: "温水浴（60〜80℃）で温めてスズと塩酸で還元しよう。", out: ["aniline"], types: ["置換", "酸化"], eq: "C₆H₅NO₂ + 3Sn + 7HCl → C₆H₅NH₂・HCl + 3SnCl₂ + 2H₂O（NaOHで中和して遊離）", text: "スズと塩酸の強い還元作用でニトロ基がアミノ基に還元され、弱塩基のアニリンが遊離した！" },
  { id: "acet_ani", in: ["aniline", "ac2o"], t: [20, 60], out: ["acetanilide"], types: ["縮合"], eq: "C₆H₅NH₂ + (CH₃CO)₂O → C₆H₅NHCOCH₃ + CH₃COOH", text: "アミノ基が無水酢酸によってアセチル化され、解熱鎮痛剤の元祖である白色結晶のアセトアニリドが生じた！" },

  // 4. 氷冷ジアゾ化とアゾカップリング
  { id: "diazo", in: ["aniline", "nano2"], t: [0, 5], lowMsg: "0℃未満では凍結してしまう。", highMsg: "温度が高すぎる（5℃超）！ ジアゾニウムイオンが分解してフェノールと窒素になってしまう。氷冷（0〜5℃）を維持せよ！", out: ["diazonium"], types: ["その他"], eq: "C₆H₅NH₂ + NaNO₂ + 2HCl → C₆H₅N₂⁺Cl⁻ + NaCl + 2H₂O", text: "氷冷下（0〜5℃）の精密な温度管理により、極めて不安定な塩化ベンゼンジアゾニウムの単離に成功した！" },
  { id: "diazo_hot", in: ["diazonium", "h2o"], t: [30, 80], lowMsg: "温めて（30℃以上）分解させよう。", out: ["phenol"], types: ["加水分解", "脱離"], eq: "C₆H₅N₂⁺Cl⁻ + H₂O → C₆H₅OH + N₂↑ + HCl", text: "ジアゾニウム塩水溶液を温めると窒素ガス N₂ を放出しながら分解し、フェノールが生成した！" },
  { id: "coupling", in: ["diazonium", "phenol"], cat: ["none"], t: [0, 20], out: ["azo_dye"], types: ["縮合"], eq: "C₆H₅N₂⁺Cl⁻ + C₆H₅ONa → C₆H₅−N=N−C₆H₄OH + NaCl", text: "弱アルカリ性下でカップリング反応が起き、鮮やかな橙赤色の沈殿（p-ヒドロキシアゾベンゼン）が一瞬で析出した！ 合成染料の完成！" },

  // 5. フェノールとサリチル酸誘導体・医薬品
  { id: "fe_phenol", in: ["phenol", "fecl3"], t: [10, 40], out: ["phenol"], types: ["検出"], eq: "フェノール性水酸基 + FeCl₃ → 紫色呈色", text: "フェノールに塩化鉄(III)を加えると、美しい紫色に呈色した！ ベンゼン環に直結した−OH（フェノール類）の特異的検出。" },
  { id: "br_phenol", in: ["phenol", "br2"], t: [10, 40], out: ["tribromophenol"], types: ["置換", "検出"], eq: "C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr", text: "フェノール水溶液に臭素水を滴下すると、o-位とp-位が激しく置換されて直ちに白色沈殿（2,4,6-トリブロモフェノール）が生じた！" },
  { id: "picric", in: ["phenol", "hno3"], cat: ["H2SO4_cat"], catMsg: "濃硫酸を触媒として加える。", t: [70, 100], lowMsg: "温水浴（70〜100℃）で加熱しよう。", out: ["picric_acid"], types: ["置換"], eq: "C₆H₅OH + 3HNO₃ → C₆H₂(NO₂)₃OH + 3H₂O", text: "フェノールのo-位とp-位が三重にニトロ化され、強酸性の黄色爆薬「ピクリン酸」が析出した！" },
  { id: "kolbe", in: ["phenol", "co2"], cat: ["none"], t: [120, 150], lowMsg: "コルベ・シュミット反応には120〜140℃の加熱と加圧が必要。", out: ["salicylic_acid"], types: ["付加", "その他"], eq: "C₆H₅ONa + CO₂ → C₆H₄(OH)COONa →（酸析）→ C₆H₄(OH)COOH", text: "フェノールナトリウムに二酸化炭素を高温高圧で反応させ、サリチル酸を合成した！ 医薬品合成の中核素材。" },
  { id: "fe_salicylic", in: ["salicylic_acid", "fecl3"], t: [10, 40], out: ["salicylic_acid"], types: ["検出"], eq: "サリチル酸 + FeCl₃ → 赤紫色呈色", text: "サリチル酸にはフェノール性−OHが残っているため、塩化鉄(III)で鮮やかな赤紫色に呈色した！" },
  { id: "synth_aspirin", in: ["salicylic_acid", "ac2o"], t: [60, 80], lowMsg: "温水浴（60〜80℃）で加熱しよう。", out: ["aspirin"], types: ["縮合"], eq: "C₆H₄(OH)COOH + (CH₃CO)₂O → C₆H₄(OCOCH₃)COOH + CH₃COOH", text: "サリチル酸のフェノール性−OHが無水酢酸でアセチル化され、解熱鎮痛薬アスピリン（アセチルサリチル酸）が生成した！ フェノール性−OHが塞がれたためFeCl₃で呈色しない。" },
  { id: "synth_salicylate", in: ["salicylic_acid", "methanol"], cat: ["H2SO4_cat"], catMsg: "エステル化には濃硫酸触媒が必要。", t: [60, 80], lowMsg: "温水浴（60〜80℃）で温めよう。", out: ["methyl_salicylate"], types: ["縮合"], eq: "C₆H₄(OH)COOH + CH₃OH ⇄ C₆H₄(OH)COOCH₃ + H₂O", text: "サリチル酸のカルボキシ基−COOHがメタノールとエステル化し、湿布薬特有の清涼な芳香をもつサリチル酸メチルが生成した！" }
];

export const COMB = {
  methane: "CH₄ + 2O₂ → CO₂ + 2H₂O",
  ethane: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O",
  propane: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
  ethylene: "C₂H₄ + 3O₂ → 2CO₂ + 2H₂O",
  propene: "2C₃H₆ + 9O₂ → 6CO₂ + 6H₂O",
  acetylene: "2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O",
  methanol: "2CH₃OH + 3O₂ → 2CO₂ + 4H₂O",
  ethanol: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
  acetone: "CH₃COCH₃ + 4O₂ → 3CO₂ + 3H₂O",
  acetic_acid: "CH₃COOH + 2O₂ → 2CO₂ + 2H₂O",
  benzene: "2C₆H₆ + 15O₂ → 12CO₂ + 6H₂O"
};

Object.keys(COMB).forEach(k => {
  RULES.push({
    id: "comb_" + k, in: [k, "o2"], t: [400, 900],
    lowMsg: "混ぜただけでは燃えない。点火（400℃以上）が必要。",
    out: ["co2"], types: ["燃焼"], eq: COMB[k], comb: true,
    text: k === "acetylene" ? "眩い白熱光を放って激しく燃焼した。酸素アセチレン炎は約3000℃に達し鉄を容易に溶断する。" :
          k === "benzene" ? "多量のすす（炭素微粒子）を出しながら燃焼した。炭素含有率が高い芳香族の特徴。" :
          "熱と光を出して激しく酸化（完全燃焼）し、二酸化炭素と水になった。"
  });
});

export const RULE = {};
RULES.forEach(r => { RULE[r.id] = r; });

export const QUESTS1 = [
  { id: "q1", who: "町の薬局", title: "クロロホルムを1本", say: "「かつて麻酔に使われた甘い芳香の液体を展示したい。メタンからクロロホルムを作ってもらえないか」", target: "chcl3",
    hints: ["メタンと塩素をフラスコに入れてみよう。", "アルカンと塩素は暗所では反応しない。光（紫外線）が必要だ。", "光を当てると、置換反応によりH原子が1個ずつClに置き換わっていく。"],
    reward: { src: ["quarry"] }, rewardText: "石灰岩の採石場（炭化カルシウム CaC₂）が解放" },
  { id: "q2", who: "鉄工所", title: "鉄を切る炎", say: "「厚い鉄板を溶断できる3000℃の炎が見たい。アセチレンを酸素で完全燃焼させてくれ」", rx: "comb_acetylene", via: "acetylene",
    hints: ["炭化カルシウム（カーバイド）に水を注ぐとアセチレン気体が発生する。", "得られたアセチレンを酸素（O₂）とともにフラスコへ。", "燃焼には点火が必要。温度を400℃以上に設定しよう。"],
    reward: { src: ["farm", "store"] }, rewardText: "サトウキビ畑（ブドウ糖）と薬品問屋（濃硫酸・HCl）が解放" },
  { id: "q3", who: "青果市場", title: "バナナを熟させるガス", say: "「青い果実を追熟させる植物ホルモンのガス、エチレンが必要だ。作れるかい？」", target: "ethylene",
    hints: ["エチレンは C=C 二重結合をもつ最も単純なアルケン。", "ルートA：アセチレンに水素を1分子付加（触媒：Ni または Pt）。", "ルートB：ブドウ糖を発酵させてエタノールを作り、濃硫酸と160〜170℃で分子内脱水。"],
    reward: { src: ["refinery"] }, rewardText: "製油所（ナフサ）が解放" },
  { id: "q4", who: "水道工事店", title: "塩ビ管の原料", say: "「水道管に使われるポリ塩化ビニル。その単量体（モノマー）になる小さな分子がほしい」", target: "vinylchloride",
    hints: ["塩化ビニルは CH₂=CHCl。二重結合が1つ残っている単量体。", "アセチレンに塩化水素HClを付加する（触媒：HgCl₂）。", "またはエチレンに塩素を付加して1,2-ジクロロエタンを作り、400℃以上で熱分解脱離させる。"],
    reward: { cat: ["poly"] }, rewardText: "重合触媒（チーグラー・ナッタ触媒）が解放" },
  { id: "q5", who: "雑貨店", title: "レジ袋の素材", say: "「薄くてしなやかな高分子素材、ポリエチレンを作ってほしい」", target: "polyethylene",
    hints: ["単量体が多数つながる反応を重合という。", "エチレン単独（フラスコBは空）で、重合触媒を選んで反応させよう。"],
    reward: {}, rewardText: "第4章「高分子化合物」の内容を先取り！" },
  { id: "q6", who: "差出人不明の手紙", title: "六角形の分子", say: "「炭素6個が正六角形の環をつくる、極めて安定な芳香族の母体を作れるだろうか」", target: "benzene",
    hints: ["アセチレン3分子（3 × C₂H₂）が環化重合するとベンゼン（C₆H₆）になる。", "アセチレン単独で、触媒に鉄（Fe）を選択。", "鉄を赤熱させるため、温度を400〜700℃に設定しよう。"],
    reward: {}, rewardText: "第1章クリア！ 第2章「官能基の工房」が完全解禁！" }
];

export const QUESTS2 = [
  { id: "q2_1", who: "町の醸造所", title: "お酢への変化", say: "「ワイン（エタノール）を放置すると酸っぱくなってしまう。酸化剤を使って食酢の主成分である酢酸を作ってほしい」", target: "acetic_acid",
    hints: ["エタノールに酸化剤 [O] を加えて温めると、アセトアルデヒドができる。", "得られたアセトアルデヒドをもう一度酸化剤と反応させると、酢酸になる。"],
    reward: { src: ["reagents2"] }, rewardText: "分析試薬棚（金属Na・銀鏡試薬・ヨウ素液・NaOH）が解放" },
  { id: "q2_2", who: "分析研究所", title: "2本の無色液体", say: "「ラベルの剥がれた2本の液体がある。エタノールとジエチルエーテルだ。金属ナトリウムで水素が出る方を見分けてくれ」", target: "h2",
    hints: ["ヒドロキシ基 −OH をもつアルコールは、金属ナトリウム Na と室温で反応して水素 H₂ を発生する。", "エタノールと Na をフラスコに入れて室温で反応させよう（エーテルは反応しない）。"],
    reward: {}, rewardText: "官能基 −OH の鑑識技術を習得！" },
  { id: "q2_3", who: "香料工房", title: "フルーティーな芳香", say: "「お菓子や塗料に使うパイナップルのような甘い香りの液体、酢酸エチルを合成してほしい」", target: "ethyl_acetate",
    hints: ["酢酸とエタノールをフラスコに入れよう。", "触媒に濃硫酸 H₂SO₄（酸触媒）を選択。", "温水浴（60〜80℃）で加熱すると、エステル化が進行する。"],
    reward: {}, rewardText: "エステル化の奥義を獲得！" },
  { id: "q2_4", who: "鏡職人", title: "純銀の輝き", say: "「ガラスの内側に銀の薄膜を張りたい。アルデヒドの強い還元力を利用して銀鏡反応を起こしてくれ」", target: "silver",
    hints: ["アセトアルデヒドとアンモニア性硝酸銀水溶液（銀鏡試薬）をフラスコへ。", "約60℃の温水浴で静かに温めよう。", "ホルミル基 −CHO が銀イオンを還元して純銀が析出する。"],
    reward: {}, rewardText: "銀鏡反応をマスター！" },
  { id: "q2_5", who: "薬局の検査室", title: "特異臭の黄色沈殿", say: "「特異な薬気臭をもつ黄色い結晶、ヨードホルムを析出させてみてほしい」", target: "iodoform",
    hints: ["アセトン（またはエタノール）をフラスコAに。", "フラスコBにヨウ素液 I₂ を入れ、温水浴（約60℃）で反応させよう。", "アルカリ（NaOH）の存在下で特有の黄色沈殿が生じる。"],
    reward: {}, rewardText: "ヨードホルム反応による構造決定をマスター！" },
  { id: "q2_6", who: "石鹸職人", title: "エステルのけん化", say: "「合成した酢酸エチルを水酸化ナトリウムで分解して、カルボン酸の塩（酢酸ナトリウム）にしてほしい」", target: "sodium_acetate",
    hints: ["酢酸エチルと水酸化ナトリウム NaOH をフラスコへ。", "温水浴（60〜80℃）で加熱すると、エステル結合が不可逆的に開裂する（けん化）。"],
    reward: {}, rewardText: "第2章クリア！ 芳香族化合物の最高峰「第3章 芳香族の迷宮」が解禁！" }
];

export const QUESTS3 = [
  { id: "q3_1", who: "香気の研究者", title: "香気の環", say: "「アセチレンから環化三分子重合で生まれたベンゼン。まずはこの芳香族の母体をフラスコに準備してほしい」", target: "benzene",
    hints: ["芳香族実験室の棚から『ベンゼン』を取り出してフラスコAへ。", "ベンゼンは正六角形の平面分子で、共鳴構造によって極めて安定している。"],
    reward: { src: ["reagents3"] }, rewardText: "第3章 合成試薬（スズ粉末・亜硝酸Na・無水酢酸・塩化鉄(III)など）が解放！" },
  { id: "q3_2", who: "火薬技師", title: "混酸の洗礼", say: "「濃硝酸と濃硫酸を混ぜた混酸を用いて、ベンゼンをニトロ化し、黄色油状のニトロベンゼンを作ってほしい」", target: "nitrobenzene",
    hints: ["ベンゼンと濃硝酸 HNO₃ をフラスコへ。", "触媒兼脱水剤として濃硫酸 H₂SO₄（酸触媒）を選択。", "温水浴（50〜60℃）で加熱しよう（60℃を超えないよう精密管理）。"],
    reward: {}, rewardText: "芳香環の親電子置換反応（ニトロ化）を習得！" },
  { id: "q3_3", who: "染料工房の親方", title: "鮮血と太陽の色", say: "「ニトロベンゼンをスズで還元してアニリンを作り、氷冷ジアゾ化を経てフェノールと結合させた橙赤色のアゾ染料を完成させてくれ！」", target: "azo_dye",
    hints: ["ステップ1：ニトロベンゼンにスズ Sn を加えて温水浴（60〜80℃）で還元し、アニリンを得る。", "ステップ2：アニリンに亜硝酸ナトリウム NaNO₂ を加え、必ず0〜5℃（氷冷）で反応させてジアゾニウム塩を作る！", "ステップ3：ジアゾニウム塩とフェノールを混ぜてカップリングさせると、鮮やかな橙赤色のアゾ染料が析出する！"],
    reward: {}, rewardText: "合成染料の最高峰アゾカップリング反応を完全制覇！" },
  { id: "q3_4", who: "現代製薬研究所", title: "奇跡の万能薬", say: "「サリチル酸から、世界で最も飲まれている解熱鎮痛薬『アスピリン（アセチルサリチル酸）』を合成してほしい」", target: "aspirin",
    hints: ["フェノールに高温高圧でCO₂を反応させてサリチル酸を作る（コルベ・シュミット反応）。", "得られたサリチル酸に無水酢酸 (CH₃CO)₂O をフラスコで加える。", "温水浴（60〜80℃）で加熱するとフェノール性−OHがアセチル化されてアスピリンが完成する！"],
    reward: {}, rewardText: "第3章クリア！ 有機化学の全体系を完全制覇！ 大博士の栄誉！" }
];

export const QUESTS = QUESTS1; // 後方互換性用

export const CHAPTERS = [
  { id: 1, name: "第1章 炭化水素の森", sub: "アルカン・アルケン・アルキン・高分子" },
  { id: 2, name: "第2章 官能基の工房", sub: "アルコール・アルデヒド・ケトン・カルボン酸・エステル・検出反応" },
  { id: 3, name: "第3章 芳香族の迷宮", sub: "ベンゼン誘導体・ニトロ化・アニリン・ジアゾ染料・サリチル酸・医薬品" }
];

export const POS1 = {
  methane: [80, 40], ch3cl: [230, 40], ch2cl2: [380, 40], chcl3: [530, 40], ccl4: [680, 40],
  cac2: [80, 200], acetylene: [230, 200], dibromoethene: [380, 130], tetrabromoethane: [560, 130], acetaldehyde: [380, 260],
  vinylchloride: [700, 240], pvc: [880, 240], benzene: [230, 300],
  ethylene: [400, 380], ethane: [580, 320], chloroethane: [760, 320], dibromoethane: [580, 380], dichloroethane: [580, 440],
  polyethylene: [220, 410], ethanol: [400, 500], ether: [580, 500], glucose: [80, 500],
  naphtha: [80, 620], propene: [300, 630], isopropanol: [500, 560], dibromopropane: [540, 630], propane: [500, 700], pp: [150, 690]
};

export const POS2 = {
  methanol: [120, 100], formaldehyde: [360, 100], formic_acid: [600, 100],
  ethanol: [120, 240], acetaldehyde: [360, 240], acetic_acid: [600, 240], ethyl_acetate: [840, 240],
  isopropanol: [120, 380], acetone: [360, 380], iodoform: [600, 380],
  ether: [120, 520], h2: [360, 520], silver: [600, 520], sodium_acetate: [840, 380]
};

export const POS3 = {
  benzene: [480, 280],
  chlorobenzene: [680, 160],
  toluene: [280, 160],
  benzoic_acid: [100, 160],
  nitrobenzene: [680, 280],
  aniline: [680, 420],
  acetanilide: [880, 420],
  diazonium: [680, 560],
  azo_dye: [480, 660],
  phenol: [480, 440],
  tribromophenol: [300, 440],
  picric_acid: [300, 540],
  salicylic_acid: [480, 340],
  aspirin: [280, 340],
  methyl_salicylate: [480, 160]
};

export const POS = POS1; // 後方互換

export const RAWSRC1 = { methane: "gas", cac2: "quarry", glucose: "farm", naphtha: "refinery" };
export const RAWSRC2 = { methanol: "distill", ethanol: "distill", isopropanol: "distill" };
export const RAWSRC3 = { benzene: "aroma_lab", toluene: "aroma_lab" };
export const RAWSRC = RAWSRC1;

export const MAPNAME1 = {
  methane: "メタン", ch3cl: "クロロメタン", ch2cl2: "ジクロロメタン", chcl3: "クロロホルム", ccl4: "四塩化炭素",
  cac2: "カーバイド", acetylene: "アセチレン", dibromoethene: "ジブロモエテン", tetrabromoethane: "テトラブロモエタン",
  acetaldehyde: "アセトアルデヒド", vinylchloride: "塩化ビニル", pvc: "ポリ塩化ビニル", benzene: "ベンゼン",
  ethylene: "エチレン", ethane: "エタン", chloroethane: "クロロエタン", dibromoethane: "ジブロモエタン",
  dichloroethane: "ジクロロエタン", polyethylene: "ポリエチレン", ethanol: "エタノール", ether: "ジエチルエーテル",
  glucose: "ブドウ糖", naphtha: "ナフサ", propene: "プロペン", isopropanol: "2-プロパノール",
  dibromopropane: "ジブロモプロパン", propane: "プロパン", pp: "ポリプロピレン"
};

export const MAPNAME2 = {
  methanol: "メタノール", formaldehyde: "ホルムアルデヒド", formic_acid: "ギ酸",
  ethanol: "エタノール", acetaldehyde: "アセトアルデヒド", acetic_acid: "酢酸", ethyl_acetate: "酢酸エチル",
  isopropanol: "2-プロパノール", acetone: "アセトン", iodoform: "ヨードホルム",
  ether: "ジエチルエーテル", h2: "水素", silver: "銀（銀鏡）", sodium_acetate: "酢酸ナトリウム"
};

export const MAPNAME3 = {
  benzene: "ベンゼン", chlorobenzene: "クロロベンゼン", toluene: "トルエン", benzoic_acid: "安息香酸",
  nitrobenzene: "ニトロベンゼン", aniline: "アニリン", acetanilide: "アセトアニリド", diazonium: "塩化ベンゼンジアゾニウム",
  azo_dye: "アゾ染料", phenol: "フェノール", tribromophenol: "トリブロモフェノール", picric_acid: "ピクリン酸",
  salicylic_acid: "サリチル酸", aspirin: "アスピリン", methyl_salicylate: "サリチル酸メチル"
};

export const MAPNAME = MAPNAME1;

export const REGIONS1 = [
  ["塩素の洞窟", 430, 84],
  ["アセチレン峠", 120, 146],
  ["エチレン平原", 640, 420],
  ["石油の谷", 190, 560]
];

export const REGIONS2 = [
  ["アルコールとエーテル", 120, 40],
  ["アルデヒドとケトン（カルボニル化合物）", 360, 40],
  ["カルボン酸・エステル・塩", 720, 40],
  ["官能基の検出・鑑識の領域", 360, 470]
];

export const REGIONS3 = [
  ["トルエンと安息香酸（側鎖酸化）", 180, 110],
  ["ベンゼン環の親電子置換", 680, 110],
  ["含窒素芳香族・アゾ染料ルート", 720, 360],
  ["フェノール類・医薬品合成（サリチル酸）", 260, 400]
];

export const REGIONS = REGIONS1;

export const ACH = [
  { id: "first", n: "はじめての合成", d: "反応を1回成功させる", test: s => Object.keys(s.rx).length >= 1 },
  { id: "fail5", n: "失敗は発見のもと", d: "うまくいかない実験を5回試す", test: s => s.fails >= 5 },
  { id: "light", n: "光の使い手", d: "メタンの塩素化置換反応を4段階すべて成功させる", test: s => ["cl1", "cl2", "cl3", "cl4"].every(i => s.rx[i]) },
  { id: "brom", n: "脱色の目利き", d: "臭素水が脱色する物質と脱色しない物質を両方確かめる", test: s => s.flags.brNo && ["brEt", "brAc", "brPr"].some(i => s.rx[i]) },
  { id: "temp", n: "温度の職人", d: "エタノールの温度調節でエーテルとエチレンを作り分ける", test: s => s.rx.dhEt && s.rx.dhEther },
  { id: "two", n: "二つの道", d: "エチレンを2通り以上の製法で合成する", test: s => ["hAc", "dhEt", "crack"].filter(i => s.rx[i]).length >= 2 },
  { id: "seer", n: "予言者", d: "反応の種類の予想を5回的中させる", test: s => s.predN >= 5 },
  { id: "poly", n: "高分子の芽", d: "3種類の合成高分子（PE, PVC, PP）をすべて合成する", test: s => s.found.polyethylene && s.found.pvc && s.found.pp },
  { id: "dex", n: "森の博物学者", d: "第1章の物質図鑑をすべて埋める", test: s => DEX1.every(i => s.found[i]) },
  // ===== 第2章の実績 =====
  { id: "ox_all", n: "酸化の探究者", d: "メタノール・エタノール・2-プロパノールの酸化を成功させる", test: s => s.rx.ox_me1 && s.rx.ox_et1 && s.rx.ox_pr },
  { id: "silver", n: "銀鏡の輝き", d: "銀鏡反応で純銀の鏡を析出させる", test: s => !!s.found.silver },
  { id: "iodo", n: "黄色い結晶", d: "ヨードホルム反応による特異沈殿を成功させる", test: s => !!s.found.iodoform },
  { id: "ester", n: "芳香とけん化", d: "エステル化とけん化（加水分解）の両方を成功させる", test: s => s.rx.ester_et && s.rx.sapon_et },
  { id: "dex2", n: "官能基の巨匠", d: "第2章の物質図鑑をすべて埋める", test: s => DEX2.every(i => s.found[i]) },
  // ===== 第3章の実績 =====
  { id: "nitro", n: "混酸のマスター", d: "ベンゼンの混酸ニトロ化を成功させる", test: s => !!s.rx.nitro_bz },
  { id: "ice_diazo", n: "絶対零度の職人", d: "5℃以下の氷冷でジアゾ化を成功させる", test: s => !!s.rx.diazo },
  { id: "azo", n: "緋色の染料", d: "アゾカップリングで橙赤色染料を析出させる", test: s => !!s.found.azo_dye },
  { id: "aspirin_ach", n: "奇跡の薬効", d: "解熱鎮痛薬アスピリンを合成する", test: s => !!s.found.aspirin },
  { id: "dex3", n: "芳香族の大賢者", d: "第3章の物質図鑑をすべて埋める", test: s => DEX3.every(i => s.found[i]) },
  // ===== 探偵モードの実績 =====
  { id: "det_first", n: "初陣の名探偵", d: "探偵モードで構造決定事件を1件解決する", test: s => Object.keys(s.detective?.solved || {}).length >= 1 },
  { id: "det_all", n: "化学のシャーロック", d: "探偵モードの全8事件を完全解決する", test: s => Object.keys(s.detective?.solved || {}).length >= 8 }
];

export const RANKS = [
  [0, "見習い"],
  [150, "助手"],
  [400, "研究員"],
  [750, "主任研究員"],
  [1150, "合成マスター"],
  [1600, "官能基の泰斗"],
  [2200, "有機化学の大博士"]
];

export const K = 1, OY = 22;
