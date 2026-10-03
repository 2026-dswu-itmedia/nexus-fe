# API 명세

데이터는 두 종류로 나뉜다.

| 종류                              | 출처                              | 사용 방식                        |
| --------------------------------- | --------------------------------- | -------------------------------- |
| 작품·학생·팀 정보, 이미지         | 프론트 정적 파일 (`exhibition.json`) | `import`로 직접 사용             |
| 방문자 세션, 작품 감상평, 쿠폰    | 백엔드 서버 (`/api`)              | `shared/apis/api.ts` + TanStack Query |

전시가 끝나고 서버를 내려도 작품·학생 페이지는 프론트만으로 동작해야 하므로, 서버는 사용자가 쓰기를 하는 데이터만 담당한다.

---

## 1. 정적 데이터 (`exhibition.json`)

### 위치와 사용

- 파일: `src/shared/constants/exhibition.json`
- 백엔드 팀원이 정리해 전달하는 파일을 그대로 넣는다. 작품 ID(`works[].id`)는 서버의 감상평과 연결되므로 임의로 바꾸지 않는다.
- fetch나 TanStack Query를 쓰지 않고 `import`로 바로 사용한다.

```ts
import exhibition from '@/shared/constants/exhibition.json';

exhibition.works; // 작품 목록
exhibition.students; // 학생 목록
exhibition.teams; // 팀 목록
```

### 구조

```ts
interface Exhibition {
  version: number;
  teams: Team[];
  students: Student[];
  works: Work[];
}

interface Team {
  id: string; // 예: "흰"
  name: string;
  memberIds: string[]; // Student.id[]
  workIds: string[]; // Work.id[]
}

interface Student {
  id: string; // 예: "student-001"
  name: string;
  teamId: string; // Team.id
  image: string; // 파일명. 예: "흰_20220986_목소연.jpeg"
  role: string; // 예: "팀장, 풀 스택 개발"
  workIds: string[]; // Work.id[]
}

interface Work {
  id: string; // 예: "noroon-노른", "hearing" (한글 포함 가능)
  category: string; // "웹/앱" | "게임" | "VR" (복수일 때 "웹/앱, VR"처럼 쉼표로 구분)
  title: string;
  teamId: string; // Team.id
  image: string; // 파일명. 예: "흰_도록_대표.png"
  summary: string; // 한 줄 소개
  keywords: string[]; // 3개
  description: string; // 작품 소개 (줄바꿈 \n 포함)
  purpose: string; // 기획 의도 (줄바꿈 \n 포함)
  memberIds: string[]; // Student.id[]
}
```

### 이미지

- `image` 필드는 파일명만 담는다. 경로는 코드에서 조합한다.
  - 학생 프로필: `src/shared/assets/images/students/`
  - 작품 대표 이미지: `src/shared/assets/images/works/`
- 파일명과 JSON의 `image` 값은 바이트 단위로 일치해야 한다. 맥에서 복사된 파일은 한글이 NFD(자모 분리형)로 저장되어 겉보기에는 같아도 매칭되지 않으므로, 이미지를 새로 받으면 NFC로 정규화한 뒤 넣는다.
- 파일명에 공백을 두지 않는다.

### 주의

- `Work.category`가 쉼표로 여러 값을 가질 수 있으므로 카테고리 필터는 문자열 포함 여부로 판단한다.
- IA의 카테고리 필터(웹앱, 게임, VR, 기타)와 JSON의 표기(`웹/앱`)가 다르므로 매핑이 필요하다. JSON 값을 바꾸지 않는다.
- 부스(Booth) 정보는 현재 JSON에 없다. 추가되면 이 문서를 갱신한다.

---

## 2. 서버 API

### 공통 규칙

| 항목              | 규칙                                                     |
| ----------------- | -------------------------------------------------------- |
| Base URL          | `/api` (`VITE_API_BASE_URL` 환경변수)                    |
| 데이터 형식       | JSON                                                     |
| 작품 식별값       | `exhibition.json`의 `works[].id`                         |
| 감상평·쿠폰 ID    | 서버에서 생성한 UUID                                     |
| 날짜 형식         | ISO 8601, UTC                                            |
| 방문자 식별       | 서버가 발급한 `visitor_session` 쿠키                     |
| 성공 응답         | `data` 필드에 결과 반환                                  |
| 실패 응답         | `error` 필드에 오류 반환                                 |
| 감상평 페이지 크기 | 8개 고정                                                 |
| 쿠폰 발급 제한    | 방문자 UUID당 1회                                        |

