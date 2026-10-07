# Beetlepedia — 꽃무지 · 사슴벌레 · 장수풍뎅이 도감

세계의 대형 딱정벌레를 **분류 체계에 따라** 소개하는 교육용 웹사이트입니다. 한국어·영어·일본어로 볼 수 있습니다.
백엔드는 Spring Boot(Kotlin) + JPA + Flyway이고, 화면은 빌드 도구 없는 순수 HTML/CSS/JavaScript로 REST API에서 데이터를 받아 그립니다.

현재 다루는 범위:

| 상위 분류군 | 속 | 분류군 |
|---|---|---|
| 꽃무지 (Cetoniinae) | *Goliathus* 골리앗꽃무지속 | 5종 |
| 사슴벌레 (Lucanidae) | *Cyclommatus* 가위사슴벌레속 | 10종·아종 (*elaphus elaphus*, *metallifer finae*, *imperator imperator*, *monguilloni*, *pulchellus*, *chewi*, *lunifer*, *tarandus*, *truncatus*, *speciosus speciosus*) |
| 장수풍뎅이 (Dynastinae) | *Dynastes* 헤라클레스장수풍뎅이속 | *D. hercules* 13아종 |

새 속·종을 추가하는 요구사항과 요청 템플릿은 [`PROMPT.md`](PROMPT.md)에 있습니다.

## 실행 방법

```bash
./gradlew bootRun        # http://localhost:8080
```

화면은 서버의 API(`/api/bootstrap`)에서 데이터를 받아 오므로 **서버를 실행해야 볼 수 있습니다**(HTML 파일을 직접 여는 방식은 더 이상 동작하지 않습니다).
개발용 DB는 `./data/beetlepedia.mv.db`(H2 파일, git 제외)입니다. 처음 시작할 때 비어 있으면 시드 데이터를 검증해 넣고, 이후에는 관리자 화면에서 고친 내용이 유지됩니다. 처음부터 다시 하려면 `data/` 폴더를 지우거나 관리자 화면의 "시드에서 다시 불러오기"를 쓰세요.
사진(Wikimedia Commons)과 글꼴(Google Fonts)을 불러오려면 인터넷 연결이 필요합니다.

## 페이지 구조 (계층)

```
index.html                      Beetlepedia 홈: 세 분류군, 계통 트리, 속을 넘나드는 크기 비교, 조건 검색(이름·계급·몸길이·국가·사진)
└ group.html?id=<group>         상위 분류군 (cetoniinae / lucanidae / dynastinae): 개요, 분류, 속 목록
  └ genus.html?id=<genus>       속: 개요, 종 카드, 비교표, 분포 지도, 크기 비교, 생활사, 보전·사육, 출처
    └ taxon.html?id=<taxon>     종·아종: 형태·크기, 역사·이슈, 3D(준비 중), 생태, 분포 지도(확대), 사육, 보전, 출처
```

페이지는 템플릿 하나에 쿼리 문자열로 내용을 채웁니다. **새 종을 추가할 때 HTML 파일을 만들 필요 없이 데이터만 넣으면 됩니다.**

## 파일 구조

```
src/main/resources/
  seed/core.json                분류 계층(상과까지 공통 + 분류군별), 국가 이름, 지도 이름, 공통 출처
  seed/genera/<genus>.json      속 하나의 모든 데이터: 속 개요·생활사·사육, 종·아종, 섬/지역 정의, 출처 (한/영/일)
  db/migration/V1__init.sql     DB 스키마 (Flyway)
  db/migration/V2__drop_weights.sql  무게 비교 테이블·컬럼 삭제
  static/
    index.html, group.html, genus.html, taxon.html
    css/style.css               디자인 ("모던 다큐멘터리" 다크 테마, CSS 변수, 반응형)
    js/boot.js                  페이지에 맞는 /api/bootstrap 범위를 불러와 window.BP를 채운 뒤 페이지 스크립트를 순서대로 실행
    js/main.js                  공통: 언어 전환, 헤더·푸터, 분류 트리 조회, 학명 이탤릭 처리, 실루엣, 카드
    js/home.js | group.js | genus.js | taxon.js   페이지별 렌더링
    js/map.js                   분포 지도 (국가·섬 단위 강조, 작은 섬은 점, 종 페이지에서는 분포에 맞춰 확대)
    js/size-compare.js          실제 비율 크기 비교 (분류군별 실루엣)
    data/i18n.js                UI 문구 (한/영/일)
    assets/maps/<region>.js     지역 지도: africa, southeast-asia, neotropics
src/main/kotlin/com/example/beetlepedia/
  domain/        엔티티        repository/   리포지토리
  seed/          시드 읽기·적재, 지도 다각형      validation/   데이터 규칙
  api/           조회 REST API
tools/
  mapgen/gen.js                 Natural Earth → 지역 지도 생성기
  cutout/                       사진 배경 제거(누끼) 파이프라인: manifest.json, cutout.py
```

