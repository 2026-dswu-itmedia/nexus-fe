import { INSTAGRAM_PROFILE_URL } from '@/shared/constants/links';

// 작품별 인스타그램 카드뉴스 게시물 URL. key는 exhibition.json의 works[].id.
// 아직 게시 전이라 비어 있다. 게시 후 각 작품의 게시물 URL을 채운다.
const WORK_INSTAGRAM_LINKS: Partial<Record<string, string>> = {
  'noroon-노른': undefined,
  마음: undefined,
  signbridge: undefined,
  hearing: undefined,
  'v-o': undefined,
  'sync-0': undefined,
  'blue-room': undefined,
  poco: undefined,
  저승명부록: undefined,
};

// 게시물 URL이 아직 없으면 전공 인스타그램 프로필로 보낸다.
export const getWorkInstagramUrl = (workId: string) =>
  WORK_INSTAGRAM_LINKS[workId] ?? INSTAGRAM_PROFILE_URL;