### 작품 데이터 처리

- 서버는 작품 테이블을 갖지 않고, 감상평에 `artworkId`만 저장한다.
- 서버는 `artworkId`의 형식만 검증하고 JSON에 실제로 존재하는 작품인지는 검증하지 않는다. 따라서 `ARTWORK_NOT_FOUND` 오류는 없다.
- 작품 제목이나 정렬 순서가 바뀌어도 `works[].id`는 유지해야 기존 감상평이 연결된다.
- 한글이 포함된 ID는 URL에 넣을 때 `encodeURIComponent(artworkId)`로 인코딩한다.

### 방문자 세션

- 로그인은 없다. 서버가 방문자 UUID를 생성해 서명된 쿠키로 전달한다.
- 운영 환경에서 `HttpOnly`, `Secure` 쿠키이며 전시 운영 기간 동안 유지된다.
- 프론트는 쿠키를 직접 읽거나 저장하지 않는다. 브라우저가 자동으로 전송한다.
- 방문자 UUID와 쿠폰 발급 UUID는 별개다. 쿠폰 발급 기록의 `visitor_id`에 UNIQUE 제약이 있어 같은 방문자의 중복 발급을 막는다. 쿠키 삭제나 다른 기기 사용까지 포함한 실제 사람당 1회 제한은 보장하지 않는다.

### 프론트엔드 연동 규칙

- 감상평 작성, 쿠폰 관련 API를 호출하기 전에 방문자 세션 발급 API를 먼저 호출한다.
- 세션이 필요한 요청은 Axios 옵션 `withCredentials: true`를 설정한다. 공용 instance(`shared/apis/api.ts`)에 적용한다.
- 세션 발급 응답은 200과 201 모두 "세션 준비 완료"이므로 구분 없이 다음 요청을 진행한다.

### 엔드포인트 목록

| 이름                    | Method | URL                                 | request param       |
| ----------------------- | ------ | ----------------------------------- | ------------------- |
| 방문자 세션 발급        | POST   | `/api/visitor-sessions`             | 없음                |
| 작품 감상평 작성        | POST   | `/api/artworks/{artworkId}/reviews` | `artworkId`         |
| 작품 감상평 목록 조회   | GET    | `/api/artworks/{artworkId}/reviews` | `artworkId`, `page` |
| 현장 QR 인증 및 쿠폰 발급 | POST | `/api/coupons`                      | 없음                |
| 내 쿠폰 조회            | GET    | `/api/coupons/me`                   | 없음                |

- IA의 "작품별 방명록"은 서버의 "감상평(reviews)"에 해당한다.
- 쿠폰 API는 PARTNER 페이지(`/event/partner`)에서 사용한다.

### 엔드포인트 상세

#### POST `/api/visitor-sessions` — 방문자 세션 발급

방문자를 식별하는 세션을 생성한다. 유효한 세션이 있으면 기존 세션을 유지한다.

- request: 없음 (기존 방문자 쿠키가 있으면 브라우저가 자동 전송)
- 201 Created: 새 세션 생성 / 200 OK: 기존 세션 유지. 둘 다 세션 준비 완료 상태다.

```json
{ "data": { "created": true } }
```

| 필드    | 타입    | 설명                           |
| ------- | ------- | ------------------------------ |
| created | boolean | 새로 생성했으면 `true`         |

- 방문자 UUID는 응답에 노출되지 않는다.
- 쿠키가 없거나 유효하지 않으면 새 세션을 발급한다. 새 세션으로는 이전 방문자의 쿠폰을 조회할 수 없다.
- 오류: 429 `RATE_LIMIT_EXCEEDED`

#### POST `/api/artworks/{artworkId}/reviews` — 작품 감상평 작성

- 방문자 세션 필요
- Path `artworkId`: `works[].id`. 1~100자, 한글·영문·숫자·하이픈·밑줄 허용. `encodeURIComponent`로 인코딩
- Body:

| 이름    | 타입   | 필수 | 설명                               |
| ------- | ------ | ---- | ---------------------------------- |
| content | string | O    | 앞뒤 공백 제거 후 1~1,000자        |

