// exhibition.json의 image 필드는 파일명만 담고 있으므로, 번들된 이미지 URL을 파일명으로 찾는다.
// JSON에는 원본 파일명(.jpeg/.png)이 적혀 있지만 디스크에는 scripts/optimizeImages.mjs가 만든
// WebP 변환본만 있으므로, 확장자를 뺀 이름으로 맞춘다.
const stripExtension = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex === -1 ? fileName : fileName.slice(0, dotIndex);
};

const toFileNameMap = (modules: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [
      stripExtension(path.slice(path.lastIndexOf('/') + 1)),
      url,
    ]),
  );

const STUDENT_IMAGES = toFileNameMap(
  import.meta.glob<string>('@/shared/assets/images/students/*', { eager: true, import: 'default' }),
);

const WORK_IMAGES = toFileNameMap(
  import.meta.glob<string>('@/shared/assets/images/works/*', { eager: true, import: 'default' }),
);

// 매칭 실패 시 undefined를 반환하고, 렌더 쪽에서 placeholder를 보여준다.
export const getStudentImage = (fileName: string): string | undefined =>
  STUDENT_IMAGES[stripExtension(fileName)];

export const getWorkImage = (fileName: string): string | undefined =>
  WORK_IMAGES[stripExtension(fileName)];
