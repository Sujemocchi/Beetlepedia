/*
 * Dynastes MacLeay, 1819 — 헤라클레스장수풍뎅이속 (Dynastinae).
 * Covers every subspecies of Dynastes hercules (Linnaeus, 1758) in the traditional 13-subspecies arrangement;
 * rank disputes (e.g. Huang 2017) are recorded per subspecies as an issue.
 * Built from the research notes of 2026-10-06 (English, Japanese and Korean sources).
 */
BP.registerGenus({
  "id": "dynastes",
  "group": "dynastinae",
  "sci": "Dynastes",
  "authority": "MacLeay, 1819",
  "map": "neotropics",
  "color": "#9FBF4A",
  "name": { "ko": "헤라클레스장수풍뎅이속", "en": "Hercules beetles" },
  "shortName": { "ko": "헤라클레스장수풍뎅이", "en": "Hercules beetles" },
  "taxonomy": [
    {
      "rank": { "ko": "족", "en": "Tribe" },
      "name": "Dynastini",
      "common": { "ko": "장수풍뎅이족", "en": "Dynastini" }
    },
    {
      "rank": { "ko": "속", "en": "Genus" },
      "name": "Dynastes",
      "common": { "ko": "헤라클레스장수풍뎅이속", "en": "Hercules beetles" }
    }
  ],
  "eyebrow": { "ko": "세계에서 가장 긴 딱정벌레", "en": "The longest beetle in the world" },
  "lead": { "ko": "멕시코에서 브라질, 카리브해 섬까지. 뿔을 포함해 18cm에 이르는 헤라클레스장수풍뎅이의 13개 아종을 소개합니다.", "en": "From Mexico to Brazil and the Caribbean islands: meet the 13 subspecies of the Hercules beetle, up to 18 cm long including the horn." },
  "heroStats": [
    {
      "value": "184.3",
      "unit": " mm",
      "label": { "ko": "수컷 최대 몸길이 (사육 기록)", "en": "Max. male length (captive record)" }
    },
    {
      "value": "185",
      "unit": " g",
      "label": { "ko": "유충 최대 무게 (사육 보고)", "en": "Max. larval weight (captive report)" }
    }
  ],
  "speciesInfo": {
    "Dynastes hercules": {
      "authority": "(Linnaeus, 1758)",
      "name": { "ko": "헤라클레스장수풍뎅이", "en": "Hercules beetle" },
      "text": { "ko": "전통적으로 13개 안팎의 아종으로 나뉜다. Huang(2017)은 분자·형태·생태 자료로 10개 분류군을 독립 종으로 승격하고 D. hercules를 과들루프·도미니카 섬 개체군으로 한정했다. iNaturalist는 이를 따르지만 GBIF·위키백과·일본 사육계는 대부분 아종 체계를 유지한다. Ratcliffe(2003)는 모든 아종을 동의어로 보자고 제안했으나 이후 저서에서는 아종 체계를 썼다.", "en": "Traditionally split into c. 13 subspecies. Huang (2017) raised 10 taxa to species on molecular, morphological and ecological data, restricting D. hercules to the Guadeloupe and Dominica populations; iNaturalist follows this, while GBIF, Wikipedia and Japanese breeders largely keep subspecies. Ratcliffe (2003) proposed synonymizing all subspecies but later works (2013, 2015) used them." },
      "sources": ["dy-huang2017-zenodo", "dy-huang2017", "dy-inat", "dy-gbif-dh", "dy-enwiki", "dy-jawiki"]
    }
  },
  "overview": {
    "kicker": { "ko": "Dynastes MacLeay, 1819", "en": "Dynastes MacLeay, 1819" },
    "body": { "ko": "수컷은 머리뿔과 앞가슴등판 뿔이 집게 모양을 이루며, 앞가슴 뿔 아래쪽에 붉은 털이 난다. 암컷은 앞가슴 뿔이 없다. 일부 종은 딱지날개 색이 습도에 따라 노란색·올리브색과 검은색 사이에서 바뀐다. 멕시코 남부에서 볼리비아·브라질까지의 열대림과 소앤틸리스 제도(과들루프, 도미니카, 마르티니크, 세인트루시아), 트리니다드 토바고에 분포한다. 아마존 유역에는 큰 분포 공백이 있다. 습한 열대 산지림·저지대 우림에 살며, 표고 약 600~2000 m에서 주로 채집된다(아종에 따라 해발 0 m 부근부터 운무림까지).", "en": "Males bear a cephalic and a pronotal horn forming a \"plier\", the pronotal horn with reddish setae beneath; females lack the pronotal horn. Several species show humidity-dependent elytral colour (yellow/olive vs black). Tropical forests from southern Mexico to Bolivia and Brazil, plus the Lesser Antilles (Guadeloupe, Dominica, Martinique, Saint Lucia) and Trinidad & Tobago; a large gap exists in the central Amazon basin. Humid montane and lowland rainforest, mostly collected at c. 600–2000 m, though some taxa live near sea level and others in cloud forest." },
    "cards": [
      {
        "title": { "ko": "이름의 유래", "en": "Where the name comes from" },
        "text": { "ko": "그리스·로마 신화에서 괴력으로 유명한 영웅 헤라클레스(헤르쿨레스)에서 따왔다.", "en": "Named after Hercules, the hero of classical mythology famed for his strength." }
      },
      {
        "title": { "ko": "습도에 따라 바뀌는 색", "en": "Colour that changes with humidity" },
        "text": { "ko": "딱지날개 표피 약 3 μm 아래의 다공성 층이 건조하면 빛을 산란해 노란·올리브색으로 보이고, 습도가 높아(약 80% 이상) 물이 스며들면 굴절률 차이가 사라져 검게 보인다. 이 가역적 변색은 Hinton & Jarman(1972·1973)이 처음 자세히 연구했고 Rassart 등(2008)이 광학 구조를 밝혔다.", "en": "A porous layer c. 3 µm below the elytral surface scatters light when dry (khaki/yellow-green) but turns black when water fills it above c. 80% humidity, removing the refractive contrast. Hinton & Jarman (1972, 1973) first studied the reversible change; Rassart et al. (2008) described the photonic structure." }
      },
      {
        "title": { "ko": "\"몸무게 850배\"의 진실", "en": "The \"850 times its weight\" myth" },
        "text": { "ko": "\"자기 몸무게의 850배를 든다\"는 주장은 Rassart 등(2008) 등 여러 곳에 실려 있지만 측정 근거가 제시되지 않았다. 실측 연구(Kram 1996)에서 훨씬 작은 장수풍뎅이류(Xylorctes thestalus)는 몸무게 30배를 지고 계속 걸었고 최대 약 100배에서는 겨우 움직였다. 따라서 850배 주장은 검증되지 않은 과장으로 본다. 별도로 Jarman & Hinton(1974)은 머리뿔(약 50 mm) 끝으로 2 kg 추를 들어 올린 실험을 보고했다.", "en": "The \"carries 850 times its own weight\" claim appears in Rassart et al. (2008) and elsewhere without supporting measurements. Kram (1996) measured a much smaller rhinoceros beetle (Xylorctes thestalus): it walked steadily with 30× body mass and barely moved at c. 100×, so the 850× figure is regarded as unverified. Separately, Jarman & Hinton (1974) reported a male lifting a 2 kg weight with the tip of its c. 50 mm head horn." }
      },
      {
        "title": { "ko": "계통", "en": "Phylogeny" },
        "text": { "ko": "Huang(2015/2016)에 따르면 아속 Dynastes와 Theogenes(넵튠·사타나스)가 먼저 갈라졌고, 이어 거대 헤라클레스 계통과 북·중미의 \"흰 헤라클레스\" 계통(그란트·티티우스·힐루스·마야·모로니)이 갈라졌다. 이 분기는 파나마 지협 완성(약 340~360만 년 전) 이전으로 추정된다.", "en": "Per Huang (2015/2016), subgenera Dynastes and Theogenes split first; within Dynastes the giant Hercules lineage and the \"white Hercules\" lineage (grantii, tityus, hyllus, maya, moroni) diverged before the Isthmus of Panama closed (c. 3.4–3.6 Ma)." }
      }
    ],
    "speciesNote": { "ko": "종 수는 분류 체계에 따라 다르다. GBIF는 7종, 영어 위키백과는 8종(D. moroni 포함)을 인정하며, Huang(2017)을 따르면 아속 Dynastes만 15종, Theogenes 2종을 더해 17종이 된다. 이 도감은 GBIF·위키백과·일본 사육계가 쓰는 아종 체계(13아종)를 따르고, 각 아종 페이지에 종 승격 등 분류 논쟁을 함께 적었다.", "en": "Species count depends on the classification: GBIF backbone 7, English Wikipedia 8 (incl. D. moroni), Huang (2017) 15 in subgenus Dynastes plus 2 in Theogenes = 17. This guide follows the subspecies arrangement (13 subspecies) used by GBIF, Wikipedia and Japanese breeders, and notes rank disputes on each subspecies page." }
  },
  "lifecycle": {
    "lead": { "ko": "아래 기간은 실험실과 사육 기록에 바탕을 둡니다.", "en": "Durations below come from laboratory and captive records." },
    "stages": [
      {
        "stage": "egg",
        "title": { "ko": "알", "en": "Egg" },
        "time": { "ko": "25℃에서 25~37일", "en": "25–37 days at 25 °C" },
        "text": { "ko": "갓 낳은 알은 약 40 mg이고 수분을 흡수해 부화 직전 약 80 mg이 된다. 25±1°C에서 25~37일(평균 27.7일) 만에 부화한다. 암컷은 최대 약 100개를 낳는다.", "en": "Eggs weigh c. 40 mg at laying and c. 80 mg before hatching; incubation 25–37 days (mean 27.7) at 25±1°C. A female may lay up to c. 100 eggs." }
      },
      {
        "stage": "larva",
        "title": { "ko": "유충", "en": "Larva" },
        "time": { "ko": "약 1~2년 (3령이 가장 길다)", "en": "About 1–2 years (the third instar is longest)" },
        "text": { "ko": "애벌레는 썩은 나무 속에서 썩은 목재를 먹으며 3령을 거친다. 실험실 25°C에서 1령 약 50일, 2령 약 56일, 3령 약 450일이다. 야생 종령은 몸길이 110 mm, 체중 약 120 g에 이른다.", "en": "Larvae feed inside rotting wood through three instars; at 25°C instars last c. 50, 56 and 450 days. A wild final instar reaches c. 110 mm and c. 120 g." }
      },
      {
        "stage": "pupa",
        "title": { "ko": "번데기", "en": "Pupa" },
        "time": { "ko": "약 1~2개월", "en": "About 1–2 months" },
        "text": { "ko": "흙 속에 수평에 가까운 번데기방을 만들고 약 32일(사육 문헌은 1.5~2개월) 번데기로 지낸다.", "en": "Pupates in a near-horizontal pupal cell; pupal stage c. 32 days (1.5–2 months in breeding literature)." }
      },
      {
        "stage": "adult",
        "title": { "ko": "성충", "en": "Adult" },
        "time": { "ko": "사육 시 3~6개월 (휴면 2~4개월 별도)", "en": "3–6 months in captivity (after 2–4 months' dormancy)" },
        "text": { "ko": "우화 후 2~4개월은 번데기방에서 휴면한다. 성충 수명은 사육 하 3~6개월이 보통이고, 1년 가까이 사는 개체도 있다. 사육 시 부화에서 우화까지 암컷 10~12개월, 수컷 14~20개월이다(2년 반 걸린 예도 있다).", "en": "After eclosion adults stay dormant in the cell for 2–4 months; captive adults usually live 3–6 months, some nearly a year. In captivity hatching to eclosion takes 10–12 months (females) and 14–20 months (males), occasionally up to 2.5 years." }
      }
    ]
  },
  "conservation": { "ko": "IUCN 적색목록 평가 기록을 찾지 못했다(미평가로 추정). CITES 부속서에 없다. 속 안에서는 D. satanas만 2016년 부속서 II에 올랐다. 삼림 벌채와 기후변화로 서식지가 위협받으며, 콜롬비아 등에서는 상업적 남획도 보고된다. 과들루프·마르티니크·도미니카에서는 법으로 보호되거나 반출이 금지되어 있다.", "en": "No IUCN Red List assessment was found (presumably Not Evaluated). Not listed by CITES; within the genus only D. satanas is listed (Appendix II, 2016). Deforestation and climate change threaten its rainforest habitat; commercial over-collecting is reported e.g. in Colombia. It is legally protected or export-banned in Guadeloupe, Martinique and Dominica." },
  "care": [
    { "ko": "일본에서는 1999년 11월 수입이 허용된 뒤 인기 종이 되었고, 지금은 대부분 국내 번식 개체가 유통된다. 애벌레는 잘 발효된 매트(톱밥·폐배지 발효물)로 20~25°C에서 키우고, 수컷은 큰 용기에 단독 사육한다. 성충은 곤충젤리·바나나를 먹이며 단독 사육이 권장된다. 한국·일본 모두 외래종 방사는 금지·자제해야 한다.", "en": "Became a hit in Japan after imports were allowed in November 1999; most animals sold are now captive-bred. Larvae are reared on well-fermented flake soil at c. 20–25°C, males individually in large containers; adults eat beetle jelly and banana and are best kept singly. Never release them outdoors." },
    { "ko": "살아 있는 외국산 곤충의 반입은 나라마다 검역 규정이 있으므로(한국은 식물방역법 등) 먼저 확인해야 한다. 기르던 개체를 야외에 풀어 주면 안 된다.", "en": "Importing live exotic insects is regulated by quarantine law in most countries — check first, and never release captive animals." }
  ],
  "facts": [
    { "ko": "뿔을 포함한 몸길이로는 세계에서 가장 긴 딱정벌레다.", "en": "Including horns, it is the longest beetle in the world." },
    { "ko": "딱지날개가 습도에 따라 노란색에서 검은색으로 되돌릴 수 있게 변한다. 이 구조는 습도 센서 연구에 응용되었다.", "en": "Its elytra reversibly change from yellow to black with humidity, a structure that inspired humidity-sensor research." },
    { "ko": "\"몸무게 850배를 든다\"는 유명한 말은 근거가 없고, 실측된 장수풍뎅이류의 한계는 약 100배였다.", "en": "The famous \"lifts 850× its weight\" line is unsupported; measured rhinoceros beetles managed about 100× at most." },
    { "ko": "애벌레는 곤충 중에서도 가장 큰 편으로, 사육 하에서는 180 g을 넘기도 한다.", "en": "Its larva is among the largest of any insect; captive larvae can exceed 180 g." },
    { "ko": "드물게 딱지날개가 푸르스름한 회백색인 \"블루 헤라클레스\"가 나타난다. 원명아종에서 약 5%로 가장 흔하다는 추정이 있다.", "en": "Rare \"blue Hercules\" individuals have bluish-grey elytra; one estimate puts them at c. 5% in the nominate subspecies." },
    { "ko": "위협을 받으면 배를 문질러 \"후\" 하는 소리를 낸다.", "en": "When threatened, adults make a huffing sound by rubbing the abdomen against the elytra." }
  ],
  "defaults": {
    "dimorphism": { "ko": "수컷만 머리뿔과 훨씬 긴 앞가슴 뿔을 가진다. 암컷은 뿔이 없고 몸이 대부분 검으며, 딱지날개 끝 일부만 수컷처럼 색을 띠기도 한다.", "en": "Only males carry the head horn and the much longer pronotal horn. Females are hornless, mostly black, with punctured elytra sometimes coloured like the male on the apical quarter." },
    "food": { "ko": "유충: 썩은 나무 · 성충: 썩은 과일, 나무 수액", "en": "Larva: rotting wood · Adult: rotting fruit, tree sap" },
    "season": { "ko": "야행성으로 낮에는 젖은 낙엽 밑에 숨고 밤에 썩은 과일과 수액을 먹는다. 수컷은 두 뿔로 상대를 집어 들어 던지는 방식으로 싸운다. 위협을 받으면 배를 딱지날개에 비벼 \"후\" 하는 소리를 낸다.", "en": "Nocturnal; hides under wet leaf litter by day and feeds on rotting fruit and sap at night. Males fight by pinning a rival between the two horns and throwing it. Disturbed adults produce a huffing stridulation." }
  },
  "weights": {
    "note": { "ko": "성충 무게 자료는 찾지 못해 유충 무게만 표시했습니다. 사육 개체는 야생보다 훨씬 크게 자랍니다.", "en": "No adult weights were found, so only larval weights are shown. Captive larvae grow far heavier than wild ones." },
    "items": [
      {
        "label": { "ko": "헤라클레스 유충 (야생 종령)", "en": "Hercules larva (wild, final instar)" },
        "value": 120,
        "approx": true,
        "reported": true,
        "note": { "ko": "몸길이 약 110mm", "en": "about 110 mm long" },
        "color": "#9FBF4A",
        "sources": ["dy-keller-cave", "dy-enwiki", "dy-rassart2008"]
      },
      {
        "label": { "ko": "헤라클레스 유충 (사육 최대)", "en": "Hercules larva (captive max.)" },
        "value": 185,
        "reported": true,
        "note": { "ko": "2025년 184.3mm 기록 수컷의 3령 유충", "en": "third instar of the 2025 record 184.3 mm male" },
        "color": "#C2D96F",
        "sources": ["dy-jawiki"]
      }
    ]
  },
  "latin": ["Scarabaeus hercules", "Dynastes lichyi", "Dynastes moroni", "D. moroni", "D. neptunus", "D. satanas", "D. grantii", "D. tityus", "D. hyllus", "D. maya", "D. hercules alcides", "D. h. alcides", "Theogenes", "Xylorctes thestalus", "Cedrela", "Dynastini", "Dynastinae"],
  "images": {
    "hero": {
      "file": "Dynastes hercules ecuatorianus MHNT.jpg",
      "author": "Didier Descouens",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "white": true,
      "alt": { "ko": "페루 이키토스산 헤라클레스장수풍뎅이 에콰토리아누스 수컷 표본(15.5cm)의 옆모습. 밝은 회백색 바탕", "en": "Male Hercules beetle (ecuatorianus) from Iquitos, Peru, 15.5 cm, lateral view on light grey-white background" }
    }
  },
  "taxa": [
    {
      "id": "dynastes-hercules-hercules",
      "rank": "subspecies",
      "sci": "Dynastes hercules hercules",
      "species": "Dynastes hercules",
      "authority": "(Linnaeus, 1758)",
      "color": "#E2C14B",
      "name": { "ko": "헤라클레스 헤라클레스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・ヘラクレス (愛称: ヘラヘラ)",
      "nameNote": { "ko": "일본명: ヘラクレス・ヘラクレス (愛称: ヘラヘラ). 모식산지: 원기재 \"America\"; 과들루프로 다뤄진다..", "en": "Japanese name: ヘラクレス・ヘラクレス (愛称: ヘラヘラ). Type locality: Original \"America\"; treated as Guadeloupe.." },
      "size": {
        "male": [50, 180],
        "female": [50, 82],
        "note": { "ko": "수컷 범위는 清水(2015) 인용, 암컷 범위는 출처 미표기. 수컷 야외 기록 172.7mm, 사육 기록 184.3mm (2025).", "en": "Male range per 清水 (2015); female range uncited in source. Male wild record 172.7 mm, captive record 184.3 mm (2025)." },
        "sources": ["dy-jawiki", "dy-enwiki"]
      },
      "pattern": { "ko": "광택이 비교적 강하고 황토색~약간 푸른 올리브색이며, 드물게 청백색이다. 검은 점은 크지 않다. 체모는 흰빛 도는 노란색이다.", "en": "Fairly glossy, ochre to slightly bluish olive, rarely bluish-white; black spots small. Setae whitish-yellow." },
      "morphology": { "ko": "앞가슴 뿔이 매우 길고 기부가 아주 굵으며 거의 휘지 않는다. 앞가슴 뿔 돌기는 가운데보다 조금 기부 쪽의 삼각형이다. 머리뿔 기부 돌기는 보통 2개(때로 3~4개)다. 굵은 뿔 개체를 pachyceras, 가는 개체를 stenoceras형이라 부른다. 광택이 비교적 강하고 황토색~약간 푸른 올리브색이며, 드물게 청백색이다. 검은 점은 크지 않다. 체모는 흰빛 도는 노란색이다.", "en": "Thoracic horn very long, extremely thick at base, nearly straight; thoracic tooth triangular, just basal of middle. Usually 2 (sometimes 3–4) basal teeth on head horn. Thick- and thin-horned forms are called pachyceras and stenoceras. Fairly glossy, ochre to slightly bluish olive, rarely bluish-white; black spots small. Setae whitish-yellow." },
      "distribution": ["GLP", "DMA"],
      "distributionNote": { "ko": "과들루프의 바스테르섬과 도미니카섬에 분포한다. 그랑드테르섬에는 없다. 쿠바·히스파니올라 기록은 의심스럽다. 세인트빈센트·그레나다에는 없는 것으로 보인다.", "en": "Basse-Terre (Guadeloupe) and Dominica; absent from Grande-Terre. Records from Cuba and Hispaniola are doubtful; apparently absent from St Vincent and Grenada." },
      "habitat": { "ko": "바스테르섬에서는 표고 300 m 전후, 도미니카에서는 400 m 이상에 많다. 서식 숲 기온은 18~25°C다.", "en": "Commonest around 300 m on Basse-Terre and above 400 m on Dominica; forest temperatures 18–25°C." },
      "ecology": { "ko": "연중 볼 수 있으나 7~9월에 발생 정점이 있다. 과들루프에서는 7월과 12월에 개체 수가 늘었다는 보고가 있다.", "en": "Seen year-round with a peak in July–September; numbers in Guadeloupe reported to rise in July and December." },
      "captivityNote": { "ko": "일본에서 가장 인기 있는 아종이며 유통 개체는 모두 사육 번식 개체다. 수컷 3령 체중 110~130 g이면 140 mm 이상으로 우화할 가능성이 있다.", "en": "The most popular subspecies in Japan; all animals sold are captive-bred. Male larvae of 110–130 g may yield adults over 140 mm." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "2020년 1월 24일 장관령으로 보호종이다. 알·애벌레·번데기 채집과 야생 개체의 포획·교란·운송·판매가 금지된다. 1986년부터 수출이 금지되었다는 보고도 있다. 2001년 기준 표본을 포함한 모든 동식물의 국외 반출이 금지되었다.", "en": "Protected by ministerial order of 24 January 2020: taking of eggs, larvae, pupae and adults and holding, transport or sale of wild-taken specimens are banned; export reportedly banned since 1986. As of 2001 export of all fauna and flora including specimens was prohibited." }
      },
      "facts": [
        { "ko": "블루 개체 출현율이 가장 높은 아종(약 5%)으로 추정된다.", "en": "Thought to produce blue individuals most often (c. 5%)." }
      ],
      "history": [
        {
          "year": 1758,
          "ko": "린네가 기재했다.",
          "en": "Described by Linnaeus."
        },
        {
          "year": 1932,
          "ko": "야생 최대 172.7 mm 수컷이 바스테르섬에서 채집되었다.",
          "en": "The 172.7 mm wild record male was collected on Basse-Terre."
        },
        {
          "year": 2020,
          "ko": "과들루프 보호종으로 지정되었다.",
          "en": "Protected in Guadeloupe."
        },
        {
          "year": 2025,
          "ko": "사육 최대 184.3 mm가 기록되었다.",
          "en": "Captive record of 184.3 mm."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)에서는 이 개체군만이 D. hercules로 남는다.", "en": "Under Huang (2017) this is the only population remaining as D. hercules." },
          "sources": ["dy-huang2017-zenodo"]
        },
        {
          "text": { "ko": "과들루프산은 보호종이라 프랑스 본토에서도 사육이 금지되어 있다.", "en": "Because Guadeloupe animals are protected, keeping the nominate form is banned even in mainland France." },
          "sources": []
        }
      ],
      "images": [
        {
          "file": "Dominica IMG 5069.jpg",
          "author": "Dirk.heldmaier",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "white": false,
          "alt": { "ko": "도미니카섬의 카카오 열매 위에 있는 야생 헤라클레스장수풍뎅이 수컷", "en": "Wild male Hercules beetle on a cacao pod in Dominica" }
        },
        {
          "file": "Dynastes hercules hercules01.JPG",
          "author": "Furry yui",
          "license": "Public domain",
          "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
          "white": false,
          "alt": { "ko": "나무껍질 위의 헤라클레스장수풍뎅이 원명아종 사육 수컷. 주변이 흰색", "en": "Captive male Dynastes hercules hercules on a piece of bark, white surroundings" }
        }
      ],
      "model3d": null,
      "sources": ["dy-wikispecies-dh", "dy-peck2011", "dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-huang2017-zenodo", "dy-keller-cave", "dy-guadeloupe2020"]
    },
    {
      "id": "dynastes-hercules-reidi",
      "rank": "subspecies",
      "sci": "Dynastes hercules reidi",
      "species": "Dynastes hercules",
      "authority": "Chalumeau, 1977",
      "color": "#E58A4C",
      "name": { "ko": "헤라클레스 레이디", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・レイディ",
      "nameNote": { "ko": "일본명: ヘラクレス・レイディ.", "en": "Japanese name: ヘラクレス・レイディ." },
      "size": {
        "male": [60, 112.6],
        "female": [47, 62],
        "note": null,
        "sources": ["dy-jawiki", "dy-enwiki"]
      },
      "pattern": { "ko": "원명아종과 매우 비슷하며 광택이 강하고 검은 점이 크다.", "en": "Very like the nominate form, glossy, with large black spots." },
      "morphology": { "ko": "머리뿔은 가늘고 길며 가운데부터 꽤 휘고, 끝 앞 돌기는 작은 삼각형이며 기부 돌기는 없다. 앞가슴 뿔은 곧고 돌기는 기부 쪽에 있다. 전체적으로 소형이다. 원명아종과 매우 비슷하며 광택이 강하고 검은 점이 크다.", "en": "Head horn slender, curved from mid-length, pre-apical tooth small and triangular, basal teeth absent; thoracic horn straight with tooth near base. A small subspecies. Very like the nominate form, glossy, with large black spots." },
      "distribution": ["LCA", "MTQ"],
      "distributionNote": { "ko": "세인트루시아(Massacre, Roseau 등)에 분포한다. baudrii를 포함하면 마르티니크도 해당한다.", "en": "Saint Lucia (e.g. Massacre, Roseau); also Martinique if baudrii is included." },
      "habitat": null,
      "ecology": { "ko": "드물다고 알려졌으나 우림의 등화 트랩에 꽤 규칙적으로 온다.", "en": "Reputedly rare but fairly regularly taken at light traps in rainforest." },
      "captivityNote": { "ko": "2015년 기준 일본에서 쌍 8,000~20,000엔 정도에 유통되었다.", "en": "Traded in Japan for about ¥8,000–20,000 per pair as of 2015." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "마르티니크에서도 법으로 보호된다(도령에는 D. hercules baudrii 이름으로 등재).", "en": "Protected by law in Martinique (prefectoral order uses the name D. hercules baudrii)." }
      },
      "facts": [],
      "history": [
        {
          "year": 1977,
          "ko": "Chalumeau가 기재했다.",
          "en": "Described by Chalumeau."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)은 Dynastes reidi로 종 승격했다. Peck(2011)은 마르티니크·세인트루시아 개체군에 D. h. alcides (Olivier, 1789)라는 이름을 썼으나, Lachaume(1985)은 alcides 모식표본이 원명아종과 같다고 보았다. GBIF·Ratcliffe & Cave(2015)는 baudrii를 reidi의 동의어로 둔다.", "en": "Raised to Dynastes reidi by Huang (2017). Peck (2011) used D. h. alcides (Olivier, 1789) for the Martinique/St Lucia population, though Lachaume (1985) found the alcides type conspecific with the nominate form. GBIF and Ratcliffe & Cave (2015) treat baudrii as a synonym of reidi." },
          "sources": ["dy-huang2017-zenodo", "dy-peck2011", "dy-gbif-dh", "dy-wikispecies-reidi"]
        },
        {
          "text": { "ko": "alcides·baudrii와의 명명 문제가 남아 있다.", "en": "Nomenclature unsettled relative to alcides and baudrii." },
          "sources": []
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-reidi", "dy-keller-cave", "dy-huang2017-zenodo", "dy-inat", "dy-peck2011"]
    },
    {
      "id": "dynastes-hercules-baudrii",
      "rank": "subspecies",
      "sci": "Dynastes hercules baudrii",
      "species": "Dynastes hercules",
      "authority": "Pinchon, 1976",
      "color": "#C9673E",
      "name": { "ko": "헤라클레스 바우드리", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・バウドリー",
      "nameNote": { "ko": "일본명: ヘラクレス・バウドリー.", "en": "Japanese name: ヘラクレス・バウドリー." },
      "size": {
        "male": [60, 108],
        "female": [50, 60],
        "note": { "ko": "수컷 사육 기록 113.6mm (2023).", "en": "Male captive record 113.6 mm (2023)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": null,
      "morphology": { "ko": "레이디보다 몸이 매우 다부지고 머리뿔이 짧으며, 끝 돌기가 아주 작고 둥글다. 끝 앞 돌기는 작은 사다리꼴 또는 둥근 모양이다.", "en": "Much stouter than reidi with a short head horn; apical point very small and rounded, pre-apical tooth a small trapezoid or rounded." },
      "distribution": ["MTQ"],
      "distributionNote": { "ko": "마르티니크섬에만 분포한다.", "en": "Martinique only." },
      "habitat": null,
      "ecology": null,
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "마르티니크에서도 법으로 보호된다(도령에는 D. hercules baudrii 이름으로 등재).", "en": "Protected by law in Martinique (prefectoral order uses the name D. hercules baudrii)." }
      },
      "facts": [],
      "history": [
        {
          "year": 1976,
          "ko": "Pinchon이 이름을 발표했다(nomen nudum).",
          "en": "Name published by Pinchon (nomen nudum)."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Ratcliffe & Cave(2015)는 nomen nudum(기재 요건 미충족 이름)으로 보아 reidi의 동의어로 둔다. 일본 문헌은 별도 아종 또는 레이디의 \"바우드리형\"으로 다루며, BE·KUWA도 별도 기록 부문을 둔다. 마르티니크 보호 법령은 이 이름을 쓴다.", "en": "Ratcliffe & Cave (2015) treat it as a nomen nudum and synonym of reidi; Japanese literature keeps it as a subspecies or a \"baudrii form\" of reidi, BE-KUWA keeps a separate record class, and the Martinique protection order uses this name." },
          "sources": ["dy-wikispecies-reidi", "dy-gbif-dh", "dy-jawiki", "dy-peck2011"]
        },
        {
          "text": { "ko": "유효성 논란: nomen nudum 여부.", "en": "Validity disputed (nomen nudum)." },
          "sources": []
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-kowiki", "dy-wikispecies-reidi", "dy-gbif-dh", "dy-peck2011", "dy-mushisha2023", "dy-enwiki"]
    },
    {
      "id": "dynastes-hercules-lichyi",
      "rank": "subspecies",
      "sci": "Dynastes hercules lichyi",
      "species": "Dynastes hercules",
      "authority": "Lachaume, 1985",
      "color": "#7FB3E0",
      "name": { "ko": "헤라클레스 리키", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・リッキー",
      "nameNote": { "ko": "일본명: ヘラクレス・リッキー. 프랑스인 René Lichy를 기린 이름이다. 모식산지: 베네수엘라 Rancho Grande.", "en": "Japanese name: ヘラクレス・リッキー. Named after the Frenchman René Lichy. Type locality: Rancho Grande, Venezuela." },
      "size": {
        "male": [85, 180.4],
        "female": [50, 75],
        "note": { "ko": "수컷 사육 기록 180.7mm (2022).", "en": "Male captive record 180.7 mm (2022)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "약간 탁한 연한 올리브색~탁한 황갈색이며 검은 점은 일정하지 않다. 체모는 황갈색, 앞가슴 뿔 털은 적갈색이다.", "en": "Dull pale olive to dull yellow-brown with variable black spots; setae yellow-brown, reddish-brown on the thoracic horn." },
      "morphology": { "ko": "머리뿔은 길고 곧은 편이며 끝이 강하게 휘고, 끝 앞 돌기는 큰 판 모양이다. 기부 돌기는 막대 1개다. 앞가슴 뿔 돌기는 가운데보다 조금 기부 쪽에 있다. 약간 탁한 연한 올리브색~탁한 황갈색이며 검은 점은 일정하지 않다. 체모는 황갈색, 앞가슴 뿔 털은 적갈색이다.", "en": "Head horn long and fairly straight, tip strongly curved, pre-apical tooth a large plate, one rod-like basal tooth; thoracic tooth slightly basal of middle. Dull pale olive to dull yellow-brown with variable black spots; setae yellow-brown, reddish-brown on the thoracic horn." },
      "distribution": ["VEN", "COL", "ECU", "PER", "BOL"],
      "distributionNote": { "ko": "안데스 산지(베네수엘라 북서부, 콜롬비아 북부, 에콰도르 중부, 페루 중부 Tingo María, 볼리비아)에 분포한다. Rassart 등(2008)은 브라질도 포함한다.", "en": "Andean slopes of NW Venezuela, N Colombia, central Ecuador, central Peru (Tingo María) and Bolivia; Rassart et al. (2008) also list Brazil." },
      "habitat": { "ko": "표고 500~2000 m의 안데스 고지 운무림에 살며 1500 m 전후에 가장 많다. 에콰도르에서는 넵튠장수풍뎅이와 서식지가 겹친다.", "en": "Andean montane cloud forest at 500–2000 m, most numerous around 1500 m; overlaps with D. neptunus in Ecuador." },
      "ecology": { "ko": "에콰도르에서는 12월~4월에 가장 많다. 페루에서는 Cedrela 수액에 모인다. 저지대 ecuatorianus와 표고로 나뉘며 경계부에서 중간형이 나온다.", "en": "Most abundant December–April in Ecuador; feeds at Cedrela sap in Peru. Separated altitudinally from lowland ecuatorianus, with intermediates near the boundary." },
      "captivityNote": { "ko": "다른 아종보다 약간 낮은 온도(산란 약 20°C)를 좋아한다. 1990년대 말~2000년대 초 일본에서 가장 흔히 유통된 아종이었다.", "en": "Prefers slightly lower temperatures than other subspecies (c. 20°C for egg-laying); the commonest subspecies in Japanese trade around 1998–2002." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [
        { "ko": "사육 기록 180.7 mm로 원명아종 다음으로 크게 자란다.", "en": "With a 180.7 mm captive record it is second only to the nominate form in size." },
        { "ko": "게임 \"갑충왕자 무시킹\"의 \"헤라클레스 리키 블루\" 카드 이후 블루 개체를 흔히 \"블루 리키\"라 부르지만, 블루는 어느 아종에서나 나온다.", "en": "Since the Mushiking card \"Hercules Lichyi Blue\", blue individuals are often called \"blue lichyi\", though blues occur in any subspecies." }
      ],
      "history": [
        {
          "year": 1985,
          "ko": "Lachaume이 기재했다.",
          "en": "Described by Lachaume."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 Dynastes lichyi로 종 승격했다.", "en": "Raised to Dynastes lichyi by Huang (2017)." },
          "sources": ["dy-huang2017-zenodo"]
        }
      ],
      "images": [
        {
          "file": "Dynastes hercules lichyi (Lachaume, 1985) male (8538220569).png",
          "author": "Udo Schmidt from Deutschland",
          "license": "CC BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
          "white": true,
          "alt": { "ko": "베네수엘라 란초그란데산 헤라클레스 리키 수컷 표본(138mm)의 옆모습. 흰 바탕", "en": "Male D. h. lichyi, 138 mm, Rancho Grande, Venezuela, lateral view on white" }
        },
        {
          "file": "Dynastes hercules lichyi (Lachaume, 1985) female (8538216877).png",
          "author": "Udo Schmidt from Deutschland",
          "license": "CC BY-SA 2.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
          "white": true,
          "alt": { "ko": "베네수엘라 란초그란데산 헤라클레스 리키 암컷 표본(62mm)의 등면. 흰 바탕", "en": "Female D. h. lichyi, 62 mm, Rancho Grande, Venezuela, dorsal view on white" }
        },
        {
          "file": "Dynastesherculeslichyi.JPG",
          "author": "Notafly",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "white": true,
          "alt": { "ko": "헤라클레스 리키 수컷 표본의 옆모습. 흰 바탕", "en": "Male D. h. lichyi specimen, lateral view on white" }
        },
        {
          "file": "Dynastes hercules.lichyi (male).JPG",
          "author": "Anaxibia",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "white": true,
          "alt": { "ko": "페루산 헤라클레스 리키 수컷 표본(144mm)의 등면. 흰 스티로폼 바탕", "en": "Male D. h. lichyi from Peru, 144 mm, dorsal view on white styrofoam" }
        }
      ],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-rassart2008", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-ecuatorianus",
      "rank": "subspecies",
      "sci": "Dynastes hercules ecuatorianus",
      "species": "Dynastes hercules",
      "authority": "Ohaus, 1913",
      "color": "#9BC75A",
      "name": { "ko": "헤라클레스 에콰토리아누스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・エクアトリアヌス",
      "nameNote": { "ko": "일본명: ヘラクレス・エクアトリアヌス. 에콰도르에서 따온 이름이다.", "en": "Japanese name: ヘラクレス・エクアトリアヌス. Named after Ecuador." },
      "size": {
        "male": [80, 165],
        "female": [55, 73],
        "note": { "ko": "수컷 사육 기록 162.6mm (2008).", "en": "Male captive record 162.6 mm (2008)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "광택이 둔하고 황갈색~밝은 노란색이며 검은 점은 일정하지 않다. 체모는 적갈색이다.", "en": "Dull, yellow-brown to bright yellow, black spots variable; setae reddish-brown." },
      "morphology": { "ko": "머리뿔이 가늘고 길며 강하게 휘지 않고 끝이 뾰족하다. 앞가슴 뿔은 기부가 굵고 돌기가 기부 쪽에 있다. 광택이 둔하고 황갈색~밝은 노란색이며 검은 점은 일정하지 않다. 체모는 적갈색이다.", "en": "Head horn slender, not strongly curved, sharply pointed; thoracic horn thick at base with tooth near base. Dull, yellow-brown to bright yellow, black spots variable; setae reddish-brown." },
      "distribution": ["COL", "ECU", "PER", "BRA", "BOL"],
      "distributionNote": { "ko": "안데스 동쪽에서 아마존 상·중류(콜롬비아 남동부, 에콰도르 동부, 페루 북동부, 브라질 서부 아마조나스, 볼리비아)까지 가장 넓게 분포한다.", "en": "East of the Andes through the upper–middle Amazon (SE Colombia, E Ecuador, NE Peru, W Brazil (Amazonas), Bolivia); the most widespread subspecies." },
      "habitat": { "ko": "아마존 저지대 열대우림에 살며 lichyi보다 낮은 곳에 산다.", "en": "Amazonian lowland rainforest, below lichyi." },
      "ecology": { "ko": "에콰도르 코카 부근 저지대에서 렉스코끼리장수풍뎅이와 함께 산다.", "en": "Near Coca, Ecuador, it shares lowland forest with Megasoma rex." },
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [
        { "ko": "영어 위키백과 대표 사진이 페루 이키토스산 이 아종 수컷이다.", "en": "The lead image of the species on English Wikipedia is a male of this subspecies from Iquitos, Peru." }
      ],
      "history": [
        {
          "year": 1913,
          "ko": "Ohaus가 기재했다.",
          "en": "Described by Ohaus."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다. GBIF는 morishimai·takakuwai를 이 아종의 동의어로 둔다.", "en": "Raised to species by Huang (2017); GBIF lists morishimai and takakuwai as its synonyms." },
          "sources": ["dy-huang2017-zenodo", "dy-gbif-dh"]
        }
      ],
      "images": [
        {
          "file": "Dynastes hercules ecuatorianus MHNT.jpg",
          "author": "Didier Descouens",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "white": true,
          "alt": { "ko": "페루 이키토스산 헤라클레스장수풍뎅이 에콰토리아누스 수컷 표본(15.5cm)의 옆모습. 밝은 회백색 바탕", "en": "Male D. h. ecuatorianus, 15.5 cm, Iquitos, Peru, lateral view on light grey-white" }
        },
        {
          "file": "Dynastes hercules f2.jpg",
          "author": "JohnSka",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "white": true,
          "alt": { "ko": "헤라클레스장수풍뎅이 에콰토리아누스 암컷 표본의 등면. 밝은 바탕", "en": "Female D. h. ecuatorianus, dorsal view on plain light background" }
        }
      ],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-occidentalis",
      "rank": "subspecies",
      "sci": "Dynastes hercules occidentalis",
      "species": "Dynastes hercules",
      "authority": "Lachaume, 1985",
      "color": "#5CC9A7",
      "name": { "ko": "헤라클레스 옥시덴탈리스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・オキシデンタリス",
      "nameNote": { "ko": "일본명: ヘラクレス・オキシデンタリス. \"서쪽의\"라는 뜻이다.", "en": "Japanese name: ヘラクレス・オキシデンタリス. Means \"western\"." },
      "size": {
        "male": [70, 164.2],
        "female": [50, 75],
        "note": { "ko": "수컷 사육 기록 164.2mm (2019).", "en": "Male captive record 164.2 mm (2019)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "조금 밝은 노란색~황갈색이며 검은 점은 일정하지 않다.", "en": "Fairly bright yellow to yellow-brown, black spots variable." },
      "morphology": { "ko": "머리뿔이 길고 곧은 편이며 끝 앞 돌기는 작은 판 모양이다. 앞가슴 뿔은 가늘고 기부가 휘며 돌기는 기부에 있고 가늘다. 조금 밝은 노란색~황갈색이며 검은 점은 일정하지 않다.", "en": "Head horn long and fairly straight, small plate-like pre-apical tooth; thoracic horn slender, curved at base, with a narrow basal tooth. Fairly bright yellow to yellow-brown, black spots variable." },
      "distribution": ["PAN", "COL", "ECU"],
      "distributionNote": { "ko": "파나마 남부 태평양 쪽 산지, 콜롬비아 서부(바예델카우카, 초코), 에콰도르 북서부에 분포한다. 파나마에서는 septentrionalis와의 중간형이 나온다.", "en": "Pacific-side mountains of S Panama, W Colombia (Valle del Cauca, Chocó) and NW Ecuador; intermediates with septentrionalis occur in Panama." },
      "habitat": { "ko": "안데스 서쪽(태평양 쪽) 사면에 산다. 저지대라는 보고와 에콰도르 파크토 일대 표고 약 2000 m 운무림(넵튠과 동소)이라는 보고가 엇갈린다.", "en": "West (Pacific) Andean slope; sources disagree: low elevations vs cloud forest at c. 2000 m near Pacto, Ecuador, alongside D. neptunus." },
      "ecology": null,
      "captivityNote": { "ko": "2002년 무렵 lichyi와 함께 일본 유통의 대부분을 차지했다.", "en": "Around 2002 it and lichyi made up most of the Japanese trade." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [],
      "history": [
        {
          "year": 1985,
          "ko": "Lachaume이 기재했다.",
          "en": "Described by Lachaume."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다.", "en": "Raised to species by Huang (2017)." },
          "sources": ["dy-huang2017-zenodo"]
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-septentrionalis",
      "rank": "subspecies",
      "sci": "Dynastes hercules septentrionalis",
      "species": "Dynastes hercules",
      "authority": "Lachaume, 1985",
      "color": "#B48CE0",
      "name": { "ko": "헤라클레스 셉텐트리오날리스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・セプテントリオナリス",
      "nameNote": { "ko": "일본명: ヘラクレス・セプテントリオナリス. \"북쪽의\"라는 뜻이다.", "en": "Japanese name: ヘラクレス・セプテントリオナリス. Means \"northern\"." },
      "size": {
        "male": [70, 158],
        "female": [55, 70],
        "note": { "ko": "수컷 사육 기록 155.1mm (2021).", "en": "Male captive record 155.1 mm (2021)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "탁한 황갈색이며 검은 점이 비교적 크다.", "en": "Dull yellow-brown with relatively large black spots." },
      "morphology": { "ko": "앞가슴 뿔이 가늘고 기부가 뚜렷하게 휘며, 큰 돌기가 기부에 있다. 머리뿔은 길다. 탁한 황갈색이며 검은 점이 비교적 크다.", "en": "Thoracic horn slender, clearly curved at base, with a large basal tooth; head horn long. Dull yellow-brown with relatively large black spots." },
      "distribution": ["MEX", "GTM", "HND", "NIC", "CRI", "PAN"],
      "distributionNote": { "ko": "멕시코 남부(치아파스)에서 과테말라·온두라스·니카라과·코스타리카·파나마 북부 카리브 쪽 산지까지 중미에 분포한다.", "en": "Central America from S Mexico (Chiapas) through Guatemala, Honduras, Nicaragua and Costa Rica to the Caribbean-side mountains of N Panama." },
      "habitat": { "ko": "중미 운무림에 산다. 코스타리카 알라후엘라에서는 표고 700~900 m에서 5~6월 우기에 많다.", "en": "Central American cloud forest; at Alajuela, Costa Rica, common at 700–900 m in the May–June rains." },
      "ecology": { "ko": "Lonchocarpus 수액에 모이고, 가로등에는 새벽 2~3시에 많이 날아온다.", "en": "Gathers at Lonchocarpus sap and comes to street lights mostly at 2–3 a.m." },
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [
        { "ko": "iNaturalist에서 관찰 기록이 가장 많은 헤라클레스 계열 분류군이다(코스타리카 등).", "en": "It is the Hercules taxon with the most iNaturalist observations (e.g. Costa Rica)." }
      ],
      "history": [
        {
          "year": 1985,
          "ko": "Lachaume이 기재했다.",
          "en": "Described by Lachaume."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다. tuxtlaensis를 동의어로 포함한다는 견해가 있다.", "en": "Raised to species by Huang (2017); tuxtlaensis is often treated as its synonym." },
          "sources": ["dy-huang2017-zenodo", "dy-wikispecies-tux"]
        }
      ],
      "images": [
        {
          "file": "Dynastes hercules (female).jpg",
          "author": "Hans Hillewaert",
          "license": "CC BY-SA 4.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
          "white": false,
          "alt": { "ko": "코스타리카 카우이타에서 찍은 8cm 헤라클레스장수풍뎅이 암컷", "en": "8 cm female Hercules beetle at Cahuita, Costa Rica" }
        },
        {
          "file": "Dynastes hercules.jpg",
          "author": "Franz Xaver",
          "license": "CC BY-SA 3.0",
          "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
          "white": false,
          "alt": { "ko": "코스타리카 몬테베르데의 바위 위에 있는 살아 있는 헤라클레스장수풍뎅이 수컷", "en": "Live male Hercules beetle at Monteverde, Costa Rica, on a rock" }
        }
      ],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-dh", "dy-keller-cave", "dy-huang2017-zenodo", "dy-inat", "dy-wikispecies-tux", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-tuxtlaensis",
      "rank": "subspecies",
      "sci": "Dynastes hercules tuxtlaensis",
      "species": "Dynastes hercules",
      "authority": "Morón, 1993",
      "color": "#E07AA6",
      "name": { "ko": "헤라클레스 툭스틀라엔시스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・トゥクストラエンシス",
      "nameNote": { "ko": "일본명: ヘラクレス・トゥクストラエンシス. 모식산지: 멕시코 베라크루스주 Los Tuxtlas 일대(Santa Marta 산괴).", "en": "Japanese name: ヘラクレス・トゥクストラエンシス. Type locality: Los Tuxtlas / Sierra de Santa Marta, Veracruz, Mexico." },
      "size": {
        "male": [62, 80],
        "female": null,
        "note": { "ko": "암컷은 알려지지 않았다. 기록된 표본이 적어 작은 개체만 알려졌을 수 있다.", "en": "Female unknown. Few specimens are known, so the range may reflect only small individuals." },
        "sources": ["dy-jawiki"]
      },
      "pattern": { "ko": "지저분한 노란색이며 검은 점은 작다. 털은 적갈색이다.", "en": "Dirty yellow with small black spots; setae reddish-brown." },
      "morphology": { "ko": "머리뿔이 짧고 가운데쯤에서 휜다. 앞가슴 뿔 기부가 뚜렷이 휘고 돌기는 기부에 있다. 지저분한 노란색이며 검은 점은 작다. 털은 적갈색이다.", "en": "Short head horn curved near the middle; thoracic horn clearly curved at base with basal tooth. Dirty yellow with small black spots; setae reddish-brown." },
      "distribution": ["los-tuxtlas"],
      "distributionNote": { "ko": "멕시코 베라크루스주 남부 Los Tuxtlas 지역으로, 헤라클레스 무리 중 가장 북쪽이다.", "en": "Los Tuxtlas region, S Veracruz, Mexico; the northernmost Hercules population." },
      "habitat": null,
      "ecology": null,
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [
        { "ko": "일본의 한 업체가 수컷 표본 3개(71·79·85 mm)를 220만 엔에 샀다는 기록이 있다.", "en": "A Japanese dealer reportedly paid ¥2.2 million for three male specimens (71, 79, 85 mm)." }
      ],
      "history": [
        {
          "year": 1993,
          "ko": "Morón이 기재했다.",
          "en": "Described by Morón."
        },
        {
          "year": 2013,
          "ko": "Ratcliffe 등이 septentrionalis의 동의어로 다뤘다.",
          "en": "Treated as a synonym of septentrionalis by Ratcliffe et al."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Ratcliffe 등(2013) 이후 septentrionalis의 동의어로 다루는 경우가 많다. 기재에 쓰인 수컷 2개체 외에 확실한 표본이 2006년까지 알려지지 않았다.", "en": "Usually treated as a synonym of septentrionalis since Ratcliffe et al. (2013); as of 2006 no specimens beyond the two type males were known." },
          "sources": ["dy-wikispecies-tux", "dy-gbif-dh", "dy-jawiki"]
        },
        {
          "text": { "ko": "유효성 논란(동의어 처리).", "en": "Validity disputed (synonymized)." },
          "sources": []
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-kowiki", "dy-wikispecies-tux", "dy-gbif-dh"]
    },
    {
      "id": "dynastes-hercules-trinidadensis",
      "rank": "subspecies",
      "sci": "Dynastes hercules trinidadensis",
      "species": "Dynastes hercules",
      "authority": "Chalumeau & Reid, 1995",
      "color": "#F2A3C1",
      "name": { "ko": "헤라클레스 트리니다덴시스", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・トリニダデンシス (トリニダーデンシス)",
      "nameNote": { "ko": "일본명: ヘラクレス・トリニダデンシス (トリニダーデンシス). 트리니다드섬에서 따온 이름이다.", "en": "Japanese name: ヘラクレス・トリニダデンシス (トリニダーデンシス). Named after Trinidad." },
      "size": {
        "male": [70, 154.4],
        "female": [55, 65],
        "note": { "ko": "수컷 사육 기록 154.4mm (2013).", "en": "Male captive record 154.4 mm (2013)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "딱지날개·점각·체모가 원명아종과 bleuzeni의 중간형이다.", "en": "Elytra, punctation and setae intermediate between the nominate form and bleuzeni." },
      "morphology": { "ko": "머리뿔이 약간 짧고 굵으며 기부 돌기는 1~2개다. 앞가슴 뿔은 기부가 굵고 전체로 곧으며 돌기는 원명아종보다 기부 쪽이다. 딱지날개·점각·체모가 원명아종과 bleuzeni의 중간형이다.", "en": "Head horn rather short and thick with 1–2 basal teeth; thoracic horn thick-based, straight, tooth more basal than in the nominate. Elytra, punctation and setae intermediate between the nominate form and bleuzeni." },
      "distribution": ["TTO"],
      "distributionNote": { "ko": "트리니다드섬과 토바고섬에 분포한다. 그레나다에서도 비슷한 개체가 나왔다는 보고가 있으나, Peck(2011)은 그레나다에 없다고 본다.", "en": "Trinidad and Tobago; similar specimens reported from Grenada, but Peck (2011) considers the species absent there." },
      "habitat": null,
      "ecology": null,
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [],
      "history": [
        {
          "year": 1995,
          "ko": "Chalumeau & Reid가 기재했다.",
          "en": "Described by Chalumeau & Reid."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다. 영어 위키백과는 bleuzeni를 이 아종의 동의어로 두며, 둘을 하나로 보는 연구자도 있다.", "en": "Raised to species by Huang (2017). English Wikipedia lists bleuzeni as its synonym, and some researchers merge the two." },
          "sources": ["dy-huang2017-zenodo", "dy-enwiki", "dy-jawiki"]
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-enwiki", "dy-huang2017-zenodo", "dy-inat", "dy-peck2011", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-bleuzeni",
      "rank": "subspecies",
      "sci": "Dynastes hercules bleuzeni",
      "species": "Dynastes hercules",
      "authority": "Silvestre & Dechambre, 1995",
      "color": "#6FA0F0",
      "name": { "ko": "헤라클레스 블뢰제니", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・ブルゼイ / ブリュゼニ (ブレウゼニ)",
      "nameNote": { "ko": "일본명: ヘラクレス・ブルゼイ / ブリュゼニ (ブレウゼニ). 프랑스인 Patrick Bleuzen을 기린 이름이다.", "en": "Japanese name: ヘラクレス・ブルゼイ / ブリュゼニ (ブレウゼニ). Named after the Frenchman Patrick Bleuzen." },
      "size": {
        "male": [66, 151],
        "female": [55, 66],
        "note": null,
        "sources": ["dy-jawiki"]
      },
      "pattern": { "ko": "광택이 둔한 황토색이며 검은 점이 크다.", "en": "Dull ochre with large black spots." },
      "morphology": { "ko": "머리뿔이 곧은 편이고 기부 돌기 2개가 뾰족하다. 앞가슴 뿔은 기부에서 조금 휘고 돌기는 기부 쪽의 긴 삼각형이다. 광택이 둔한 황토색이며 검은 점이 크다.", "en": "Head horn fairly straight with two pointed basal teeth; thoracic horn slightly curved at base, tooth an elongate triangle near base. Dull ochre with large black spots." },
      "distribution": ["VEN", "BRA"],
      "distributionNote": { "ko": "베네수엘라 동부 볼리바르주와 브라질(호라이마, 파라)에 분포한다.", "en": "E Venezuela (Bolívar) and Brazil (Roraima, Pará)." },
      "habitat": null,
      "ecology": null,
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [],
      "history": [
        {
          "year": 1995,
          "ko": "Silvestre & Dechambre가 기재했다.",
          "en": "Described by Silvestre & Dechambre."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다. 영어 위키백과는 trinidadensis의 동의어로 둔다.", "en": "Raised to species by Huang (2017); English Wikipedia treats it as a synonym of trinidadensis." },
          "sources": ["dy-huang2017-zenodo", "dy-enwiki"]
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-gbif-dh", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-enwiki"]
    },
    {
      "id": "dynastes-hercules-paschoali",
      "rank": "subspecies",
      "sci": "Dynastes hercules paschoali",
      "species": "Dynastes hercules",
      "authority": "Grossi & Arnaud, 1993",
      "color": "#4FB37C",
      "name": { "ko": "헤라클레스 파스코알리", "en": "Atlantic Forest Hercules beetle" },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・パスコアリ",
      "nameNote": { "ko": "일본명: ヘラクレス・パスコアリ. 기재자 Grossi의 아들 Paschoal Coelho Grossi를 기린 이름이다.", "en": "Japanese name: ヘラクレス・パスコアリ. Named after Paschoal Coelho Grossi, son of the describer Grossi." },
      "size": {
        "male": [85, 149],
        "female": [50, 63],
        "note": { "ko": "수컷 사육 기록 149mm (2022).", "en": "Male captive record 149 mm (2022)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "광택이 조금 강한 올리브그린이며 검은 점이 없거나 작다. 체모는 흰빛 노란색이다.", "en": "Fairly glossy olive-green with no or small black spots; setae whitish-yellow." },
      "morphology": { "ko": "머리뿔 앞쪽이 갈고리처럼 휘고 기부 돌기가 없거나 매우 작다. 앞가슴 뿔은 곧고 기부 점각이 넓다. 광택이 조금 강한 올리브그린이며 검은 점이 없거나 작다. 체모는 흰빛 노란색이다.", "en": "Head horn hooked anteriorly, basal teeth absent or tiny; thoracic horn straight with broad basal punctation. Fairly glossy olive-green with no or small black spots; setae whitish-yellow." },
      "distribution": ["bahia-espirito-santo"],
      "distributionNote": { "ko": "브라질 대서양림(바이아주 남동부, 이스피리투산투주 북동부)에 분포하며 가장 남동쪽 집단이다. 과거에는 페르남부쿠·리우데자네이루 부근에도 있었던 것으로 보인다.", "en": "Brazilian Atlantic Forest (SE Bahia, NE Espírito Santo), the south-easternmost population; historically perhaps also Pernambuco and around Rio de Janeiro." },
      "habitat": { "ko": "가장 낮은 곳에 사는 아종으로, 바이아주 올리벤사에서는 해발 0 m 부근에서 관찰되었다. 표고 150 m 이하 지역에 한정된다는 보고가 있다.", "en": "The lowest-living subspecies, seen near sea level at Olivença, Bahia; reported confined to areas below 150 m." },
      "ecology": { "ko": "현지에서는 serrador(\"나무를 갉는 것\"), bicudo(\"뿔이 긴 것\")라 부른다.", "en": "Locally called serrador (\"wood-shredder\") and bicudo (\"long-horned\")." },
      "captivityNote": { "ko": "브라질의 엄격한 채집 규제로 생체 입수가 매우 어렵다고 평가되었다(2009).", "en": "Live imports considered nearly impossible due to Brazil's strict collecting rules (2009)." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "브라질 적색목록(2008)에 실렸고, ICMBio 적색목록(2018)에서 준위협(NT), 바이아주 목록(2017)에서 취약(VU), 이스피리투산투주 목록(2005)에서 위급(CR)으로 평가되었다.", "en": "Listed in the Brazilian Red Book (2008); Near Threatened in the ICMBio Red Book (2018), Vulnerable on the Bahia state list (2017), Critically Endangered on the Espírito Santo list (2005)." }
      },
      "facts": [
        { "ko": "17세기 네덜란드 여행자들이 이미 그림으로 남겼다.", "en": "It was already illustrated by Dutch travellers in the 17th century." }
      ],
      "history": [
        {
          "year": 1993,
          "ko": "Grossi & Arnaud가 기재했다.",
          "en": "Described by Grossi & Arnaud."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)이 종으로 승격했다. 다른 개체군과 가장 고립된 대륙 집단이다.", "en": "Raised to species by Huang (2017); the most isolated mainland population." },
          "sources": ["dy-huang2017-zenodo", "dy-ptwiki-paschoali"]
        },
        {
          "text": { "ko": "헤라클레스 무리에서 국가 적색목록에 오른 유일한 분류군이다(확인된 범위).", "en": "The only Hercules taxon found on a national red list." },
          "sources": []
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-ptwiki-paschoali", "dy-gbif-dh", "dy-enwiki", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-mushisha2023", "dy-inat-paschoali"]
    },
    {
      "id": "dynastes-hercules-morishimai",
      "rank": "subspecies",
      "sci": "Dynastes hercules morishimai",
      "species": "Dynastes hercules",
      "authority": "Nagai, 2002",
      "color": "#D7B98C",
      "name": { "ko": "헤라클레스 모리시마이", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・モリシマイ",
      "nameNote": { "ko": "일본명: ヘラクレス・モリシマイ. 일본 우쓰노미야의 진딧물 생태 연구가 森島啓司를 기린 이름이다.", "en": "Japanese name: ヘラクレス・モリシマイ. Named after Keiji Morishima, an aphid ecologist from Utsunomiya, Japan." },
      "size": {
        "male": [70, 143.2],
        "female": [50, 60],
        "note": { "ko": "수컷 사육 기록 143.2mm (2019).", "en": "Male captive record 143.2 mm (2019)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "광택이 강한 노란빛 황토색이며 검은 점이 많다. 체모가 모든 아종 중 가장 노랗다. 암컷은 작고 둥글며 검다.", "en": "Glossy yellowish ochre with many black spots; setae the yellowest of all subspecies. Female small, rounded and black." },
      "morphology": { "ko": "몸이 작고 다부지다. 머리뿔은 짧고 위아래로 넓으며 돌기가 2~4개다. 앞가슴 뿔은 매우 굳세고 앞쪽 절반이 아래로 강하게 휜다. 광택이 강한 노란빛 황토색이며 검은 점이 많다. 체모가 모든 아종 중 가장 노랗다. 암컷은 작고 둥글며 검다.", "en": "Compact, robust build; head horn short and deep with 2–4 teeth; thoracic horn very stout, strongly down-curved in the front half. Glossy yellowish ochre with many black spots; setae the yellowest of all subspecies. Female small, rounded and black." },
      "distribution": ["la-paz-yungas"],
      "distributionNote": { "ko": "볼리비아 서부 라파스주 중부에 분포하며, 코차밤바·융가스에서도 비슷한 개체가 나왔다.", "en": "Central La Paz Department, W Bolivia; similar specimens from Cochabamba and the Yungas." },
      "habitat": null,
      "ecology": null,
      "captivityNote": { "ko": "서식지가 코카인 생산지·금광·게릴라 지역이라 기재 직후 일본에 거의 들어오지 않았다.", "en": "Its range overlapped coca-growing, gold-mining and guerrilla areas, so almost none reached Japan right after description." },
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "아종 단위의 평가는 없다. 종 전체로는 삼림 벌채와 기후변화가 서식지를 위협한다.", "en": "No subspecies-level assessment exists. For the species as a whole, deforestation and climate change threaten its habitat." }
      },
      "facts": [],
      "history": [
        {
          "year": 2002,
          "ko": "Nagai가 기재했다.",
          "en": "Described by Nagai."
        },
        {
          "year": 2017,
          "ko": "Huang이 종으로 승격했다.",
          "en": "Raised to species by Huang."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "Huang(2017)은 종으로 승격했지만 GBIF는 ecuatorianus의 동의어로 둔다.", "en": "Raised to species by Huang (2017), yet GBIF lists it as a synonym of ecuatorianus." },
          "sources": ["dy-huang2017-zenodo", "dy-gbif-dh"]
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-enwiki", "dy-wikispecies-dh", "dy-huang2017-zenodo", "dy-inat", "dy-gbif-dh", "dy-mushisha2023"]
    },
    {
      "id": "dynastes-hercules-takakuwai",
      "rank": "subspecies",
      "sci": "Dynastes hercules takakuwai",
      "species": "Dynastes hercules",
      "authority": "Nagai, 2002",
      "color": "#C2D96F",
      "name": { "ko": "헤라클레스 타카쿠와이", "en": null },
      "nameInformal": { "ko": true, "en": false },
      "nameJa": "ヘラクレス・タカクワイ",
      "nameNote": { "ko": "일본명: ヘラクレス・タカクワイ. 가나가와현립생명의별·지구박물관의 高桑正敏 박사를 기린 이름이다. 모식산지: 브라질 혼도니아주 Pimenta Bueno.", "en": "Japanese name: ヘラクレス・タカクワイ. Named after Dr Masatoshi Takakuwa of the Kanagawa Prefectural Museum of Natural History. Type locality: Pimenta Bueno, Rondônia, Brazil." },
      "size": {
        "male": [70, 142.1],
        "female": [50, 65],
        "note": { "ko": "2006년 기준 암컷이 알려지지 않았다는 서술과 암컷 범위가 함께 실려 있어 암컷 수치는 불확실하다. 수컷 사육 기록 142.1mm (2011).", "en": "Source both says the female was unknown in 2006 and gives a female range; treat female figures as uncertain. Male captive record 142.1 mm (2011)." },
        "sources": ["dy-jawiki", "dy-mushisha2023", "dy-enwiki"]
      },
      "pattern": { "ko": "갈색 기운의 황토색이며 검은 점이 조금 크다. 체모는 적갈색이다.", "en": "Brownish ochre with rather large black spots; setae reddish-brown." },
      "morphology": { "ko": "뿔 돌기가 모든 아종 중 가장 약하다. 머리뿔은 고르게 휘고 가늘며 기부 돌기는 없거나 흔적뿐이다. 앞가슴 뿔 돌기도 거의 없다. 갈색 기운의 황토색이며 검은 점이 조금 크다. 체모는 적갈색이다.", "en": "Weakest horn teeth of all subspecies: head horn evenly curved and slender, basal teeth absent or vestigial; thoracic tooth nearly absent. Brownish ochre with rather large black spots; setae reddish-brown." },
      "distribution": ["rondonia"],
      "distributionNote": { "ko": "브라질 북부 혼도니아주에 분포한다.", "en": "Rondônia, N Brazil." },
      "habitat": null,
      "ecology": null,
      "captivityNote": null,
      "conservation": {
        "status": { "ko": "평가 기록 없음 (IUCN)", "en": "No IUCN assessment found" },
        "text": { "ko": "모식산지 일대는 개발이 진행되어 채집이 어려울 것으로 보고되었다(2009).", "en": "The type locality area was reported heavily developed (2009)." }
      },
      "facts": [
        { "ko": "paschoali와 함께 머리뿔 기부 돌기가 거의 없는 특이한 형태다.", "en": "Like paschoali, it almost lacks basal teeth on the head horn." }
      ],
      "history": [
        {
          "year": 2002,
          "ko": "Nagai가 기재했다.",
          "en": "Described by Nagai."
        }
      ],
      "issues": [
        {
          "title": { "ko": "아종인가, 종인가", "en": "Subspecies or species?" },
          "text": { "ko": "GBIF는 ecuatorianus의 동의어로 둔다. Huang(2017)의 승격 목록에는 없으며 그 처리 내용은 확인하지 못했다.", "en": "GBIF treats it as a synonym of ecuatorianus; it is not among the taxa raised by Huang (2017), whose treatment of it could not be verified." },
          "sources": ["dy-gbif-dh", "dy-huang2017-zenodo"]
        },
        {
          "text": { "ko": "GBIF에서 동의어 처리.", "en": "Synonymized in GBIF." },
          "sources": []
        }
      ],
      "images": [],
      "model3d": null,
      "sources": ["dy-jawiki", "dy-enwiki", "dy-wikispecies-dh", "dy-gbif-dh", "dy-huang2017-zenodo", "dy-mushisha2023"]
    }
  ],
  "areas": {
    "los-tuxtlas": {
      "name": { "ko": "로스툭스틀라스 (멕시코 베라크루스)", "en": "Los Tuxtlas (Veracruz, Mexico)" },
      "countries": ["MEX"],
      "point": [-95.1, 18.45]
    },
    "bahia-espirito-santo": {
      "name": { "ko": "브라질 대서양림 (바이아 남동부 · 이스피리투산투 북동부)", "en": "Atlantic Forest, Brazil (SE Bahia, NE Espírito Santo)" },
      "countries": ["BRA"],
      "point": [-39.7, -17.2]
    },
    "rondonia": {
      "name": { "ko": "혼도니아주 (브라질)", "en": "Rondônia (Brazil)" },
      "countries": ["BRA"],
      "point": [-63, -10.8]
    },
    "la-paz-yungas": {
      "name": { "ko": "라파스주 융가스 (볼리비아)", "en": "La Paz Yungas (Bolivia)" },
      "countries": ["BOL"],
      "point": [-67.6, -16.2]
    }
  },
  "sources": {
    "dy-huang2017-zenodo": {
      "title": "Zenodo record of Huang 2017 (abstract listing the 10 taxa raised to species)",
      "url": "https://zenodo.org/records/4957585"
    },
    "dy-jawiki": {
      "title": "ヘラクレスオオカブト – Japanese Wikipedia (cites 永井信二 2002/2006, 飯島和彦 2017, 清水輝彦 2015, 山内英治・永井信二 2009, BE・KUWA)",
      "url": "https://ja.wikipedia.org/wiki/%E3%83%98%E3%83%A9%E3%82%AF%E3%83%AC%E3%82%B9%E3%82%AA%E3%82%AA%E3%82%AB%E3%83%96%E3%83%88"
    },
    "dy-enwiki": {
      "title": "Hercules beetle – English Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Hercules_beetle"
    },
    "dy-wikispecies-dh": {
      "title": "Dynastes hercules – Wikispecies",
      "url": "https://species.wikimedia.org/wiki/Dynastes_hercules"
    },
    "dy-peck2011": {
      "title": "Peck, S.B. 2011. The beetles of Martinique, Lesser Antilles (Insecta: Coleoptera); diversity and distributions – Dynastinae treatment (Plazi)",
      "url": "https://tb.plazi.org/GgServer/html/039D87F3FFDBFFEBFF407DA6B9ED49A5"
    },
    "dy-gbif-dh": {
      "title": "GBIF Backbone – Dynastes hercules (Linnaeus, 1758) and infraspecific names",
      "url": "https://www.gbif.org/species/1074504"
    },
    "dy-keller-cave": {
      "title": "Keller, O. & Cave, R.D. 2016. Hercules Beetle Dynastes hercules (Linnaeus, 1758). UF/IFAS EDIS IN1142",
      "url": "https://ask.ifas.ufl.edu/publication/IN1142"
    },
    "dy-guadeloupe2020": {
      "title": "Arrêté du 24 janvier 2020 fixant la liste des insectes représentés dans le département de la Guadeloupe protégés (AIDA/INERIS)",
      "url": "https://aida.ineris.fr/reglementation/arrete-240120-fixant-liste-insectes-representes-departement-guadeloupe-proteges"
    },
    "dy-wikispecies-reidi": {
      "title": "Dynastes hercules reidi – Wikispecies (baudrii Pinchon 1976 nomen nudum; Ratcliffe & Cave 2015)",
      "url": "https://species.wikimedia.org/wiki/Dynastes_hercules_reidi"
    },
    "dy-inat": {
      "title": "iNaturalist – Dynastes hercules complex (follows Huang 2017 split)",
      "url": "https://www.inaturalist.org/taxa/1502695"
    },
    "dy-mushisha2023": {
      "title": "むし社 BE・KUWA カブトレコード個体 2023年度版 (PDF)",
      "url": "https://mushi-sha.life.coocan.jp/2023Kabuto-record.pdf"
    },
    "dy-kowiki": {
      "title": "헤라클레스장수풍뎅이 – Korean Wikipedia",
      "url": "https://ko.wikipedia.org/wiki/%ED%97%A4%EB%9D%BC%ED%81%B4%EB%A0%88%EC%8A%A4%EC%9E%A5%EC%88%98%ED%92%8D%EB%8E%85%EC%9D%B4"
    },
    "dy-rassart2008": {
      "title": "Rassart, M. et al. 2008. Diffractive hygrochromic effect in the cuticle of the hercules beetle Dynastes hercules. New Journal of Physics 10: 033014",
      "url": "https://doi.org/10.1088/1367-2630/10/3/033014"
    },
    "dy-wikispecies-tux": {
      "title": "Dynastes hercules tuxtlaensis – Wikispecies (synonym of septentrionalis; Ratcliffe et al. 2013)",
      "url": "https://species.wikimedia.org/wiki/Dynastes_hercules_tuxtlaensis"
    },
    "dy-ptwiki-paschoali": {
      "title": "Dynastes paschoali – Portuguese Wikipedia (cites ICMBio Livro Vermelho 2008/2018, Bahia 2017, Espírito Santo 2005 lists)",
      "url": "https://pt.wikipedia.org/wiki/Dynastes_paschoali"
    },
    "dy-inat-paschoali": {
      "title": "iNaturalist – Dynastes paschoali (conservation status VU, Livro Vermelho)",
      "url": "https://www.inaturalist.org/taxa/1065730"
    },
    "dy-huang2017": {
      "title": "Huang, J.-P. 2017. The Hercules beetles (subgenus Dynastes, genus Dynastes, Dynastidae): a revisionary study... Misc. Publ. Mus. Zool. Univ. Michigan 206: 1–32",
      "url": "https://deepblue.lib.umich.edu/handle/2027.42/138820"
    },
    "dy-wikispecies-genus": {
      "title": "Dynastes – Wikispecies (MacLeay 1819; ICZN Opinion 2344; type species by Kirby 1825)",
      "url": "https://species.wikimedia.org/wiki/Dynastes"
    },
    "dy-gbif-genus": {
      "title": "GBIF Backbone – Dynastes MacLeay, 1819",
      "url": "https://www.gbif.org/species/9555578"
    },
    "dy-enwiki-genus": {
      "title": "Dynastes – English Wikipedia",
      "url": "https://en.wikipedia.org/wiki/Dynastes"
    },
    "dy-hinton1973": {
      "title": "Hinton, H.E. & Jarman, G.M. 1973. Physiological colour change in the elytra of the hercules beetle. J. Insect Physiol. 19: 533–549",
      "url": "https://doi.org/10.1016/0022-1910(73)90064-4"
    },
    "dy-huang2016": {
      "title": "Huang, J.-P. 2016. Parapatric genetic introgression and phenotypic assimilation... Molecular Ecology 25: 5513–5526",
      "url": "https://doi.org/10.1111/mec.13849"
    },
    "dy-gwr": {
      "title": "Guinness World Records – Largest species of beetle",
      "url": "https://www.guinnessworldrecords.com/world-records/largest-species-of-beetle"
    },
    "dy-hinton1972": {
      "title": "Hinton, H.E. & Jarman, G.M. 1972. Physiological colour change in the Hercules beetle. Nature 238: 160–161",
      "url": "https://doi.org/10.1038/238160a0"
    },
    "dy-toussaint2015": {
      "title": "Toussaint, A. 2015. Dynastes hercules (Hercules Beetle). Online Guide to the Animals of Trinidad and Tobago, UWI",
      "url": "https://sta.uwi.edu/fst/lifesciences/sites/default/files/lifesciences/documents/ogatt/Dynastes_hercules%20-%20Hercules%20Beetle.pdf"
    },
    "dy-kram1996": {
      "title": "Kram, R. 1996. Inexpensive load carrying by rhinoceros beetles. J. Exp. Biol. 199: 609–612",
      "url": "https://cob.silverchair.com/jeb/article-pdf/199/3/609/3389605/jexbio_199_3_609.pdf"
    },
    "dy-jarman1974": {
      "title": "Jarman, G.M. & Hinton, H.E. 1974. Some defence mechanisms of the Hercules beetle, Dynastes hercules. J. Entomol. (A) 49: 71–80",
      "url": "https://doi.org/10.1111/j.1365-3032.1974.tb00070.x"
    },
    "dy-cites-cop17": {
      "title": "CITES Notification 2016/057 – amendments to Appendices adopted at CoP17 (Dynastes satanas to App. II)",
      "url": "https://cites.org/sites/default/files/notif/E-Notif-2016-057.pdf"
    },
    "dy-usfws-satanas": {
      "title": "USFWS statement (repost): D. satanas the only Dynastes in CITES appendices",
      "url": "https://forums.kingsnake.com/view.php?id=1824028"
    },
    "dy-huang-knowles2016": {
      "title": "Huang, J.-P. & Knowles, L.L. 2016. The species versus subspecies conundrum... Hercules beetles. Systematic Biology 65: 685–699",
      "url": "https://doi.org/10.1093/sysbio/syv119"
    }
  }
});
