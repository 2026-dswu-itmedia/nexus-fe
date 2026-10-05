import StudentListItem from '@/pages/students/components/StudentListItem';
import { getChosung, getChosungFilters, type Chosung } from '@/pages/students/utils/chosung';
import FilterTabs from '@/shared/components/FilterTabs';
import SearchInput from '@/shared/components/SearchInput';
import { getStudents } from '@/shared/utils/exhibition';
import { motion, useReducedMotion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';

const STUDENTS = getStudents();
const CHOSUNG_FILTERS = getChosungFilters(STUDENTS.map(({ name }) => name));

// WORKS 목록과 같은 진입 애니메이션 값.
const ROW_STAGGER = 0.05;
const ROW_TRANSITION = { duration: 0.4, ease: 'easeOut' } as const;

// URL의 chosung 값이 필터 항목에 없으면 전체(null)로 본다.
const parseChosung = (value: string | null): Chosung | null =>
  CHOSUNG_FILTERS.find((filter) => filter.value !== null && filter.value === value)?.value ?? null;

const Students = () => {
  // WORKS와 같이 필터를 URL 쿼리로 유지한다(새로고침·상세에서 복귀 시 유지, 링크 공유 가능).
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const keyword = searchParams.get('q') ?? '';
  const chosung = parseChosung(searchParams.get('chosung'));

  // replace·flushSync·preventScrollReset을 쓰는 이유는 Works.tsx 주석 참고.
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
  const handleChosungChange = (value: Chosung | null) => updateSearchParam('chosung', value);

  const normalizedKeyword = keyword.trim();
  const filteredStudents = STUDENTS.filter(
    (student) =>
      student.name.includes(normalizedKeyword) &&
      (chosung === null || getChosung(student.name) === chosung),
  );

  return (
    <div className="flex flex-1 flex-col pt-6 pb-10">
      <SearchInput
        value={keyword}
        onChange={handleKeywordChange}
        placeholder="학생 이름을 검색해주세요"
      />
      <div className="mt-5">
        <FilterTabs items={CHOSUNG_FILTERS} value={chosung} onChange={handleChosungChange} />
      </div>
      {/* 필터가 바뀌면 ul이 다시 마운트되어 결과 목록 전체가 아래에서 올라온다(Works.tsx와 동일). */}
      <ul key={`${normalizedKeyword}|${chosung ?? ''}`} className="mt-5">
        {filteredStudents.map((student, index) =>
          shouldReduceMotion ? (
            <li key={student.id}>
              <StudentListItem student={student} />
            </li>
          ) : (
            <motion.li
              key={student.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ROW_TRANSITION, delay: index * ROW_STAGGER }}
            >
              <StudentListItem student={student} />
            </motion.li>
          ),
        )}
      </ul>
      {filteredStudents.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={ROW_TRANSITION}
          className="text-regular-14 text-subtext-700 py-10 text-center"
        >
          검색 결과가 없습니다
        </motion.p>
      )}
    </div>
  );
};

export default Students;
