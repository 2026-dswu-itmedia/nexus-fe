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
- [x] `components/FloatingActions.tsx`: 우측 하단 FAB 2개(시안 `FAB.png`: 위 공유 `ic-share-24`, 아래 `ic-go-to-top-24`). 48px 흰 원형, `shadow-fab`, `subtext-700`, 세로 `gap-2.5`, **항상 표시**(사용자 결정). 공유는 카카오톡 초대장(`shared/utils/kakaoShare.ts`의 `shareKakaoTemplate`, 메시지 템플릿 ID `INVITATION_TEMPLATE_ID` = 137738). 키 미설정·SDK 로드 실패 시 Web Share API, 미지원 브라우저는 링크 복사 후 3초간 체크 아이콘. `fixed` 래퍼를 `max-w-mobile px-5`로 맞춰 데스크톱에서도 콘텐츠 우측에 붙는다.
- [x] `shared/components/Reveal.tsx`(Phase 3에서 `pages/about/components`에서 이동): 스크롤 reveal 래퍼(motion `whileInView`, 아래 24px에서 0.5초 easeOut 페이드업, `once: true`, `amount: 0.2`, `delay` prop). `useReducedMotion`이면 애니메이션 없이 렌더. 소개 문단(구분선+문단 묶음)·일정 행·지도/주소·바로가기 행·위원회 제목/행에 적용, 행 단위 stagger 0.1초. (사용자 요청 2026-10-04)
- [x] `About.tsx` 조립: `pt-10 gap-20 pb-25`(섹션 간 80px, 하단 100px. 5:7 키비주얼이 GNB 아래 40px에서 시작하면 시안 그래픽 하단 위치와 일치). 맨 아래에 `shared/components/Footer` 렌더(다른 페이지에는 없음).
- [x] 검증: SSR 문자열 렌더로 전 섹션 출력·외부 링크 `target="_blank"` 확인, `pnpm build`, `pnpm lint` 통과. **브라우저 실측(가로 스크롤·클립보드 복사·FAB)은 Claude 브라우저가 로컬 포트에 접속하지 못해 미수행 — 사용자가 `pnpm dev`로 확인 필요.**

## 4. Phase 3 — WORKS `/works`, `/works/:workId` (브랜치 `feat/works`)

시안: `[Works] Home.png`, `[Works] 프로젝트 상세 - 작품 소개 Tab.png`, `- 기획 의도 Tab.png`.

### 4-1. 목록

- [x] `Works.tsx`: `useState` 검색어·카테고리. `SearchInput`(placeholder "프로젝트명을 검색해주세요") + `FilterTabs`(category 상수) + `WorkListItem` 목록. 필터: 제목 `includes`(대소문자 무시) AND 카테고리 `includes`. 팀원 이름은 `getStudentsByIds(work.memberIds)`. 전체 목록은 `shared/utils/exhibition.ts`에 추가한 `getWorks()`로 가져온다(MAP 하단 목록에서도 사용 예정). 결과 0건이면 "검색 결과가 없습니다".

### 4-2. 상세

