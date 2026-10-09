import type { ReactNode } from 'react';

interface StepCardProps {
  step: number;
  title: string;
  isActive: boolean;
  children?: ReactNode;
}

// 활성 카드는 흰 배경 + 그림자 + 살짝 기울어진 상태, 비활성 카드는 전체를 25%로 흐리게 둔다(시안 측정값).
// QR 인증이 끝나면 1→2로 넘어가므로 기울기·투명도를 transition으로 잇는다.
const StepCard = ({ step, title, isActive, children }: StepCardProps) => {
  return (
    <div
      aria-current={isActive ? 'step' : undefined}
      className={`bg-white-100 border-border shadow-card border px-4 py-5 transition-[rotate,opacity] duration-300 ${
        isActive ? '-rotate-2' : 'opacity-25'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="bg-navy-100 text-regular-14 text-white-100 flex size-6 shrink-0 items-center justify-center rounded-full"
        >
          {step}
        </span>
        <h2 className="text-regular-14 text-black">
          <span className="sr-only">{step}단계. </span>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
};

export default StepCard;
