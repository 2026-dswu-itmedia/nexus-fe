import LogoNexus from '@/shared/assets/logos/logo-nexus.svg?react';
import { GNB_MENUS } from '@/shared/constants/navigation';
import { animate } from 'motion';
import type { AnimationPlaybackControls } from 'motion';
import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// 이 거리(px) 이상 끌었으면 드래그로 보고, 놓을 때 탭 클릭(이동)을 막는다.
const DRAG_THRESHOLD = 5;

const TopNavigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ isDragging: false, hasMoved: false, startX: 0, startScrollLeft: 0 });
  const wheelAnimationRef = useRef<AnimationPlaybackControls | null>(null);
  const { pathname } = useLocation();

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

  return (
    <header className="bg-ivory-bg shadow-gnb sticky top-0 z-10">
      <div className="flex justify-center py-3">
        <LogoNexus className="h-[1.875rem] w-auto" role="img" aria-label="NEX:US" />
      </div>
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
    </header>
  );
};

export default TopNavigation;
