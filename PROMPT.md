# Claude Code 프롬프트 — Beetlepedia (꽃무지 · 사슴벌레 · 장수풍뎅이 도감)

이 문서는 Beetlepedia를 만들고 **확장할 때** 쓰는 요구사항입니다.
처음에는 골리앗꽃무지속(*Goliathus*) 한 속만 다뤘지만, 지금은 상위 분류군 → 속 → 종 → 아종의 계층으로 어떤 속이든 추가할 수 있습니다.
새 속이나 종을 추가할 때는 **6장의 "속 추가 요청 템플릿"** 을 채워서 요청하면 됩니다.

## 1. 목표

세계의 대형 딱정벌레(꽃무지, 사슴벌레, 장수풍뎅이)를 분류 체계에 따라 소개하는 교양·교육용 웹사이트.
일반인이 상위 분류군과 속 전체를 이해하고, 각 종·아종을 자세히 비교하며 볼 수 있어야 한다.

| 상위 분류군 (group) | 학명 | 현재 수록 속 |
|---|---|---|
| 꽃무지 | Scarabaeidae: Cetoniinae | *Goliathus* |
| 사슴벌레 | Lucanidae | *Cyclommatus* |
| 장수풍뎅이 | Scarabaeidae: Dynastinae | *Dynastes* |

새 상위 분류군도 `data/core.js`의 `groups`에 추가할 수 있다.

## 2. 기술 스택

- 순수 HTML / CSS / JavaScript (프레임워크·빌드 도구·npm 없음). Spring Boot는 정적 파일 서빙만 담당한다.
- `index.html`을 브라우저로 바로 열어도(`file://`) 동작해야 한다. 그래서 데이터는 JSON 대신 전역 변수 JS로 내보낸다.
- 외부 라이브러리가 꼭 필요하면 CDN(cdnjs / jsdelivr)으로만 불러온다.
- 반응형: 모바일(375px)부터 데스크톱까지, 가로 스크롤이 생기지 않게 한다.

## 3. 계층과 파일 구조

```
index.html               홈: 상위 분류군, 계통 트리, 속을 넘나드는 크기 비교, 전체 목록(검색)
group.html?id=<group>    상위 분류군 페이지
genus.html?id=<genus>    속 페이지
taxon.html?id=<taxon>    종·아종 페이지 (taxon = 종 또는 아종)

data/core.js             분류 계층(공통 상위 단계 + 분류군별 단계), 국가 이름, 지역 지도 목록, 공통 출처
data/genera/<genus>.js   속 하나의 모든 데이터 (BP.registerGenus 호출)
data/ja/<file>.js        콘텐츠 일본어 번역 (영어 원문을 키로)
data/i18n.js             UI 문구 (ko / en / ja)
assets/maps/<region>.js  지역 지도 (tools/mapgen/gen.js로 생성)
tools/validate-data.js   데이터 검증
tools/extract-strings.js 번역 대상 텍스트 추출
```

- **페이지는 템플릿 하나에 데이터를 채운다.** 종이 늘어나도 HTML 파일을 새로 만들지 않는다.
- 각 페이지는 위 계층의 빵부스러기(breadcrumb)를 보여 준다: Beetlepedia › 분류군 › 속 › (종) › 아종.

## 4. 데이터 스키마 (요약)

모든 사용자용 텍스트는 `{ "ko": "...", "en": "..." }`로 쓴다. 일본어는 `data/ja/`에 따로 둔다(7장).

### 속 (`BP.registerGenus({...})`)
| 필드 | 내용 |
|---|---|
| `id`, `group`, `sci`, `authority` | 예: `cyclommatus`, `lucanidae`, `Cyclommatus`, `Parry, 1863` |
| `map` | 지역 지도 id (`africa`, `southeast-asia`, `neotropics` …) |
| `color`, `name`, `shortName`, `eyebrow`, `lead`, `heroStats` | 속 페이지 히어로 |
| `taxonomy` | 상위 분류군 아래 단계(아과·족·속) |
| `overview` | `body`, `cards[]`(이름의 유래 등), `speciesNote`(종 수·분류 메모) |
| `speciesInfo` | 아종을 여럿 다루는 종의 설명 (`{"Dynastes hercules": {authority, name, text}}`) |
| `lifecycle` | `lead`, `stages[]` (`egg`/`larva`/`pupa`/`adult`, 기간·설명) |
| `conservation`, `care[]`, `facts[]` | 보전 요약, 사육 요약, 재미있는 사실 |
| `defaults` | 종 페이지 공통값: `dimorphism`, `food`, `season` |
| `weights` | (선택) 무게 막대 |
| `areas` | (선택) 섬·지역 정의: `box`(경위도 상자) 또는 `point`(경위도) |
| `latin[]` | 본문에서 이탤릭 처리할 그 밖의 라틴어 이름 |
| `images.hero` | 대표 사진 |
| `taxa[]`, `sources{}` | 분류군 목록, 출처 (id에 속별 접두사) |

