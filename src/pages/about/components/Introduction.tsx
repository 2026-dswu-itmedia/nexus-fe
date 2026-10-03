import Reveal from '@/pages/about/components/Reveal';
import { INTRO_PARAGRAPHS } from '@/pages/about/constants/about';
import VectorLeft from '@/shared/assets/icons/ic-about-vector-left.svg?react';
import VectorRight from '@/shared/assets/icons/ic-about-vector-right.svg?react';

// 문단 사이 구분선. 시안 순서대로 1·3번째는 left, 2번째는 right 벡터를 쓴다.
const DIVIDERS = [VectorLeft, VectorRight, VectorLeft];

const Introduction = () => {
  return (
    <section className="flex flex-col gap-5">
      {INTRO_PARAGRAPHS.map((segments, paragraphIndex) => {
        const Divider = DIVIDERS[paragraphIndex - 1];
        return (
          // 구분선과 다음 문단을 한 묶음으로 떠오르게 한다.
          <Reveal key={paragraphIndex} className="flex flex-col gap-5">
            {Divider && <Divider className="mx-auto shrink-0" aria-hidden="true" />}
            <p className="text-regular-14 text-black">
              {segments.map(({ text, bold }, segmentIndex) =>
                bold ? <strong key={segmentIndex}>{text}</strong> : text,
              )}
            </p>
          </Reveal>
        );
      })}
    </section>
  );
};

export default Introduction;
