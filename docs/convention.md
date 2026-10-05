# 코딩 컨벤션

## 설계 원칙 / 패턴

필요한 경우 아래 패턴을 사용한다.

- **Custom Hook**: 반복되거나 컴포넌트에서 분리할 가치가 있는 상태/로직
- **Controlled Components**: form 입력 상태 관리
- **Error Boundary**: 페이지 또는 주요 기능 단위의 예외 처리
- **Lazy Loading**: 페이지 또는 무거운 컴포넌트의 지연 로딩

다음 패턴은 복잡도가 필요한 경우에만 사용한다.

- **useReducer**: 여러 상태가 서로 연관되어 있고 상태 전이가 복잡한 경우
- **Context Provider**: 여러 하위 컴포넌트가 동일한 상태를 공유해야 하는 경우
- **Zustand**: 페이지 경계를 넘어 공유되는 전역 클라이언트 상태

단순한 상태에는 `useState`를 우선한다.

불필요한 Context, Reducer, Zustand 사용 및 과도한 추상화를 지양한다.

---

## 네이밍

| 대상                   | 규칙             |
| ---------------------- | ---------------- |
| 컴포넌트 / class       | `PascalCase`     |
| 폴더명                 | `camelCase`      |
| 파일명 (컴포넌트 제외) | `camelCase`      |
| 변수 / 함수 / 파라미터 | `camelCase`      |
| 상수                   | `BIG_SNAKE_CASE` |
| interface / type       | `PascalCase`     |

- 이름만 보고 역할을 이해할 수 있도록 작성한다.
- 의미를 알기 어려운 임의의 줄임말을 사용하지 않는다.
- `API`, `URL`, `ID`, `UI` 등 일반적으로 사용되는 약어는 사용할 수 있다.
- 추가 설명이 필요한 경우 주석을 작성하되, 가능한 한 이름 자체로 의미가 드러나도록 한다.

---

## 변수

- 전역 변수는 최대한 지양한다.
- `var`는 사용하지 않는다.
- 기본적으로 `const`를 사용하고, 재할당이 필요한 경우에만 `let`을 사용한다.
- 객체와 배열에서 적절한 경우 구조 분해 할당을 사용한다.

```ts
const { id, title } = project;
```

- 동적인 문자열 조합에는 템플릿 리터럴을 사용한다.

```ts
const message = `${teamName} 프로젝트입니다.`;
```

단순한 고정 문자열에는 일반 문자열 리터럴을 사용한다.

---

## 함수

기본적으로 화살표 함수를 사용한다.

```ts
const getProject = () => {};
```

### 이벤트 핸들러

`handle + 대상/기능 + 이벤트` 형태를 기본으로 한다.

```tsx
const handleButtonClick = () => {};
const handleTabChange = () => {};
const handleModalClose = () => {};
```

JSX에 전달되는 이벤트 핸들러와 실제 동작 함수가 구분되어야 하는 경우 의미가 명확하도록 이름을 작성한다.

---

### Boolean

Boolean 값은 상태가 드러나는 이름을 사용한다.

기본적으로 다음 prefix를 사용한다.

```ts
isOpen;
isLoading;
isSelected;

hasError;
hasProject;

canSubmit;
canEdit;

shouldRender;
```

상태 setter는 React 기본 관례를 따른다.

```tsx
const [isOpen, setIsOpen] = useState(false);
```

---

### API 함수

API 함수는 기본적으로 `HTTP Method + Resource` 형태를 사용한다.

```ts
const getProjects = async () => {};
const getProjectDetail = async () => {};

const postProject = async () => {};

const patchProject = async () => {};

const deleteProject = async () => {};
```

단, 함수의 동작이 CRUD 이름만으로 충분히 표현되지 않는 경우 기능을 드러내는 이름을 사용할 수 있다.

```ts
const postProjectLike = async () => {};
const patchProjectVisibility = async () => {};
```

---

## TypeScript

`any` 사용을 지양한다.

타입을 명확하게 정의할 수 있는 경우 반드시 타입을 작성한다.

### interface / type

객체 형태의 데이터는 기본적으로 `interface`를 사용한다.

```ts
interface Project {
  id: number;
  title: string;
  description: string;
}
```

Union, Literal, Primitive 조합 등에는 `type`을 사용한다.

```ts
type ProjectStatus = "ready" | "published";

type ProjectId = number;
```

단순히 규칙을 맞추기 위해 `interface`와 `type`을 억지로 구분하지 않는다.