### 분류군 (taxon)
`id`(속 id로 시작), `rank`(`species`/`subspecies`), `sci`, `species`(아종이면 상위 이명법), `authority`, `color`,
`name`(+`nameInformal`, `nameJa`, `nameNote`), `size`(`male`, `female`, `note`, `sources`), `pattern`, `morphology`,
`distribution`(국가 코드 또는 `areas` 키), `distributionNote`, `habitat`, `ecology`, `captivityNote`,
`conservation`(`status`, `text`), `history[]`(`year`, `ko`, `en`), `issues[]`(`title`?, `text`, `sources`), `facts[]`, `images[]`, `model3d`, `sources[]`.

- 몸길이는 `[min, max]`(mm). **최댓값만 알면 `[null, max]`** — 최솟값을 지어내지 않는다.
- 사슴벌레는 큰턱, 장수풍뎅이는 뿔을 포함한 길이다. 야외 기록과 사육 기록(BE-KUWA 등)은 `size.note`에 구분해 적는다.

## 5. 페이지별 콘텐츠

### 홈
1. 히어로 (속별 대표 사진 모자이크, 수록 분류군·속·종 수)
2. 상위 분류군 카드 → 각 속 링크
3. 계통 트리: 목 → 상과 → 과 → 아과 → 속 → 종 → 아종
4. 속을 넘나드는 크기 비교
5. 전체 목록: 학명·한/영/일 이름으로 검색, 분류군 필터

### 상위 분류군 페이지
개요(특징·생활), 분류 단계, 속 카드, 수록 종·아종 카드.

### 속 페이지
히어로 → 속 개요(분류 체계, 이름의 유래 등) → 종·아종 카드(아종이 많은 종은 묶어서) → 비교표(정렬) → 분포 지도 → 크기·무게 비교 → 생활사 → 보전·사육·재미있는 사실 → 참고문헌·이미지 출처.

### 종·아종 페이지 (섹션 순서)
1. 분류·형태·크기 (명명자, 분류, 몸길이 막대, 암수 차이, 색·무늬, 아종 목록 또는 같은 종의 다른 아종)
2. 역사·특별한 이슈 (명명·연구 연표, 분류 논쟁·기록·보호 등)
3. 3D 모델 (보류: "준비 중")
4. 생활사·생태 (먹이, 활동 시기)
5. 분포·서식지 (분포 지역 목록 + 분포에 맞춰 확대한 지도)
6. 사육
7. 보전 현황 — 공식 평가가 없으면 "평가되지 않음" 또는 "평가 기록 없음"이라고 적는다
8. 재미있는 사실 + 이 페이지의 출처
9. 같은 속 안에서 이전/다음 분류군으로 이동

## 6. 속 추가 요청 템플릿

```
다음 속을 Beetlepedia에 추가해줘.
- 상위 분류군: (꽃무지 / 사슴벌레 / 장수풍뎅이 / 새 분류군이면 학명)
- 속: (학명)  한국어 이름: (예: 가위사슴벌레속)
- 다룰 분류군: (종·아종 학명 목록, 또는 "○○의 모든 아종")
- 분포 지역: (지도가 필요한 지역, 예: 동남아시아 · 뉴기니)
- 특별히 다룰 이슈: (선택)
```

작업 순서:
1. **조사**: 7장 규칙에 따라 속·분류군 자료를 모은다(분류군이 많으면 나눠서 병렬로).
2. **데이터**: `data/genera/<genus>.js` 작성. 섬·지역 분포는 `areas`로 정의한다.
3. **지도**: 새 지역이면 `tools/mapgen/gen.js`의 `REGIONS`에 추가해 지도를 만들고 `data/core.js`의 `maps`에 이름을 넣는다.
4. **페이지 연결**: 네 HTML에 `data/genera/<genus>.js`와 `data/ja/<genus>.js` 스크립트를 추가한다.
5. **번역**: `node tools/extract-strings.js --missing-ja --json`으로 목록을 뽑아 `data/ja/<genus>.js`를 만든다.
6. **검증**: 9장의 점검을 모두 통과시킨다.

