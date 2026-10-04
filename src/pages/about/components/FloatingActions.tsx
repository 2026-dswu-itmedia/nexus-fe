import { INVITATION_TEMPLATE_ID } from '@/pages/about/constants/about';
import GoToTopIcon from '@/shared/assets/icons/ic-go-to-top-24.svg?react';
import ShareIcon from '@/shared/assets/icons/ic-share-24.svg?react';
import { shareKakaoTemplate } from '@/shared/utils/kakaoShare';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

// 링크 복사 완료 표시(체크 아이콘)를 유지하는 시간
const COPIED_FEEDBACK_MS = 3000;

const FAB_CLASS =
  'bg-white-100 shadow-fab text-subtext-700 pointer-events-auto flex size-12 items-center justify-center rounded-full';

// 공유·맨 위로 FAB 두 개. 시안(FAB.png)대로 세로로 쌓고 항상 떠 있는다.
const FloatingActions = () => {
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    if (!isLinkCopied) return;
    const timerId = window.setTimeout(() => setIsLinkCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timerId);
  }, [isLinkCopied]);

  // 카카오톡 초대장 공유가 기본. 키 미설정·SDK 로드 실패 시에는 Web Share API,
  // 그것도 지원하지 않는 브라우저(데스크톱 등)는 링크 복사로 대신한다.
  const handleShareClick = async () => {
    try {
      await shareKakaoTemplate(INVITATION_TEMPLATE_ID);
      return;
    } catch {
      // 아래 fallback으로 진행
    }

    const shareData = { title: document.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareData.url);
      setIsLinkCopied(true);
    } catch {
      // 공유 시트를 닫았거나 클립보드 권한이 없는 경우는 조용히 무시한다.
    }
  };

  const handleScrollTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // fixed 요소는 뷰포트 기준이므로, 모바일 폭 컨테이너(max-w-mobile + px-5)와 같은 영역을 다시 만들어
    // 데스크톱에서도 버튼이 콘텐츠 우측 하단에 오게 한다. 래퍼는 클릭을 가로채지 않도록 pointer-events-none.
    <div className="max-w-mobile pointer-events-none fixed inset-x-0 bottom-5 z-10 mx-auto flex flex-col items-end gap-2.5 px-5">
      <button
        type="button"
        onClick={handleShareClick}
        aria-label={isLinkCopied ? '링크가 복사되었습니다' : '공유하기'}
        className={FAB_CLASS}
      >
        {isLinkCopied ? (
          <Check className="size-6" aria-hidden="true" />
        ) : (
          <ShareIcon className="size-6" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={handleScrollTopClick}
        aria-label="맨 위로"
        className={FAB_CLASS}
      >
        <GoToTopIcon className="size-6" aria-hidden="true" />
      </button>
    </div>
  );
};

export default FloatingActions;
