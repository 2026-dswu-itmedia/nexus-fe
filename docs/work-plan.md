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
| `Partner] Step1.png`, `Step2.png`, `Loading.png`                                          | `/event/partner`             | 메인         |
| `Partner] 제휴사 상세 - 베리베리/쥬얼창동/오스시.png`                                     | `/event/partner/:partnerId`  | 상세(네이비) |
| `404.png`                                                                                 | `*`                          | 없음(단독)   |

레이아웃 정의:

- **메인 레이아웃**: 상단 중앙 로고 + 가로 스크롤 탭형 GNB + `Outlet`. Footer 없음.
- **상세 레이아웃**: `←` 뒤로가기 헤더(선택적 제목) + `Outlet`. 협찬사·제휴사 상세는 네이비 배경.
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

- [ ] `shared/types/exhibition.ts`: `Team`, `Student`, `Work`, `Exhibition` interface (`docs/api-spec.md` 1장 그대로). `Work.category`는 string 유지.
- [ ] `shared/constants/category.ts`: IA 카테고리 ↔ JSON 표기 매핑. `전체(null)`, `웹/앱`, `게임`, `VR`. 필터는 `category.includes(match)`로 판단.
- [ ] `shared/utils/exhibition.ts`: `exhibition.json` import 후 `getWorkById`, `getStudentById`, `getTeamById`, `getStudentsByIds`, `getWorksByIds`. 단순 함수(훅·쿼리 아님).
- [ ] `shared/utils/image.ts`: `import.meta.glob('@/shared/assets/images/students/*', { eager: true, import: 'default' })`로 파일명 → URL 맵을 만들고 `getStudentImage(fileName)`, `getWorkImage(fileName)` 제공. 매칭 실패 시 `undefined` 반환(렌더에서 회색 placeholder).
- [ ] `shared/apis/api.ts`에 `withCredentials: true` 추가. `shared/types/api.ts`에 `ApiResponse<T> = { data: T }`, `ApiError = { error: { code; message; details? } }` 정의.
- [ ] `shared/apis/visitorSession.ts`: `postVisitorSession()` (works 감상평, event 쿠폰 두 곳에서 쓰므로 shared).

### 2-2. 레이아웃·라우팅

- [ ] `shared/components/GNB.tsx` 재구현: 상단 중앙 `logo-nexus.svg`(`?react`), 아래 가로 스크롤 탭 행. 비활성 탭 = 흰 배경 + border, 활성 탭 = `navy-100` 배경 + 흰 글자 + 살짝 기울어진(회전) 형태. 활성 탭이 보이도록 마운트 시 `scrollIntoView`. sticky + `shadow-gnb`. `GNB_MENUS` 순서 유지.
- [ ] `shared/components/Footer.tsx` 재구현: 네이비 배경, "2026 덕성여자대학교 IT미디어공학전공 / 제14회 졸업전시회 웹사이트 / © 2026 IT Media Engineering all rights reserved. / Developed by 김시연 목소연 송은지" (시안 `[About].png` 하단). **ABOUT에서만 사용**하므로 `Layout`에서 제거하고 Phase 2에서 `About.tsx`가 렌더한다.
- [ ] `shared/components/Layout.tsx`: GNB + `Outlet`만. 배경 `ivory-bg`, `max-w-mobile`. `main`의 고정 padding 제거 여부는 시안 기준으로 판단(MAP·EVENT는 좌우 20px, 상세는 0).
- [ ] `global.css`의 `body` 배경을 시안에 맞게 조정(`bg-gray-100` → 모바일 폭 밖 배경 확인).
- [ ] `shared/components/BackHeader.tsx`: `ArrowLeft`(lucide) + 선택적 `title`. `navigate(-1)`. 네이비 페이지용 `variant: 'dark'` prop(흰 아이콘·글자).
- [ ] `shared/components/DetailLayout.tsx`: `BackHeader` + `Outlet`. 상세 4개 라우트가 사용.
- [ ] `shared/components/NotFound.tsx` 재구현: 중앙 404 그래픽(이미지 파일 수령 전까지 텍스트 "404"), 하단 고정 네이비 full-width 버튼 "NEX:US 홈페이지 바로가기" → `/`.
- [ ] `shared/components/ErrorBoundary.tsx`(class component) + `shared/components/PageFallback.tsx`(로딩 스피너, `Loader2` lucide). `routes/router.tsx`를 `React.lazy` + `Suspense` + `errorElement`로 재구성하고 `/event/sponsor/:sponsorId`, `/event/partner/:partnerId` 추가.
- [ ] `docs/ia.md` 라우팅 표에 두 상세 라우트 추가, EVENT 연결 설명 갱신, Footer 항목을 "ABOUT에만 표시"로 수정(사용자 승인된 변경).

### 2-3. 공통 UI 컴포넌트

