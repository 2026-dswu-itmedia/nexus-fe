# 정보 구조 (IA)

## 라우팅

```text
/                     ABOUT (메인)
/works                WORKS 목록
/works/:workId        WORKS 상세
/students             STUDENTS 목록
/students/:studentId  STUDENTS 상세
/map                  MAP
/event                EVENT
/event/sponsor        SPONSOR
/event/sponsor/:sponsorId  SPONSOR 상세 (협찬사)
/event/partner        PARTNER
/event/partner/:partnerId  PARTNER 상세 (제휴사)
*                     404
```

## 페이지별 구성

### `/` — ABOUT

- 전시 소개, 전시 일정
- 오시는 길: 주소, 지도 임베드, 지하철, 버스
- 졸업준비위원회
- 바로가기: 학과 홈페이지, 전시회 Instagram

### `/works` — WORKS 목록

- 작품 검색, 카테고리 필터 (웹앱, 게임, VR, 기타)
- 작품 카드: 대표 이미지, 부스 위치, 작품명, 한 줄 소개 → 클릭 시 상세로 이동

### `/works/:workId` — WORKS 상세

- 대표 이미지
- 기본 정보: 부스 위치, 부스 배치도 CTA, 작품명, 한 줄 소개, 키워드 3개
- 상세 정보: 팀원, 작품 소개, 기획 의도
- 작품별 방명록: 코멘트 입력, 코멘트 리스트
- 이전 / 다음 작품 CTA

### `/students` — STUDENTS 목록

- 초성 필터 (ㄱ~ㅎ)
- 학생 카드: 프로필 사진, 이름 → 클릭 시 상세로 이동

### `/students/:studentId` — STUDENTS 상세

- 프로필 사진, 이름, 학번 (예: `21학번`), 팀명, 역할
- 방문객 인사말 또는 졸전 소감: 100자 이내, 최소 1개
- SNS, 이메일 (선택)
- 참여 작품 CTA

### `/map` — MAP

- 전체 부스 배치도
- 카테고리 필터 → 해당 카테고리 작품의 스튜디오·부스 하이라이트
- 부스 클릭:
  - 작품 1팀 → 바로 WORKS 상세로 이동
  - 작품 2팀 이상 → 부스 내부 약도 또는 작품 선택 UI → WORKS 상세

### `/event` — EVENT

- SPONSOR 영역, PARTNER 영역 두 개로 구성한다.
- 각 영역 클릭 시 해당 하위 페이지로 이동한다.

### `/event/sponsor` — SPONSOR

- 협찬 기업 목록: 기업명, 대표 사진, 한 줄 소개, 기업 페이지 링크
- 기업 클릭 시 `/event/sponsor/:sponsorId` 상세로 이동

### `/event/sponsor/:sponsorId` — SPONSOR 상세

- 협찬사 소개, 기업 페이지 링크, 협찬 물품 소개

### `/event/partner` — PARTNER

- 제휴 기업 목록: 기업명, 대표 사진, 한 줄 소개, 기업 페이지 링크
- 현장 QR 인증 및 쿠폰 발급, 내 쿠폰 조회 (`docs/api-spec.md`의 쿠폰 API 사용)
- 쿠폰 발급 후 매장 클릭 시 `/event/partner/:partnerId` 상세로 이동

### `/event/partner/:partnerId` — PARTNER 상세

- 제휴사 소개, 매장 위치 링크, 쿠폰 표시

## 페이지 연결 (변경 금지)

```text
WORKS 목록 → WORKS 상세
WORKS 상세 ── 팀원 클릭 ──────→ STUDENTS 상세 ── 참여 작품 ──→ WORKS 상세
WORKS 상세 ── 부스 배치도 CTA ─→ MAP ── 부스 클릭 ──→ WORKS 상세
EVENT ── SPONSOR 영역 클릭 ──→ SPONSOR ── 기업 클릭 ──→ SPONSOR 상세
EVENT ── PARTNER 영역 클릭 ──→ PARTNER ── 매장 클릭 ──→ PARTNER 상세
```

WORKS 상세에서 MAP으로 이동할 때는 해당 부스를 하이라이트할 수 있도록 작품 또는 부스 식별 정보를 함께 전달한다.

## 도메인 관계

```text
WORK    ── boothId, category, memberIds → STUDENT[]
STUDENT ── workIds → WORK[]
BOOTH   ── workIds → WORK[]
```

아래 타입은 관계 설명용 예시다. 실제 스키마는 API 명세나 확정된 데이터 구조를 따른다.

```ts
interface WorkTypes {
  id: string;
  boothId: string;
  memberIds: string[];
}

interface StudentTypes {
  id: string;
  workIds: string[];
}

interface BoothTypes {
  id: string;
  workIds: string[];
}
```

## 전역 요소

### GNB

- 전 페이지 공통. 메뉴 순서는 `ABOUT → WORKS → STUDENTS → MAP → EVENT`로 고정한다.
- 현재 페이지 active 상태를 표시한다.
- 메뉴명과 페이지 명칭을 바꾸지 않는다.

### Footer

- ABOUT 페이지 하단에만 표시한다. 컴포넌트는 `shared/components/Footer.tsx` 하나이며 `About.tsx`가 렌더한다.

### 카카오톡 공유

- 페이지별 공유 정보(제목, 설명, 대표 이미지, URL)를 구분할 수 있게 설계한다.
- 작품 상세 페이지는 해당 작품 정보로 공유되어야 한다.

### 404

- 정의되지 않은 경로에서 표시하고, 주요 페이지로 돌아가는 경로를 제공한다.
