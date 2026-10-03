# CLAUDE.md

졸업 작품을 소개하는 전시회 웹사이트 프론트엔드. 페이지는 `ABOUT(/)`, `WORKS`, `STUDENTS`, `MAP`, `EVENT` 5개이며 별도 랜딩 페이지는 없다.

## 문서 안내

작업 성격에 맞는 문서를 먼저 읽고 시작한다.

- 페이지·라우팅·페이지 연결 작업 → `docs/ia.md`
- 상태 관리·API·스타일링 판단이 필요할 때 → `docs/architecture.md`
- 코드 작성 시 → `docs/convention.md`
- api 연결 작업 시 -> `docs/api-spec.md`
- 작업 진행 순서·완료 상태 확인 → `docs/work-plan.md` (세션 시작 시 먼저 읽고, 종료 시 체크박스 갱신)

## 기술 스택

React, Vite, TypeScript, Tailwind CSS, React Router DOM, TanStack Query, Zustand, Axios, ESLint, Prettier

아이콘은 `lucide-react`(일반 UI), `vite-plugin-svgr`(프로젝트 전용 SVG)를 사용한다.

패키지 매니저는 `pnpm`만 사용한다 (`npm`, `yarn` 금지).

## 명령어

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## 폴더 구조

```text
src/
├── pages/      # about, works, students, map, event
│   └── <page>/ # 필요 시 apis, components, constants, hooks, types, utils
├── shared/     # apis, assets, components, constants, hooks, types, utils
└── routes/
```

- 한 페이지에서만 쓰는 코드는 해당 페이지 폴더에 둔다. 두 개 이상 페이지에서 실제로 공유될 때만 `shared/`로 옮긴다.
- 핵심 도메인 타입(Work, Student, Booth)은 `shared/types/`, GNB·Footer는 `shared/components/`에서 관리한다.
- Figma에서 export한 전용 SVG는 `shared/assets/icons/`에 둔다. 사용 규칙은 `docs/convention.md`의 Styling > 아이콘을 따른다.

## 핵심 규칙

- IA, GNB 메뉴 순서·명칭, 페이지 간 연결 구조를 임의로 바꾸지 않는다.
- 방명록은 작품 단위로만 관리한다 (전시 공용 방명록 없음).
- WORK·STUDENT·BOOTH는 ID로 연결하고, 같은 데이터를 페이지마다 중복 생성하지 않는다.
- 내부 이동은 React Router(`Link`, `NavLink`, `useNavigate`), 외부 이동은 `<a>`를 사용한다.
- API 응답 구조를 추측하지 않는다. 명세가 없으면 임의 필드를 확정 스키마처럼 쓰지 않는다.

## 작업 방식

- 구현 전 관련 파일과 기존 패턴을 확인하고, 간단한 계획을 먼저 설명한다.
- 요구사항이 명확하면 중간 확인 없이 끝까지 완료한다.
- 기존 컴포넌트·훅·유틸을 재사용하고, 요청 범위 밖 리팩터링이나 무관한 파일 수정은 하지 않는다.
- 현재 요구사항만 가장 단순하게 구현한다. 미래를 위한 추상화, 불필요한 Provider·전역 상태·라이브러리를 추가하지 않는다. 라이브러리 추가가 꼭 필요하면 이유를 설명한다.
- 완료 후 변경 내용과 검증 결과를 한국어로 설명하고, 중요한 구현 판단은 이유까지 설명한다.

## 금지 사항

- 기존 UI 디자인 임의 변경 (spacing, font size, color, radius 포함)
- 타입 오류를 피하기 위한 `any`, 린트 오류를 숨기기 위한 disable 남용
- 환경변수·API Key 하드코딩, `.env` 민감 값 노출
- 사용자의 기존 작업 삭제 또는 되돌리기
- 요청 없이 `git commit`, `git push`, `git reset`, `git rebase` 실행

## 완료 전 체크리스트

1. 요구사항이 모두 구현되었고 기존 기능이 깨지지 않았는가
2. IA와 페이지 연결 관계를 지켰는가
3. 중복 구현이나 불필요한 코드, 무관한 파일 수정이 없는가
4. `pnpm build`, `pnpm lint`가 통과하는가 (테스트·타입 체크 명령이 있으면 함께 실행)
