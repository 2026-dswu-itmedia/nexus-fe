# 정보 구조 (IA)

## 라우팅

```text
/                     ABOUT (메인)
/works                WORKS 목록
/works/:workId        WORKS 상세
/students             STUDENTS 목록
/students/:studentId  STUDENTS 상세
/map                  MAP
*                     404
```

## 페이지별 구성

### `/` — ABOUT

- 전시 소개, 전시 일정
- 오시는 길: 주소, 지도 임베드, 지하철, 버스
- 졸업준비위원회
- 협찬·제휴: 기업명, 대표 사진, 한 줄 소개, 기업 페이지 링크
- 바로가기: 학과 홈페이지, 전시회 Instagram

### `/works` — WORKS 목록

- 작품 검색, 카테고리 필터 (웹앱, 게임, VR, 기타)
- 작품 카드: 대표 이미지, 부스 위치, 작품명, 한 줄 소개 → 클릭 시 상세로 이동

### `/works/:workId` — WORKS 상세

- 대표 이미지
- 기본 정보: 부스 위치, 부스 배치도 CTA, 작품명, 한 줄 소개, 키워드 3개
- 상세 정보: 팀원, 작품 소개, 기획 의도
- 작품별 방명록: 이모지 리액션, 코멘트 입력, 코멘트 리스트
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

## 페이지 연결 (변경 금지)

```text
WORKS 목록 → WORKS 상세
WORKS 상세 ── 팀원 클릭 ──────→ STUDENTS 상세 ── 참여 작품 ──→ WORKS 상세
WORKS 상세 ── 부스 배치도 CTA ─→ MAP ── 부스 클릭 ──→ WORKS 상세
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

- 전 페이지 공통. 메뉴 순서는 `ABOUT → WORKS → STUDENTS → MAP`으로 고정한다.
- 현재 페이지 active 상태를 표시한다.
- 메뉴명과 페이지 명칭을 바꾸지 않는다.

### Footer

- 전 페이지 공통. 페이지마다 따로 구현하지 않는다.

### 카카오톡 공유

- 페이지별 공유 정보(제목, 설명, 대표 이미지, URL)를 구분할 수 있게 설계한다.
- 작품 상세 페이지는 해당 작품 정보로 공유되어야 한다.

### 404

- 정의되지 않은 경로에서 표시하고, 주요 페이지로 돌아가는 경로를 제공한다.