- [x] `pages/works/types/review.ts`: `Review`, `ReviewPagination`, `ReviewPage`, `PostedReview` (api-spec 응답 그대로).
- [x] `pages/works/apis/reviews.ts`: `getReviews(artworkId, page)`, `postReview(artworkId, content)`. `encodeURIComponent(artworkId)`.
- [x] `pages/works/hooks/useReviews.ts`: `useQuery({ queryKey: ['reviews', workId, page], staleTime: 0, placeholderData: keepPreviousData })`.
- [x] `pages/works/hooks/usePostReview.ts`: `useMutation`; `mutationFn`에서 `postVisitorSession()` → `postReview()`. 성공 시 `['reviews', workId]` invalidate, 1페이지 이동·입력 비우기는 `ReviewForm`의 `mutate(..., { onSuccess })`에서 처리. 401이면 세션 재발급 후 1회 재시도. 429·500은 서버 `error.message`를 폼 아래 표시, 응답 없으면 네트워크 안내.
- [x] `components/WorkHero.tsx`: 대표 이미지(`getWorkImage`, 3:2), 제목(`semibold-24`) + `ic-location-24`(→ `/map?work=`) + `ic-go-link-24`(작품별 인스타그램 카드뉴스, `<a target="_blank">`), `TeamBadge`, 한 줄 소개(`whitespace-pre-line`), `KeywordChip` 3개. 카드뉴스 URL은 `pages/works/constants/instagramLinks.ts`의 `getWorkInstagramUrl(workId)`. **게시 전이라 모두 비어 있고, 비어 있으면 전공 프로필(`shared/constants/links.ts` `INSTAGRAM_PROFILE_URL`, ABOUT 바로가기와 공유)로 이동**. (사용자 요청 2026-10-05. 처음엔 ↗를 카카오 공유로 보고 제외했었음)
- [x] `components/MemberChips.tsx`: 팀원 이름 + `ChevronRight` 칩(`navy-010` 배경), `Link to=/students/:id`.
- [x] `components/DescriptionTabs.tsx`: "작품 소개 / 기획 의도" 2탭(`useState`), 활성 탭 네이비 배경, 높이 40px. 본문 `whitespace-pre-line`.
- [x] `components/ReviewForm.tsx`(시안 `Comment.png`, 2026-10-05 갱신): 자동 높이 textarea(Enter 등록, Shift+Enter 줄바꿈). 4개 상태 — 기본: ✨ + placeholder + 네이비 화살표 / 포커스·미입력: ✨·placeholder 숨김 + `0/80` + 회색 화살표 / 입력 중: `n/80` + 네이비 화살표 / 80자 초과: 글자 수 `semibold-14` 검정 + 회색 화살표 + 아래 `Info` 아이콘 "최대 80자까지 작성 가능해요"(spring pop, `AnimatePresence`). 80자 초과는 입력은 되지만 제출 불가(시안의 `85/80` 상태를 보여주기 위해 hard cap 대신 제출 차단). 전송 중 disabled.
- [x] `components/ReviewList.tsx`: 2열 그리드 메모지(`min-h` 170px). 배경은 시안 순서 `pink-bg → yellow-bg → green-bg → orange-bg`를 index 순환. 긴 글은 `line-clamp-6`. 로딩 스피너·에러·빈 목록 문구.
- [x] `components/ReviewPagination.tsx`: 좌 `<`(1페이지면 disabled 회색) / 우 `>`(hasNext false면 disabled) 48px 네이비 버튼.
- [x] `components/ReviewSection.tsx`: `page` 상태 + `useReviews` + Form·List·Pagination 조립. `totalPages === 0`이면 페이지네이션 숨김.
- [x] `WorkDetail.tsx` 조립. `useParams` → `getWorkById`; 없으면 `NotFound` 렌더(`-mx-5` 래퍼).
- [x] 애니메이션(사용자 요청 2026-10-05): `WorkDetail`의 Hero·팀원·탭·감상평 섹션을 `shared/components/Reveal`로 감싸 0.1초 간격 페이드업. `DescriptionTabs` 본문은 `AnimatePresence mode="wait"`로 이전 글이 흐려진 뒤 새 글이 0.2초 페이드업. `ReviewList` 메모지는 `motion.li` `whileInView`(once)로 0.07초 간격 stagger(아래 20px·0.92배에서 제자리로, 0.5초). 기울기는 Tailwind `rotate` 클래스(CSS rotate 속성)라 motion transform과 충돌하지 않는다. 모두 `useReducedMotion`이면 정적 렌더.
- [x] 검증: `pnpm build`, `pnpm lint` 통과. 감상평 작성·페이지 이동은 서버 연결 상태에 따라 사용자가 `pnpm dev`로 확인 필요(아래 결정 기록 참고).

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

