# AGENTS.md

졸업 작품을 소개하는 전시회 웹사이트 프론트엔드.

페이지는 `ABOUT(/)`, `WORKS`, `STUDENTS`, `MAP` 4개이며 별도 랜딩 페이지는 없다.

상세 규칙은 아래 문서를 source of truth로 사용한다.

## 문서 안내

작업 시작 전 관련 문서를 확인한다.

- 페이지 구조, 라우팅, 페이지 연결 → `docs/ia.md`
- 상태 관리, API 구조, 폴더 구조, 스타일링 → `docs/architecture.md`
- 코드 작성 및 수정 → `docs/convention.md`
- 실제 API 연결 및 요청/응답 타입 → `api-spec.md`

여러 영역에 걸친 작업이라면 관련 문서를 모두 확인한다.

## 기술 스택

React, Vite, TypeScript, Tailwind CSS, React Router DOM, TanStack Query, Zustand, Axios, ESLint, Prettier

아이콘은 `lucide-react`(일반 UI)와 `vite-plugin-svgr`(프로젝트 전용 SVG)를 사용한다.

패키지 매니저는 `pnpm`만 사용한다. `npm`, `yarn`은 사용하지 않는다.

## 명령어

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

작업 완료 전 `pnpm build`와 `pnpm lint`를 실행한다.

## 폴더 구조

```text
src/
├── pages/      # about, works, students, map
│   └── <page>/ # 필요 시 apis, components, constants, hooks, types, utils
├── shared/     # apis, assets, components, constants, hooks, types, utils
└── routes/
```

- 한 페이지에서만 쓰는 코드는 해당 페이지 폴더에 둔다.
- 두 개 이상 페이지에서 실제로 공유될 때만 `shared/`로 이동한다.
- `Work`, `Student`, `Booth` 등 공통 도메인 타입은 `shared/types/`에서 관리한다.
- GNB, Footer 등 전역 공통 UI는 `shared/components/`에서 관리한다.
- Figma에서 export한 전용 SVG는 `shared/assets/icons/`에서 관리한다. 사용 규칙은 `docs/convention.md`의 Styling > 아이콘을 따른다.

## 핵심 규칙

- IA, GNB 명칭·순서, 페이지 간 연결 구조를 임의로 변경하지 않는다.
- 방명록은 작품 단위로만 관리한다.
- `WORK`, `STUDENT`, `BOOTH` 데이터는 ID 기반으로 연결하고 페이지마다 중복 생성하지 않는다.
- 내부 이동은 React Router를 사용하고 외부 이동은 `<a>`를 사용한다.
- API endpoint, 요청/응답 구조, 필드를 추측하지 않는다.
- 디자인 시안이 존재하면 임의로 변경하지 않는다.
- 현재 요구사항에 없는 기능이나 불필요한 추상화를 추가하지 않는다.

## 작업 방식

- 구현 전 관련 파일과 기존 패턴을 확인한다.
- 간단한 작업 계획을 먼저 설명한 뒤 구현한다.
- 요구사항이 명확하면 불필요한 중간 확인 없이 완료한다.
- 기존 컴포넌트, 훅, 유틸을 우선 재사용한다.
- 요청 범위를 벗어난 리팩터링이나 무관한 파일 수정은 하지 않는다.
- 새 라이브러리는 기존 의존성으로 해결할 수 없는 경우에만 추가하고 이유를 설명한다.
- 완료 후 변경 내용과 검증 결과를 한국어로 설명한다.

## 금지 사항

- 타입 오류를 피하기 위한 무분별한 `any`
- 린트 오류를 숨기기 위한 disable 남용
- 환경변수 또는 API Key 하드코딩
- `.env` 민감 값 노출
- 사용자의 기존 작업 삭제 또는 되돌리기
- 요청 없는 `git commit`, `git push`, `git reset`, `git rebase`

## 완료 전 확인

- 요구사항과 관련 문서를 준수했는가
- 기존 기능이 깨지지 않았는가
- 불필요한 중복 구현이나 무관한 수정이 없는가
- `pnpm build`와 `pnpm lint`가 통과하는가
