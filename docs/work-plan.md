# 작업 계획 (work-plan)

NEX:US 전시 웹사이트 전체 페이지 구현 계획. 여러 세션에 걸쳐 진행하며, 이 파일이 진행 상태의 단일 기준이다.

## 0. 사용 방법

- 세션 시작: `CLAUDE.md` → 이 파일 순으로 읽고, 가장 위의 미완료(`[ ]`) 항목부터 진행한다. 해당 페이지의 시안 PNG를 반드시 먼저 읽는다.
- 시안 위치: `c:\Users\siyeo\Desktop\덕성여대\졸업프로젝트\졸업 전시회 웹사이트\ai한테 주는 것들\`
- 세션 종료: 완료 항목을 `[x]`로 바꾸고, 결정 사항·보류 사항은 "9. 결정 기록" / "10. 보류 목록"에 추가한다.
- 모든 Phase는 `pnpm build`, `pnpm lint` 통과 후 완료 처리한다.
- 브랜치는 Phase 단위로 `develop`에서 분기한다 (현재 `feat/public-components` = Phase 1). 커밋·푸시는 사용자가 요청할 때만 한다.
- 시안은 PNG뿐이라 정확한 px를 알 수 없다. `theme.css` 토큰(색·타이포·그림자)을 우선 쓰고, 간격은 4px 단위로 시안에 가장 가깝게 맞춘다. 애매하면 사용자에게 Figma 값을 묻는다.

## 1. 시안 파일 ↔ 페이지 매핑

| 시안                                                                                      | 라우트                       | 레이아웃     |
| ----------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `[About].png`                                                                             | `/`                          | 메인         |
| `[Works] Home.png`                                                                        | `/works`                     | 메인         |
| `[Works] 프로젝트 상세 - 작품 소개 Tab.png`, `- 기획 의도 Tab.png`                        | `/works/:workId`             | 상세         |
| `[Students] Home.png`                                                                     | `/students`                  | 메인         |
| `[Students] 학생 상세.png`                                                                | `/students/:studentId`       | 상세         |
| `[Map] Home.png`, `Studio Large ver.`, `Studio Large - Click ver.`, `Studio Small ver.`   | `/map`                       | 메인         |
| `[Event] Home.png`                                                                        | `/event`                     | 메인         |
| (EVENT 홈의 SPONSOR 목록과 동일)                                                          | `/event/sponsor`             | 메인         |
| `Sponsor] 협찬사 상세 - 인클리어/이너감/체리미마카.png`                                   | `/event/sponsor/:sponsorId`  | 상세(네이비) |
| `Partner] Step1.png`, `Step2.png`, `Loading.png`                                          | `/event/partner`             | 상세         |
| `Partner] 제휴사 상세 - 베리베리/쥬얼창동/오스시.png`                                     | `/event/partner/:partnerId`  | 상세(네이비) |
| `404.png`                                                                                 | `*`                          | 없음(단독)   |

레이아웃 정의:

- **루트 레이아웃**(`RootLayout`): `Outlet` + `ScrollRestoration`. `errorElement`(`ErrorBoundary`)도 여기에 붙는다.
- **메인 레이아웃**(`MainLayout`): 상단 중앙 로고 + 가로 스크롤 탭형 GNB(`TopNavigation`) + `main px-5` + `Suspense` + `Outlet`. Footer 없음.
- **상세 레이아웃**(`DetailLayout`): 배경(light/dark) + `main px-5` + `Suspense` + `Outlet`. `←` 뒤로가기 헤더(`BackHeader`, 선택적 제목)는 각 페이지가 렌더한다. 협찬사·제휴사 상세는 네이비 배경(`variant="dark"`).
- 모든 페이지의 좌우 padding은 1.25rem(`px-5`)이며 레이아웃 `main`이 담당한다. GNB·Footer·하단 full-width 버튼만 예외.
- **Footer는 ABOUT 페이지에만 존재**한다. 파일은 `shared/components/Footer.tsx`에 두고 `About.tsx`가 직접 렌더한다.
- 페이지 배경은 `ivory-bg`(#FFFDF8).

공통 컴포넌트 추출 기준(2곳 이상 실제 사용):

- `WorkListItem`: WORKS 목록, MAP 하단 목록
- `TeamBadge`: STUDENTS 목록·상세, WORKS 상세
- `KeywordChip`: WORKS 상세, STUDENTS 상세
- `SearchInput`, `FilterTabs`: WORKS, STUDENTS
- `Button`: 404, 제휴사 상세
- `LinkRow`: ABOUT 바로가기, 협찬사·제휴사 상세

## 2. Phase 1 — 공통 기반 + 공통 컴포넌트 (브랜치 `feat/public-components`)

### 2-1. 데이터·타입·유틸 (shared)

- [x] `shared/types/exhibition.ts`: `Team`, `Student`, `Work`, `Exhibition` interface (`docs/api-spec.md` 1장 그대로). `Work.category`는 string 유지.
- [x] `shared/constants/category.ts`: IA 카테고리 ↔ JSON 표기 매핑. `전체(null)`, `웹/앱`, `게임`, `VR`. 필터는 `category.includes(match)`로 판단.
- [x] `shared/utils/exhibition.ts`: `exhibition.json` import 후 `getWorkById`, `getStudentById`, `getTeamById`, `getStudentsByIds`, `getWorksByIds`. 단순 함수(훅·쿼리 아님).
- [x] `shared/utils/image.ts`: `import.meta.glob('@/shared/assets/images/students/*', { eager: true, import: 'default' })`로 파일명 → URL 맵을 만들고 `getStudentImage(fileName)`, `getWorkImage(fileName)` 제공. 매칭 실패 시 `undefined` 반환(렌더에서 회색 placeholder).
- [x] `shared/apis/api.ts`에 `withCredentials: true` 추가. `shared/types/api.ts`에 `ApiResponse<T> = { data: T }`, `ApiError = { error: { code; message; details? } }` 정의.
- [x] `shared/apis/visitorSession.ts`: `postVisitorSession()` (works 감상평, event 쿠폰 두 곳에서 쓰므로 shared).

### 2-2. 레이아웃·라우팅

- [x] `shared/components/TopNavigation.tsx`(구 GNB) 재구현: 상단 중앙 `logo-nexus.svg`(`?react`), 아래 가로 스크롤 탭 행. 비활성 탭 = 흰 배경 + border, 활성 탭 = `navy-100` 배경 + 흰 글자 + `-rotate-8`(Figma 값) + transition. 경로 변경 시 활성 탭을 좌측 끝으로 `scrollTo`. 데스크톱용 마우스 드래그·휠 가로 스크롤(휠은 motion `animate`로 부드럽게). sticky + `shadow-gnb`. `GNB_MENUS` 순서 유지.
- [x] `shared/components/Footer.tsx` 재구현: 네이비 배경, 4줄 문구(시안 `[About].png` 하단). **ABOUT에서만 사용**하므로 레이아웃에서 제거, Phase 2에서 `About.tsx`가 렌더. `main px-5` 안에서 full-width가 되도록 `-mx-5`.
- [x] `shared/components/MainLayout.tsx`(구 Layout): TopNavigation + `main px-5` + `Suspense(PageFallback)` + `Outlet`. 배경 `ivory-bg`, `max-w-mobile`.
- [x] `shared/components/RootLayout.tsx`: `Outlet` + `ScrollRestoration`. 루트 라우트 element.
- [x] `global.css`: body는 `bg-gray-100` 유지(모바일 폭 밖), 레이아웃 컨테이너가 `ivory-bg`. `font-pretendard` 적용, `scrollbar-hide` 유틸 추가.
- [x] `shared/components/BackHeader.tsx`: `ArrowLeft`(lucide) + 선택적 `title`. `history.length > 1`이면 `navigate(-1)`, 아니면 `/`. 네이비 페이지용 `variant: 'dark'`.
- [x] `shared/components/DetailLayout.tsx`: 배경(`variant` light/dark) + `main px-5` + `Suspense` + `Outlet`. `BackHeader`는 페이지가 렌더. 상세 4개 + `/event/partner` 라우트가 사용.
- [x] `shared/components/NotFound.tsx` 재구현: `img-404-graphic.svg` 중앙, 하단 네이비 full-width 버튼 "NEX:US 홈페이지 바로가기" → `/`. 좌우 1.25rem·상하 2.5rem padding. 레이아웃 밖 단독 라우트.
- [x] `shared/components/ErrorBoundary.tsx`(`useRouteError` 함수 컴포넌트, 루트 `errorElement`) + `shared/components/PageFallback.tsx`(`LoaderCircle` 스피너). `routes/pages.ts`에 11개 페이지 `React.lazy`, `routes/router.tsx`를 RootLayout → MainLayout / DetailLayout / DetailLayout dark 그룹으로 재구성, `/event/sponsor/:sponsorId`, `/event/partner/:partnerId` 추가(placeholder 페이지 `SponsorDetail.tsx`, `PartnerDetail.tsx`).
- [x] `docs/ia.md` 라우팅 표에 두 상세 라우트 추가, EVENT 연결 설명 갱신, Footer 항목을 "ABOUT에만 표시"로 수정.

### 2-3. 공통 UI 컴포넌트

- [x] `shared/components/SearchInput.tsx`: controlled input, placeholder prop, 오른쪽 `ic-search-24.svg`. 밑줄(border-b navy) 스타일.
- [x] `shared/components/FilterTabs.tsx`: 텍스트 탭 목록, 선택 항목은 `navy-100` semibold, 나머지 `subtext-700`. 가로 스크롤 허용. 제네릭 `items: { label; value }[]`, `value`, `onChange`.
- [x] `shared/components/TeamBadge.tsx`: 팀 아이콘(`symbol-decor.svg`) + 팀명.
- [x] `shared/components/KeywordChip.tsx`: border 칩.
- [x] `shared/components/WorkListItem.tsx`: 썸네일(68×45) + 제목(`semibold-16`) + 팀원 이름 나열(`regular-14 subtext-700`) + `ChevronRight`. `Link to=/works/:id`.
- [x] `shared/components/Button.tsx`: `variant: 'primary'(navy) | 'outline'(white)`, full-width, 오른쪽 선택 아이콘. motion `whileTap` 축소 인터랙션.
- [x] `shared/components/LinkRow.tsx`: 아이콘 + 텍스트 + `ic-go-link-24` 가로 바(`<a>` 외부 링크). `variant: 'light' | 'dark'`로 네이비 페이지 대응.

### 2-4. 검증

- [x] `pnpm dev`로 5개 메뉴 이동 시 활성 탭·스크롤 확인, 존재하지 않는 경로에서 404, 상세 라우트에서 뒤로가기 헤더 표시.
- [x] `pnpm build`, `pnpm lint`.

## 3. Phase 2 — ABOUT `/` (브랜치 `feat/about`)

시안: `[About].png`. 데이터는 전부 정적 → `pages/about/constants/about.ts`.

- [x] 상수: 소개 문단 4개(시안 기준. 강조 구간은 `{ text, bold }[]` 배열), 일정 3행(`26.11.04 (수)` / `10:00 - 17:00`, `26.11.05 (목)` / `10:00 - 17:00`, `26.11.06 (금)` / `10:00 - 14:00`), 주소(`서울 도봉구 마들로 13길 84` / `서울창업허브 창동 B1`), 링크 2개(덕성여자대학교 IT미디어공학전공 홈페이지, Instagram `dswu_itmedia_26`), 졸업준비위원회(위원장 목소연, 부위원장 안유빈·이채진). 타입은 `pages/about/types/about.ts`. **URL 3개(학과 홈페이지·지도 임베드)는 임시값 — 10절 확인 필요 참고.**
- [x] `components/HeroGraphic.tsx`: 상단 키비주얼. `shared/assets/lottie/home-animation.lottie`(600×840, 5초, loop 없음)를 `DotLottieReact`로 한 번 재생. 영역은 `aspect-5/7 w-full`.
- [x] `components/Introduction.tsx`: 문단 렌더(강조는 `<strong>`). 문단 사이 구분선은 `ic-about-vector-left/right.svg`(그라데이션 고정색). 1·3번째 left, 2번째 right.
- [x] `components/ScheduleTable.tsx`: `grid-cols-2 gap-x-4 gap-y-2`, 셀 높이 38px(`h-9.5`). 좌 네이비 날짜 / 우 흰색+border 시간.
- [x] `components/NaverMap.tsx` + `components/LocationSection.tsx`: 네이버 지도 JS API v3(`ncpKeyId=VITE_NAVER_MAP_CLIENT_ID`)를 ABOUT 진입 시 동적 로드, 4:3 영역에 중심·마커(`EXHIBITION_LOCATION` 37.655211, 127.048241 = 창동 아우르네). 컨트롤 숨김, 키 없거나 로드 실패 시 회색 영역 유지. 주소 2줄 + `ic-copy-16` 클릭 시 `navigator.clipboard.writeText`, 성공 시 3초간 체크 + "복사됨"으로 전환(motion `AnimatePresence` 페이드·슬라이드).
- [x] `components/QuickLinks.tsx`: `LinkRow` 2개(`logo-duksung-24.svg`, `logo-instagram-24.svg`), `gap-2`.
- [x] `components/Committee.tsx`: 네이비 제목 바(38px) "졸업준비위원회" + 3행(36px, border + `shadow-card`, 가운데 행 `-rotate-2`). 직책 `regular-14 subtext-700` + 이름 `regular-16 subtext-500`.
- [x] `components/FloatingActions.tsx`: 우측 하단 FAB 2개(시안 `FAB.png`: 위 공유 `ic-share-24`, 아래 `ic-go-to-top-24`). 48px 흰 원형, `shadow-fab`, `subtext-700`, 세로 `gap-2.5`, **항상 표시**(사용자 결정). 공유는 카카오 보류 동안 Web Share API, 미지원 브라우저는 링크 복사 후 3초간 체크 아이콘. `fixed` 래퍼를 `max-w-mobile px-5`로 맞춰 데스크톱에서도 콘텐츠 우측에 붙는다.
- [x] `components/Reveal.tsx`: 스크롤 reveal 래퍼(motion `whileInView`, 아래 24px에서 0.5초 easeOut 페이드업, `once: true`, `amount: 0.2`, `delay` prop). `useReducedMotion`이면 애니메이션 없이 렌더. 소개 문단(구분선+문단 묶음)·일정 행·지도/주소·바로가기 행·위원회 제목/행에 적용, 행 단위 stagger 0.1초. (사용자 요청 2026-10-04)
- [x] `About.tsx` 조립: `pt-10 gap-20 pb-25`(섹션 간 80px, 하단 100px. 5:7 키비주얼이 GNB 아래 40px에서 시작하면 시안 그래픽 하단 위치와 일치). 맨 아래에 `shared/components/Footer` 렌더(다른 페이지에는 없음).
- [x] 검증: SSR 문자열 렌더로 전 섹션 출력·외부 링크 `target="_blank"` 확인, `pnpm build`, `pnpm lint` 통과. **브라우저 실측(가로 스크롤·클립보드 복사·FAB)은 Claude 브라우저가 로컬 포트에 접속하지 못해 미수행 — 사용자가 `pnpm dev`로 확인 필요.**

## 4. Phase 3 — WORKS `/works`, `/works/:workId` (브랜치 `feat/works`)

시안: `[Works] Home.png`, `[Works] 프로젝트 상세 - 작품 소개 Tab.png`, `- 기획 의도 Tab.png`.

### 4-1. 목록

- [ ] `Works.tsx`: `useState` 검색어·카테고리. `SearchInput`(placeholder "프로젝트명을 검색해주세요") + `FilterTabs`(category 상수) + `WorkListItem` 목록. 필터: 제목 `includes`(대소문자 무시) AND 카테고리 `includes`. 팀원 이름은 `getStudentsByIds(work.memberIds)`.

### 4-2. 상세

- [ ] `pages/works/apis/reviews.ts`: `getReviews(artworkId, page)`, `postReview(artworkId, content)`. `encodeURIComponent(artworkId)`.
- [ ] `pages/works/hooks/useReviews.ts`: `useQuery({ queryKey: ['reviews', workId, page], staleTime: 0 })`.
- [ ] `pages/works/hooks/usePostReview.ts`: `useMutation`; `mutationFn`에서 `postVisitorSession()` → `postReview()`. 성공 시 `['reviews', workId]` invalidate, 1페이지로 이동. 401이면 세션 재발급 후 1회 재시도. 429·500은 메시지 표시.
- [ ] `components/WorkHero.tsx`: 대표 이미지(`getWorkImage`), 제목 + `ic-location-24`(→ `/map?workId=`), `TeamBadge`, 한 줄 소개(줄바꿈 `\n` → `whitespace-pre-line`), `KeywordChip` 3개. 제목 옆 `↗`(공유)은 카카오 공유 보류로 제외.
- [ ] `components/MemberChips.tsx`: 팀원 이름 + `ChevronRight` 칩, `Link to=/students/:id`.
- [ ] `components/DescriptionTabs.tsx`: "작품 소개 / 기획 의도" 2탭(`useState`), 활성 탭 네이비 배경. 본문 `whitespace-pre-line`.
- [ ] `components/ReviewForm.tsx`: ✨ placeholder "작품에 대한 따뜻한 감상평을 남겨주세요" + 제출 화살표(`ic-arrow-24`). controlled; `trim()` 1~1000자 아니면 제출 불가. 전송 중 disabled.
- [ ] `components/ReviewList.tsx`: 2열 그리드 메모지. 배경은 `green-bg / yellow-bg / pink-bg / orange-bg`를 index 순환. 긴 글은 `line-clamp-6`. 빈 목록은 안내 문구.
- [ ] `components/ReviewPagination.tsx`: 좌 `<`(1페이지면 disabled 회색) / 우 `>`(hasNext false면 disabled) 네이비 버튼.
- [ ] `WorkDetail.tsx` 조립. `useParams` → `getWorkById`; 없으면 `NotFound` 렌더.
- [ ] 검증: `.env`에 `VITE_API_BASE_URL` 설정 후 감상평 작성·조회·페이지 이동. 서버 없을 때 에러 메시지가 레이아웃을 깨지 않는지. `pnpm build`, `pnpm lint`.

## 5. Phase 4 — EVENT (브랜치 `feat/event`)

라우트: `/event`, `/event/sponsor`, `/event/sponsor/:sponsorId`, `/event/partner`, `/event/partner/:partnerId`
시안: `[Event] Home.png`, `Sponsor] 협찬사 상세 - *.png`(3), `Partner] Step1/Step2/Loading.png`, `Partner] 제휴사 상세 - *.png`(3).

### 5-1. 데이터

- [ ] `pages/event/types/event.ts`: `Sponsor { id; name; logo; link: { label; url; icon: 'instagram' | 'kakao' }; description; productTitle; productImages: string[] }`, `Partner { id; name; icon; benefit; mapUrl }`.
- [ ] `pages/event/constants/sponsors.ts`: 인클리어("인클리어하자!!" 카카오 링크, 여성청결티슈 3매입), 이너감(`innergarm_official`, 메디 이너밸런싱젤 6p / 비건 페미닌 엔자임 파우더 워시 30p), 체리미마카. 링크 URL·소개문·이미지는 사용자에게 받음(없으면 placeholder).
- [ ] `pages/event/constants/partners.ts`: 베리베리베이커리(전메뉴 5% 할인, 🥐), 쥬얼창동(전시술 20% 할인, ✂️), 오스시 창동씨드큐브점(회전초밥 10% 할인, 🍣). 아이콘은 `images/partners/`에 파일 수령 시 교체. 매장 지도 URL은 사용자에게 받음.
- [ ] `pages/event/apis/coupons.ts`: `postCoupon(qrToken)`, `getMyCoupon()`. `pages/event/types/coupon.ts`에 응답 타입.
- [ ] `pages/event/hooks/useMyCoupon.ts`: `useQuery(['coupon', 'me'])`, 404 `COUPON_NOT_FOUND`는 에러가 아닌 `null`로 정규화.
- [ ] `pages/event/hooks/useIssueCoupon.ts`: `useMutation`(세션 발급 → `postCoupon`), 성공 시 `['coupon','me']` `setQueryData`.

### 5-2. 컴포넌트

- [ ] `components/SectionTitle.tsx`: 큰 제목(`SPONSOR`) + 작은 부제(`협찬 물품`) + 설명 2줄, 선택적 우측 chevron(`Link`). (EVENT 홈, PARTNER 페이지)
- [ ] `components/SponsorListItem.tsx`: 흰 카드, 좌 이름 + 중앙 로고 이미지 + 우 chevron, 살짝 기울어진 카드 스택 느낌(회전 값은 확인). `Link to=/event/sponsor/:id`.
- [ ] `components/PartnerListItem.tsx`: 아이콘 + 이름 + chevron. `Link to=/event/partner/:id`.
- [ ] `components/StepCard.tsx`: 번호 원(①②) + 제목. `isActive` false면 전체 흐림(`opacity`), true면 흰 카드 + `shadow-card` + 회전.
- [ ] `components/CouponRow.tsx`: 아이콘 + 매장명 + 혜택 + 우측 액션(인증 전: 회색 다운로드 아이콘 disabled / 인증 후: chevron → 상세). ※ Step2 시안에서 첫 행만 chevron이고 나머지는 다운로드 아이콘이다. 의미를 사용자에게 확인 후 확정.
- [ ] `components/Toast.tsx`: 하단 고정 네이비 바 "✓ QR 인증이 완료되었습니다", 3초 후 사라짐. (PARTNER 전용)
- [ ] `components/CouponCard.tsx`: 흰 카드, 아이콘 + 매장명 + 혜택(`semibold-24`), 점선 구분(양옆 반원 notch는 네이비 원 absolute), 유효기간 `~ YYYY/MM/DD`(`expiresAt` 포맷) + "1일 1회 사용 가능".

### 5-3. 페이지

- [ ] `Event.tsx`: SPONSOR 섹션(목록 3) + PARTNER 섹션(제목 chevron → `/event/partner`, 목록 3).
- [ ] `Sponsor.tsx`(`/event/sponsor`): `SectionTitle` + `SponsorListItem` 목록.
- [ ] `SponsorDetail.tsx`(신규): 네이비 배경(`DetailLayout` dark). "OFFICIAL SPONSOR" → "{name}이 NEX:US와 함께합니다" → `LinkRow`(회색 반투명) → 인용 소개문 → "PRODUCT DETAIL" → 제품명 → 제품 이미지 세로 나열.
- [ ] `Partner.tsx`: 진입 시 URL `?qrToken=` 읽기(파라미터명은 백엔드와 확인). 토큰 있으면 `useIssueCoupon` 실행 → 성공 시 Toast + Step2 활성 + URL에서 토큰 제거(`setSearchParams`). 토큰 없으면 `useMyCoupon`으로 발급 여부 판단: 로딩이면 Step2 카드 안 스피너(`Loading.png`), 쿠폰 없으면 Step1 활성, 있으면 Step2 활성. 발급 에러(`INVALID_QR_TOKEN`, `COUPON_ISSUANCE_CLOSED`, `QR_TOKEN_INACTIVE`, `RATE_LIMIT_EXCEEDED`)는 코드별 한국어 메시지를 Toast로 표시.
- [ ] `PartnerDetail.tsx`(신규): 네이비 배경, `BackHeader` title = 매장명. "OFFICIAL PARTNER" → 헤드라인 → `LinkRow`(`ic-location-24` "매장 위치 확인하기", `<a>` 외부) → 캐릭터 그래픽(파일 수령 전 placeholder) → 안내 2줄 → `CouponCard`(`useMyCoupon`의 `expiresAt`·`status`, `EXPIRED`면 만료 표시) → 주의 문구. 쿠폰 없으면 `/event/partner`로 `Navigate`. 하단 "쿠폰을 이미지로 저장하기" 버튼은 이미지 저장 보류로 제외.
- [ ] 라우터에 `SponsorDetail`, `PartnerDetail` lazy 등록(Phase 1에서 라우트만 선언, 여기서 실제 컴포넌트 연결).
- [ ] 검증: `/event/partner?qrToken=...`로 진입 시 발급 흐름, 재진입 시 Step2 유지, 쿠폰 없이 상세 진입 시 리다이렉트. `pnpm build`, `pnpm lint`.

## 6. Phase 5 — MAP `/map` (브랜치 `feat/map`)

시안: `[Map] Home.png`, `Studio Large ver.`, `Studio Large - Click ver.`, `Studio Small ver.`.

- [ ] `pages/map/types/booth.ts`: `Studio { id: 'studio-2'..'studio-6'; label; size: 'large' | 'small'; booths: Booth[] }`, `Booth { id; workId; area }`(내부 약도 위치).
- [ ] `pages/map/constants/studios.ts`: 스튜디오 2~6과 작품 9개 배치. **실제 배치는 사용자에게 확인**(없으면 임시 배치 후 결정 기록에 "임시" 표시).
- [ ] `components/FloorPlan.tsx`: 시안 전체 배치도를 Tailwind `grid`/`absolute`로 구성. 고정 블록(LED, 포토월, 제휴부스, 협찬부스×2, 리셉션, 대강당, 엘리베이터 아이콘, 동선 화살표)은 회색, 스튜디오 2~6은 `navy-075` 클릭 가능 버튼. 선택된 스튜디오는 `navy-100` + `ic-location-24` 핀. 이미지가 아닌 DOM으로 만들어 클릭·하이라이트 처리.
- [ ] `components/StudioDetail.tsx`: `size === 'large'`일 때 네이비 패널에 내부 약도(부스 블록 2개 이상, 클릭 시 흰색 + 핀 하이라이트, 우하단 입구 화살표). `small`은 패널 없이 바로 목록.
- [ ] `Map.tsx`: 상태 `selectedStudioId`, `selectedBoothId`(`useState`). 하단 목록은 선택 없음 → 전체 작품, 스튜디오 선택 → 해당 스튜디오 작품들, 부스 선택 → 해당 작품 1개. `WorkListItem` 재사용. `useSearchParams`의 `workId`가 있으면 마운트 시 해당 스튜디오·부스를 미리 선택(WORKS 상세 → MAP 연결).
- [ ] 검증: 스튜디오 클릭 전환, Large/Small 분기, `?workId=`로 진입 시 하이라이트, 작품 클릭 → 상세. `pnpm build`, `pnpm lint`.

## 7. Phase 6 — STUDENTS `/students`, `/students/:studentId` (브랜치 `feat/students`)

시안: `[Students] Home.png`, `[Students] 학생 상세.png`.

- [ ] `pages/students/utils/chosung.ts`: 한글 첫 글자의 초성 추출(유니코드 분해). 쌍자음(ㄲ,ㄸ,ㅃ,ㅆ,ㅉ)은 기본 자음(ㄱ,ㄷ,ㅂ,ㅅ,ㅈ)으로 매핑. 필터 항목: 전체 + ㄱ ㄴ ㄷ ㄹ ㅂ ㅅ ㅇ ㅈ ㅊ ㅎ(시안 표기 순서. 시안에 ㅁ·ㅋ·ㅌ·ㅍ가 없어 보이므로 확인 후 확정).
- [ ] `components/StudentListItem.tsx`: 프로필 이미지(정사각, `getStudentImage`, 없으면 회색) + 이름(`semibold-16 navy`) + `TeamBadge` + chevron. `Link to=/students/:id`.
- [ ] `Students.tsx`: `SearchInput`(placeholder "학생 이름을 검색해주세요") + `FilterTabs`(초성) + 목록. 이름 `includes` AND 초성 일치.
- [ ] `components/WorkCard.tsx`: 흰 카드(`shadow-card`) 대표 이미지 + 제목 + 한 줄 소개 + `KeywordChip`. `Link to=/works/:id`.
- [ ] `StudentDetail.tsx`: 상단 좌 프로필 이미지 + 우 이름·`TeamBadge`·역할, 아래 참여 작품 `WorkCard`(복수면 세로 나열). 없는 ID면 `NotFound`.
- [ ] 검증: 초성 필터·검색 조합, 상세 ↔ 작품 상세 왕복. `pnpm build`, `pnpm lint`.

## 8. Phase 7 — 마무리

- [ ] 모든 페이지 모바일(360px) 가로 스크롤 점검, `index.html` `<title>` 등 메타 정리.
- [ ] 보류 목록 중 사용자가 진행 결정한 항목 수행(카카오 공유, 쿠폰 이미지 저장, 로띠).
- [ ] 받은 실제 이미지(키비주얼, 404 캐릭터, 협찬사 로고·제품, 제휴사 아이콘, 파트너 캐릭터)로 placeholder 교체. 파일명 NFC 정규화·공백 제거 확인.

## 9. 결정 기록

- 2026-10-03: EVENT 기업 상세는 `/event/sponsor/:sponsorId`, `/event/partner/:partnerId` 라우트 추가로 확정. `/event/sponsor`는 협찬사 목록, `/event/partner`는 QR 인증 페이지.
- 2026-10-03: 부스·협찬사·제휴사 데이터는 프론트 상수(`pages/map/constants`, `pages/event/constants`). JSON에 추가되면 상수를 제거하고 타입을 `shared/types`로 옮긴다.
- 2026-10-03: WORKS 상세 하단 화살표 = 감상평 페이지네이션. 이전/다음 작품 CTA는 시안에 없어 미구현.
- 2026-10-03: Footer는 ABOUT 페이지에만 존재한다(사용자 확인). `Layout`에는 넣지 않고 `About.tsx`에서만 렌더. `docs/ia.md`의 "Footer 전 페이지 공통" 문구를 함께 수정한다.
- 2026-10-03: 부가 기능 중 페이지 lazy loading + Error Boundary만 이번 범위에 포함.
- 2026-10-03 (Phase 1 구현 중 확정):
  - 모든 페이지 좌우 padding 1.25rem(`px-5`)은 레이아웃 `main`이 담당. GNB·Footer·full-width 버튼만 예외. 404는 좌우 1.25rem·상하 2.5rem.
  - 파일명: `Layout.tsx` → `MainLayout.tsx`, `GNB.tsx` → `TopNavigation.tsx`. `RootLayout.tsx`(Outlet + ScrollRestoration) 추가. `GNB_MENUS` 상수명은 유지.
  - `ErrorBoundary`는 class가 아닌 `useRouteError` 함수 컴포넌트. data router 내장 경계를 쓰므로 별도 class 불필요.
  - `DetailLayout`은 배경·padding·Suspense만 담당하고 `BackHeader`는 각 페이지가 렌더(협찬사·제휴사 상세 제목이 페이지 데이터에서 나오기 때문). `/event/partner`도 상세 레이아웃(시안에 GNB 없음).
  - `Suspense`는 루트가 아니라 각 레이아웃의 `Outlet` 둘레에 둔다(페이지 전환 시 GNB 유지).
  - lazy 페이지 선언은 `routes/pages.ts`로 분리(`router.tsx`에 두면 `react-refresh/only-export-components` 위반).
  - 아이콘 색 제어: 사용하는 `ic-*` SVG의 고정색을 `currentColor`로 직접 수정(`ic-search-24`, `ic-go-link-24`, `ic-location-24` 완료). svgr 전역 옵션은 고정색 그래픽까지 바꾸므로 사용 안 함.
  - Pretendard는 `main.tsx`에서 `pretendardvariable-dynamic-subset.css` import, body `font-pretendard`. body 배경은 `gray-100`(모바일 폭 밖), 컨테이너는 `ivory-bg`.
  - TeamBadge 팀 아이콘은 `symbol-decor.svg`(사용자 확인).
  - 활성 탭 회전은 Figma 값 `-8deg`. 탭 전환·회전은 transition 0.3s. 활성 탭은 좌측 끝 정렬로 스크롤.
  - 애니메이션 라이브러리 `motion` 추가(사용자 요청). Button `whileTap` 축소, TopNavigation 휠 스크롤 애니메이션에 사용. 메인 청크가 500KB 경고를 넘김(motion 포함) — 추후 필요 시 검토.
  - Phase 4 상세 2개(`SponsorDetail.tsx`, `PartnerDetail.tsx`)는 `<h1>` placeholder로 생성해 라우트 연결.
- 2026-10-04 (Phase 2 구현 중 확정):
  - 시안 소개 문단은 4개(계획서의 3개 아님). 3번째 문단의 "지능형 시스템 , 가상과"는 오타로 보고 "지능형 시스템, 가상과"로 수정.
  - 시안 px 측정값: 키비주얼 그래픽 하단 y≈590(5:7 로띠를 GNB 아래 40px에 두면 일치), 섹션 간격 80px, 문단 간격 20px + 구분선 21px, 일정 셀 38px, 위원회 제목 바 38px·행 36px·행 간격 4px, 가운데 행 약 -2°, FAB 48px·우측 20px, Footer 위 100px.
  - `ic-copy-16.svg` 고정색을 `currentColor`로 수정(Phase 1 아이콘 규칙과 동일).
  - 주소 복사 피드백: 별도 Toast 없이 아이콘을 1.5초간 체크로 바꾼다(Toast는 Phase 4 PARTNER 전용).
  - 시안의 Footer 배경은 `#505050`(subtext-500)으로 보이나, Phase 1에서 네이비로 확정·구현된 `Footer.tsx`는 건드리지 않았다. 네이비가 맞는지 사용자 확인 필요.
  - 지도는 네이버 지도 JS API v3(사용자 요청). `@types/navermaps` devDependency 추가, `tsconfig.app.json` `types`에 `navermaps` 등록. 키는 `.env`의 `VITE_NAVER_MAP_CLIENT_ID`(`example.env`에 항목 추가). SDK는 index.html이 아닌 `NaverMap.tsx`에서 필요할 때만 script를 주입한다.
  - `ic-check-16.svg`, `ic-share-24.svg`, `ic-go-to-top-24.svg`(신규, 원본 `ic-go-to-top.svg`에 크기 접미사 추가) 고정색도 `currentColor`로 수정.
  - FAB은 스크롤량과 무관하게 항상 표시(공유 버튼이 함께 있어야 하므로, 사용자 결정 2026-10-04).