- [x] `pages/map/types/booth.ts`: `Booth { id: 'studio-2'..'studio-6'; number; x; y; width; height; workIds }`. 배치도 좌표(viewBox 320×304, px)와 작품 연결을 한 곳에 둔다. 작품 데이터(`exhibition.json`)에는 부스 필드가 없으므로(api-spec 1장) 부스 쪽에서 `workIds`로 연결한다.
- [x] `pages/map/constants/booths.ts`: 스튜디오 2~6 좌표(시안 1:1 측정값) + 작품 9개 **임시 배치**(6: 노른 / 5: 마음 / 4: SignBridge·Hearing / 3: V-O·SYNC:0 / 2: Blue Room·POCO·저승명부록). 실제 배치는 사용자 확인 후 `workIds`만 바꾸면 된다.
- [x] `components/BoothMap.tsx`: 인라인 SVG(viewBox `0 0 320 304`, 컨테이너 폭에 맞춰 스케일). 클릭되지 않는 배경(LED·대강당·포토월·협찬·제휴·리셉션·화살표·아이콘)은 Figma export `shared/assets/images/map/map-background.svg`를 `?react`로 한 번 깔고, 스튜디오 2~6만 좌표 상수로 `<rect rx=4>` + 라벨 두 줄(`<text>`)을 그린다. 기본 `navy-075`, 선택 `navy-100` + 라벨 대신 `ic-location-24` 핀(24px, 흰색). 부스 `<g>`는 focus 불가(아래 결정 기록). 선택 시 핀은 스프링 팝업, 배치도는 진입 시 0.4초 페이드인.
- [x] `Map.tsx`: 배치도 + (스튜디오 2·3·4면) 내부 약도 + 하단 `WorkList`. 선택 상태는 **URL 쿼리 `?booth=studio-4&work=hearing`이 기준**(`useState` 없음). 부스 클릭 → `booth` 설정(같은 부스 다시 클릭 시 해제, `work` 제거) 후 하단에 그 부스의 작품 목록(작품 1개여도 바로 이동하지 않음). 약도의 자리 클릭 → `work` 설정(다시 클릭 시 해제)으로 그 작품 1개만 목록. 선택 없으면 전체 목록. WORKS 상세 위치 아이콘은 `?work=`만 넘기고 부스는 MAP이 찾는다. 잘못된 값은 선택 없음으로 처리.
- [x] `shared/components/WorkList.tsx`: `Works.tsx`에 있던 목록 + stagger 페이드업 + 빈 결과 문구를 분리(WORKS·MAP 공용).
- [x] 스튜디오 내부 약도(`Studio Large ver.`·`Click ver.` 시안): `components/StudioFloorPlan.tsx`(viewBox 320×160). 사용자 제공 `studio{2,3,4}.svg`에서 배경·자리 블록을 뺀 틀(입구·화살표·라벨)을 `shared/assets/images/map/studio-N.svg`로 두고, 배경은 `fill-navy-075`, 자리는 `Booth.floorPlan.areas`(rect는 `rx 4`, L자는 Figma path 그대로)로 `fill-white-075`, 선택 시 `fill-white-100` + 네이비 `MapPin`. 핀은 `components/MapPin.tsx`로 분리해 배치도(흰 핀)와 공용. 패널은 카드 아래 24px(`mt-6`), 목록은 패널 아래 40px(`mt-10`, 시안 측정값). **자리별 작품 배치는 임시**(`workIds` 순서).
- [x] 검증: 브라우저(Chrome, 375px)에서 배치도 렌더·라벨 위치, 스튜디오 4 클릭 → 핀 + 목록 2개, 스튜디오 6 클릭 → 핀 + 목록 1개 → 작품 클릭 시 상세 이동, 같은 부스 재클릭 → 전체 목록, `/map?work=hearing` 진입 → 스튜디오 4 핀 + 자리 핀 + 목록 1개, WORKS 목록 회귀 없음 확인. `pnpm build`, `pnpm lint` 통과.

## 7. Phase 6 — STUDENTS `/students`, `/students/:studentId` (브랜치 `feat/students`)

시안: `[Students] Home.png`, `[Students] 학생 상세.png`.

- [x] `pages/students/utils/chosung.ts`: 한글 첫 글자의 초성 추출(유니코드 분해, `getChosung`). 쌍자음(ㄲ,ㄸ,ㅃ,ㅆ,ㅉ)은 기본 자음(ㄱ,ㄷ,ㅂ,ㅅ,ㅈ)으로 매핑. 필터 항목은 상수가 아니라 `getChosungFilters(names)`가 **실제 학생 이름에 있는 초성만** 자음 순으로 만든다 → 현재 데이터로 `전체 ㄱ ㄴ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅎ`(시안과 동일. 계획서의 ㄷ·ㄹ은 시안에 없고 ㅁ이 있었음).
- [x] `components/StudentListItem.tsx`: 프로필 이미지(68×100, `getStudentImage`, 없으면 `navy-010`) + 이름(`semibold-16 navy-100`) + `TeamBadge` + `ChevronRight`. `motion.create(Link)` `whileTap` 0.98, `viewTransition`.
- [x] `Students.tsx`: `SearchInput`(placeholder "학생 이름을 검색해주세요") + `FilterTabs`(초성) + 목록. 이름 `includes` AND 초성 일치. 필터는 WORKS와 같은 URL 쿼리(`?q=&chosung=`), 진입·필터 변경 시 행 stagger 페이드업, 0건이면 "검색 결과가 없습니다".
- [x] `components/WorkCard.tsx`: 흰 카드(`p-5 shadow-card`) 3:2 대표 이미지 + 제목(`semibold-16`) + 한 줄 소개(`regular-14 subtext-500`) + `KeywordChip`. `Link to=/works/:id`(`viewTransition`, `whileTap` 0.98).
- [x] `StudentDetail.tsx`: 상단 좌 프로필 이미지(152px, 2:3) + 우 이름(`semibold-24 navy-100`)·`TeamBadge`·역할(`regular-14 subtext-700`)을 **하단 정렬**(`items-end`, 시안에서 텍스트가 이미지 하단보다 12px 위에서 끝남), 아래 참여 작품 `WorkCard`(복수면 `gap-4` 세로 나열, `Reveal` 0.1초 간격). 없는 ID면 `NotFound`(`-mx-5` 래퍼).
- [x] `shared/utils/exhibition.ts`에 전체 학생 getter `getStudents()` 추가(`getWorks()`와 동일 패턴).
- [x] 검증: Vite SSR 렌더로 전체 36명·탭 목록·`q=김&chosung=ㄱ` 12명·잘못된 chosung은 전체·0건 문구·상세(이름/팀/역할/작품 링크/키워드 3개)·없는 ID → NotFound 확인. `pnpm build`, `pnpm lint` 통과. **브라우저 실측(애니메이션·상세 ↔ 작품 상세 왕복)은 사용자가 `pnpm dev`로 확인 필요.**

