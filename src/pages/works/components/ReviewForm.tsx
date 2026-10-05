import usePostReview from '@/pages/works/hooks/usePostReview';
import type { ApiError } from '@/shared/types/api';
import { isAxiosError } from 'axios';
import InputArrowIcon from '@/shared/assets/icons/ic-input-arrow-24.svg?react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

// 시안(Comment.png) 기준 최대 글자 수. 서버 한도(1,000자)보다 훨씬 작다.
const MAX_CONTENT_LENGTH = 80;

// 서버 오류(429·500 등)는 한국어 message를 내려주므로 그대로 보여주고, 응답 자체가 없으면 네트워크 안내로 대체한다.
const getErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiError>(error) && error.response?.data.error.message) {
    return error.response.data.error.message;
  }
  return '네트워크 연결을 확인해 주세요.';
};

interface ReviewFormProps {
  workId: string;
  onPosted: () => void;
}

// 시안의 네 가지 상태:
// 1. 기본(포커스 없음·미입력): ✨ + placeholder, 화살표 네이비
// 2. 포커스·미입력: ✨·placeholder 숨김, "0/80", 화살표 회색
// 3. 입력 중(80자 이내): "n/80", 화살표 네이비
// 4. 80자 초과: 글자 수 굵게, 화살표 회색, 아래에 "최대 80자까지 작성 가능해요" 안내
const ReviewForm = ({ workId, onPosted }: ReviewFormProps) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { mutate, isPending, error } = usePostReview(workId);

  const trimmedContent = content.trim();
  const isOverLimit = content.length > MAX_CONTENT_LENGTH;
  const canSubmit = trimmedContent.length >= 1 && !isOverLimit && !isPending;
  const isIdle = !isFocused && content.length === 0;

  // 입력 내용 길이에 맞춰 textarea 높이를 늘린다(시안 4번째 상태처럼 여러 줄로 감긴다).
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const submit = () => {
    if (!canSubmit) return;

    mutate(trimmedContent, {
      onSuccess: () => {
        setContent('');
        onPosted();
      },
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  // 이전 input과 같이 Enter로 등록한다. 줄바꿈은 Shift+Enter.
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-navy-100 flex items-end gap-2 border-b-[1.5px] py-2">
        {isIdle && <span aria-hidden="true">✨</span>}
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isPending}
          placeholder={isIdle ? '작품에 대한 따뜻한 감상평을 남겨주세요' : ''}
          aria-label="감상평"
          className="text-regular-14 placeholder:text-subtext-900 flex-1 resize-none overflow-hidden bg-transparent text-black outline-none"
        />
        {!isIdle && (
          <span className="text-regular-14 text-subtext-500 shrink-0" aria-live="polite">
            <span className={isOverLimit ? 'text-semibold-14 text-black' : undefined}>
              {content.length}
            </span>
            /{MAX_CONTENT_LENGTH}
          </span>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="감상평 등록"
          className={`shrink-0 transition-colors ${isIdle || canSubmit ? 'text-navy-100' : 'text-subtext-900'}`}
        >
          <InputArrowIcon className="size-6" aria-hidden="true" />
        </button>
      </div>
      <AnimatePresence>
        {isOverLimit && (
          // 안내 문구는 작게 시작해 통통 튀며 나타난다(spring).
          <motion.p
            role="alert"
            className="text-semibold-14 mt-3 flex origin-left items-center gap-1 text-black"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 500, damping: 18, opacity: { duration: 0.15 } }
            }
          >
            <Info className="size-4" aria-hidden="true" />
            최대 {MAX_CONTENT_LENGTH}자까지 작성 가능해요
          </motion.p>
        )}
      </AnimatePresence>
      {error && <p className="text-regular-12 text-subtext-700 mt-2">{getErrorMessage(error)}</p>}
    </form>
  );
};

export default ReviewForm;
