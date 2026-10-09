import { INSTAGRAM_PROFILE_URL } from '@/shared/constants/links';

// 작품별 인스타그램 카드뉴스 게시물 URL. key는 exhibition.json의 works[].id.
// 공유 링크에 붙는 추적용 쿼리는 빼고 게시물 주소만 둔다.
const WORK_INSTAGRAM_LINKS: Partial<Record<string, string>> = {
  'noroon-노른': 'https://www.instagram.com/p/DeOfJqigVP5/', // 흰
  마음: 'https://www.instagram.com/p/DeOcsoHgVMm/', // 괄호
  signbridge: 'https://www.instagram.com/p/DeOcWqsAUwD/', // Synaction
  hearing: 'https://www.instagram.com/p/DeOcFKRAVx2/', // 플로우
  'v-o': 'https://www.instagram.com/p/DeObjqfgbz4/', // 아자
  'sync-0': 'https://www.instagram.com/p/DeObERIAXSE/', // 개구락찌
  'blue-room': 'https://www.instagram.com/p/DeOaq4BAYcF/', // 뭉게구름
  poco: 'https://www.instagram.com/p/DeOaNhVASTa/', // 여학교의 별
  저승명부록: 'https://www.instagram.com/p/DeOZcuyAeEZ/', // Soundspace
};

// 매핑에 없는 작품이면 전공 인스타그램 프로필로 보낸다.
export const getWorkInstagramUrl = (workId: string) =>
  WORK_INSTAGRAM_LINKS[workId] ?? INSTAGRAM_PROFILE_URL;
