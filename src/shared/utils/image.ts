// exhibition.json의 image 필드는 파일명만 담고 있으므로, 번들된 이미지 URL을 파일명으로 찾는다.
const toFileNameMap = (modules: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
  );

const STUDENT_IMAGES = toFileNameMap(
  import.meta.glob<string>('@/shared/assets/images/students/*', { eager: true, import: 'default' }),
);

const WORK_IMAGES = toFileNameMap(
  import.meta.glob<string>('@/shared/assets/images/works/*', { eager: true, import: 'default' }),
);

// 매칭 실패 시 undefined를 반환하고, 렌더 쪽에서 placeholder를 보여준다.
export const getStudentImage = (fileName: string): string | undefined => STUDENT_IMAGES[fileName];

export const getWorkImage = (fileName: string): string | undefined => WORK_IMAGES[fileName];
