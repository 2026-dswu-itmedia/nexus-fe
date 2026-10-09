import FilterTabs from '@/shared/components/FilterTabs';
import SearchInput from '@/shared/components/SearchInput';
import WorkList from '@/shared/components/WorkList';
import { WORK_CATEGORY_FILTERS, type WorkCategory } from '@/shared/constants/category';
import { getWorks } from '@/shared/utils/exhibition';
import { useSearchParams } from 'react-router-dom';

const WORKS = getWorks();

// URL의 category 값이 정의된 필터가 아니면 전체(null)로 본다.
const parseCategory = (value: string | null): WorkCategory | null =>
  WORK_CATEGORY_FILTERS.find((filter) => filter.value !== null && filter.value === value)?.value ??
  null;

const Works = () => {
  // 필터를 URL 쿼리로 유지해 새로고침하거나 상세에서 돌아와도 그대로 남고, 링크로 공유할 수 있다.
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const category = parseCategory(searchParams.get('category'));

  // replace: 타이핑마다 히스토리가 쌓이지 않게.
  // flushSync: 라우터는 상태를 transition으로 갱신하므로, 그대로 두면 controlled input이 글자를 놓친다.
  // preventScrollReset: 쿼리가 바뀔 때 맨 위로 튀지 않게.
  const updateSearchParam = (key: string, value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true, flushSync: true, preventScrollReset: true },
    );
  };

  const handleKeywordChange = (value: string) => updateSearchParam('q', value);
  const handleCategoryChange = (value: WorkCategory | null) => updateSearchParam('category', value);

  const normalizedKeyword = keyword.trim().toLowerCase();
  // category는 "웹/앱, VR"처럼 복수일 수 있으므로 포함 여부로 판단한다(shared/constants/category.ts).
  const filteredWorks = WORKS.filter(
    (work) =>
      work.title.toLowerCase().includes(normalizedKeyword) &&
      (category === null || work.category.includes(category)),
  );

  return (
    <div className="flex flex-1 flex-col pt-6 pb-6">
      <SearchInput
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="프로젝트명을 검색해주세요"
      />
      <div className="mt-5">
        <FilterTabs
          items={WORK_CATEGORY_FILTERS}
          value={category}
          onChange={handleCategoryChange}
        />
      </div>
      {/* 진입 시와 검색·카테고리가 바뀔 때마다 결과 목록 전체가 아래에서 스르륵 올라온다(WorkList). */}
      <WorkList
        key={`${normalizedKeyword}|${category ?? ''}`}
        works={filteredWorks}
        emptyMessage="검색 결과가 없습니다"
        className="mt-5"
      />
    </div>
  );
};

export default Works;
