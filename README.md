# Beetlepedia — 꽃무지 · 사슴벌레 · 장수풍뎅이 도감

세계의 대형 딱정벌레를 **분류 체계에 따라** 소개하는 교육용 정적 웹사이트입니다.
순수 HTML/CSS/JavaScript로 만들었고 빌드 도구와 npm은 쓰지 않습니다. Spring Boot는 정적 파일을 서빙하는 용도로만 씁니다.

현재 다루는 범위:

| 상위 분류군 | 속 | 분류군 |
|---|---|---|
| 꽃무지 (Cetoniinae) | *Goliathus* 골리앗꽃무지속 | 5종 |
| 사슴벌레 (Lucanidae) | *Cyclommatus* 가위사슴벌레속 | 10종·아종 (*elaphus elaphus*, *metallifer finae*, *imperator imperator*, *monguilloni*, *pulchellus*, *chewi*, *lunifer*, *tarandus*, *truncatus*, *speciosus speciosus*) |
| 장수풍뎅이 (Dynastinae) | *Dynastes* 헤라클레스장수풍뎅이속 | *D. hercules* 13아종 |

## 실행 방법

사이트 파일은 Spring Boot 정적 리소스 폴더 `src/main/resources/static/`에 있습니다.

1. **파일로 바로 열기**: `src/main/resources/static/index.html`을 브라우저로 엽니다.
2. **Spring Boot로 띄우기**: `./gradlew bootRun` 실행 후 http://localhost:8080 에 접속합니다.

사진(Wikimedia Commons)과 글꼴(Google Fonts)을 불러오려면 인터넷 연결이 필요합니다.

## 페이지 구조 (계층)

```
index.html                      Beetlepedia 홈: 세 분류군, 계통 트리, 속을 넘나드는 크기 비교, 전체 목록(검색)
└ group.html?id=<group>         상위 분류군 (cetoniinae / lucanidae / dynastinae): 개요, 분류, 속 목록
  └ genus.html?id=<genus>       속: 개요, 종 카드, 비교표, 분포 지도, 크기·무게 비교, 생활사, 보전·사육, 출처
    └ taxon.html?id=<taxon>     종·아종: 형태·크기, 역사·이슈, 3D(준비 중), 생태, 분포 지도(확대), 사육, 보전, 출처
```

페이지는 템플릿 하나에 쿼리 문자열로 내용을 채웁니다. **새 종을 추가할 때 HTML 파일을 만들 필요 없이 데이터만 넣으면 됩니다.**
`file://`에서도 `location.search`가 동작하므로 파일로 열어도 됩니다.

## 파일 구조

```
src/main/resources/static/
  index.html, group.html, genus.html, taxon.html
  css/style.css                 디자인 ("모던 다큐멘터리" 다크 테마, CSS 변수, 반응형)
  js/main.js                    공통: 언어 전환, 헤더·푸터, 분류 트리 조회, 학명 이탤릭 처리, 실루엣, 카드
  js/home.js | group.js | genus.js | taxon.js   페이지별 렌더링
  js/map.js                     분포 지도 (국가·섬 단위 강조, 작은 섬은 점, 종 페이지에서는 분포에 맞춰 확대)
  js/size-compare.js            실제 비율 크기 비교 (분류군별 실루엣) + 무게 막대
  data/i18n.js                  UI 문구
  data/core.js                  분류 계층(상과까지 공통 + 분류군별), 국가 이름, 공통 출처
  data/genera/<genus>.js        속 하나의 모든 데이터: 속 개요·생활사·사육, 종·아종, 섬/지역 정의, 출처
  assets/maps/<region>.js       지역 지도: africa, southeast-asia, neotropics
tools/
  validate-data.js              데이터 검증 (id 중복, 분포 코드↔지도, 출처 id, 이미지 메타데이터 등)
  mapgen/gen.js                 Natural Earth → 지역 지도 생성기
```

### 데이터 형식

