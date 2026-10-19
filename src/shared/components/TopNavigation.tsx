import LogoNexus from '@/shared/assets/logos/logo-nexus.svg?react';
import { GNB_MENUS } from '@/shared/constants/navigation';
import { animate } from 'motion';
import type { AnimationPlaybackControls } from 'motion';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// 이 거리(px) 이상 끌었으면 드래그로 보고, 놓을 때 탭 클릭(이동)을 막는다.
const DRAG_THRESHOLD = 5;

// 이보다 작은 스크롤 변화는 방향 판단에서 무시한다(손가락 떨림·관성 스크롤 끝의 미세 움직임).
const SCROLL_DIRECTION_THRESHOLD = 8;

const HIDE_TRANSITION = { duration: 0.3, ease: 'easeOut' } as const;

const TopNavigation = () => {
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ isDragging: false, hasMoved: false, startX: 0, startScrollLeft: 0 });
  const wheelAnimationRef = useRef<AnimationPlaybackControls | null>(null);
  const { pathname } = useLocation();
  const shouldReduceMotion = useReducedMotion();
  // 탭 줄을 접은 높이(px). 0이면 펼쳐진 상태. 높이 대신 transform으로 접어야 하므로 값(px)을 들고 있는다.
  const [collapsedBy, setCollapsedBy] = useState(0);

  // 아래로 스크롤하면 메뉴 탭 줄만 접어 로고(NEX:US)만 남기고, 위로 스크롤하면 다시 펼친다(사용자 요청 2026-10-19, 시안 두 번째 화면).
  // 헤더 높이 안쪽(맨 위 근처)에서는 항상 펼쳐져 있다. lastY는 마운트 시점 위치로 시작하므로
  // 뒤로가기 복귀 때 ScrollRestoration이 layout effect에서 먼저 옮겨 둔 위치를 "아래로 스크롤"로 오인하지 않는다.
  // 접을 때 헤더의 레이아웃 높이를 바꾸면(height: 0) 문서 높이가 함께 변해 페이지 아래쪽에서 브라우저가 스크롤 위치를
  // 되돌리고, 그게 다시 "위로 스크롤"로 읽혀 펼쳐지는 되먹임이 생긴다(사용자 리포트). 그래서 transform만 쓴다.
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      // iOS 바운스처럼 범위를 벗어난 값은 경계로 잘라 방향이 뒤집히지 않게 한다.
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), Math.max(maxY, 0));
      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD) return;
      lastY = y;

      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const navHeight = navRef.current?.offsetHeight ?? 0;
      setCollapsedBy(delta > 0 && y > headerHeight ? navHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 데스크톱에서 마우스 휠(세로)을 탭의 가로 스크롤로 바꾼다.
  // 휠 한 칸마다 바로 점프하면 끊겨 보이므로 목표 위치를 누적해 두고 거기까지 애니메이션한다.
  // 페이지 세로 스크롤을 막아야 하므로 passive: false 네이티브 리스너를 쓴다.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let targetScrollLeft = nav.scrollLeft;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaX !== 0 || event.deltaY === 0) return;
      event.preventDefault();

      // 애니메이션 중이 아니면(드래그 등으로 위치가 바뀌었을 수 있으므로) 현재 위치에서 다시 시작한다.
      if (!wheelAnimationRef.current) targetScrollLeft = nav.scrollLeft;
      const maxScrollLeft = nav.scrollWidth - nav.clientWidth;
      targetScrollLeft = Math.min(Math.max(targetScrollLeft + event.deltaY, 0), maxScrollLeft);

      wheelAnimationRef.current?.stop();
      wheelAnimationRef.current = animate(nav.scrollLeft, targetScrollLeft, {
        duration: 0.4,
        ease: 'easeOut',
        onUpdate: (value) => {
          nav.scrollLeft = value;
        },
        onComplete: () => {
          wheelAnimationRef.current = null;
        },
      });
    };

    nav.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      nav.removeEventListener('wheel', handleWheel);
      wheelAnimationRef.current?.stop();
    };
  }, []);

  // 마우스로 끌어서 가로 스크롤한다. 터치는 브라우저 기본 스크롤을 그대로 쓴다.
  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const nav = event.currentTarget;
    // 휠 애니메이션이 진행 중이면 드래그와 충돌하지 않도록 멈춘다.
    wheelAnimationRef.current?.stop();
    wheelAnimationRef.current = null;
    dragRef.current = {
      isDragging: true,
      hasMoved: false,
      startX: event.clientX,
      startScrollLeft: nav.scrollLeft,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag.isDragging) return;
    const deltaX = event.clientX - drag.startX;
    if (!drag.hasMoved && Math.abs(deltaX) <= DRAG_THRESHOLD) return;

    // 실제 드래그가 시작된 뒤에만 포인터를 잡는다. pointerdown에서 잡으면
    // click의 대상이 nav로 바뀌어 탭 링크 클릭이 동작하지 않는다.
    if (!drag.hasMoved) {
      drag.hasMoved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  // 드래그 끝에 발생하는 click이 탭 이동으로 이어지지 않게 캡처 단계에서 끊는다.
  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!dragRef.current.hasMoved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.hasMoved = false;
  };

  // 탭이 가로 스크롤되므로 활성 탭이 좌측 끝(padding 안쪽)에 오도록 nav만 스크롤한다.
  // scrollIntoView는 페이지 세로 스크롤까지 건드릴 수 있어 nav.scrollTo를 직접 쓴다.
  // NavLink가 활성 상태에 aria-current="page"를 붙여 주므로 그걸로 찾는다.
  useEffect(() => {
    const nav = navRef.current;
    const activeTab = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !activeTab) return;

    const paddingLeft = parseFloat(getComputedStyle(nav).paddingLeft);
    const tabLeft =
      activeTab.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;

    nav.scrollTo({ left: tabLeft - paddingLeft, behavior: 'smooth' });
  }, [pathname]);

  const hideTransition = shouldReduceMotion ? { duration: 0 } : HIDE_TRANSITION;

  return (
    // 접힘은 레이아웃을 건드리지 않는다: 헤더 전체를 탭 줄 높이만큼 위로 올리고, 로고 줄은 같은 만큼 아래로 내려
    // 제자리에 남긴다. 헤더의 배경·그림자가 함께 올라가 로고 아래에서 끝나므로 "로고만 남은 GNB"로 보이고,
    // 비워진 자리는 헤더 밖이라 아래 콘텐츠를 가리거나 클릭을 막지 않는다.
    <motion.header
      ref={headerRef}
      className="bg-ivory-bg shadow-gnb sticky top-0 z-50"
      initial={false}
      animate={{ y: -collapsedBy }}
      transition={hideTransition}
    >
      <motion.div
        className="bg-ivory-bg relative z-10 flex justify-center py-3"
        initial={false}
        animate={{ y: collapsedBy }}
        transition={hideTransition}
      >
        <Link to="/" aria-label="NEX:US 홈으로">
          <LogoNexus className="h-[1.875rem] w-auto" aria-hidden="true" />
        </Link>
      </motion.div>
      {/* 탭 줄은 로고 줄 뒤로 들어가며 흐려진다. 가로 스크롤·드래그는 안쪽 nav가 맡는다. */}
      <motion.div
        initial={false}
        animate={{ opacity: collapsedBy ? 0 : 1 }}
        transition={hideTransition}
        style={{ pointerEvents: collapsedBy ? 'none' : 'auto' }}
      >
        <nav
          ref={navRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClickCapture={handleClickCapture}
          className="scrollbar-hide flex gap-2 overflow-x-auto px-5 pt-3 pb-[0.81rem] select-none"
        >
          {GNB_MENUS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              draggable={false}
              className={({ isActive }) =>
                `text-semibold-16 shrink-0 px-3 py-2 transition duration-300 ease-out ${
                  isActive
                    ? 'bg-navy-100 text-white-100 -rotate-8'
                    : 'border-navy-010 bg-white-100 text-navy-100 border'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default TopNavigation;