- (확인 필요) PARTNER QR 토큰의 URL 파라미터명 (`qrToken` 가정).
- (확인 필요) 스튜디오별 작품 배치, 제휴사 매장 지도 URL, 협찬사 링크 URL·소개문.
- (확인 필요) ABOUT 임시 URL: 학과 홈페이지 `https://itmedia.duksung.ac.kr/`, Instagram `https://www.instagram.com/dswu_itmedia_26/`. `pages/about/constants/about.ts`에서 교체.
- (확인 필요) 네이버 지도: NCP 콘솔에서 Maps 서비스 Client ID 발급 후 `.env`에 `VITE_NAVER_MAP_CLIENT_ID` 설정, 콘솔의 Web 서비스 URL에 배포 도메인·`http://localhost:5173` 등록. 지도 좌표(37.655211, 127.048241)는 주소 검색값이므로 실제 핀 위치 확인.
- (확인 필요) PARTNER Step2에서 첫 행 chevron / 나머지 다운로드 아이콘의 의미.

## 10. 보류 목록 (이번 범위 제외)

- 카카오톡 공유(IA 전역 요소, WORKS 상세·ABOUT의 ↗ FAB) — Kakao JS SDK + `VITE_KAKAO_JS_KEY` 필요. ABOUT의 공유 FAB은 Web Share API/링크 복사로 우선 동작하며, 도입 시 `FloatingActions.tsx`의 `handleShareClick`만 교체한다.
- 제휴사 상세 "쿠폰을 이미지로 저장하기" — `html-to-image` 등 라이브러리 추가 필요.
- 404·로딩 로띠 애니메이션(`@lottiefiles/dotlottie-react` 설치됨, 파일 미수령. ABOUT 키비주얼 로띠는 Phase 2에서 적용 완료).
- IA에만 있고 시안·데이터에 없는 항목: STUDENTS 상세 학번·인사말·SNS·이메일, MAP 카테고리 필터, ABOUT 지하철·버스 안내.
- `AGENTS.md`가 4페이지 기준으로 낡아 있음(EVENT 누락) — 사용자 요청 시 갱신.
