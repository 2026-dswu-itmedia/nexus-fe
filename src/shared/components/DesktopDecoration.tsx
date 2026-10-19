import joystickImage from '@/shared/assets/images/desktop/img-desktop-joystick.webp';
import musicImage from '@/shared/assets/images/desktop/img-desktop-music.webp';
import projectorImage from '@/shared/assets/images/desktop/img-desktop-projector.webp';
import logoNexusUrl from '@/shared/assets/logos/logo-nexus.svg';
import LogoNexus from '@/shared/assets/logos/logo-nexus.svg?react';
import { REVEAL_STAGGER } from '@/shared/constants/motion';
import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';

// 둥실 떠다니는 주기·위상을 캐릭터마다 다르게 둬 한 덩어리로 움직이지 않게 한다(음수 delay = 시작 위상).
const CHARACTERS = [
  { src: projectorImage, floatClassName: '[animation-duration:3.2s]' },
  { src: joystickImage, floatClassName: '[animation-duration:3.8s] [animation-delay:-1.3s]' },
  { src: musicImage, floatClassName: '[animation-duration:3.5s] [animation-delay:-2.4s]' },
];

// 첫 진입 시 MAP 핀처럼 아래에서 커지며 통통 튀어 올라온다.
const POP_INITIAL = { opacity: 0, y: 12, scale: 0.5 };
const POP_ANIMATE = { opacity: 1, y: 0, scale: 1 };
const POP_TRANSITION = { type: 'spring', stiffness: 500, damping: 22 } as const;

// 마우스를 올리면 살짝 커지며 좌우로 갸웃한다.
const HOVER = { scale: 1.1, rotate: [0, -8, 8, -5, 5, 0] };
const HOVER_TRANSITION = {
  scale: { type: 'spring', stiffness: 400, damping: 15 },
  rotate: { duration: 0.5, ease: 'easeInOut' },
} as const;

// 넓은 화면에서 모바일 폭 컨테이너 바깥의 빈 배경을 채우는 장식(시안 데탑이미지.png): 좌상단 미니 캐릭터 3개, 우하단 로고.
// 뷰포트에 고정되어 스크롤과 무관하다. 레이어는 클릭을 막지 않고 캐릭터만 호버 반응을 위해 포인터 이벤트를 받는다.
// 음수 z-index로 두면 body 블록이 hit test에서 앞서 호버가 닿지 않으므로 z-0으로 둔다(사용자 리포트 2026-10-19).
// 중앙 440px 컨테이너와 겹치지 않는 xl(1280px)부터 모서리 40px 안쪽에 두고, 2xl(1536px)부터 시안대로 80px 안쪽에 둔다.
// 페이지 슬라이드(View Transition) 때 함께 밀리지 않도록 root 스냅샷에서 분리한다.
// RootLayout에서 한 번만 마운트되므로 등장 애니메이션은 첫 진입·새로고침 때만 재생된다.
// 등장·호버(motion)는 각각 감싸는 div의 transform을, 둥실(CSS keyframes)은 img의 transform을 써 서로 충돌하지 않는다.
const DesktopDecoration = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden [view-transition-name:desktop-decoration] xl:block"
    >
      <div className="absolute top-10 left-10 flex items-center gap-10 2xl:top-20 2xl:left-20">
        {CHARACTERS.map(({ src, floatClassName }, index) => (
          <motion.div
            key={src}
            initial={shouldReduceMotion ? false : POP_INITIAL}
            animate={POP_ANIMATE}
            transition={{ ...POP_TRANSITION, delay: index * REVEAL_STAGGER }}
          >
            {/* 등장(delay 포함)과 호버는 transition이 달라 요소를 나눈다 */}
            <motion.div
              className="pointer-events-auto"
              whileHover={shouldReduceMotion ? undefined : HOVER}
              transition={HOVER_TRANSITION}
            >
              <img
                src={src}
                alt=""
                className={`motion-safe:animate-float w-22 ${floatClassName}`}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="absolute right-10 bottom-10 flex flex-col items-end 2xl:right-20 2xl:bottom-20">
        {/* 전시 문구는 애니메이션 없이 고정(사용자 요청 2026-10-19). 글자색은 logo-nexus.svg의 fill(#0A233F)과 맞춘다(테마 navy-100 #1B2541과 다름).
            로고 SVG(240×60)는 글자가 오른쪽 10px·위 14px 안쪽에서 끝나므로, 문구 오른쪽 끝을 글자 끝에 맞추려고 mr-2.5를 주고 세로 간격은 그 여백에 맡긴다. */}
        <p className="text-semibold-16 mr-2.5 text-[#0a233f]">
          덕성여자대학교 IT미디어공학전공 제 14회 졸업 전시회
        </p>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: CHARACTERS.length * REVEAL_STAGGER }}
          className="relative h-15 w-60"
        >
          <LogoNexus className="h-full w-full" />
          {/* 로고 글자 모양으로 마스킹한 흰 빛줄기가 반복해서 훑고 지나간다(반짝임). 마스크 URL은 import 값이라 CSS 변수로 넘긴다. */}
          <div
            className="motion-safe:animate-shimmer absolute inset-0 bg-[linear-gradient(105deg,transparent_45%,rgb(255_255_255/80%)_50%,transparent_55%)] mask-(--logo-mask) bg-size-[300%_100%] bg-no-repeat mask-contain mask-center mask-no-repeat"
            style={{ '--logo-mask': `url(${logoNexusUrl})` } as CSSProperties}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DesktopDecoration;