```json
{ "content": "작품의 아이디어와 전달하려는 메시지가 인상적이었어요." }
```

- 201 Created:

```json
{
  "data": {
    "id": "c28b9cd5-92d1-43c2-a7d4-a9216c31b82f",
    "artworkId": "signbridge",
    "content": "작품의 아이디어와 전달하려는 메시지가 인상적이었어요.",
    "createdAt": "2026-11-20T05:30:00.000Z"
  }
}
```

- 프론트에서도 전송 전에 `content.trim()` 길이가 1~1,000인지 검사한다. 공백만 있는 입력은 보내지 않는다.
- 내용은 일반 텍스트로 저장·표시한다.
- 방문자별 작성 개수 제한은 없고, 연속 요청만 제한된다.
- 오류: 400 `VALIDATION_ERROR` (내용 누락·타입 오류·공백만·길이 초과·artworkId 형식 오류), 401 `INVALID_VISITOR_SESSION`, 429 `RATE_LIMIT_EXCEEDED`

#### GET `/api/artworks/{artworkId}/reviews` — 작품 감상평 목록 조회

- 방문자 세션 불필요
- Path `artworkId`: 작성 API와 동일
- Query `page`: integer, 선택, 기본값 `1`, 최소 `1`. 페이지 크기는 8 고정이며 `limit`·`pageSize`는 받지 않는다.
- 정렬: 작성일 내림차순, 작성일이 같으면 ID 내림차순
- 200 OK:

```json
{
  "data": {
    "items": [
      {
        "id": "c28b9cd5-92d1-43c2-a7d4-a9216c31b82f",
        "content": "작품의 아이디어와 전달하려는 메시지가 인상적이었어요.",
        "createdAt": "2026-11-20T05:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 8,
      "totalCount": 1,
      "totalPages": 1,
      "hasNext": false
    }
  }
}
```

| 필드                  | 타입             | 설명                                        |
| --------------------- | ---------------- | ------------------------------------------- |
| items[].id            | string(UUID)     | 감상평 ID                                   |
| items[].content       | string           | 감상평 내용                                 |
| items[].createdAt     | string(datetime) | 작성 일시                                   |
| pagination.page       | integer          | 요청한 페이지 번호                          |
| pagination.pageSize   | integer          | 항상 `8`                                    |
| pagination.totalCount | integer          | 전체 감상평 수                              |
| pagination.totalPages | integer          | `ceil(totalCount / 8)`                      |
| pagination.hasNext    | boolean          | `page < totalPages`                         |

- 감상평이 없으면 `items: []`, `totalCount: 0`, `totalPages: 0`으로 200을 반환한다.
- 전체 페이지 수를 초과한 `page`를 요청해도 200과 빈 `items`를 반환한다. `page`는 요청값을 유지한다.
- 응답에 방문자 식별 정보는 포함되지 않는다. 내가 쓴 감상평을 구분할 수 없다.
- 오류: 400 `VALIDATION_ERROR` (artworkId 형식 또는 page 오류)

#### POST `/api/coupons` — 현장 QR 인증 및 쿠폰 발급

현장 QR에는 프론트 접속 URL과 서버가 생성한 인증 토큰이 포함된다. 프론트는 QR로 진입한 URL에서 토큰을 추출해 이 API에 전달한다.

- 방문자 세션 필요
- Body:

| 이름    | 타입   | 필수 | 설명                        |
| ------- | ------ | ---- | --------------------------- |
| qrToken | string | O    | 현장 QR에 포함된 인증 토큰  |

```json
{ "qrToken": "qT7nYv4Jp9Kx2Lm8Rc5Ws3Hd6Af0Bu1Ze" }
```

- 201 Created: 최초 발급 / 200 OK: 이미 발급 기록이 있어 기존 쿠폰 반환. 응답 구조는 동일하다 (내 쿠폰 조회 참고).
- 서버 처리 순서: 세션 검증 → QR 토큰 유효성·활성 상태·유효 기간 검증 → 기존 발급 기록이 있으면 반환 → 최초 발급이면 발급 기간 확인 후 생성
- 같은 QR 토큰을 여러 방문자가 쓸 수 있다. QR이 바뀌어도 방문자당 1회 제한은 유지된다.
- 재요청 시 새 발급 기록을 만들지 않고 기존 `id`, `issuedAt`, `expiresAt`을 유지한다. 만료된 쿠폰이면 `status: "EXPIRED"`로 반환하고 재발급하지 않는다.
- 동시 요청이나 네트워크 오류 재시도에도 쿠폰은 1개만 발급된다.
- 오류:

