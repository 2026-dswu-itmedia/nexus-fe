import CheckIcon from '@/shared/assets/icons/ic-check-16.svg?react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

// 토스트가 떠 있는 시간(ms)
const VISIBLE_DURATION_MS = 3000;

interface ToastProps {
  type: 'success' | 'error';
  message: string;
}

// PARTNER 페이지 전용 하단 토스트. 마운트되면 3초 뒤 스스로 사라진다.
// 같은 자리에서 다른 메시지를 다시 띄우려면 부모가 key를 바꿔 새로 마운트한다.
const Toast = ({ type, message }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsVisible(false), VISIBLE_DURATION_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    // fixed 요소는 뷰포트 기준이므로 FloatingActions처럼 모바일 폭 컨테이너(max-w-mobile + px-5)를 다시 만든다.
    <div className="max-w-mobile pointer-events-none fixed inset-x-0 bottom-5 z-10 mx-auto px-5">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="status"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-navy-075 text-regular-14 text-white-100 flex items-center gap-2 rounded-lg px-4 py-3"
          >
            {type === 'success' ? (
              <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <Info className="size-4 shrink-0" aria-hidden="true" />
            )}
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