## 8. Phase 7 — 마무리

- [ ] 모든 페이지 모바일(360px) 가로 스크롤 점검, `index.html` `<title>` 등 메타 정리.
- [ ] 보류 목록 중 사용자가 진행 결정한 항목 수행(카카오 공유, 쿠폰 이미지 저장, 로띠).
- [ ] 받은 실제 이미지(키비주얼, 404 캐릭터, 협찬사 로고·제품, 제휴사 아이콘, 파트너 캐릭터)로 placeholder 교체. 파일명 NFC 정규화·공백 제거 확인. 학생·작품 사진을 교체하면 `pnpm optimize:images`를 다시 실행한다.

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
  - 카카오톡 공유: JS SDK 2.8.3을 `shared/utils/kakaoShare.ts`에서 첫 공유 시 동적 로드(SRI 해시 포함) 후 `Kakao.init(VITE_KAKAO_JS_KEY)`. 타입은 `@types/kakao-js-sdk`가 v1(`Kakao.Link`) 기준이라 쓰지 않고 `shared/types/kakao.d.ts`에 필요한 부분만 선언. 초대장은 카카오 메시지 템플릿(ID 137738) + `Kakao.Share.sendCustom`. 카카오 디벨로퍼스 "JavaScript SDK 도메인"에 `http://localhost:5173`·배포 도메인 등록 필요.
- 2026-10-04 (Phase 3 구현 중 확정):
  - 감상평 제출 아이콘은 Figma 전용 SVG `ic-input-arrow-24.svg`(2026-10-05 사용자 제공, stroke를 `currentColor`로 변환). 처음엔 lucide `ArrowDown`을 썼으나 시안 아이콘과 모양이 달라 교체했다. 색은 `ReviewForm`의 상태에 따라 `text-navy-100`/`text-subtext-900`로 제어한다.
  - 메모지 배경 순환은 시안 기준 `pink → yellow → green → orange`(계획서의 green 시작 순서와 다름).
  - `NotFound`는 자체 `px-5 min-h-dvh`를 가지므로 상세 레이아웃 안에서 쓸 때 `-mx-5` 래퍼로 감싸 좌우 패딩 중복을 없앤다(Footer와 같은 방식).
  - 전체 작품 목록 getter `getWorks()`를 `shared/utils/exhibition.ts`에 추가(기존에는 ID 조회만 있었음). MAP 하단 목록도 같은 함수를 쓴다.
  - `useReviews`에 `placeholderData: keepPreviousData`를 둬 페이지 이동 시 그리드가 비었다가 채워지는 깜빡임을 막는다. 페이지 상태·쿼리·폼·목록·페이지네이션은 `ReviewSection`이 묶어서 관리하고 `WorkDetail`은 작품 조회와 404 분기만 한다.
  - 감상평 오류 메시지는 서버 `error.message`(한국어)를 그대로 쓰고, 응답이 없을 때만 "네트워크 연결을 확인해 주세요."를 보여준다. 별도 Toast 없이 폼 아래 한 줄(`regular-12 subtext-700`).
  - 감상평이 0개(`totalPages === 0`)면 페이지네이션을 렌더하지 않는다.
  - 시안 px 측정값(360px 기준): 목록 GNB 아래 28px·검색→탭 24px·탭→목록 28px / 상세 이미지 3:2·제목 24px·탭 높이 40px·메모지 최소 높이 170px·그리드 간격 16px·페이지 버튼 48px.
  - `pages/works` 하위 `apis/components/hooks/types`의 `.gitkeep`은 실제 파일이 생겨 제거. `constants/`, `utils/`는 유지.