### 데이터 형식 (시드 JSON)

- 시드(`src/main/resources/seed`)가 데이터의 **원본**입니다. 서버는 시작할 때 이 JSON을 검증해 DB에 넣고, 화면은 API로 받습니다.
- 계층은 `group → genus → taxon`이며 taxon의 `rank`는 `species` 또는 `subspecies`입니다.
  아종의 상위 종은 `species`(이명법 학명)로, 종 수준 설명은 속의 `speciesInfo`로 넣습니다.
- 사람이 읽는 텍스트는 모두 `{ "ko", "en", "ja" }`입니다.
- 몸길이는 `[min, max]`(mm)입니다. **최댓값만 발표된 경우 `[null, max]`** 로 두고 화면에는 "≤ max mm"로 표시합니다. 근거 없는 최솟값을 만들지 않기 위해서입니다.
- 분포(`distribution`)는 ISO 3166-1 alpha-3 국가 코드 또는 `areas`의 키입니다.
  `areas`는 섬·지역을 정의합니다: `box`(경위도 상자)에 중심이 들어오는 지도 다각형을 강조하거나, `point`(경위도)에 점을 찍습니다.
  예: `sumatra`, `banggai`(펠렝섬 등), `new-guinea-id`, `los-tuxtlas`.
- 출처 id는 속마다 접두사를 붙입니다(`cy-`, `dy-`). 모든 숫자·서술에는 `sources`가 연결되어 있습니다.

### 새 속을 추가하는 방법

1. `src/main/resources/seed/genera/<id>.json`을 만들어 속·분류군·출처·지역을 넣습니다(`goliathus.json`이 예시). 일본어(`ja`)도 함께 넣습니다.
2. 지도가 없는 지역이면 `tools/mapgen/gen.js`의 `REGIONS`에 범위를 추가해 지도를 만들고, `seed/core.json`의 `maps`에 이름을 넣고, `genus.html`·`taxon.html`에 지도 스크립트를 추가합니다.
3. `./gradlew test`를 실행합니다. `SeedLoaderTests`가 시드 전체를 규칙대로 검사해 문제를 목록으로 보여 줍니다.

### 언어 (한국어 · English · 日本語)

헤더의 `KO | EN | JA` 버튼으로 전환합니다. 선택은 `localStorage`의 `beetlepedia-lang`에 저장하고(try/catch), `<html lang>`도 바꿉니다.
학명은 언어와 관계없이 이탤릭 라틴어로 표기합니다.

- **UI 문구**: `data/i18n.js`의 각 키에 `ko`, `en`, `ja`가 있습니다.
- **콘텐츠**: 시드의 모든 텍스트에 `ja`가 있어야 합니다(검증 규칙). 일본어가 없으면 화면은 영어로 보여 줍니다.
- **일본어 이름**: 분류군의 `name.ja`(일본 취미계·문헌의 和名)를 씁니다. 확인되지 않은 이름에는 `nameInformal.ja`로 "非公式名" 표시를 붙입니다.
- 일본어 화면은 Noto Sans/Serif JP 글꼴을 쓰고, 한국어용 `word-break: keep-all`을 끕니다.

## 백엔드

- **도메인 모델** (`domain/`): `TaxonGroup` → `Genus` → `Taxon`(종·아종), `Source`, `Image`, `Country`, `Area`, `MapRegion`, `BaseRank`
  - 다국어 텍스트는 `LocalizedText`(ko/en/ja)이며, 컬럼 이름은 속성 경로를 따릅니다(`name.ko` → `name_ko`, `size.male.max` → `size_male_max`).
  - 몸길이는 `SizeRange(min, max)`이며 `min`은 null일 수 있습니다(최댓값만 알려진 경우).
- **스키마**: Flyway(`db/migration`)가 관리하고, Hibernate는 엔티티와 스키마가 맞는지만 검사합니다(`ddl-auto=validate`).
  개발·테스트는 H2 메모리 DB를 쓰며, SQL은 PostgreSQL에서도 쓸 수 있게 작성했습니다.
- **시드 적재** (`SeedLoader`): DB가 비어 있으면 시드를 검증한 뒤 넣습니다. 규칙을 하나라도 어기면 서버가 시작되지 않고 문제 목록을 출력합니다. `beetlepedia.seed.enabled=false`로 끌 수 있습니다.
- **검증** (`TaxonomyValidator`): id·학명 형식, 계급, 색, 몸길이, 분포 코드와 지도 다각형, 사진 크레딧, 일본어 누락. 지도 다각형은 사이트의 지도 파일을 그대로 읽습니다.

