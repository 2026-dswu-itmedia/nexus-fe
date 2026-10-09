import exhibitionJson from '@/shared/constants/exhibition.json';
import type { Exhibition } from '@/shared/types/exhibition';

// 타입 단언(as) 대신 주석을 써서 JSON 구조가 명세와 어긋나면 빌드에서 바로 드러나게 한다.
const exhibition: Exhibition = exhibitionJson;

export const getWorks = () => exhibition.works;

export const getStudents = () => exhibition.students;

export const getWorkById = (id: string) => exhibition.works.find((work) => work.id === id);

export const getStudentById = (id: string) =>
  exhibition.students.find((student) => student.id === id);

export const getTeamById = (id: string) => exhibition.teams.find((team) => team.id === id);

export const getStudentsByIds = (ids: string[]) =>
  ids.map(getStudentById).filter((student) => student !== undefined);

export const getWorksByIds = (ids: string[]) =>
  ids.map(getWorkById).filter((work) => work !== undefined);