- 2026-10-05 (WORKS 애니메이션 보강, 사용자 요청):
  - 페이지 진입·복귀 슬라이드는 **View Transitions API**(`document.startViewTransition`, React Router `viewTransition`)로 처리한다. 처음에는 motion으로 `DetailLayout`을 슬라이드 아웃한 뒤 navigate하는 방식을 썼으나, 라우터가 한 번에 한 페이지만 렌더해 빠지는 동안 빈 배경만 보였다(사용자 피드백 "흰 화면이 오래 보임"). View Transition은 이전·다음 화면 스냅샷을 겹쳐 두므로 돌아올 때 목록이 바로 보인다.
    - CSS는 `global.css`: 기본 크로스페이드를 끄고, `:root[data-nav-direction='forward']`면 새 화면이 오른쪽에서 들어오고(`::view-transition-new(root)`), `'back'`이면 이전 화면이 위에서 오른쪽으로 빠진다(`::view-transition-old(root)`, `z-index: 1`). 0.3s, iOS push 곡선, `animation-fill-mode: both`(없으면 애니메이션이 끝난 뒤 전환 레이어가 정리되기 전 한두 프레임 동안 이전 화면이 제자리로 돌아와 깜빡인다 — 사용자 리포트로 발견). `prefers-reduced-motion`이면 즉시 전환.
    - 방향은 `RootLayout`이 `useNavigationType()`으로 `<html data-nav-direction>`에 설정한다(POP → back, 그 외 forward). 라우터가 `startViewTransition` 콜백 안에서 `flushSync` 렌더하므로 layout effect가 스냅샷 전에 실행된다.
    - 전환을 켠 곳: `WorkListItem`·`MemberChips`·`WorkHero` 위치 링크의 `viewTransition`, `BackHeader`의 홈 이동. `navigate(-1)`과 브라우저 뒤로가기 제스처는 라우터가 들어올 때 기록한 경로 쌍으로 전환을 다시 적용하므로 별도 옵션이 없다. 공유 링크로 바로 들어온 뒤 뒤로가기는 기록이 없어 즉시 전환. GNB 탭 이동은 기존대로 즉시 전환. Firefox 144 미만 등 미지원 브라우저는 즉시 전환.
  - 라우터 레벨 `AnimatePresence`는 쓰지 않는다. data router에서 나가는 페이지가 바뀐 location을 읽어 `NotFound`가 깜빡이고, `/works` ↔ `/works/:id`는 레이아웃이 달라 GNB 유지 설계와 충돌하기 때문.
  - WORKS 목록은 진입 시와 검색·카테고리 변경 시 결과 목록 전체가 아래 16px에서 0.4초 페이드업, 행마다 0.05초 stagger(사용자 요청 2026-10-05). `ul`의 key를 필터 값으로 두어 필터가 바뀌면 재마운트된다. 처음에는 `AnimatePresence mode="popLayout"` + `motion.li layout`(항목별 이동 + 페이드아웃)이었으나 "스르륵 올라오는 느낌만" 남기기 위해 교체. `useReducedMotion`이면 정적 렌더.
  - 눌림 피드백 `whileTap` 배율: `Button` 0.97(기존), `WorkListItem` 행 0.98(`motion.create(Link)`), `BackHeader` 아이콘 0.85. `FilterTabs` 글자색 전환 0.2s.
  - Tailwind v4 Preflight가 `button` 커서를 `default`로 두므로 `global.css` base에 `button:not(:disabled), [role='button']:not(:disabled) { cursor: pointer }` 추가(사용자 요청, 전 페이지 공통).
  - `symbol-decor.svg`(TeamBadge 팀 아이콘)의 고정색 `#1B2541`을 `currentColor`로 수정. `text-navy-075`가 적용되지 않고 navy-100으로 보이던 문제(사용자 리포트). Phase 1 아이콘 규칙과 동일.
  - WORKS 목록 필터는 `useState`가 아닌 **URL 쿼리**(`?q=검색어&category=VR`)로 관리한다(사용자 요청: 새로고침해도 유지). 상세에서 뒤로 돌아올 때도 유지되고 링크 공유가 된다. `setSearchParams` 옵션은 `replace`(타이핑마다 히스토리 미누적)·`flushSync`(라우터가 transition으로 렌더해 controlled input이 글자를 놓치는 문제 방지)·`preventScrollReset`. 잘못된 category 값은 전체로 처리. STUDENTS 목록(Phase 6)도 같은 방식을 쓴다.