- 전역 변수 JS를 씁니다(`window.BP`, `window.I18N`). `file://`에서는 `fetch()`로 로컬 JSON을 읽을 수 없기 때문입니다.
- 각 속 파일은 `BP.registerGenus({...})`를 호출합니다. 계층은 `group → genus → taxon`이며 taxon의 `rank`는 `species` 또는 `subspecies`입니다.
  아종의 상위 종은 `species`(이명법 학명)로, 종 수준 설명은 속의 `speciesInfo`로 넣습니다.
- 몸길이는 `[min, max]`(mm)입니다. **최댓값만 발표된 경우 `[null, max]`** 로 두고 화면에는 "≤ max mm"로 표시합니다. 근거 없는 최솟값을 만들지 않기 위해서입니다.
- 분포(`distribution`)는 ISO 3166-1 alpha-3 국가 코드 또는 `areas`의 키입니다.
  `areas`는 섬·지역을 정의합니다: `box`(경위도 상자)에 중심이 들어오는 지도 다각형을 강조하거나, `point`(경위도)에 점을 찍습니다.
  예: `sumatra`, `banggai`(펠렝섬 등), `new-guinea-id`, `los-tuxtlas`.
- 출처 id는 속마다 접두사를 붙입니다(`cy-`, `dy-`). 모든 숫자·서술에는 `sources`가 연결되어 있습니다.

### 새 속을 추가하는 방법

1. `data/genera/<id>.js`를 만들고 `BP.registerGenus({...})`로 속·분류군·출처를 넣습니다(`goliathus.js`가 예시).
2. 지도가 없는 지역이면 `tools/mapgen/gen.js`의 `REGIONS`에 범위를 추가해 지도를 만듭니다.
3. 네 HTML 파일에 `<script src="data/genera/<id>.js">`를 추가합니다.
4. `node tools/validate-data.js`로 검증합니다.

### 언어

헤더의 언어 버튼으로 전환합니다. 선택은 `localStorage`의 `beetlepedia-lang`에 저장합니다(try/catch).
학명은 언어와 관계없이 이탤릭 라틴어로 표기합니다.

## 테스트

```bash
./gradlew test                 # Spring 컨텍스트 + 모든 페이지·스크립트·데이터 파일이 서빙되는지
node tools/validate-data.js    # 데이터 무결성 검사
```

## 지도