- [ ] `shared/components/SearchInput.tsx`: controlled input, placeholder prop, 오른쪽 `ic-search-24.svg`. 밑줄(border-b navy) 스타일.
- [ ] `shared/components/FilterTabs.tsx`: 텍스트 탭 목록, 선택 항목은 `navy-100` semibold, 나머지 `subtext-700`. 가로 스크롤 허용. 제네릭 `items: { label; value }[]`, `value`, `onChange`.
- [ ] `shared/components/TeamBadge.tsx`: 팀 아이콘(●● 모양, `ic-*`에 없으면 lucide `Users`로 대체 후 사용자 확인) + 팀명.
- [ ] `shared/components/KeywordChip.tsx`: border + `regular-12` 칩.
- [ ] `shared/components/WorkListItem.tsx`: 썸네일(68×48 비율) + 제목(`semibold-16`) + 팀원 이름 나열(`regular-14 subtext-700`) + `ChevronRight`. `Link to=/works/:id`.
- [ ] `shared/components/Button.tsx`: `variant: 'primary'(navy) | 'outline'(white)`, full-width, 오른쪽 선택 아이콘.
- [ ] `shared/components/LinkRow.tsx`: 아이콘 + 텍스트 + `ic-go-link-24` 가로 바(`<a>` 외부 링크). 배경색 prop으로 네이비 페이지 대응.

### 2-4. 검증

- [ ] `pnpm dev`로 5개 메뉴 이동 시 활성 탭·스크롤 확인, 존재하지 않는 경로에서 404, 상세 라우트에서 뒤로가기 헤더 표시.
- [ ] `pnpm build`, `pnpm lint`.

## 3. Phase 2 — ABOUT `/` (브랜치 `feat/about`)

시안: `[About].png`. 데이터는 전부 정적 → `pages/about/constants/about.ts`.

- [ ] 상수: 소개 문단 3개(강조 구간은 `{ text, bold }[]` 배열), 일정 3행(`26.11.04 (수)` / `10:00 - 17:00`, `26.11.05 (목)` / `10:00 - 17:00`, `26.11.06 (금)` / `10:00 - 14:00`), 주소(`서울 도봉구 마들로 13길 84` / `서울창업허브 창동 B1`), 링크 2개(덕성여자대학교 IT미디어공학전공 홈페이지, Instagram `dswu_itmedia_26`), 졸업준비위원회(위원장 목소연, 부위원장 안유빈·이채진). URL은 사용자에게 확인.
- [ ] `components/HeroGraphic.tsx`: 상단 키비주얼. `shared/assets/images/graphic/`이 비어 있으므로 파일 수령 전까지 비율 유지 placeholder.
- [ ] `components/Introduction.tsx`: 문단 렌더(강조는 `<strong>`).
- [ ] `components/ScheduleTable.tsx`: 좌 네이비 날짜 셀 + 우 흰 시간 셀, 3행.
- [ ] `components/LocationSection.tsx`: 지도 임베드(iframe, 카카오맵/구글맵 공유 URL은 사용자에게 받음) + 주소 2줄 + `ic-copy-16` 클릭 시 `navigator.clipboard.writeText`.
- [ ] `components/QuickLinks.tsx`: `LinkRow` 2개(`logo-duksung-24.svg`, `logo-instagram-24.svg`).
- [ ] `components/Committee.tsx`: 네이비 제목 바 "졸업준비위원회" + 3행(직책 `subtext-700` + 이름).
- [ ] `components/ScrollTopButton.tsx`: 우측 하단 원형 FAB(`shadow-fab`, `ArrowUp` lucide), 스크롤 일정량 이후 표시. (공유 FAB은 카카오 공유 보류와 함께 제외)
- [ ] `About.tsx` 조립. 맨 아래에 `shared/components/Footer` 렌더(다른 페이지에는 없음).
- [ ] 검증: 모바일 폭에서 가로 스크롤 없음, 클립보드 복사 동작, 외부 링크 새 탭. `pnpm build`, `pnpm lint`.

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
- (확인 필요) PARTNER QR 토큰의 URL 파라미터명 (`qrToken` 가정).
- (확인 필요) 스튜디오별 작품 배치, 제휴사 매장 지도 URL, 협찬사 링크 URL·소개문, 학과 홈페이지 URL, 지도 임베드 URL.
- (확인 필요) PARTNER Step2에서 첫 행 chevron / 나머지 다운로드 아이콘의 의미.

## 10. 보류 목록 (이번 범위 제외)

- 카카오톡 공유(IA 전역 요소, WORKS 상세·ABOUT의 ↗ FAB) — Kakao JS SDK + `VITE_KAKAO_JS_KEY` 필요.
- 제휴사 상세 "쿠폰을 이미지로 저장하기" — `html-to-image` 등 라이브러리 추가 필요.
- 404·로딩 로띠 애니메이션(`@lottiefiles/dotlottie-react` 설치됨, 파일 미수령).
- IA에만 있고 시안·데이터에 없는 항목: STUDENTS 상세 학번·인사말·SNS·이메일, MAP 카테고리 필터, ABOUT 지하철·버스 안내.
- `AGENTS.md`가 4페이지 기준으로 낡아 있음(EVENT 누락) — 사용자 요청 시 갱신.
