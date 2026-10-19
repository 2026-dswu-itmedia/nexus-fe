import exhibitionJson from '@/shared/constants/exhibition.json';
import type { Exhibition, Work } from '@/shared/types/exhibition';

// 타입 단언(as) 대신 주석을 써서 JSON 구조가 명세와 어긋나면 빌드에서 바로 드러나게 한다.
const exhibition: Exhibition = exhibitionJson;

const startsWithLatin = (text: string) => /^[A-Za-z]/.test(text.trim());

// 이름 정렬: 영문으로 시작하는 이름이 먼저, 그 다음 한글. 같은 그룹 안에서는 가나다·알파벳순(대소문자 무시).
const compareName = (a: string, b: string) => {
  const groupDiff = Number(!startsWithLatin(a)) - Number(!startsWithLatin(b));
  if (groupDiff !== 0) return groupDiff;
  return a.localeCompare(b, 'ko', { sensitivity: 'base', numeric: true });
};

const compareWork = (a: Work, b: Work) => compareName(a.title, b.title);

// 목록은 모듈 로드 시 한 번만 정렬해 두고, 페이지는 이 배열을 그대로 쓴다(사용자 요청 2026-10-19).
const WORKS = [...exhibition.works].sort(compareWork);
const STUDENTS = [...exhibition.students].sort((a, b) => compareName(a.name, b.name));

export const getWorks = () => WORKS;

export const getStudents = () => STUDENTS;

export const getWorkById = (id: string) => exhibition.works.find((work) => work.id === id);

export const getStudentById = (id: string) =>
  exhibition.students.find((student) => student.id === id);

export const getTeamById = (id: string) => exhibition.teams.find((team) => team.id === id);

// 팀원 순서는 데이터의 순서를 그대로 둔다(작품 상세·목록의 팀원 나열은 팀이 정한 순서).
export const getStudentsByIds = (ids: string[]) =>
  ids.map(getStudentById).filter((student) => student !== undefined);

// 작품 목록(MAP 부스 선택, 학생 상세 참여 작품)은 전체 목록과 같은 순서로 보여준다.
export const getWorksByIds = (ids: string[]) =>
  ids
    .map(getWorkById)
    .filter((work) => work !== undefined)
    .sort(compareWork);