국경은 [Natural Earth](https://www.naturalearthdata.com/) 1:50m(퍼블릭 도메인)를
[world-atlas 2.0.2](https://github.com/topojson/world-atlas)(ISC) TopoJSON으로 받아 `tools/mapgen/gen.js`로 단순화했습니다(등장방형 투영).
다시 만들려면:

```bash
curl -o countries-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
node tools/mapgen/gen.js countries-50m.json src/main/resources/static/assets/maps
```

- 섬 하나하나가 별도 경로라서 섬 단위 분포(수마트라, 방가이 제도 등)를 표시할 수 있습니다.
- 프랑스 해외 영토(과들루프, 마르티니크, 프랑스령 기아나)는 프랑스에서 분리했습니다.
- 크기가 작은 섬은 점으로 표시합니다. 분포 표시는 국가·섬 단위이므로 실제 분포는 그 일부일 수 있습니다.

## 이미지

모든 사진은 Wikimedia Commons에서 `Special:FilePath`로 불러오며, 작가·라이선스·원본 링크를 캡션과 각 속 페이지의 "이미지 출처"에 표시합니다.
**흰 배경 표본 사진을 우선** 골랐고(`white: true`), 이런 사진은 잘리지 않게 밝은 "표본 판" 위에 통째로 보여 줍니다.
라이선스를 확인한 사진이 없는 분류군은 실루엣과 "사진을 아직 찾지 못했습니다" 안내를 표시합니다.

### TODO: 이미지
- 사진 없음: *C. monguilloni*, *C. chewi*, *C. lunifer*, *D. h. reidi*, *baudrii*, *occidentalis*, *tuxtlaensis*, *trinidadensis*, *bleuzeni*, *paschoali*, *morishimai*, *takakuwai*.
- *C. metallifer finae*의 `Ssp finae.JPG`는 파일명과 일본어 위키백과 캡션은 펠렝(finae)인데 Commons 설명란에는 *aenomicans*로 적혀 있습니다. 확인이 필요합니다.
- *C. truncatus*의 사진은 세 종을 함께 찍은 단체 사진입니다. 잘라 낸 사진이 있으면 교체하기.
- *C. speciosus*의 RBINS 사진 3장은 종 수준 동정이며 아종(원명아종) 확인은 되지 않았습니다.

## 정확성 메모

- 조사는 영어·일본어·한국어 자료를 함께 썼습니다. 사슴벌레·장수풍뎅이는 일본 문헌과 사육 기록(BE-KUWA 등)이 가장 풍부합니다.
- **기록값 구분**: 사슴벌레·장수풍뎅이 최대 몸길이는 야외 기록과 사육 기록을 구분해 `size.note`에 적었습니다.
- **분류 논쟁을 숨기지 않습니다.**
  - *Cyclommatus elaphus elaphus*, *C. imperator imperator* 같은 삼명법은 아종을 인정하는 일본 문헌(Mizunuma & Nagai 1994)의 체계입니다. Catalogue of Life는 두 종에 아종을 두지 않습니다. *C. monguilloni*는 독립종/아종 견해가 갈립니다.
  - *Dynastes hercules*는 전통적인 13아종 체계를 따랐습니다. Huang(2017)은 그중 10개를 독립 종으로 승격했고, GBIF는 일부를 동의어로 봅니다. 각 아종 페이지의 "아종인가, 종인가" 이슈에 적었습니다.
- *C. chewi*에 관한 2020년 종군 재검토 논문(Kim et al., *J. Asia-Pacific Biodiversity* 13(3))은 사바주 생물다양성법 미준수로 **철회**되었습니다. 해당 논문의 내용은 쓰지 않았습니다.
- "헤라클레스는 몸무게 850배를 든다"는 말은 측정 근거가 없어 검증되지 않은 주장으로 적었습니다(Kram 1996 실측: 소형 장수풍뎅이류 최대 약 100배).
- 보전 상태: *Goliathus*, *Cyclommatus*는 모두 IUCN 미평가(NE). *D. hercules*는 평가 기록을 찾지 못했으며, 과들루프(2020년 장관령)·마르티니크·도미니카의 보호·반출 금지를 적었습니다.
- 한국어 이름: 널리 쓰이는 이름(골리앗꽃무지, 메탈리퍼가위사슴벌레, 헤라클레스장수풍뎅이 등)은 그대로, 공식 국명이 없는 이름은 "비공식 이름" 표시를 붙였습니다.

### 골리앗꽃무지속 메모 (이전 버전에서 계승)
- 몸길이는 영문 Wikipedia 각 종 문서(원출처: Natural Worlds, Beetles Space 등) 기준입니다.
- 무게는 속 전체 기준입니다. 흔히 말하는 "100g 이상"은 유충의 무게이고, 성충은 약 50g(추정)입니다.
- *G. regius* × *G. cacicus* 자연 교잡종 *G.* "atlas"를 두 종의 "특별한 이슈"에 정리했습니다.
- Catalogue of Life는 6종(*G. kolbei* 포함)을 싣고 있으며, 이 사이트는 5종을 다룹니다.

## 3D 모델: 보류
상세 페이지의 "3D 모델" 섹션은 "준비 중" 안내만 표시합니다. *G. albosignatus*의 `model3d`에 Sketchfab 모델 ID `84ab495a2f204510b9ed131ec25e3418`가 들어 있습니다.
TODO: 라이선스·원작자를 확인한 모델만 "3D로 보기" 버튼으로 지연 로딩하기.

## 주요 참고문헌
전체 목록은 각 속 페이지 하단과 `data/genera/*.js`의 `sources`에 있습니다.
- De Palma M. et al. (2020) *Entomologia Africana* 25(1) — *Goliathus* 바코딩·분류 개정
- Zhu et al. (2023) — *Cyclommatus* 분자계통 (섬 무리·대륙 무리)
- Huang J.-P. (2017) — *Dynastes hercules* 무리 개정
- Hinton & Jarman (1972), Rassart et al. (2008) — 헤라클레스 딱지날개의 습도 변색
- BE-KUWA 기록 목록(むし社) — 사육·야외 최대 기록