### 조회 API

| 엔드포인트 | 내용 |
|---|---|
| `GET /api/bootstrap` | 페이지 데이터(분류군·속·종·국가·지역·출처·지도). `js/boot.js`가 페이지에 맞는 범위로 불러와 `window.BP`로 씀 |
| `GET /api/bootstrap?scope=summary` | 홈·분류군 페이지용: 긴 글 없이 이름·크기·분포·대표 사진만 (전체의 약 15%) |
| `GET /api/bootstrap?genus={id}` / `?taxon={id}` | 속·종 페이지용: 그 속만 전체, 나머지는 요약, 출처는 그 속이 인용한 것만 |
| `GET /api/groups`, `/api/groups/{id}` | 상위 분류군과 소속 속 요약 |
| `GET /api/genera`, `/api/genera/{id}` | 속 요약 목록 / 속 전체와 그 분류군 |
| `GET /api/taxa/{id}` | 종·아종 상세 |
| `GET /api/taxa?q=&group=&genus=&rank=&minLength=&maxLength=&country=&hasImage=` | 검색. `q`는 학명(약칭 `D. h. lichyi` 포함)과 한·영·일 이름, `country`는 그 나라에 있는 섬·지역 분포도 포함 |

- 몸길이는 `[min, max]`(min은 null 가능)입니다. 값이 없는 필드는 응답에서 빠집니다.
- 없는 id는 404, 잘못된 파라미터는 400이며 본문은 RFC 9457 `ProblemDetail`입니다.

## 관리자 화면 (/admin)

```bash
BEETLEPEDIA_ADMIN_PASSWORD=비밀번호 ./gradlew bootRun     # 아이디 admin
```

비밀번호를 정하지 않으면 서버 시작 로그에 그 실행에서만 쓰는 임시 비밀번호가 한 번 출력됩니다.

- **대시보드**: 개수, 사진 없는 분류군 수, 모든 데이터 규칙 검사 결과(일본어 누락 포함)
- **분류군**: 속별 목록, 편집·추가·삭제. 이름·몸길이·분포·서식지·생태·보전·사진·출처 등을 한/영/일로 고칩니다.
  저장할 때 `TaxonomyValidator` 규칙을 그대로 검사하며, 하나라도 어기면 **아무것도 저장하지 않고** 문제 목록을 보여 줍니다.
  (연표·특별한 이슈·재미있는 사실·아종 목록은 아직 시드 JSON에서 고칩니다.)
- **출처**, **사진**: 목록·편집·추가 (사진은 Wikimedia Commons 파일 이름, 작가, 라이선스, 흰 배경 여부, 대체 텍스트)
- **시드로 내보내기**: 지금 DB를 시드 형식(zip)으로 받습니다. `src/main/resources/seed`에 풀어 커밋하면 수정이 저장소에 남습니다.
- **시드에서 다시 불러오기**: DB를 비우고 시드로 다시 채웁니다(시드가 규칙을 어기면 DB는 그대로).

공개 페이지와 `/api/**`는 로그인 없이 열려 있고, `/admin/**`만 로그인이 필요합니다(CSRF 보호 사용).

## 테스트

```bash
./gradlew test    # DB 스키마·리포지토리, 시드 검증·적재·내보내기 왕복, API, 관리자 화면·보안, 모든 페이지 서빙
```

브라우저 점검(모든 페이지 × 1280/375px × 한·영·일, 검색 UI, 관리자 화면)은 서버를 띄운 뒤 실행합니다.

```bash
BEETLEPEDIA_ADMIN_PASSWORD=pw ./gradlew bootRun
cd e2e && npm ci && npx playwright install chromium
E2E_ADMIN_PASSWORD=pw node run.mjs          # 설치된 Chrome을 쓰려면 E2E_CHANNEL=chrome
```

GitHub Actions(`.github/workflows/ci.yml`)가 PR과 `main` 푸시마다 두 가지를 모두 실행합니다.

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
**구도는 위에서 내려다본 등면 표본 사진으로 통일**합니다(머리가 위, 좌우 대칭, 다리·더듬이·큰턱/뿔이 보이는 것, 흰색·단색 배경, 성별이 표시되면 수컷을 대표로). 옆모습·생태 사진·여러 마리 사진·손 위 사진은 쓰지 않습니다.
흰 배경 사진(`white: true`)은 잘리지 않게 밝은 "표본 판" 위에 통째로 보여 줍니다.