## 7. 조사·정확성 규칙

- **지어내지 않는다.** 확인되지 않은 수치·명명자·산지·이미지 파일은 넣지 않고 `null`로 두거나 "자료 부족"으로 표시한다.
- 숫자(몸길이·무게·분포)는 믿을 수 있는 출처(논문, 박물관, 데이터베이스, Wikipedia 참고문헌, 공인 기록)를 쓰고 `sources`에 남긴다.
  확실하지 않으면 "추정", "보고에 따르면", "사육 기록"처럼 성격을 밝힌다.
- **일본어로도 검색한다.** 사슴벌레·장수풍뎅이는 일본 문헌과 사육 자료(和名 예: ホソアカクワガタ, ヘラクレスオオカブト)가 가장 풍부하다. 한국어 취미계 이름도 확인한다.
- **분류 논쟁을 숨기지 않는다.** 아종/종 승격, 동의어 처리 등 견해가 갈리면 사이트가 따르는 체계를 밝히고, 다른 견해를 해당 분류군의 이슈로 적는다.
- 흔한 과장(예: "몸무게 850배를 든다", "100g 이상")은 근거를 확인해 성충/유충, 실측/주장을 구분한다.
- 철회된 논문은 쓰지 않고, 철회 사실을 적는다.
- 공식 이름이 없으면 학명 음차로 짓고 "비공식 이름" 표시를 붙인다(`nameInformal`).

## 8. 이미지

- Wikimedia Commons의 CC 라이선스 / 퍼블릭 도메인 이미지만 쓴다. 작가·라이선스·원본 링크를 캡션과 출처 목록에 표시한다.
- **흰 배경 표본 사진을 우선** 고른다(`white: true`). 이런 사진은 잘리지 않게 밝은 판 위에 통째로 보여 준다.
- Commons API로 파일이 실제로 있는지와 라이선스를 확인한다. 동정이 의심스러운 사진은 쓰지 않거나 대체 텍스트에 그 사실을 적는다.
- 사진이 없으면 실루엣과 "사진을 아직 찾지 못했습니다"를 보여 주고 README의 이미지 TODO에 적는다.

## 9. 언어

- 한국어(기본) · English · 日本語. 헤더의 `KO | EN | JA` 토글, 선택은 `localStorage`에 저장(try/catch), `<html lang>`도 바꾼다.
- UI 문구는 `data/i18n.js`에 세 언어 모두 넣는다. 콘텐츠의 일본어는 `data/ja/<file>.js`에 영어 원문을 키로 넣는다.
- 학명은 언어와 관계없이 이탤릭 라틴어로 표기한다.

## 10. 디자인 — "모던 다큐멘터리" (유지)

- 다크 테마(짙은 숲 녹색·검정 바탕, 녹슨 갈색·흰색 포인트). 분류군·속·종마다 고유 색(`--sp`, `--accent`)을 쓴다.
- 화면을 채우는 큰 사진, 넓은 여백, 큰 제목. 스크롤하면 섹션이 부드럽게 나타난다(IntersectionObserver, `prefers-reduced-motion`이면 끔).
- 글꼴: Noto Serif/Sans KR (일본어는 JP). 색은 CSS 변수.
- 접근성: 이미지 대체 텍스트(한/영), 키보드 이동, 충분한 명도 대비, 지도는 지역마다 `aria-label`.
- 새 상위 분류군을 추가하면 크기 비교용 실루엣(100×160 상자, y=5…158)도 `js/main.js`에 추가한다.

## 11. 점검

- `node tools/validate-data.js` — id 중복, 분포 코드↔지도 다각형, 출처 id, 이미지 메타데이터, 일본어 누락
- `./gradlew test` — Spring 컨텍스트 + 모든 페이지·스크립트·데이터 파일 서빙
- 브라우저로 모든 페이지를 375px·1280px, 세 언어로 열어 콘솔 에러와 가로 넘침이 없는지 확인

## 12. 작업 보고와 PR

- 단계를 마칠 때마다 무엇을 만들었는지 짧게 알린다.
- PR은 기능 단위로 나눠 올린다(예: 데이터 모델 / 지도 / 페이지 / 새 속 데이터 / 번역 / 문서).
  제목은 Conventional Commits 형식(`feat:`, `fix:`, `docs:`, `chore:`), 본문은 요약 · 변경 사항 · 테스트 방법 순서로 쓴다.
