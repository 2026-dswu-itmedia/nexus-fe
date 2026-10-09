import NaverMap from '@/pages/about/components/NaverMap';
import Reveal from '@/shared/components/Reveal';
import { ADDRESS_LINES, NAVER_MAP_DIRECTIONS_URL } from '@/pages/about/constants/about';
import CheckIcon from '@/shared/assets/icons/ic-check-16.svg?react';
import CopyIcon from '@/shared/assets/icons/ic-copy-16.svg?react';
import GoLinkIcon from '@/shared/assets/icons/ic-go-link-16.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

// 복사 완료 표시(체크 + "복사됨")를 유지하는 시간
const COPIED_FEEDBACK_MS = 3000;

// 복사 아이콘 ↔ "복사됨" 전환 애니메이션. 나타날 때는 아래에서 올라오고, 사라질 때는 위로 빠진다.
const FEEDBACK_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const;

const LocationSection = () => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timerId = window.setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timerId);
  }, [isCopied]);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS_LINES.join(' '));
      setIsCopied(true);
    } catch {
      // 클립보드 권한이 없는 환경(http, 구형 브라우저)에서는 조용히 무시한다.
    }
  };

  return (
    <section aria-label="오시는 길" className="flex flex-col gap-6">
      <Reveal>
        <NaverMap />
      </Reveal>
      <Reveal delay={0.1} className="flex items-center justify-between gap-4">
        <address className="text-regular-14 text-black not-italic">
          {ADDRESS_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </address>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCopyClick}
            aria-label={isCopied ? '주소가 복사되었습니다' : '주소 복사'}
            className="text-subtext-700 -m-1 flex shrink-0 items-center p-1"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isCopied ? (
                <motion.span key="copied" className="flex items-center gap-1" {...FEEDBACK_MOTION}>
                  <CheckIcon className="size-4" aria-hidden="true" />
                  <span className="text-regular-14">복사됨</span>
                </motion.span>
              ) : (
                <motion.span key="copy" className="flex" {...FEEDBACK_MOTION}>
                  <CopyIcon className="size-4" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <a
            href={NAVER_MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="네이버 지도에서 길찾기 (새 탭)"
            className="text-subtext-700 -m-1 flex shrink-0 p-1"
          >
            <GoLinkIcon className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
};

export default LocationSection;
