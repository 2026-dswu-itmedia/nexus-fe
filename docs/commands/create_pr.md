# GitHub PR 생성

## 역할

현재 브랜치의 변경사항을 분석해 PR 제목과 본문을 작성하고, `gh pr create`로 PR을 올린다.

## 실행 순서

1. 사전 확인
   - `git status`로 커밋하지 않은 변경사항이 있으면 사용자에게 알리고 멈춘다
   - `gh pr view`로 현재 브랜치에 이미 열린 PR이 있는지 확인한다
   - `pnpm build`, `pnpm lint`가 통과하는지 확인한다

2. 변경사항 확인
   - `git fetch origin`
   - `git branch --show-current`
   - `git log origin/develop..HEAD --oneline`
   - `git diff origin/develop...HEAD --stat`
   - 필요한 파일은 `git diff origin/develop...HEAD -- <파일>`로 실제 변경 내용을 확인한다

3. PR 제목 작성
   - 형식: `[Type] 한 줄 요약` (이슈 제목과 동일한 형식, 요약은 한국어)
   - Type 선택 기준:
     | Type | 사용 시점 |
     |------|----------|
     | Feature | 새로운 기능 추가 |
     | Fix | 버그 수정 |
     | Refactor | 코드 구조 개선 |
     | Chore | 설정 및 기타 작업 |
     | Docs | 주석, README 등 문서 수정 |
     | Style | 스타일(CSS/Tailwind) 변경 |
     | Test | 테스트 코드 |

4. PR 본문 작성
   - `.github/PULL_REQUEST_TEMPLATE.md`를 읽고 양식에 맞춰 채운다
   - 안내용 주석(`<!-- -->`)은 지운다
   - 관련 이슈 번호를 사용자에게 묻고 `closes #번호`로 연결한다
   - UI 변경이 있으면 스크린샷 섹션은 비워 두고, 사용자에게 직접 추가하라고 안내한다
   - 작성한 본문은 `/tmp/pr-body.md`에 저장한다

5. 사용자 확인
   - 제목, 본문, draft 여부를 보여주고 확인받는다

6. push 및 PR 생성

```bash
   git push -u origin <현재 브랜치>
   gh pr create \
     --base develop \
     --title "[Feature] 로그인 API 연결" \
     --body-file /tmp/pr-body.md
```

- draft로 올리면 `--draft`를 추가한다
- 생성된 PR URL을 사용자에게 알려준다

## 주의사항

- base 브랜치는 항상 `develop`
- 사용자 확인 없이 push하거나 PR을 생성하지 않는다
