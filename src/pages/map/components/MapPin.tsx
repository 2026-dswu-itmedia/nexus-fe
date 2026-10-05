import LocationIcon from '@/shared/assets/icons/ic-location-24.svg?react';
import { motion, useReducedMotion } from 'motion/react';

const PIN_SIZE = 24;
// 핀이 중심 아래(viewBox 8px)에서 커지며 올라와 살짝 넘쳤다가 자리잡는다.
const PIN_INITIAL = { opacity: 0, y: 8, scale: 0.5 };
const PIN_ANIMATE = { opacity: 1, y: 0, scale: 1 };
const PIN_TRANSITION = { type: 'spring', stiffness: 500, damping: 22 } as const;

interface MapPinProps {
  // 핀 중심(부모 SVG 좌표)
  x: number;
  y: number;
  // 색은 text-* 토큰으로 제어한다(아이콘이 currentColor).
  className: string;
}

// 배치도(흰 핀)와 내부 약도(네이비 핀)가 함께 쓰는 위치 핀. 선택될 때만 마운트되므로 initial이 매번 재생된다.
const MapPin = ({ x, y, className }: MapPinProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.g
      initial={shouldReduceMotion ? false : PIN_INITIAL}
      animate={PIN_ANIMATE}
      transition={PIN_TRANSITION}
    >
      <LocationIcon
        x={x - PIN_SIZE / 2}
        y={y - PIN_SIZE / 2}
        width={PIN_SIZE}
        height={PIN_SIZE}
        className={className}
        aria-hidden="true"
      />
    </motion.g>
  );
};

export default MapPin;
