/*
 * Goliathus Lamarck, 1801 — 골리앗꽃무지속 (Cetoniinae).
 *
 * Every number comes from a source listed in `sources`.
 * Uncertain values are flagged with `estimate: true` or phrased as "reported".
 */
BP.registerGenus({
  "id": "goliathus",
  "group": "cetoniinae",
  "sci": "Goliathus",
  "authority": "Lamarck, 1801",
  "map": "africa",
  "sizeDefaults": ["goliathus-goliatus", "goliathus-regius", "goliathus-albosignatus"],
  "color": "#E0823F",
  "name": { "ko": "골리앗꽃무지속", "en": "Goliath beetles" },
  "shortName": { "ko": "골리앗꽃무지", "en": "Goliath Beetles" },
  "taxonomy": [
    {
      "rank": { "ko": "족", "en": "Tribe" },
      "name": "Goliathini",
      "common": { "ko": "골리앗꽃무지족", "en": "Goliath chafers" }
    },
    {
      "rank": { "ko": "속", "en": "Genus" },
      "name": "Goliathus",
      "common": { "ko": "골리앗꽃무지속", "en": "Goliath beetles" }
    }
  ],
  "eyebrow": { "ko": "아프리카 열대의 거인", "en": "Giants of tropical Africa" },
  "lead": { "ko": "세계에서 가장 무거운 곤충 중 하나. 아프리카 숲과 사바나에 사는 Goliathus 속 5종을 만나 보세요.", "en": "Among the heaviest insects on Earth. Meet five species of Goliathus from Africa's forests and savannas." },
  "heroStats": [
    {
      "value": "115",
      "unit": " mm",
      "label": { "ko": "수컷 최대 몸길이 (보고)", "en": "Max. male length (reported)" }
    },
    {
      "value": "100",
      "unit": " g+",
      "label": { "ko": "유충 최대 무게 (보고)", "en": "Max. larval weight (reported)" }
    }
  ],
  "overview": {
    "kicker": { "ko": "Goliathus Lamarck, 1801", "en": "Goliathus Lamarck, 1801" },
    "body": { "ko": "골리앗꽃무지속은 풍뎅이과 꽃무지아과에 속하는 대형 딱정벌레 무리다. 크기·부피·무게를 모두 따지면 지구에서 가장 큰 곤충에 든다. 아프리카의 열대림과 사바나에 살며, 성충은 주로 나무 수액과 과일을 먹는다. 수컷은 머리에 Y자 뿔이 있어 먹이 자리나 짝을 두고 싸울 때 지렛대처럼 쓰고, 암컷은 뿔 대신 쐐기 모양 머리로 흙을 파고 알을 낳는다. 모든 종의 앞가슴등판에는 대비가 뚜렷한 검은 세로줄이 있고, 종은 주로 딱지날개의 색과 무늬로 구별한다.", "en": "Goliathus is a genus of large flower chafers (Scarabaeidae: Cetoniinae). Measured by size, bulk and weight together, they rank among the largest insects on Earth. They live in Africa's tropical forests and savannas, and adults feed mainly on tree sap and fruit. Males carry a Y-shaped head horn used as a pry bar in fights over food and mates; females instead have a wedge-shaped head for digging when laying eggs. All species share sharply contrasting black stripes on the pronotum, and are told apart mainly by the colour and pattern of the elytra." },
    "cards": [
      {
        "title": { "ko": "이름의 유래", "en": "Where the name comes from" },
        "text": { "ko": "속 이름은 성경에 나오는 블레셋의 거인 골리앗(Goliath)에서 따왔다. 1801년 프랑스 박물학자 라마르크가 이 속을 세웠다.", "en": "The genus is named after Goliath, the Philistine giant of the Bible. French naturalist Lamarck erected the genus in 1801." }
      },
      {
        "title": { "ko": "닫힌 날개로 난다", "en": "Flying with closed wing-cases" },
        "text": { "ko": "대부분의 딱정벌레는 날 때 딱지날개를 펼치지만, 골리앗꽃무지를 비롯한 꽃무지아과는 딱지날개를 닫은 채 옆 틈으로 뒷날개만 내밀어 난다.", "en": "Most beetles lift their elytra to fly, but Goliath beetles — like all flower chafers — keep them closed and fly with only the hindwings slipped out from the sides." }
      }
    ],
    "speciesNote": { "ko": "Catalogue of Life는 이 속에 6종을 싣고 있다. 이 사이트는 그중 5종을 다루며, 아속 Argyrophegges로 따로 분류되는 G. kolbei는 제외했다.", "en": "The Catalogue of Life lists six species. This site covers five; G. kolbei, placed in the separate subgenus Argyrophegges, is not included." }
  },
  "lifecycle": {
    "lead": { "ko": "야생에서의 유충 생활은 잘 알려지지 않았고, 아래 내용의 상당 부분은 사육 기록에 바탕을 둡니다.", "en": "Little is known of the larval cycle in the wild; much of what follows comes from captive rearing." },
    "stages": [
      {
        "stage": "egg",
        "title": { "ko": "알", "en": "Egg" },
        "time": { "ko": "기간: 자료 부족", "en": "Duration: insufficient data" },
        "text": { "ko": "암컷이 쐐기 모양 머리로 흙을 파고 들어가 알을 낳는다.", "en": "The female digs into the soil with her wedge-shaped head to lay eggs." }
      },
      {
        "stage": "larva",
        "title": { "ko": "유충", "en": "Larva" },
        "time": { "ko": "야생 약 4개월 (보고) · 사육 시 더 길어짐", "en": "≈ 4 months in the wild (reported) · longer in captivity" },
        "text": { "ko": "다른 꽃무지 유충과 달리 단백질을 많이 필요로 한다. 우기 동안 빠르게 자라 몸길이 13cm 안팎, 무게 약 100g까지 커진다(일부 보고는 최대 25cm).", "en": "Unlike most flower-chafer grubs, they need a lot of protein. They grow fast through the rainy season, reaching around 13 cm and about 100 g (some reports give up to 25 cm)." }
      },
      {
        "stage": "pupa",
        "title": { "ko": "번데기", "en": "Pupa" },
        "time": { "ko": "건기 동안", "en": "Through the dry season" },
        "text": { "ko": "다 자란 유충은 모래흙으로 벽이 얇고 단단한 번데기방을 짓고 그 안에서 번데기가 된다. 탈바꿈을 마친 성충은 건기가 끝날 때까지 방 안에서 쉰다.", "en": "The grown larva builds a thin-walled, hardened cell of sandy soil and pupates inside. The new adult rests in the cell until the dry season ends." }
      },
      {
        "stage": "adult",
        "title": { "ko": "성충", "en": "Adult" },
        "time": { "ko": "사육 시 약 1년 (야생은 더 짧을 것으로 추정)", "en": "≈ 1 year in captivity (likely shorter in the wild)" },
        "text": { "ko": "비가 내리기 시작하면 방을 깨고 나와 짝을 찾는다. 수액과 과일처럼 당분이 많은 먹이를 먹는다.", "en": "When the rains begin it breaks out of the cell and looks for a mate, feeding on sugary foods such as sap and fruit." }
      }
    ]
  },
  "conservation": { "ko": "5종 모두 IUCN 적색목록에서 평가되지 않았다(Not Evaluated). 하지만 서식지 감소, 국제 애완 곤충 거래를 위한 과도한 채집, 기후변화의 잠재적 영향으로 보전 문제가 커지고 있다. 서아프리카에서는 주민 인터뷰로 개체군 감소가 보고되었다.", "en": "None of the five species has been evaluated for the IUCN Red List. Still, habitat loss, over-collection for the international pet trade and the potential impact of climate change pose growing problems. Interview surveys in West Africa report population declines." },
  "care": [
    { "ko": "유충에게는 단백질이 많은 먹이(개·고양이 사료 알갱이 등)를 발효 부엽토·썩은 나무 톱밥 속에 정기적으로 묻어 준다.", "en": "Feed larvae protein-rich food (e.g. dog or cat food pellets) buried regularly in a substrate of moist, decayed leaves and wood." },
    { "ko": "번데기방을 지을 수 있도록 모래질 흙이 필요하다.", "en": "Provide sandy soil so the larva can build its pupal cell." },
    { "ko": "유충끼리 잡아먹는 사례가 보고되어 개별 사육이 권장된다.", "en": "Larvae may cannibalise one another; rear them individually." },
    { "ko": "난이도: 높은 편으로 알려져 있다. 살아 있는 외국산 곤충의 반입은 나라마다 검역 규정이 있으므로(한국은 식물방역법 등) 먼저 확인해야 한다.", "en": "Difficulty: generally considered high. Importing live exotic insects is regulated by quarantine law in most countries — check before acquiring any." }
  ],
  "facts": [
    { "ko": "속 이름은 성경 속 거인 골리앗에서 왔다.", "en": "The genus is named after the biblical giant Goliath." },
    { "ko": "딱지날개를 닫은 채로 난다. 꽃무지아과 공통의 특징이다.", "en": "They fly with their wing-cases closed — a trait shared by all flower chafers." },
    { "ko": "'100g이 넘는다'는 말은 유충 얘기다. 성충은 그 절반 정도로 알려져 있다.", "en": "\"Over 100 g\" is the larva; adults weigh roughly half that." },
    { "ko": "다리 끝마다 날카로운 발톱 한 쌍이 있어 나무줄기와 가지를 단단히 붙잡는다.", "en": "Each leg ends in a pair of sharp claws for gripping trunks and branches." },
    { "ko": "1959년 미국자연사박물관에서 처음 공개된 살아 있는 개체는 '바나나 껍질을 스스로 벗기는' 곤충으로 신문에 소개되었다.", "en": "The first live specimen shown at the American Museum of Natural History in 1959 made the news as a beetle that \"peels its own bananas\"." },
    { "ko": "G. regius와 G. cacicus는 사는 곳이 겹쳐 야생에서 교잡종이 나온다. 한때 Goliathus atlas라는 별개의 종으로 기재되었을 만큼 독특한 모습이다.", "en": "G. regius and G. cacicus overlap in the wild and occasionally hybridise — the hybrids once got their own species name, Goliathus atlas." }
  ],
  "defaults": {
    "dimorphism": { "ko": "수컷은 머리에 Y자 뿔이 있어 다른 수컷과 싸울 때 지렛대로 쓴다. 암컷은 뿔이 없고 쐐기 모양 머리로 흙을 파서 알을 낳는다.", "en": "Males have a Y-shaped head horn used as a lever in fights with rivals. Females lack the horn and have a wedge-shaped head for digging to lay eggs." },
    "food": { "ko": "유충: 단백질 요구량이 높음 · 성충: 나무 수액, 과일", "en": "Larva: high protein requirement · Adult: tree sap, fruit" },
    "season": { "ko": "우기에 성충이 나와 짝짓기를 하고, 번데기·성충 휴면은 건기에 이루어진다.", "en": "Adults emerge and mate in the rainy season; pupation and adult dormancy fall in the dry season." }
  },
  "weights": {
    "note": { "ko": "종별 무게 자료는 거의 발표되지 않아 속 전체 기준으로 표시했습니다. 흔히 말하는 '100g 이상'은 성충이 아니라 유충의 무게입니다.", "en": "Per-species weights are rarely published, so genus-level figures are shown. The often-quoted \"over 100 g\" refers to larvae, not adults." },
    "items": [
      {
        "label": { "ko": "골리앗꽃무지 성충 (최대)", "en": "Goliath beetle adult (max.)" },
        "value": 50,
        "approx": true,
        "estimate": true,
        "note": { "ko": "유충 최대 무게의 약 절반", "en": "about half the larval maximum" },
        "sources": ["wiki-genus"]
      },
      {
        "label": { "ko": "골리앗꽃무지 유충 (최대)", "en": "Goliath beetle larva (max.)" },
        "value": 100,
        "plus": true,
        "reported": true,
        "note": { "ko": "사육 개체 보고, 100g을 넘기도 함", "en": "reported in captivity; can exceed 100 g" },
        "sources": ["meyer", "wiki-genus"]
      }
    ]
  },
  "latin": ["Scarabaeus goliatus", "Scarabaeus cacicus", "Cetonia cacica", "Fornasinius", "Argyrophegges", "Goliathus africanus", "Goliathus drurii", "Goliathus princeps", "Goliathus albopictus", "Goliathus atlas", "G. meleagris", "G. kolbei", "G. giganteus", "G. giganteus orientalis", "G. goliathus preissi", "G. orientalis usambarensis", "G. albosignatus kirkianus"],
  "images": {
    "hero": {
      "file": "Goliath beetles (25553087544).jpg",
      "author": "Thomas Quine",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "alt": { "ko": "표본 상자 속 골리앗꽃무지들", "en": "Goliath beetles in a specimen display" }
    },
    "overview": {
      "file": "Goliathus regius, Goliathus cacicus, Goliathus orientalis (10656790965).jpg",
      "author": "Gennady Grachev",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "alt": { "ko": "G. regius, G. cacicus, G. orientalis 표본을 나란히 놓은 사진", "en": "Specimens of G. regius, G. cacicus and G. orientalis side by side" }
    }
  },
  "taxa": [
    {
      "id": "goliathus-goliatus",
      "rank": "species",
      "sci": "Goliathus goliatus",
      "authority": "(Linnaeus, 1771)",
      "year": 1771,
      "color": "#E0823F",
      "name": { "ko": "골리앗꽃무지", "en": "Goliath beetle" },
      "nameNote": { "ko": "국내에서 가장 널리 쓰이는 이름. 속의 대표종(모식종)이다.", "en": "The most widely used common name; the genus' type species." },
      "size": {
        "male": [50, 110],
        "female": [54, 80],
        "sources": ["wiki-goliatus"]
      },
      "pattern": { "ko": "앞가슴등판은 검은 바탕에 흰 세로줄, 딱지날개는 짙은 갈색(전형형). 흰색이 많은 형태도 있다.", "en": "Black pronotum with whitish stripes; dark-brown elytra in the typical form, with white-marked forms too." },
      "morphology": { "ko": "속에서 가장 큰 종 가운데 하나로, 넓고 납작한 몸에 굵고 튼튼한 다리를 가졌다. 머리는 희고, 수컷은 검은 Y자 뿔을 가진다. 딱지날개 색은 개체군에 따라 크게 달라서, 흰 바탕의 \"quadrimaculatus\" 형과 여러 중간형이 베냉·나이지리아 동부·카메룬 서부에서 갈색 전형형과 함께 나타난다.", "en": "One of the largest species in the genus, with a broad, flat body and strong legs. The head is whitish and males carry a black Y-shaped horn. Elytral colour is highly variable: the mostly white \"quadrimaculatus\" form and several intermediate forms occur alongside the brown typical form in Benin, eastern Nigeria and western Cameroon." },
      "distribution": ["NGA", "CMR", "CAF", "GAB", "COG", "COD", "UGA", "KEN", "TZA"],
      "distributionNote": { "ko": "적도 아프리카 서부~동부에 넓게 분포. 케냐는 서부, 탄자니아는 북서부에 한정. 흰색 형태는 베냉에서도 보고됨.", "en": "Widespread across equatorial Africa. Kenya: western part only; Tanzania: north-west only. White forms are also reported from Benin." },
      "habitat": { "ko": "적도 열대우림과 그 주변의 아적도 사바나", "en": "Equatorial forests and sub-equatorial savanna" },
      "ecology": { "ko": "성충은 주로 나무 수액과 과일을 먹는다. 수컷은 Y자 뿔을 지렛대처럼 써서 먹이 자리나 짝을 두고 다른 수컷과 싸운다.", "en": "Adults feed mainly on tree sap and fruit. Males use the Y-shaped horn as a pry bar in fights over feeding sites and mates." },
      "conservation": {
        "status": { "ko": "평가되지 않음 (IUCN)", "en": "Not Evaluated (IUCN)" },
        "text": { "ko": "상업적으로 인기 있는 흰색 형태가 다형 개체군 안에서 줄어들고 있다는 연구가 있다(Dendi et al. 2021). 채집·거래 압력과 서식지 감소가 주요 위협으로 꼽힌다.", "en": "A study reports a decline of the commercially attractive white morph within polymorphic populations (Dendi et al. 2021). Collection for trade and habitat loss are the main threats." }
      },
      "facts": [
        { "ko": "린네가 1771년 처음 기재할 때는 Scarabaeus goliatus라는 이름을 붙였다.", "en": "Linnaeus first described it in 1771 as Scarabaeus goliatus." },
        { "ko": "1959년 1월 1일, 가봉에서 온 개체가 미국자연사박물관에 전시되었다. 미국에서 처음 공개된 살아 있는 골리앗꽃무지로 여겨진다.", "en": "On 1 January 1959 a live specimen from Gabon went on display at the American Museum of Natural History — believed to be the first live one seen in the US." },
        { "ko": "G. meleagris를 이 종의 아종으로 보는 견해가 있다(De Palma et al. 2020).", "en": "G. meleagris is sometimes treated as a subspecies of this species (De Palma et al. 2020)." }
      ],
      "history": [
        {
          "year": 1771,
          "ko": "린네가 Scarabaeus goliatus로 처음 기재. Goliathus 속에서 가장 먼저 기재된 종이다.",
          "en": "Linnaeus described it as Scarabaeus goliatus — the first Goliathus species ever described."
        },
        {
          "year": 1801,
          "ko": "라마르크가 이 종을 모식종으로 Goliathus 속을 세움 (당시 이름 Goliathus africanus).",
          "en": "Lamarck erected the genus Goliathus with this species as its type (under the name Goliathus africanus)."
        },
        {
          "year": 1889,
          "ko": "1889–1898년 Kraatz가 딱지날개 무늬가 다른 형태들에 잇달아 이름을 붙였고, 1928년 Sjöstedt, 1960년 Endrödi도 뒤를 이었다. 지금은 모두 동의어이거나 색 형태로 본다.",
          "en": "From 1889 to 1898 Kraatz named one elytral pattern after another, followed by Sjöstedt (1928) and Endrödi (1960). All are now synonyms or colour forms."
        },
        {
          "year": 1959,
          "ko": "1월 1일, 가봉산 살아 있는 개체가 미국자연사박물관에 전시됨.",
          "en": "On 1 January a live specimen from Gabon went on show at the American Museum of Natural History."
        },
        {
          "year": 2020,
          "ko": "DNA 바코딩 연구에서 G. meleagris를 이 종의 아종으로 볼 수 있다는 결과가 나옴.",
          "en": "A DNA-barcoding study supported treating G. meleagris as a subspecies of this species."
        }
      ],
      "issues": [
        {
          "title": { "ko": "흰색 형태의 감소", "en": "Decline of the white morph" },
          "text": { "ko": "베냉·나이지리아 동부·카메룬 서부의 다형 개체군에서는 흰 딱지날개를 가진 \"quadrimaculatus\" 형이 수집가에게 인기가 높다. 2021년 연구는 이 흰색 형태가 개체군 안에서 줄어들고 있다고 보고했고, 선택적 채집 압력이 원인으로 지목된다.", "en": "In the polymorphic populations of Benin, eastern Nigeria and western Cameroon, the white \"quadrimaculatus\" form is prized by collectors. A 2021 study reported that this white morph is declining, pointing to selective collection pressure." },
          "sources": ["dendi2021"]
        }
      ],
      "images": [
        {
          "file": "Goliathus goliatus dos.jpg",
          "author": "Didier Descouens",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "alt": { "ko": "골리앗꽃무지 수컷 표본의 등면. 흰 머리와 검은 줄무늬 앞가슴, 갈색 딱지날개", "en": "Dorsal view of a male Goliathus goliatus specimen: white head, black-striped pronotum, brown elytra" }
        },
        {
          "file": "Goliathus goliatus vol.jpg",
          "author": "Didier Descouens",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "alt": { "ko": "뒷날개를 펼친 비행 자세의 골리앗꽃무지 표본", "en": "Goliathus goliatus specimen in flight position with hindwings spread" }
        },
        {
          "file": "Goliath beetle (Goliathus goliatus), Entomica.jpg",
          "author": "Fungus Guy",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "alt": { "ko": "사람 손 위에 올려진 골리앗꽃무지. 손바닥을 거의 덮는 크기", "en": "A Goliath beetle held on a human hand, covering most of the palm" }
        }
      ],
      "model3d": null,
      "sources": ["wiki-goliatus", "dendi2021", "depalma2020"]
    },
    {
      "id": "goliathus-regius",
      "rank": "species",
      "sci": "Goliathus regius",
      "authority": "Klug, 1835",
      "year": 1835,
      "color": "#F2CF5B",
      "name": { "ko": "레기우스 골리앗꽃무지", "en": "Royal Goliath beetle" },
      "nameInformal": { "ko": true, "en": false, "ja": true },
      "nameNote": { "ko": "공식 국명이 없어 종소명(regius, '왕의')을 음차했다.", "en": "\"regius\" means \"royal\" in Latin." },
      "size": {
        "male": [50, 115],
        "female": [56, 82],
        "sources": ["wiki-regius"]
      },
      "pattern": { "ko": "흰 딱지날개에 복잡한 검은 무늬, 앞가슴등판에 굵은 검은 세로줄", "en": "Whitish elytra with complex black markings; broad black stripe on the pronotum" },
      "morphology": { "ko": "구조와 색이 G. goliatus와 매우 비슷하다. 몸은 넓고 납작하며, 수컷 최대 115mm로 보고되어 속에서 가장 큰 편이다. 다리는 길고 검으며 힘이 세다. 암컷은 앞다리 종아리마디 바깥쪽에 날카로운 가시 두 개가 있다.", "en": "Very similar to G. goliatus in structure and colour. The body is broad and flat; males are reported up to 115 mm, among the largest in the genus. Legs are long, black and powerful. Females have two sharp spikes on the outer edge of the tibiae." },
      "distribution": ["LBR", "SLE", "CIV", "BFA", "GHA", "TGO", "BEN", "NGA", "GNQ"],
      "distributionNote": { "ko": "서아프리카 적도 지역. 부르키나파소는 남부만 해당.", "en": "Western equatorial Africa. Burkina Faso: southern part only." },
      "habitat": { "ko": "서아프리카 열대림", "en": "West African tropical forest" },
      "ecology": { "ko": "몸이 크지만 잘 난다. 성충은 나무 수액과 과일을 먹는다. 유충은 땅속에서 빠르게 자라며 단백질이 많은 먹이가 필요하다. 야생에서는 우기에 해당하는 약 4개월 만에 다 자라고, 번데기방에서 건기를 보낸 뒤 비가 오면 성충이 나온다.", "en": "Despite its size it flies well. Adults feed on tree sap and fruit. Larvae grow fast in the soil and need protein-rich food; in the wild they mature in about 4 months, matching the rainy season, then spend the dry season in a pupal chamber and emerge when the rains return." },
      "conservation": {
        "status": { "ko": "평가되지 않음 (IUCN)", "en": "Not Evaluated (IUCN)" },
        "text": { "ko": "서아프리카에서 주민 인터뷰를 바탕으로 골리앗꽃무지 개체군 감소가 보고되었다(Dendi et al. 2023). 표본·애완 거래용 채집과 산림 파괴가 주요 위협이다.", "en": "Interview-based surveys report declining Goliath beetle populations in West Africa (Dendi et al. 2023). Collection for the specimen and pet trade and forest loss are the main threats." }
      },
      "facts": [
        { "ko": "종소명 regius는 라틴어로 '왕의'라는 뜻이다.", "en": "The name regius is Latin for \"royal\"." },
        { "ko": "1960년 한 해에만 이 종의 색 변이 20여 개에 각각 이름이 붙었으나 지금은 모두 동의어로 정리되었다.", "en": "In 1960 alone, over twenty colour variants were given separate names — all now treated as synonyms." },
        { "ko": "시카고 필드박물관에는 쥐와 나란히 놓고 크기를 비교한 전시가 있다.", "en": "The Field Museum in Chicago displays one next to a mouse for scale." }
      ],
      "history": [
        {
          "year": 1835,
          "ko": "Klug가 기재. 아돌프 에르만의 세계일주 여행에서 수집된 동식물 목록에 실린 논문이었다.",
          "en": "Described by Klug in a report on animals and plants collected during Adolf Erman's journey around the world."
        },
        {
          "year": 1837,
          "ko": "Westwood가 곤충 화가 드루리(Dru Drury)의 이름을 딴 Goliathus drurii를 기재했으나 지금은 동의어다.",
          "en": "Westwood described Goliathus drurii, named after the naturalist-illustrator Dru Drury — now a synonym."
        },
        {
          "year": 1887,
          "ko": "Nickerl이 G. cacicus와의 교잡 개체를 Goliathus atlas로 기재함 (아래 참고).",
          "en": "Nickerl described a hybrid with G. cacicus as Goliathus atlas (see below)."
        },
        {
          "year": 1960,
          "ko": "Endrödi가 색 변이 20여 개에 각각 이름을 붙였으나 모두 동의어로 정리됨.",
          "en": "Endrödi gave names to twenty-odd colour variants, all since sunk into synonymy."
        }
      ],
      "issues": [
        {
          "title": { "ko": "자연 교잡종 Goliathus \"atlas\"", "en": "The natural hybrid Goliathus \"atlas\"" },
          "text": { "ko": "G. regius와 G. cacicus는 서아프리카에서 분포가 겹치는데, 두 종 사이에서 태어난 것으로 강하게 추정되는 개체가 야생에서 채집된다. 1887년 Nickerl이 이를 Goliathus atlas라는 별개의 종으로 기재했지만, 지금은 진짜 종이 아니라 교잡 개체로 보며 학명은 두 종의 동의어 목록에 올라 있다. 몸길이 55–85mm, 흰 딱지날개의 검은 가로띠가 불규칙한 점으로 줄어든 모습이 특징이다. 채집된 표본이 몇 개뿐인 매우 드문 형태로, 부르키나파소와 코트디부아르에서 알려져 있다.", "en": "G. regius and G. cacicus overlap in West Africa, and wild individuals strongly believed to be hybrids of the two have been collected. Nickerl described one as a separate species, Goliathus atlas, in 1887; today it is regarded as a hybrid rather than a true species, and the name is listed among the synonyms of both parents. It measures 55–85 mm and has white elytra whose black cross-bands are reduced to irregular spots. Only a few specimens are known, from Burkina Faso and Côte d'Ivoire." },
          "sources": ["nw-atlas", "wiki-regius", "wiki-cacicus"]
        }
      ],
      "images": [
        {
          "file": "Goliathus-regius hg.jpg",
          "author": "Hannes Grobe",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "alt": { "ko": "레기우스 골리앗꽃무지 표본. 흰 딱지날개에 검은 무늬", "en": "Goliathus regius specimen: white elytra with black markings" }
        }
      ],
      "model3d": null,
      "sources": ["wiki-regius", "dendi2023", "nw-regius", "nw-atlas"]
    },
    {
      "id": "goliathus-orientalis",
      "rank": "species",
      "sci": "Goliathus orientalis",
      "authority": "Moser, 1909",
      "year": 1909,
      "color": "#63B0E6",
      "name": { "ko": "오리엔탈리스 골리앗꽃무지", "en": "Eastern Goliath beetle" },
      "nameInformal": { "ko": true, "en": true, "ja": true },
      "nameNote": { "ko": "공식 국명이 없어 종소명(orientalis, '동쪽의')을 음차했다.", "en": "No established English name; \"orientalis\" means \"eastern\"." },
      "subspecies": [
        {
          "sci": "G. orientalis orientalis",
          "authority": "Moser, 1909"
        },
        {
          "sci": "G. orientalis usambarensis",
          "authority": "Preiss, 1933"
        }
      ],
      "size": {
        "male": [50, 100],
        "female": [50, 65],
        "sources": ["wiki-orientalis", "nw-orientalis"]
      },
      "pattern": { "ko": "흰 딱지날개에 검은 고리 모양 무늬, 앞가슴등판에 넓은 검은 줄이나 검은 부분", "en": "Whitish elytra with black ring-shaped markings; broad black stripes or patch on the pronotum" },
      "morphology": { "ko": "몸은 넓고 납작하다. 흰 딱지날개에 대개 검은 고리 모양의 복잡한 무늬가 있고, 무늬는 아종에 따라 크게 다르다. 수컷은 검은 Y자 뿔을 가진다. 다리는 길고 검다.", "en": "Broad, flat body. Whitish elytra usually carry a complex pattern of black rings, varying greatly between subspecies. Males bear a black Y-shaped horn; legs are long and black." },
      "distribution": ["COD", "TZA", "AGO", "ZMB"],
      "distributionNote": { "ko": "중앙~동아프리카 남부. 아종 usambarensis는 탄자니아 우삼바라 산지 이름에서 따왔다.", "en": "South-central and East Africa. Subspecies usambarensis is named after Tanzania's Usambara Mountains." },
      "habitat": { "ko": "나무 그늘이 있는 사바나", "en": "Savanna, in shady areas with trees" },
      "ecology": { "ko": "사바나의 나무 그늘에서 발견되며, 3마리 이상이 무리 지어 특정 나무의 수액을 빠는 모습이 관찰된다. 유충은 단백질 요구량이 높다.", "en": "Found in shaded savanna, where groups of three or more are seen sipping sap from certain trees. Larvae have a high protein requirement." },
      "captivityNote": { "ko": "사육 시 유충이 다 자라는 데 약 1년 반이 걸린다는 보고가 있으며, 유충이 같은 종이나 다른 종 유충을 잡아먹는 경향이 있어 따로 길러야 한다.", "en": "Captive larvae are reported to take about 18 months to mature and tend to cannibalise other larvae, so they should be kept separately." },
      "conservation": {
        "status": { "ko": "평가되지 않음 (IUCN)", "en": "Not Evaluated (IUCN)" },
        "text": { "ko": "애완 곤충 시장에서 인기가 높고, 성충은 대부분 사육 개체가 아닌 야생 채집 개체로 거래된다.", "en": "Highly valued in the pet trade; adults on the market are mostly wild-caught rather than captive-bred." }
      },
      "facts": [
        { "ko": "처음에는 G. giganteus의 아종(G. giganteus orientalis)으로 기재되었다.", "en": "It was first described as a subspecies, G. giganteus orientalis." },
        { "ko": "이 종의 분류는 2013년 Mawdsley가 따로 정리했다.", "en": "Its taxonomy was reviewed separately by Mawdsley in 2013." }
      ],
      "history": [
        {
          "year": 1909,
          "ko": "Moser가 G. giganteus의 아종(G. giganteus orientalis)으로 기재.",
          "en": "Moser described it as a subspecies, G. giganteus orientalis."
        },
        {
          "year": 1933,
          "ko": "Preiss가 탄자니아 우삼바라 산지의 개체군을 usambarensis로 기재.",
          "en": "Preiss described the Usambara Mountains population in Tanzania as usambarensis."
        },
        {
          "year": 1951,
          "ko": "Endrödi가 G. goliathus preissi 등을 기재했으나 지금은 이 종의 동의어.",
          "en": "Endrödi described G. goliathus preissi and others — now synonyms of this species."
        },
        {
          "year": 2013,
          "ko": "Mawdsley가 이 종의 분류를 따로 정리함.",
          "en": "Mawdsley published a taxonomic review of the species."
        },
        {
          "year": 2020,
          "ko": "DNA 바코딩 연구에서 usambarensis가 G. regius와 가까운 계통으로 나타남.",
          "en": "A DNA-barcoding study placed usambarensis close to G. regius."
        }
      ],
      "issues": [
        {
          "title": { "ko": "야생 채집에 의존하는 거래", "en": "A trade built on wild-caught adults" },
          "text": { "ko": "애완 곤충 시장에서 인기가 높지만 거래되는 성충은 대부분 야생에서 채집된 개체다. 사육 시 유충이 약 1년 반 동안 자라고 서로 잡아먹기도 해서 대량 번식이 어렵기 때문이다.", "en": "The species is popular in the pet trade, but most adults sold are wild-caught: captive larvae take about 18 months to mature and may eat one another, which makes mass breeding hard." },
          "sources": ["wiki-orientalis", "meyer"]
        }
      ],
      "images": [
        {
          "file": "Goliathusorientalis.JPG",
          "author": "Notafly",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "alt": { "ko": "오리엔탈리스 골리앗꽃무지 표본. 흰 딱지날개에 검은 고리 무늬", "en": "Goliathus orientalis specimen with black ring markings on white elytra" }
        },
        {
          "file": "Goliathus orientalis - Sankt-Peterburg.jpg",
          "author": "Andrey Butko",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "alt": { "ko": "상트페테르부르크에서 촬영된 오리엔탈리스 골리앗꽃무지", "en": "Goliathus orientalis photographed in Saint Petersburg" }
        }
      ],
      "model3d": null,
      "sources": ["wiki-orientalis", "mawdsley2013", "meyer", "depalma2020"]
    },
    {
      "id": "goliathus-cacicus",
      "rank": "species",
      "sci": "Goliathus cacicus",
      "authority": "(Olivier, 1789)",
      "year": 1789,
      "color": "#B58CE6",
      "name": { "ko": "카키쿠스 골리앗꽃무지", "en": "Chief goliath" },
      "nameInformal": { "ko": true, "en": false, "ja": true },
      "nameNote": { "ko": "공식 국명이 없어 종소명(cacicus, '추장')을 음차했다.", "en": "\"cacicus\" refers to a chief (cacique)." },
      "size": {
        "male": [50, 100],
        "female": [58, 79],
        "sources": ["wiki-cacicus"]
      },
      "pattern": { "ko": "수컷은 광택 있는 무지갯빛, 암컷은 광택 없는 흰색 (암수 색이 다름)", "en": "Males iridescent; females matte white (sexual dichromatism)" },
      "morphology": { "ko": "암수의 색이 뚜렷하게 다른 '성적 이색성'을 보인다. 수컷은 흔히 무지갯빛 광택을 띠고, 암컷은 광택 없는 흰색이다. 이 차이는 딱지날개 속 섬유 구조가 무작위로 배열된 방식에서 비롯된다는 연구가 있다.", "en": "Shows sexual dichromatism: males are commonly iridescent, while females are white and lack lustre. Research traces this to randomly structured filaments inside the elytra." },
      "distribution": ["LBR", "SLE", "CIV", "BFA", "GHA", "NGA", "GNQ"],
      "distributionNote": { "ko": "서아프리카. G. regius와 분포가 많이 겹친다.", "en": "West Africa, overlapping widely with G. regius." },
      "habitat": { "ko": "서아프리카 열대림", "en": "West African tropical forest" },
      "ecology": { "ko": "다른 골리앗꽃무지처럼 성충은 수액과 과일을 먹고, 유충은 단백질이 많은 먹이로 자란다. 이 종만의 야외 생태 자료는 적다.", "en": "Like other Goliath beetles, adults take sap and fruit and larvae need protein-rich food. Field data specific to this species are scarce." },
      "conservation": {
        "status": { "ko": "평가되지 않음 (IUCN)", "en": "Not Evaluated (IUCN)" },
        "text": { "ko": "서아프리카 골리앗꽃무지 개체군 감소 보고(Dendi et al. 2023)가 이 종의 분포 지역과 겹친다. 채집·거래와 산림 파괴가 위협 요인이다.", "en": "Reported declines of West African Goliath beetles (Dendi et al. 2023) overlap this species' range. Threats are collection for trade and forest loss." }
      },
      "facts": [
        { "ko": "5종 가운데 G. goliatus 다음으로 오래전(1789년)에 기재되었고, 처음 이름은 Cetonia cacica였다.", "en": "The second of the five to be described (1789, after G. goliatus), originally as Cetonia cacica." },
        { "ko": "수컷의 무지갯빛은 색소가 아니라 딱지날개의 미세 구조가 만드는 '구조색'과 관련이 있다(Jiang et al. 2012).", "en": "The males' iridescence is linked to structural colour from the elytral microstructure, not pigment (Jiang et al. 2012)." }
      ],
      "history": [
        {
          "year": 1779,
          "ko": "Voet가 Scarabaeus cacicus라는 이름을 썼지만 명명 규약상 유효하지 않은 이름으로 본다.",
          "en": "Voet used the name Scarabaeus cacicus, but it is considered unavailable under the naming rules."
        },
        {
          "year": 1789,
          "ko": "Olivier가 Cetonia cacica로 정식 기재.",
          "en": "Olivier formally described it as Cetonia cacica."
        },
        {
          "year": 1837,
          "ko": "Hope가 Goliathus princeps로 기재했으나 동의어로 정리됨.",
          "en": "Hope described Goliathus princeps — later sunk as a synonym."
        },
        {
          "year": 1887,
          "ko": "Nickerl이 G. regius와의 교잡 개체를 Goliathus atlas로 기재함 (아래 참고).",
          "en": "Nickerl described a hybrid with G. regius as Goliathus atlas (see below)."
        },
        {
          "year": 2012,
          "ko": "상하이 연구진이 암수 색 차이의 원인을 딱지날개 속 미세 섬유 구조에서 찾음.",
          "en": "Researchers in Shanghai traced the male–female colour difference to microscopic filaments in the elytra."
        }
      ],
      "issues": [
        {
          "title": { "ko": "자연 교잡종 Goliathus \"atlas\"", "en": "The natural hybrid Goliathus \"atlas\"" },
          "text": { "ko": "G. regius와 G. cacicus는 서아프리카에서 분포가 겹치는데, 두 종 사이에서 태어난 것으로 강하게 추정되는 개체가 야생에서 채집된다. 1887년 Nickerl이 이를 Goliathus atlas라는 별개의 종으로 기재했지만, 지금은 진짜 종이 아니라 교잡 개체로 보며 학명은 두 종의 동의어 목록에 올라 있다. 몸길이 55–85mm, 흰 딱지날개의 검은 가로띠가 불규칙한 점으로 줄어든 모습이 특징이다. 채집된 표본이 몇 개뿐인 매우 드문 형태로, 부르키나파소와 코트디부아르에서 알려져 있다.", "en": "G. regius and G. cacicus overlap in West Africa, and wild individuals strongly believed to be hybrids of the two have been collected. Nickerl described one as a separate species, Goliathus atlas, in 1887; today it is regarded as a hybrid rather than a true species, and the name is listed among the synonyms of both parents. It measures 55–85 mm and has white elytra whose black cross-bands are reduced to irregular spots. Only a few specimens are known, from Burkina Faso and Côte d'Ivoire." },
          "sources": ["nw-atlas", "wiki-regius", "wiki-cacicus"]
        }
      ],
      "images": [
        {
          "file": "Goliathus-cacicus hg.jpg",
          "author": "Hannes Grobe",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "alt": { "ko": "카키쿠스 골리앗꽃무지 표본", "en": "Goliathus cacicus specimen" }
        }
      ],
      "model3d": null,
      "sources": ["wiki-cacicus", "jiang2012", "biolib-cacicus", "dendi2023", "nw-atlas"]
    },
    {
      "id": "goliathus-albosignatus",
      "rank": "species",
      "sci": "Goliathus albosignatus",
      "authority": "Boheman, 1857",
      "year": 1857,
      "color": "#6FD69A",
      "name": { "ko": "알보시그나투스 골리앗꽃무지", "en": "White-marked Goliath beetle" },
      "nameInformal": { "ko": true, "en": true, "ja": true },
      "nameNote": { "ko": "공식 국명이 없어 종소명(albosignatus, '흰 표시가 있는')을 음차했다.", "en": "No established English name; \"albosignatus\" means \"white-marked\"." },
      "subspecies": [
        {
          "sci": "G. albosignatus albosignatus",
          "authority": "Boheman, 1857",
          "note": { "ko": "짐바브웨 중남부, 남아공 북동부 · ♂ 40–68 mm, ♀ 45–52 mm", "en": "Central–southern Zimbabwe, NE South Africa · ♂ 40–68 mm, ♀ 45–52 mm" }
        },
        {
          "sci": "G. albosignatus kirkianus",
          "authority": "Gray, 1864",
          "note": { "ko": "말라위, 모잠비크, 탄자니아 · ♂ 40–71 mm, ♀ 45–55 mm", "en": "Malawi, Mozambique, Tanzania · ♂ 40–71 mm, ♀ 45–55 mm" }
        }
      ],
      "size": {
        "male": [45, 70],
        "female": [40, 50],
        "sources": ["wiki-albosignatus", "beetlespace-albo"]
      },
      "pattern": { "ko": "딱지날개를 가로지르는 불규칙한 검은 띠", "en": "Irregular black bands running across the elytra" },
      "morphology": { "ko": "속에서 가장 작은 종이다. 딱지날개를 가로지르는 불규칙한 검은 띠로 다른 종과 구별된다. 수컷의 머리뿔이 망치 모양이고, 발목마디가 길며, 꽁무니판에 흰 분필 같은 무늬가 있다는 점이 분류상 특징이다.", "en": "The smallest species in the genus, told apart by irregular black bands across the elytra. Diagnostic traits include the male's hammer-shaped head horns, elongated tarsi and chalky white marks on the pygidium." },
      "distribution": ["ZWE", "ZAF", "MWI", "MOZ", "TZA"],
      "distributionNote": { "ko": "속에서 유일하게 아열대 지역에만 사는 종. 아종별 분포는 위 아종 목록 참고.", "en": "The only species of the genus found exclusively in subtropical Africa. See subspecies above for ranges." },
      "habitat": { "ko": "아열대 사바나·삼림지대 (아카시아, 마룰라 나무)", "en": "Subtropical savanna and woodland (acacia, marula trees)" },
      "ecology": { "ko": "유충이 바위너구리(하이랙스) 똥 속에서 자란다. 이는 Fornasinius 속과 공통점이며 다른 골리앗꽃무지에는 없는 특징이다. 성충은 아카시아 수액을 먹고, 특히 마룰라 나무에 모인다.", "en": "Larvae develop in hyrax dung — a trait shared with Fornasinius but not with other Goliath beetles. Adults feed on acacia sap and gather especially on marula trees." },
      "conservation": {
        "status": { "ko": "평가되지 않음 (IUCN)", "en": "Not Evaluated (IUCN)" },
        "text": { "ko": "다른 종보다 흔하지 않다고 알려져 있다. 공식 평가는 없으며, 서식지 변화와 채집 압력이 잠재적 위협이다.", "en": "Said to be less commonly found than the other species. There is no formal assessment; habitat change and collection are potential threats." }
      },
      "facts": [
        { "ko": "2020년 DNA 바코딩 분석에서 나머지 골리앗꽃무지들과 가장 먼저 갈라진 계통으로 나타났다.", "en": "A 2020 DNA-barcoding study placed it as the earliest-diverging lineage in the genus." },
        { "ko": "속에서 유일하게 아열대 지역에만 산다.", "en": "It is the only Goliathus restricted to subtropical Africa." }
      ],
      "history": [
        {
          "year": 1857,
          "ko": "스웨덴 곤충학자 Boheman이 기재.",
          "en": "Described by the Swedish entomologist Boheman."
        },
        {
          "year": 1864,
          "ko": "Gray가 말라위·모잠비크·탄자니아 개체군을 kirkianus로 기재. 지금은 아종으로 본다.",
          "en": "Gray described the Malawi–Mozambique–Tanzania population as kirkianus, now treated as a subspecies."
        },
        {
          "year": 1874,
          "ko": "Westwood가 Goliathus albopictus로 기재했으나 동의어로 정리됨.",
          "en": "Westwood described Goliathus albopictus — later sunk as a synonym."
        },
        {
          "year": 2020,
          "ko": "DNA 바코딩 연구에서 속의 나머지 종들과 가장 먼저 갈라진 계통으로 확인됨.",
          "en": "A DNA-barcoding study showed it to be the earliest-branching lineage of the genus."
        }
      ],
      "issues": [
        {
          "title": { "ko": "바위너구리 똥에서 자라는 유충", "en": "Larvae that grow in hyrax dung" },
          "text": { "ko": "다른 골리앗꽃무지 유충은 흙과 썩은 식물질 속에서 자라지만, 이 종의 유충은 바위너구리(하이랙스) 똥 속에서 자란다. 가까운 Fornasinius 속에서만 알려진 방식이다.", "en": "Other Goliath grubs develop in soil and decaying plant matter, but this species develops in hyrax dung — a habit otherwise known only in the related genus Fornasinius." },
          "sources": ["depalma2020"]
        }
      ],
      "images": [
        {
          "file": "Goliathus albosignatusMale.JPG",
          "author": "Notafly",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "alt": { "ko": "알보시그나투스 골리앗꽃무지 수컷 표본. 딱지날개를 가로지르는 검은 띠", "en": "Male Goliathus albosignatus specimen with black bands across the elytra" }
        },
        {
          "file": "Goliathus albosignatusPair.JPG",
          "author": "Notafly",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "alt": { "ko": "알보시그나투스 골리앗꽃무지 암수 한 쌍", "en": "A male and female Goliathus albosignatus" }
        }
      ],
      "model3d": {
        "id": "84ab495a2f204510b9ed131ec25e3418",
        "url": "https://sketchfab.com/3d-models/goliathus-albosignatus-beetle-84ab495a2f204510b9ed131ec25e3418",
        "author": null,
        "license": null
      },
      "sources": ["wiki-albosignatus", "depalma2020", "gbif-albo", "beetlespace-albo", "nw-albo"]
    }
  ],
  "sources": {
    "wiki-genus": {
      "title": "Goliathus — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus"
    },
    "wiki-goliatus": {
      "title": "Goliathus goliatus — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus_goliatus"
    },
    "wiki-regius": {
      "title": "Goliathus regius — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus_regius"
    },
    "wiki-orientalis": {
      "title": "Goliathus orientalis — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus_orientalis"
    },
    "wiki-cacicus": {
      "title": "Goliathus cacicus — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus_cacicus"
    },
    "wiki-albosignatus": {
      "title": "Goliathus albosignatus — Wikipedia (English)",
      "url": "https://en.wikipedia.org/wiki/Goliathus_albosignatus"
    },
    "depalma2020": {
      "title": "De Palma M., Takano H., Leonard P., Bouyer T. (2020). Barcoding analysis and taxonomic revision of Goliathus Lamarck, 1802. Entomologia Africana 25(1): 11–32."
    },
    "dendi2021": {
      "title": "Dendi D. et al. (2021). Decline of the commercially attractive white morph in goliath beetle polymorphic populations. Diversity 13(8): 388.",
      "url": "https://doi.org/10.3390/d13080388"
    },
    "dendi2023": {
      "title": "Dendi D. et al. (2023). Detecting declines of West African Goliath beetle populations based on interviews. Journal of Insect Conservation 27(2): 249–259.",
      "url": "https://doi.org/10.1007/s10841-022-00447-7"
    },
    "mawdsley2013": {
      "title": "Mawdsley J.R. (2013). Taxonomy of the Goliath beetle Goliathus orientalis Moser, 1909. Journal of Natural History 47(21–22).",
      "url": "https://doi.org/10.1080/00222933.2012.763052"
    },
    "jiang2012": {
      "title": "Jiang L. et al. (2012). Chinese Science Bulletin 57: 3211.",
      "url": "https://doi.org/10.1007/s11434-012-5343-4"
    },
    "meyer": {
      "title": "Meyer K. Goliathus Breeding Manual — naturalworlds.org",
      "url": "https://web.archive.org/web/20201107073139/http://www.naturalworlds.org/goliathus/manual/Goliathus_breeding_1.htm"
    },
    "nw-regius": {
      "title": "Goliathus regius — Natural Worlds",
      "url": "https://web.archive.org/web/20141030174609/http://www.naturalworlds.org/goliathus/species/Goliathus_regius.htm"
    },
    "nw-atlas": {
      "title": "Goliathus \"atlas\" — Natural Worlds (archived 2015)",
      "url": "https://web.archive.org/web/20151029193810/http://www.naturalworlds.org/goliathus/species/Goliathus_atlas.htm"
    },
    "nw-orientalis": {
      "title": "Goliathus orientalis — Natural Worlds",
      "url": "http://www.naturalworlds.org/goliathus/species/Goliathus_orientalis.htm"
    },
    "nw-albo": {
      "title": "Goliathus albosignatus — Natural Worlds",
      "url": "http://www.naturalworlds.org/goliathus/species/Goliathus_albosignatus.htm"
    },
    "beetlespace-albo": {
      "title": "Goliathus albosignatus — Beetles Space",
      "url": "http://beetlespace.wz.cz/e_Goliathus_albosignatus_kirkianus.html"
    },
    "biolib-cacicus": {
      "title": "Goliathus cacicus — BioLib",
      "url": "https://www.biolib.cz/en/taxon/id337494/"
    },
    "gbif-albo": {
      "title": "Goliathus albosignatus Boheman, 1857 — GBIF",
      "url": "https://www.gbif.org/species/1076870"
    },
    "col": {
      "title": "Catalogue of Life — Goliathus",
      "url": "https://www.catalogueoflife.org/data/browse?taxonKey=62SJY"
    }
  }
});
