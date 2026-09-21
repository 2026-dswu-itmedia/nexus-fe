# create_issue.md

## 역할

작업 이슈를 생성한다.

## 실행 순서

1. `.github/ISSUE_TEMPLATE/✏️-이슈-생성---작업.md` 템플릿을 읽는다
2. 사용자에게 작업 내용을 물어본다
3. `gh label list`로 라벨 목록을 확인하고, 사용자에게 붙일 라벨을 고르게 한다
4. 제목을 `[작성종류] 상세내용` 형식으로 작성한다 (작성종류는 커밋 컨벤션과 동일)
5. 템플릿의 front matter와 안내 주석을 제외한 본문 양식을 채워 `/tmp/issue-body.md`에 저장한다
6. 제목, 라벨, 본문을 사용자에게 보여주고 확인받는다
7. 아래 명령으로 이슈를 생성하고, 생성된 이슈 URL을 알려준다

## 명령어

```bash
gh issue create \
  --title "[Feature] 로그인 API 연결" \
  --body-file /tmp/issue-body.md \
  --label "<선택한 라벨>" \
  --assignee "@me"
```
