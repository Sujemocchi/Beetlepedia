# Beetlepedia — 꽃무지 · 사슴벌레 · 장수풍뎅이 도감

세계의 대형 딱정벌레를 **분류 체계에 따라** 소개하는 교육용 정적 웹사이트입니다. 한국어·영어·일본어로 볼 수 있습니다.
순수 HTML/CSS/JavaScript로 만들었고 빌드 도구와 npm은 쓰지 않습니다. Spring Boot는 정적 파일을 서빙하는 용도로만 씁니다.

현재 다루는 범위:

| 상위 분류군 | 속 | 분류군 |
|---|---|---|
| 꽃무지 (Cetoniinae) | *Goliathus* 골리앗꽃무지속 | 5종 |
| 사슴벌레 (Lucanidae) | *Cyclommatus* 가위사슴벌레속 | 10종·아종 (*elaphus elaphus*, *metallifer finae*, *imperator imperator*, *monguilloni*, *pulchellus*, *chewi*, *lunifer*, *tarandus*, *truncatus*, *speciosus speciosus*) |
| 장수풍뎅이 (Dynastinae) | *Dynastes* 헤라클레스장수풍뎅이속 | *D. hercules* 13아종 |

새 속·종을 추가하는 요구사항과 요청 템플릿은 [`PROMPT.md`](PROMPT.md)에 있습니다.

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
  data/i18n.js                  UI 문구 (한/영/일)
  data/ja/<file>.js             콘텐츠 일본어 번역 (영어 원문을 키로 하는 표)
  data/core.js                  분류 계층(상과까지 공통 + 분류군별), 국가 이름, 공통 출처
  data/genera/<genus>.js        속 하나의 모든 데이터: 속 개요·생활사·사육, 종·아종, 섬/지역 정의, 출처
  assets/maps/<region>.js       지역 지도: africa, southeast-asia, neotropics
tools/
  validate-data.js              데이터 검증 (id 중복, 분포 코드↔지도, 출처 id, 이미지 메타데이터, 일본어 번역 누락 등)
  extract-strings.js            번역 대상 텍스트 추출 (--missing-ja: 일본어가 없는 텍스트만)
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
3. 네 HTML 파일에 `<script src="data/genera/<id>.js">`와 `<script src="data/ja/<id>.js">`를 추가합니다.
   일본어 번역은 `node tools/extract-strings.js --missing-ja --json`으로 목록을 뽑아 `data/ja/<id>.js`에 넣습니다.
4. `node tools/validate-data.js`로 검증합니다.

### 언어 (한국어 · English · 日本語)

헤더의 `KO | EN | JA` 버튼으로 전환합니다. 선택은 `localStorage`의 `beetlepedia-lang`에 저장하고(try/catch), `<html lang>`도 바꿉니다.
학명은 언어와 관계없이 이탤릭 라틴어로 표기합니다.

- **UI 문구**: `data/i18n.js`의 각 키에 `ko`, `en`, `ja`가 있습니다.
- **콘텐츠**: 데이터의 텍스트는 `{ ko, en }`입니다. 일본어는 `data/ja/<파일>.js`(`window.BP_JA`)에 **영어 원문을 키로** 따로 둡니다.
  표시 순서는 ① 데이터에 직접 넣은 `ja` → ② `BP_JA[en]` → ③ 영어입니다. 영어 원문을 고치면 번역이 끊기므로 검증 스크립트가 바로 알려 줍니다.
- **일본어 이름**: 분류군의 `nameJa`(일본 취미계·문헌의 和名)를 씁니다. 확인되지 않은 이름에는 `nameInformal.ja`로 "非公式名" 표시를 붙입니다.
- 번역이 빠진 텍스트 목록: `node tools/extract-strings.js --missing-ja` (전체 목록은 `--json`).
- 일본어 화면은 Noto Sans/Serif JP 글꼴을 쓰고, 한국어용 `word-break: keep-all`을 끕니다.

## 백엔드 (진행 중)

데이터를 JS 파일에서 DB로 옮기는 작업을 단계별로 진행하고 있습니다. 화면은 아직 JS 데이터 파일을 씁니다.

- **도메인 모델** (`src/main/kotlin/.../domain`): `TaxonGroup` → `Genus` → `Taxon`(종·아종), `Source`, `Image`, `Country`, `Area`, `MapRegion`, `BaseRank`
  - 다국어 텍스트는 `LocalizedText`(ko/en/ja)이며, 컬럼 이름은 속성 경로를 따릅니다(`name.ko` → `name_ko`, `size.male.max` → `size_male_max`).
  - 몸길이는 `SizeRange(min, max)`이며 `min`은 null일 수 있습니다(최댓값만 알려진 경우).
- **스키마**: Flyway(`src/main/resources/db/migration`)가 관리하고, Hibernate는 엔티티와 스키마가 맞는지만 검사합니다(`ddl-auto=validate`).
  개발·테스트는 H2 메모리 DB를 쓰며, SQL은 PostgreSQL에서도 쓸 수 있게 작성했습니다.
- 리포지토리: `src/main/kotlin/.../repository/Repositories.kt`
- **시드 데이터** (`src/main/resources/seed`): `core.json`과 `genera/<속>.json`. 서버가 시작할 때 DB가 비어 있으면 이 시드를 검증한 뒤 넣습니다(`SeedLoader`). 규칙을 하나라도 어기면 서버가 시작되지 않고 문제 목록을 출력합니다.
  - 지금은 JS 데이터 파일에서 `node tools/export-seed.js`로 만듭니다(일본어 오버레이를 `ja`로 합침). 화면이 API로 바뀌면 시드가 원본이 됩니다.