- 2026-10-05 (Phase 6 구현 중 확정):
  - 초성 필터 항목은 데이터에서 추출한다(`getChosungFilters`). 시안의 `전체 ㄱ ㄴ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅎ`가 36명 이름의 초성 집합과 정확히 일치했으므로, 고정 상수 대신 데이터 기반으로 두어 학생이 바뀌어도 수정이 필요 없게 했다. 한글이 아닌 이름(초성 없음)은 "전체"에서만 보인다.
  - STUDENTS 목록 쿼리 키는 `q`(검색어)·`chosung`(초성). 이름 검색은 한글이라 대소문자 변환 없이 `trim`만 한다.
  - 시안 px 측정값(360px 기준): 목록 프로필 68×100·행 `py-3`(행 간격 125px, WORKS 목록과 같은 pt-6/mt-6/mt-5 구조로 첫 행 y=268 일치) / 상세 프로필 152×227(≈2:3)·이미지→텍스트 12px·BackHeader 아래 24px·카드 위 24px·카드 패딩 20px·카드 이미지 3:2(280×187)·이미지→제목 24px·제목→소개 8px·소개→키워드 8px·키워드 간격 4px.
  - `WorkCard`·`StudentListItem`은 STUDENTS에서만 쓰므로 `pages/students/components`에 둔다. `WorkListItem`(shared)과 레이아웃이 달라(카드형) 공통화하지 않았다.
  - `pages/students` 하위 `components/`, `utils/`의 `.gitkeep`은 실제 파일이 생겨 제거. `apis/`, `constants/`, `hooks/`, `types/`는 유지.
- 2026-10-05 (이미지 최적화 + 스켈레톤, 사용자 요청 "이미지 로딩이 느리다"):
  - 원인은 원본 사진 크기였다. 학생 사진 36장 합계 약 202MB(장당 평균 5.7MB, 약 4000×5300px)를 68×100px로 표시하고 있었고, 작품 대표 이미지도 최대 8MB(6480×4320px)였다.
  - `scripts/optimizeImages.mjs`(`pnpm optimize:images`, devDependency `sharp`)가 `students/`는 폭 456px(상세 프로필 152px × 3배 DPR), `works/`는 폭 1200px(카드·히어로 약 390px × 3배)로 줄여 WebP(q80)로 저장하고 원본을 지운다. 결과: students 476KB(장당 7~19KB, 흰 배경 스튜디오 사진이라 작음), works 384KB. 이미 `.webp`인 파일은 건너뛰므로 새 사진을 넣고 다시 실행하면 된다. `sharp().rotate()`로 EXIF 방향을 픽셀에 반영한다(없으면 휴대폰 사진이 눕는다). 원본은 git 히스토리(교체 커밋 이전)에 남는다.
  - WebP로 통일한 이유: works PNG는 PNG로 줄여도 장당 1~2MB가 남지만 WebP는 20~100KB. Safari 14+ 지원.
  - `exhibition.json`의 `image` 필드는 원본 파일명(`.jpeg`/`.png`)을 그대로 두고, `shared/utils/image.ts`가 **확장자를 뺀 이름**으로 매칭한다. JSON은 명세 데이터라 손대지 않기 위함. 같은 이름에 확장자만 다른 파일이 둘이면 충돌하지만 현재 없다.
  - 스켈레톤은 라이브러리 없이 `shared/components/SkeletonImage.tsx`로 직접 구현(필요한 건 로드 전 `animate-pulse` 회색 박스뿐이라 `react-loading-skeleton` 등은 과함). 기존 5곳(`StudentListItem`·`StudentDetail`·`WorkCard`·`WorkHero`·`WorkListItem`)의 `imageUrl ? <img> : <div 회색>` 분기를 이 컴포넌트로 합쳤다. `src` 없음 → 회색 정지, 로딩 중 → `motion-safe:animate-pulse`, 로드 후 0.3초 페이드인. 캐시된 이미지는 `onLoad`가 안 올 수 있어 `img.complete`를 effect에서 확인한다. 목록은 `loading="lazy"`, 상세 히어로·프로필은 `eager`. `WorkListItem` placeholder에만 있던 `rounded-sm`은 다른 placeholder와 통일하기 위해 제거(실제 이미지에는 원래 없던 값).
  - `partners/`의 PNG(6.8MB)는 직접 import 경로로 쓰일 수 있어 이번 범위에서 제외(보류 목록).