| 상태 | code                      | 상황                                   |
| ---- | ------------------------- | -------------------------------------- |
| 400  | `VALIDATION_ERROR`        | qrToken 누락·빈 문자열·문자열 아님     |
| 401  | `INVALID_VISITOR_SESSION` | 세션 없음 또는 무효                    |
| 403  | `INVALID_QR_TOKEN`        | QR 토큰이 유효하지 않음                |
| 409  | `COUPON_ISSUANCE_CLOSED`  | 최초 발급 요청이 발급 기간 밖          |
| 410  | `QR_TOKEN_INACTIVE`       | QR 토큰 만료 또는 비활성화             |
| 429  | `RATE_LIMIT_EXCEEDED`     | 인증 요청 과다                         |

#### GET `/api/coupons/me` — 내 쿠폰 조회

현재 방문자에게 발급된 쿠폰을 조회한다. QR 재인증은 필요 없다.

- 방문자 세션 필요
- request: 없음
- 200 OK:

```json
{
  "data": {
    "id": "ddbb4f77-677d-49ec-b35c-51ec5dafb5c6",
    "name": "졸업전시 방문 기념 쿠폰",
    "benefitDescription": "현장 기념품 1개 교환",
    "status": "ISSUED",
    "issuedAt": "2026-11-20T05:35:00.000Z",
    "expiresAt": "2026-11-23T09:00:00.000Z"
  }
}
```

| 필드               | 타입             | 설명                          |
| ------------------ | ---------------- | ----------------------------- |
| id                 | string(UUID)     | 쿠폰 발급 기록 ID             |
| name               | string           | 쿠폰 이름                     |
| benefitDescription | string           | 쿠폰 혜택 설명                |
| status             | string           | `ISSUED` 또는 `EXPIRED`       |
| issuedAt           | string(datetime) | 최초 발급 일시                |
| expiresAt          | string(datetime) | 쿠폰 만료 일시                |

| status  | 설명                     |
| ------- | ------------------------ |
| ISSUED  | 발급 완료, 유효 기간 내  |
| EXPIRED | 유효 기간 만료           |

- 서버 시간이 `expiresAt` 이상이면 `EXPIRED`로 반환한다. 만료된 쿠폰도 조회되며 재발급하지 않는다.
- 오류: 401 `INVALID_VISITOR_SESSION`, 404 `COUPON_NOT_FOUND` (발급받은 쿠폰 없음)

### 오류 응답

모든 오류는 `error` 필드로 반환한다. `details`는 400 `VALIDATION_ERROR`에서만 포함된다.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값을 확인해 주세요.",
    "details": [{ "field": "content", "message": "감상평은 1자 이상 1,000자 이하로 입력해 주세요." }]
  }
}
```

#### 오류 코드 목록

| 상태 | code                      | 사용 API                          |
| ---- | ------------------------- | --------------------------------- |
| 400  | `VALIDATION_ERROR`        | 감상평 작성·조회, 쿠폰 발급       |
| 401  | `INVALID_VISITOR_SESSION` | 감상평 작성, 쿠폰 발급, 내 쿠폰   |
| 403  | `INVALID_QR_TOKEN`        | 쿠폰 발급                         |
| 404  | `COUPON_NOT_FOUND`        | 내 쿠폰                           |
| 409  | `COUPON_ISSUANCE_CLOSED`  | 쿠폰 발급                         |
| 410  | `QR_TOKEN_INACTIVE`       | 쿠폰 발급                         |
| 429  | `RATE_LIMIT_EXCEEDED`     | 세션 발급, 감상평 작성, 쿠폰 발급 |
| 500  | `INTERNAL_SERVER_ERROR`   | 전체                              |

- 401이 오면 방문자 세션 발급 API를 다시 호출한 뒤 재시도한다.
- 500은 예상하지 못한 서버 오류다. 내부 오류나 DB 정보는 응답에 포함되지 않는다.

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
  }
}
```
