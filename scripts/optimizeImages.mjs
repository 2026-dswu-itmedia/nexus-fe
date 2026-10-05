// 전시 사진(학생 프로필·작품 대표 이미지)을 화면 표시 크기에 맞게 줄이고 WebP로 바꾼다.
// 원본은 4000px급 수 MB짜리라 그대로 번들하면 목록 한 페이지에 200MB를 내려받게 된다.
// 실행: pnpm optimize:images  (새 사진을 넣은 뒤 다시 실행하면 된다. 이미 .webp인 파일은 건너뛴다)
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const IMAGES_DIR = fileURLToPath(new URL('../src/shared/assets/images/', import.meta.url));

// 목표 폭 = 가장 크게 표시되는 CSS px × 3배(고해상도 모바일 DPR).
const TARGETS = [
  { dir: 'students', width: 456 }, // 학생 상세 프로필 152px
  { dir: 'works', width: 1200 }, // 작품 카드·히어로 최대 약 390px
];

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const WEBP_QUALITY = 80;

const toKB = (bytes) => `${Math.round(bytes / 1024)}KB`;

const optimizeFile = async (dirPath, fileName, width) => {
  const inputPath = path.join(dirPath, fileName);
  const baseName = fileName.slice(0, fileName.lastIndexOf('.'));
  const outputPath = path.join(dirPath, `${baseName}.webp`);

  const { size: inputSize } = await stat(inputPath);
  // rotate(): EXIF 방향을 픽셀에 반영한다. 휴대폰 사진은 메타데이터로만 회전된 경우가 많아
  // 이 단계가 없으면 변환 후 사진이 눕는다.
  const {
    width: outWidth,
    height: outHeight,
    size: outputSize,
  } = await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);
  await unlink(inputPath);

  console.log(
    `${fileName}  ${toKB(inputSize)} → ${toKB(outputSize)}  ${outWidth}x${outHeight}  → ${baseName}.webp`,
  );
};

for (const { dir, width } of TARGETS) {
  const dirPath = path.join(IMAGES_DIR, dir);
  const fileNames = (await readdir(dirPath)).filter((fileName) =>
    SOURCE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
  );
  console.log(`\n[${dir}] ${fileNames.length}개 변환 (폭 ${width}px)`);
  for (const fileName of fileNames) {
    await optimizeFile(dirPath, fileName, width);
  }
}