- 2026-10-05 (Phase 5 구현 중 확정, 사용자 프롬프트 기준):
  - 배치도는 이미지·단일 SVG 컴포넌트가 아니라 **배경 SVG 1장 + 데이터 기반 부스 레이어**다. 배경은 Figma export(`map-background.svg`, 고정색 `#ECECEC`·`#999999` 유지)이고, 부스는 `BOOTHS` 좌표로 그려 선택·하이라이트를 DOM으로 바꾼다.
  - 계획서의 `Studio/Booth` 2단 타입은 쓰지 않는다. IA가 클릭 단위를 "부스"라 부르고 내부 약도가 범위 밖이라, 클릭 단위 = `Booth`(id `studio-N`) 하나로 둔다.
  - 프롬프트의 `Work.boothId` 대신 `Booth.workIds`로 연결한다. `exhibition.json`은 명세 데이터라 필드를 추가하지 않는다.
  - 진입 쿼리는 프롬프트의 `?boothId=`가 아니라 작품 ID(`?work=`, 처음엔 `?workId=`)를 쓴다(WORKS 쪽이 MAP 상수를 알 필요가 없고, 부스 ID는 MAP 내부 개념).
  - 핀 아이콘은 lucide `MapPin`(선 아이콘)이 아니라 이미 `currentColor`로 바꿔 둔 Figma `ic-location-24`(채운 핀)를 쓴다. 시안의 핀과 모양이 같다.
  - 카테고리 필터(IA·프롬프트에 있었음)는 **제거**(사용자 결정 2026-10-05). 시안에 없고 배치도가 GNB 아래 24px인 시안 레이아웃을 지킨다. `docs/ia.md` MAP 항목도 함께 수정.
  - 부스 클릭은 작품 수와 무관하게 선택 → 하단 목록이다(사용자 결정 2026-10-05). 처음엔 IA대로 1팀이면 바로 상세로 보냈으나, 스튜디오 2·3·4와 같은 흐름으로 통일했다.
  - 시안 px 측정값(360px 기준): 카드 320×304, 1px `navy-010` 테두리(Figma center stroke를 CSS border로), 라운드 4. 라벨 "스튜디오" 10px(토큰 없음 → `text-[0.625rem] tracking-tight`) + 숫자 `semibold-12`, 두 줄 중심이 부스 중심에서 −6.5px/+6px. 카드 → 목록 40px(`mt-10`).
  - 하단 목록은 WORKS와 같은 stagger 페이드업을 쓰기 위해 `WorkList`를 shared로 분리했다("두 페이지 이상에서 실제로 공유될 때만 shared"). `parseCategory`는 MAP이 안 쓰게 되어 `Works.tsx` 로컬로 유지. 부스 탭 피드백(`whileTap`)은 SVG transform-origin 문제가 있어 넣지 않았다(핀 하나를 `motion.g`로 키우는 건 motion이 `getBBox()`로 중심을 잡아 문제없다).
  - 부스 `<g>`의 `role="button" tabIndex={0}`은 **제거**(사용자 요청 2026-10-05 "클릭하면 테두리가 생긴다"). 원인: Chrome은 SVG 요소를 `:focus-visible`이 아닌 `:focus` 기준으로 `outline: auto`를 그려서 마우스 클릭만 해도 테두리가 남고, 다른 곳을 눌러 focus가 옮겨가야 사라진다(브라우저에서 `document.activeElement` = `<g>`, `:focus-visible` false, computed outline `auto` 확인). 키보드로는 부스를 고를 수 없지만 선택 없을 때 하단 전체 목록으로 모든 작품에 도달할 수 있다. cursor는 `[role=button]` 규칙 대신 `cursor-pointer` 클래스.
  - 내부 약도 SVG는 "틀"만 쓴다(사용자 제공 studio{2,3,4}.svg에서 배경 rect·자리 블록 제거, studio2는 드롭섀도용 `translate(0 10)`을 `translate(0 -10)`으로 상쇄해 320×160으로 정규화). 블록까지 SVG에 두면 선택 상태를 바꿀 수 없고 좌표를 SVG·상수 두 곳에서 관리하게 되기 때문. L자 블록은 모서리까지 포함된 Figma path를 상수로 옮겼고, 직사각형은 `rx 4`로 그린다. 핀 위치는 직사각형 중심, L자는 모서리 정사각형 중심(Click ver. 시안의 (32,128)).
  - 진입 애니메이션: 배치도는 `motion.div` 페이드인 0.4초(목록 행과 같은 값, 위치 이동 없음). 핀은 `motion.g`로 `y 8→0 · scale 0.5→1 · opacity`, spring(stiffness 500, damping 22)으로 "위로 뿅" 나타난다. 선택될 때만 마운트되므로 다른 부스로 옮겨도 다시 재생. `useReducedMotion`이면 둘 다 즉시 표시.