기존 코드에 이미 사용되는 패턴이 있다면 해당 패턴을 우선한다.

---

### Props

컴포넌트 Props는 컴포넌트 바로 위에 선언한다.

이름은 `컴포넌트명 + Props`를 사용한다.

```tsx
interface IntroductionProps {
  title: string;
  description: string;
}

const Introduction = ({ title, description }: IntroductionProps) => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
};
```

Props가 없으면 별도의 빈 Props 타입을 만들지 않는다.

---

## React

함수형 컴포넌트를 사용한다.

```tsx
const ProjectCard = () => {
  return <div />;
};

export default ProjectCard;
```

- 하나의 컴포넌트가 너무 많은 역할을 담당하지 않도록 한다.
- 재사용 가능한 UI는 컴포넌트로 분리한다.
- 페이지 전용 컴포넌트를 무조건 공통 컴포넌트로 만들지 않는다.
- 두 곳 이상에서 실제로 재사용될 가능성이 있는 경우 공통화를 고려한다.
- 단순히 파일 길이를 줄이기 위한 컴포넌트 분리는 지양한다.

---

## 상태 관리

상태의 범위에 따라 관리 방법을 선택한다.

### 지역 상태

하나의 컴포넌트 또는 가까운 컴포넌트 사이에서만 사용하는 상태는 `useState`를 우선한다.

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### 전역 상태

여러 페이지 또는 서로 멀리 떨어진 컴포넌트에서 공유하는 클라이언트 상태는 Zustand 사용을 고려한다.

모든 상태를 Zustand에 넣지 않는다.

---

## Styling

스타일링은 Tailwind CSS를 사용한다.

- 특별한 이유가 없다면 inline style을 사용하지 않는다.
- 디자인 시안에 정의된 spacing, font size, color, radius 등을 우선한다.
- 디자인을 임의로 변경하지 않는다.
- 반복되는 UI 패턴은 컴포넌트화를 고려한다.
- 반응형 레이아웃을 고려한다.
- 모바일에서 의도하지 않은 가로 스크롤이 발생하지 않도록 확인한다.

### 아이콘

기본 UI 아이콘(화살표, X, 메뉴, 검색, 공유, chevron 등)은 `lucide-react`를 사용한다.

```tsx
import { ChevronRight, X, Search } from 'lucide-react';
```

Lucide에 동일하거나 유사한 아이콘이 있으면 SVG를 별도로 추가하지 않는다.

프로젝트 고유 아이콘, 브랜드 아이콘, Figma에서 별도 제작된 그래픽만 SVG로 사용한다. 아이콘은 `shared/assets/icons/`에, 배경·일러스트 같은 그래픽은 `shared/assets/images/<영역>/`(예: `images/map/`, `images/graphic/`)에 두고, 둘 다 `<img src="...">` 대신 `?react` import로 React Component처럼 사용한다.

```tsx
// Bad
<img src={guideIcon} alt="" />;

// Good
import Guide from '@/shared/assets/icons/Guide.svg?react';

<Guide className="h-6 w-6" />;
```

단색 아이콘은 SVG 내부의 고정 색상 대신 `currentColor`를 사용해 Tailwind `text-*`로 색을 제어한다.

```svg
<!-- Bad -->
<path fill="#000000" />

<!-- Good -->
<path fill="currentColor" />
```

고정 색상을 의도한 일러스트나 브랜드 그래픽은 임의로 변경하지 않는다.

---

## 코드 품질

의미를 알 수 없는 변수명을 사용하지 않는다.

```ts
// Bad
const a = projectList.filter(...);

// Good
const publishedProjects = projectList.filter(...);
```

사용하지 않는 변수, import, 주석 처리된 코드는 제거한다.

개발 과정에서 사용한 불필요한 `console.log`는 작업 완료 전에 제거한다.

주석은 **코드가 무엇을 하는지**보다 **왜 이렇게 구현했는지** 설명할 필요가 있을 때 작성한다.

---

## 과설계 금지

현재 요구사항을 가장 단순하고 명확한 구조로 구현한다.

- 한 번만 사용되는 값을 무조건 상수화하지 않는다.
- 한 번만 사용되는 로직을 무조건 Custom Hook으로 만들지 않는다.
- 미래의 요구사항을 예상하여 불필요한 추상화 레이어를 만들지 않는다.
- 불필요한 Provider를 추가하지 않는다.
- 단순한 상태에 `useReducer`나 Zustand를 사용하지 않는다.
- 기존 코드로 해결 가능한 경우 새로운 라이브러리를 추가하지 않는다.
