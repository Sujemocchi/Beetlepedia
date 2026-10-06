/*
 * Beetlepedia core data: the classification tree above genus level, shared
 * country / area names and sources. Each genus lives in data/genera/<id>.js
 * and adds itself with BP.registerGenus().
 *
 * Exported as globals instead of JSON so every page also works from file://
 * (fetch() of local files is blocked there).
 *
 * Hierarchy: group (꽃무지 / 사슴벌레 / 장수풍뎅이) → genus → species → subspecies.
 * A "taxon" is one entry with its own page; it can be a species or a subspecies.
 */
window.BP = {
  // Ranks shared by every group, from kingdom down to superfamily.
  baseTaxonomy: [
    { rank: { ko: "계", en: "Kingdom" }, name: "Animalia", common: { ko: "동물계", en: "Animals" } },
    { rank: { ko: "문", en: "Phylum" }, name: "Arthropoda", common: { ko: "절지동물문", en: "Arthropods" } },
    { rank: { ko: "강", en: "Class" }, name: "Insecta", common: { ko: "곤충강", en: "Insects" } },
    { rank: { ko: "목", en: "Order" }, name: "Coleoptera", common: { ko: "딱정벌레목", en: "Beetles" } },
    { rank: { ko: "상과", en: "Superfamily" }, name: "Scarabaeoidea", common: { ko: "풍뎅이상과", en: "Scarab beetles & allies" } }
  ],

  groups: [
    {
      id: "cetoniinae",
      sci: "Cetoniinae",
      authority: "Leach, 1815",
      color: "#E0823F",
      name: { ko: "꽃무지", en: "Flower chafers", ja: "ハナムグリ" },
      // Ranks below Scarabaeoidea down to this group.
      taxonomy: [
        { rank: { ko: "과", en: "Family" }, name: "Scarabaeidae", common: { ko: "풍뎅이과", en: "Scarab beetles" } },
        { rank: { ko: "아과", en: "Subfamily" }, name: "Cetoniinae", common: { ko: "꽃무지아과", en: "Flower chafers" } }
      ],
      lead: {
        ko: "꽃과 수액, 익은 과일을 찾아 낮에 날아다니는 풍뎅이 무리. 딱지날개를 닫은 채로 난다.",
        en: "Day-flying scarabs that visit flowers, sap and ripe fruit — and fly with their wing-cases closed."
      },
      body: {
        ko: "꽃무지아과는 풍뎅이과에 속하는 큰 무리로, 성충은 꽃가루·꿀·나무 수액·익은 과일처럼 당분이 많은 먹이를 먹는다. 대부분의 딱정벌레는 날 때 딱지날개를 들어 올리지만, 꽃무지는 딱지날개를 닫은 채 옆쪽 틈으로 뒷날개만 내밀어 난다. 유충은 부엽토나 썩은 식물질 속에서 자란다. 아프리카의 골리앗꽃무지처럼 세계에서 가장 무거운 곤충에 드는 종도 이 무리에 속한다.",
        en: "Cetoniinae is a large subfamily of scarab beetles whose adults feed on sugary foods such as pollen, nectar, tree sap and ripe fruit. Most beetles lift their elytra to fly, but flower chafers keep them closed and push only the hindwings out through side notches. Larvae grow in leaf litter and decaying plant matter. The group includes Africa's Goliath beetles, among the heaviest insects on Earth."
      },
      sources: ["wiki-cetoniinae"]
    },
    {
      id: "lucanidae",
      sci: "Lucanidae",
      authority: "Latreille, 1804",
      color: "#D9B44A",
      name: { ko: "사슴벌레", en: "Stag beetles", ja: "クワガタムシ" },
      taxonomy: [
        { rank: { ko: "과", en: "Family" }, name: "Lucanidae", common: { ko: "사슴벌레과", en: "Stag beetles" } }
      ],
      lead: {
        ko: "수컷의 커다란 큰턱이 사슴뿔을 닮은 딱정벌레. 썩은 나무 속에서 유충이 자란다.",
        en: "Beetles named for the males' antler-like mandibles. Their larvae grow inside rotting wood."
      },
      body: {
        ko: "사슴벌레과는 1,000종이 넘는 딱정벌레 과로, 수컷의 큰턱이 사슴뿔처럼 크게 발달한 종이 많다. 수컷은 이 큰턱으로 먹이 자리나 암컷을 두고 다른 수컷과 겨룬다. 같은 종 안에서도 수컷의 몸 크기와 큰턱 길이가 크게 달라, 큰 개체와 작은 개체의 생김새가 딴 종처럼 보이기도 한다. 유충은 썩은 나무 속에서 1년 넘게 자라는 경우가 많다.",
        en: "Lucanidae is a family of more than a thousand species, many with males whose mandibles are enlarged like antlers. Males use them to fight rivals over feeding sites and females. Male size and mandible length vary so much within a species that large and small males can look like different species. Larvae often spend a year or more inside decaying wood."
      },
      sources: ["wiki-lucanidae"]
    },
    {
      id: "dynastinae",
      sci: "Dynastinae",
      authority: "MacLeay, 1819",
      color: "#9FBF4A",
      name: { ko: "장수풍뎅이", en: "Rhinoceros beetles", ja: "カブトムシ" },
      taxonomy: [
        { rank: { ko: "과", en: "Family" }, name: "Scarabaeidae", common: { ko: "풍뎅이과", en: "Scarab beetles" } },
        { rank: { ko: "아과", en: "Subfamily" }, name: "Dynastinae", common: { ko: "장수풍뎅이아과", en: "Rhinoceros beetles" } }
      ],
      lead: {
        ko: "수컷의 머리와 앞가슴에 뿔이 솟은 풍뎅이 무리. 세계에서 가장 긴 딱정벌레가 여기에 속한다.",
        en: "Scarabs whose males carry horns on the head and thorax — including the longest beetles in the world."
      },
      body: {
        ko: "장수풍뎅이아과는 풍뎅이과에 속하는 무리로, 많은 종의 수컷이 머리나 앞가슴등판에 큰 뿔을 가진다. 수컷은 뿔로 상대를 들어 올리거나 밀어내며 싸운다. 유충은 썩은 나무나 부엽토 속에서 자라며 종에 따라 1년 이상 걸린다. 아메리카 열대의 헤라클레스장수풍뎅이는 뿔을 포함한 몸길이로 세계에서 가장 긴 딱정벌레로 꼽힌다.",
        en: "Dynastinae is a subfamily of scarab beetles in which males of many species bear large horns on the head or pronotum, used to lift or push rivals in fights. Larvae grow in decaying wood or leaf litter, taking a year or more in some species. The Hercules beetle of tropical America is counted as the longest beetle in the world when its horn is included."
      },
      sources: ["wiki-dynastinae"]
    }
  ],

  // Filled by data/genera/*.js
  genera: [],
  taxa: [],

  // ISO 3166-1 alpha-3 (plus a few territories split out of France in the maps).
  countries: {
    // Africa
    AGO: { ko: "앙골라", en: "Angola" },
    BEN: { ko: "베냉", en: "Benin" },
    BFA: { ko: "부르키나파소", en: "Burkina Faso" },
    CAF: { ko: "중앙아프리카공화국", en: "Central African Republic" },
    CIV: { ko: "코트디부아르", en: "Côte d'Ivoire" },
    CMR: { ko: "카메룬", en: "Cameroon" },
    COD: { ko: "콩고민주공화국", en: "DR Congo" },
    COG: { ko: "콩고공화국", en: "Republic of the Congo" },
    GAB: { ko: "가봉", en: "Gabon" },
    GHA: { ko: "가나", en: "Ghana" },
    GNQ: { ko: "적도기니", en: "Equatorial Guinea" },
    KEN: { ko: "케냐", en: "Kenya" },
    LBR: { ko: "라이베리아", en: "Liberia" },
    MOZ: { ko: "모잠비크", en: "Mozambique" },
    MWI: { ko: "말라위", en: "Malawi" },
    NGA: { ko: "나이지리아", en: "Nigeria" },
    SLE: { ko: "시에라리온", en: "Sierra Leone" },
    TGO: { ko: "토고", en: "Togo" },
    TZA: { ko: "탄자니아", en: "Tanzania" },
    UGA: { ko: "우간다", en: "Uganda" },
    ZAF: { ko: "남아프리카공화국", en: "South Africa" },
    ZMB: { ko: "잠비아", en: "Zambia" },
    ZWE: { ko: "짐바브웨", en: "Zimbabwe" },
    // Asia & Oceania
    BRN: { ko: "브루나이", en: "Brunei" },
    CHN: { ko: "중국", en: "China" },
    IDN: { ko: "인도네시아", en: "Indonesia" },
    IND: { ko: "인도", en: "India" },
    KHM: { ko: "캄보디아", en: "Cambodia" },
    LAO: { ko: "라오스", en: "Laos" },
    MMR: { ko: "미얀마", en: "Myanmar" },
    MYS: { ko: "말레이시아", en: "Malaysia" },
    PHL: { ko: "필리핀", en: "Philippines" },
    PNG: { ko: "파푸아뉴기니", en: "Papua New Guinea" },
    SGP: { ko: "싱가포르", en: "Singapore" },
    SLB: { ko: "솔로몬 제도", en: "Solomon Islands" },
    THA: { ko: "태국", en: "Thailand" },
    TLS: { ko: "동티모르", en: "Timor-Leste" },
    TWN: { ko: "타이완", en: "Taiwan" },
    VNM: { ko: "베트남", en: "Vietnam" },
    // Americas
    BLZ: { ko: "벨리즈", en: "Belize" },
    BOL: { ko: "볼리비아", en: "Bolivia" },
    BRA: { ko: "브라질", en: "Brazil" },
    COL: { ko: "콜롬비아", en: "Colombia" },
    CRI: { ko: "코스타리카", en: "Costa Rica" },
    DMA: { ko: "도미니카 연방", en: "Dominica" },
    ECU: { ko: "에콰도르", en: "Ecuador" },
    GLP: { ko: "과들루프 (프랑스)", en: "Guadeloupe (France)" },
    GTM: { ko: "과테말라", en: "Guatemala" },
    GUF: { ko: "프랑스령 기아나", en: "French Guiana" },
    GUY: { ko: "가이아나", en: "Guyana" },
    HND: { ko: "온두라스", en: "Honduras" },
    LCA: { ko: "세인트루시아", en: "Saint Lucia" },
    MEX: { ko: "멕시코", en: "Mexico" },
    MTQ: { ko: "마르티니크 (프랑스)", en: "Martinique (France)" },
    NIC: { ko: "니카라과", en: "Nicaragua" },
    PAN: { ko: "파나마", en: "Panama" },
    PER: { ko: "페루", en: "Peru" },
    SLV: { ko: "엘살바도르", en: "El Salvador" },
    SUR: { ko: "수리남", en: "Suriname" },
    TTO: { ko: "트리니다드 토바고", en: "Trinidad and Tobago" },
    VEN: { ko: "베네수엘라", en: "Venezuela" }
  },

  /*
   * Sub-national areas (islands, regions) for ranges that a country fill would
   * misrepresent. A map polygon belongs to an area when its country is listed
   * and its centroid falls inside `box` [lonMin, latMin, lonMax, latMax] and
   * outside every `exclude` box. Genus files may add more with `areas`.
   */
  areas: {},

  // Sources used by several genera / pages.
  sources: {
    "wiki-cetoniinae": { title: "Cetoniinae — Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Cetoniinae" },
    "wiki-lucanidae": { title: "Stag beetle (Lucanidae) — Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Stag_beetle" },
    "wiki-dynastinae": { title: "Dynastinae — Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Dynastinae" },
    "naturalearth": { title: "Natural Earth country boundaries (public domain) via world-atlas 2.0.2", url: "https://github.com/topojson/world-atlas" }
  },

  // Region maps, keyed by id; filled by assets/maps/*.js (BP_MAPS) — listed here for labels.
  maps: {
    africa: { name: { ko: "아프리카", en: "Africa" } },
    "southeast-asia": { name: { ko: "동남아시아 · 뉴기니", en: "Southeast Asia & New Guinea" } },
    neotropics: { name: { ko: "중남미 · 카리브해", en: "Central & South America, Caribbean" } }
  },

  registerGenus: function (g) {
    var BP = window.BP;
    BP.genera.push(g);
    (g.taxa || []).forEach(function (t) {
      t.genus = g.id;
      t.group = g.group;
      BP.taxa.push(t);
    });
    Object.keys(g.sources || {}).forEach(function (k) { BP.sources[k] = g.sources[k]; });
    Object.keys(g.areas || {}).forEach(function (k) { BP.areas[k] = g.areas[k]; });
    Object.keys(g.countries || {}).forEach(function (k) { BP.countries[k] = g.countries[k]; });
  }
};