### 배경 제거(누끼)와 후광
표본 사진은 배경을 제거한 투명 WebP(`static/assets/images/cutouts/`, 긴 변 최대 1200px)로 보여 주고, 이미지 데이터의 `cutout` 필드가 그 파일을 가리킵니다.
누끼 파일이 없거나 불러오지 못하면 Commons 원본을 보여 줍니다. 곤충 외곽선을 따라 CSS `drop-shadow`를 세 겹(가는 밝은 테두리 + 넓고 옅은 번짐) 줘서 어두운 배경에서도 다리·더듬이가 묻히지 않게 합니다.
누끼는 원본의 2차 저작물이므로 원본 라이선스(CC BY-SA 등)를 그대로 따르며, 출처 줄에 "배경 제거 등 편집"(한/영/일)을 붙입니다.

```bash
py -3 -m venv tools/cutout/.venv
tools/cutout/.venv/Scripts/python -m pip install "rembg[cpu]" pillow numpy scipy
tools/cutout/.venv/Scripts/python tools/cutout/cutout.py          # manifest.json 전체
tools/cutout/.venv/Scripts/python tools/cutout/cutout.py elapus   # 이름에 elapus가 들어간 항목만
```
- 신경망(rembg `isnet-general-use`) 마스크와, 배경색 모델과의 색 차이 마스크를 합칩니다. 신경망이 놓치는 가는 다리·더듬이 끝을 색 차이 마스크가 살립니다.
- `manifest.json` 항목별로 `rotate`(회전), `floor`(배경으로 볼 색 차이 하한: 어두운 표본·받침 그림자용), `de`(색 차이 범위)를 조절합니다.
- `tools/cutout/.review/`의 검토 이미지(원본 | 어두운 배경 | 자홍색 배경)로 다리·발톱·더듬이·큰턱 톱니가 남았는지, 흰 테두리나 그림자가 없는지 반드시 눈으로 확인합니다.
- 회전한 사진(Udo Schmidt의 *D. h. lichyi* 수컷·암컷)은 누끼만 회전되어 있으므로, 누끼를 불러오지 못할 때 보이는 원본은 옆으로 누워 있습니다.
라이선스를 확인한 사진이 없는 분류군은 실루엣과 "사진을 아직 찾지 못했습니다" 안내를 표시합니다.

### TODO: 이미지
- 사진 없음: *C. monguilloni*, *C. chewi*, *C. lunifer*, *D. h. reidi*, *baudrii*, *occidentalis*, *tuxtlaensis*, *trinidadensis*, *bleuzeni*, *paschoali*, *morishimai*, *takakuwai*.
- *C. metallifer finae*의 `Ssp finae.JPG`는 파일명과 일본어 위키백과 캡션은 펠렝(finae)인데 Commons 설명란에는 *aenomicans*로 적혀 있습니다. 확인이 필요합니다.
- *C. truncatus*의 사진은 세 종을 함께 찍은 단체 사진입니다. 단독 등면 사진이 Commons에 없어 그대로 둡니다(잘라 낸 사진이 있으면 교체하기).
- 등면 표본 사진을 찾지 못해 기존 사진을 유지: *D. h. hercules*(야생·사육 개체), *D. h. septentrionalis*(야생 암컷·수컷). *D. h. ecuatorianus*는 수컷 등면 사진이 없어 암컷 등면 사진이 대표입니다.
- 머리가 옆을 향한 *C. m. metallifer* 수컷(Udo Schmidt)은 아종이 달라 쓰지 않았습니다. *D. h. lichyi*의 Udo Schmidt 사진은 누끼 단계에서 회전해 씁니다.
- *D. h. lichyi* 두 번째 사진(Anaxibia, 스티로폼 위)은 뿔 옆에 받침 그림자 조각이 조금 남아 있습니다.
- *G. orientalis*의 대표 사진은 'meleagris' 형 표본입니다(이 사이트에서는 orientalis와 거의 같은 것으로 봅니다).
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
전체 목록은 각 속 페이지 하단과 `seed/genera/*.json`의 `sources`에 있습니다.
- De Palma M. et al. (2020) *Entomologia Africana* 25(1) — *Goliathus* 바코딩·분류 개정
- Zhu et al. (2023) — *Cyclommatus* 분자계통 (섬 무리·대륙 무리)
- Huang J.-P. (2017) — *Dynastes hercules* 무리 개정
- Hinton & Jarman (1972), Rassart et al. (2008) — 헤라클레스 딱지날개의 습도 변색
- BE-KUWA 기록 목록(むし社) — 사육·야외 최대 기록