- 2026-10-05 (MAP 코드 리뷰 반영):
  - MAP 선택 상태를 `useState`에서 **URL 쿼리(`?booth=`·`?work=`)**로 옮겼다. 상태로 두면 상세에서 뒤로 돌아올 때 처음 진입한 `?workId=`가 다시 읽혀 다른 부스가 선택되고, GNB로 `/map`에 다시 와도 이전 선택이 남는 문제가 있었다. `WorkHero`의 링크는 `?work=`로 바꿨다.
  - `Booth.workIds`와 `floorPlan.areas[].workId`가 같은 연결의 복사본이라, `Booth`를 `SimpleBooth(workIds)` | `FloorPlanBooth(floorPlan)` 유니언으로 나누고 `getBoothWorkIds()`로 합친다. 자리가 바뀌면 `areas`만 고치면 된다.
  - 내부 약도의 클릭은 자리 도형이 아니라 핀까지 감싸는 `<g>`에서 받는다(핀을 눌러도 해제되게). `WorkList`의 빈 결과 문구도 "동작 줄이기"를 따른다. `WorkList`의 `listKey` prop은 React `key`로 대체. 페이드 값은 `shared/constants/motion.ts`(`FADE_TRANSITION`·`ROW_STAGGER`)로 모아 MAP·목록이 공유한다(`Students.tsx`의 복사본은 범위 밖이라 그대로).
  - 배치도·약도 `<svg>`에 `role="group"`, 부스·자리 `<g>`에 `<title>`을 넣어 스크린리더가 이름을 읽게 했다(focus 불가 결정은 유지).
  - Figma export SVG 위치 규칙을 "아이콘은 `icons/`, 배경·일러스트는 `images/<영역>/`"으로 `CLAUDE.md`·`docs/convention.md`에 명시했다(`images/graphic`, `images/partners` 선례와 `images/map` 기준).
- 2026-10-05: 백엔드 운영 서버 배포 전까지 **dev 전용 mock API**(`mocks/apiMock.ts`, Vite 미들웨어)로 감상평 UI 작업을 진행한다. `.env`에 `VITE_API_MOCK=true`, `VITE_API_BASE_URL=/api`를 두면 `pnpm dev`에서 세션·감상평 작성·조회를 명세 구조대로 응답한다(작품당 11개 시드, 메모리 저장이라 서버 재시작 시 초기화, 300ms 지연). 실제 서버 연결 시 `VITE_API_MOCK`을 비우고 `VITE_API_BASE_URL=http://localhost:4000/api`(또는 운영 주소)로 바꾸면 된다. 라이브러리(MSW 등)는 추가하지 않았다. 쿠폰 API는 Phase 4 착수 시 mock에 추가한다.
- (확인 필요) 작품별 인스타그램 카드뉴스 게시물 URL 9개 — 게시 후 `pages/works/constants/instagramLinks.ts`에 채운다.
- (확인 필요) PARTNER QR 토큰의 URL 파라미터명 (`qrToken` 가정).
- (확인 필요) 스튜디오별 작품 배치와 스튜디오 2·3·4 내부 자리별 작품 배치(`pages/map/constants/booths.ts`의 `workIds`·`floorPlan.areas[].workId`), 제휴사 매장 지도 URL, 협찬사 링크 URL·소개문.
- (확인 필요) ABOUT 임시 URL: 학과 홈페이지 `https://itmedia.duksung.ac.kr/`, Instagram `https://www.instagram.com/dswu_itmedia_26/`. `pages/about/constants/about.ts`에서 교체.
- (확인 필요) 네이버 지도: NCP 콘솔에서 Maps 서비스 Client ID 발급 후 `.env`에 `VITE_NAVER_MAP_CLIENT_ID` 설정, 콘솔의 Web 서비스 URL에 배포 도메인·`http://localhost:5173` 등록. 지도 좌표(37.655211, 127.048241)는 주소 검색값이므로 실제 핀 위치 확인.
- (확인 필요) PARTNER Step2에서 첫 행 chevron / 나머지 다운로드 아이콘의 의미.

## 10. 보류 목록 (이번 범위 제외)

- 카카오톡 공유 중 WORKS 상세의 작품별 공유(`Kakao.Share.sendDefault` 또는 별도 템플릿). ABOUT 초대장 공유는 Phase 2에서 완료했고 SDK 로더(`shared/utils/kakaoShare.ts`)를 재사용한다.
- 제휴사 상세 "쿠폰을 이미지로 저장하기" — `html-to-image` 등 라이브러리 추가 필요.
- 404·로딩 로띠 애니메이션(`@lottiefiles/dotlottie-react` 설치됨, 파일 미수령. ABOUT 키비주얼 로띠는 Phase 2에서 적용 완료).
- IA에만 있고 시안·데이터에 없는 항목: STUDENTS 상세 학번·인사말·SNS·이메일, ABOUT 지하철·버스 안내. (MAP 카테고리 필터는 2026-10-05 IA에서 제거.)
- `AGENTS.md`가 4페이지 기준으로 낡아 있음(EVENT 누락) — 사용자 요청 시 갱신.
- `shared/assets/images/partners/` PNG(약 6.8MB) 리사이즈 — `optimizeImages.mjs`의 `TARGETS`에 추가하면 되지만, 직접 import 경로(확장자 포함)로 쓰는 곳이 있으면 함께 고쳐야 한다.