- **검증** (`TaxonomyValidator`): `validate-data.js`의 규칙(id·학명 형식, 계급, 색, 몸길이, 분포 코드와 지도, 사진 크레딧, 일본어 누락)을 서버로 옮겼습니다. 지도 다각형은 사이트의 지도 파일을 그대로 읽습니다.

### 조회 API

| 엔드포인트 | 내용 |
|---|---|
| `GET /api/bootstrap` | 페이지가 쓰는 전체 데이터. 예전 `window.BP`와 같은 모양(분류군·속·종·국가·지역·출처·지도) |
| `GET /api/groups`, `/api/groups/{id}` | 상위 분류군과 소속 속 요약 |
| `GET /api/genera`, `/api/genera/{id}` | 속 요약 목록 / 속 전체와 그 분류군 |
| `GET /api/taxa/{id}` | 종·아종 상세 |
| `GET /api/taxa?q=&group=&genus=&rank=&minLength=&maxLength=&country=&hasImage=` | 검색. `q`는 학명(약칭 `D. h. lichyi` 포함)과 한·영·일 이름, `country`는 그 나라에 있는 섬·지역 분포도 포함 |

- 다국어 텍스트는 `{ "ko", "en", "ja" }`, 몸길이는 `[min, max]`(min은 null 가능)입니다. 값이 없는 필드는 응답에서 빠집니다.
- 없는 id는 404, 잘못된 파라미터는 400이며 본문은 RFC 9457 `ProblemDetail`입니다.

## 테스트

```bash
./gradlew test                 # Spring 컨텍스트, DB 스키마·리포지토리, 모든 페이지·스크립트·데이터 파일 서빙
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

공통 규칙은 `PROMPT.md` 7장(조사·정확성 규칙)에 있습니다. 요약:
- 영어·일본어·한국어 자료를 함께 조사합니다. 사슴벌레·장수풍뎅이는 일본 문헌과 사육 기록(BE-KUWA 등)이 가장 풍부합니다.
- 최대 몸길이는 야외 기록과 사육 기록을 구분해 `size.note`에 적습니다. 최솟값을 모르면 `[null, max]`로 둡니다.
- 분류 논쟁은 사이트가 따르는 체계를 밝히고, 다른 견해를 각 분류군의 "특별한 이슈"에 적습니다.
- 공식 국명이 없는 이름에는 "비공식 이름" 표시를 붙입니다(일본어 이름도 같음).

### 속별 메모

#### *Goliathus* 골리앗꽃무지속
- 몸길이는 영문 Wikipedia 각 종 문서(원출처: Natural Worlds, Beetles Space 등) 기준입니다.
- 무게는 속 전체 기준입니다. 흔히 말하는 "100g 이상"은 유충의 무게이고, 성충은 약 50g(추정)입니다.
- *G. regius* × *G. cacicus* 자연 교잡종 *G.* "atlas"를 두 종의 "특별한 이슈"에 정리했습니다.
- Catalogue of Life는 6종(*G. kolbei* 포함)을 싣고 있으며, 이 사이트는 5종을 다룹니다. 5종 모두 IUCN 미평가(NE)입니다.
- 일본어 이름 중 *goliatus* 외 4종(レギウス 등)은 일본 자료로 확인하지 못해 "非公式名"으로 표시합니다.

#### *Cyclommatus* 가위사슴벌레속
- *C. elaphus elaphus*, *C. imperator imperator* 같은 삼명법은 아종을 인정하는 일본 문헌(Mizunuma & Nagai 1994)의 체계입니다. Catalogue of Life는 두 종에 아종을 두지 않습니다.
- *C. monguilloni*는 독립종/아종(*C. imperator monguilloni*) 견해가 갈립니다. *C. truncatus*는 *C. elaphus truncatus*로 기재되었다가 종으로 다뤄집니다.
- *C. chewi*에 관한 2020년 종군 재검토 논문(Kim et al., *J. Asia-Pacific Biodiversity* 13(3))은 사바주 생물다양성법 미준수로 **철회**되었습니다. 해당 논문의 내용은 쓰지 않았습니다.
- 수록 10개 분류군 모두 IUCN 미평가(NE)입니다.

#### *Dynastes* 헤라클레스장수풍뎅이속
- *D. hercules*는 전통적인 13아종 체계를 따랐습니다. Huang(2017)은 그중 10개를 독립 종으로 승격했고, GBIF는 일부(*baudrii*, *tuxtlaensis*, *morishimai*, *takakuwai*)를 동의어로 봅니다. 각 아종 페이지의 "아종인가, 종인가"에 적었습니다.
- "몸무게 850배를 든다"는 말은 측정 근거가 없어 검증되지 않은 주장으로 적었습니다(Kram 1996 실측: 소형 장수풍뎅이류 최대 약 100배).
- IUCN 평가 기록은 찾지 못했습니다. 과들루프(2020년 장관령)·마르티니크·도미니카의 보호·반출 금지를 적었습니다.
- 분포가 좁은 아종(*tuxtlaensis*, *paschoali*, *morishimai*, *takakuwai*)은 지도에 점(`point` 지역)으로 표시합니다.

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
