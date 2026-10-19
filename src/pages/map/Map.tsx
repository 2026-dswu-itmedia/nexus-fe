import BoothMap from '@/pages/map/components/BoothMap';
import StudioFloorPlan from '@/pages/map/components/StudioFloorPlan';
import { BOOTHS, getBoothWorkIds } from '@/pages/map/constants/booths';
import type { Booth, FloorPlanArea } from '@/pages/map/types/booth';
import WorkList from '@/shared/components/WorkList';
import { FADE_TRANSITION } from '@/shared/constants/motion';
import useIsViewTransitioning from '@/shared/hooks/useIsViewTransitioning';
import useSkipEntranceMotion from '@/shared/hooks/useSkipEntranceMotion';
import { getWorks, getWorksByIds } from '@/shared/utils/exhibition';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const WORKS = getWorks();

// 자동 스크롤 후 내부 약도 위에 남기는 여백(px). 약도의 mt-6(24px)과 같다.
const FLOOR_PLAN_SCROLL_GAP = 24;

const findBoothById = (id: string | null) => BOOTHS.find((booth) => booth.id === id);

const findBoothByWorkId = (workId: string | null) =>
  workId === null ? undefined : BOOTHS.find((booth) => getBoothWorkIds(booth).includes(workId));

const Map = () => {
  // 선택은 URL 쿼리(?booth=studio-4&work=hearing)가 기준이다. 상태를 따로 두면 상세에서 뒤로 돌아올 때
  // 처음 진입한 쿼리로 되돌아가고, GNB로 다시 들어와도 이전 선택이 남는다(WORKS 필터와 같은 이유).
  // WORKS 상세의 위치 아이콘은 ?work=만 넘기고, 그 작품이 있는 부스는 여기서 찾는다.
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldSkipEntrance = useSkipEntranceMotion();
  const shouldReduceMotion = useReducedMotion();
  const floorPlanRef = useRef<HTMLDivElement>(null);
  // 부스를 "클릭해서" 내부 약도가 뜰 때만 스크롤한다. ?work= 직접 진입이나 뒤로가기 복귀에는 움직이지 않는다.
  const shouldScrollToFloorPlanRef = useRef(false);
  // 작품 상세의 위치 아이콘(슬라이드 전환)으로 들어올 때는 슬라이드가 끝난 뒤에 페이드인한다.
  const isViewTransitioning = useIsViewTransitioning();
  const fadeAnimate = { opacity: !shouldSkipEntrance && isViewTransitioning ? 0 : 1 };
  const workParam = searchParams.get('work');
  const selectedBooth = findBoothById(searchParams.get('booth')) ?? findBoothByWorkId(workParam);
  // 자리 선택은 내부 약도가 있는 부스에서, 그 부스의 작품일 때만 유효하다.
  const selectedWorkId =
    workParam !== null &&
    selectedBooth?.floorPlan &&
    getBoothWorkIds(selectedBooth).includes(workParam)
      ? workParam
      : null;

  // replace: 부스를 고를 때마다 히스토리가 쌓이지 않게. preventScrollReset: 쿼리가 바뀔 때 맨 위로 튀지 않게.
  const updateSelection = (boothId: string | null, workId: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (boothId) {
          next.set('booth', boothId);
        } else {
          next.delete('booth');
        }
        if (workId) {
          next.set('work', workId);
        } else {
          next.delete('work');
        }
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  // 작품이 하나인 부스도 바로 이동하지 않고 하단 목록에서 고르게 한다(사용자 결정 2026-10-05).
  // 같은 부스를 다시 누르면 선택이 풀려 전체 목록으로 돌아가고, 부스가 바뀌면 자리 선택도 풀린다.
  const handleBoothClick = (booth: Booth) => {
    const isDeselecting = selectedBooth?.id === booth.id;
    shouldScrollToFloorPlanRef.current = !isDeselecting && booth.floorPlan !== undefined;
    updateSelection(isDeselecting ? null : booth.id, null);
  };

  // 내부 약도가 화면 아래에 생기면 사용자가 모를 수 있어, 약도가 화면 상단에 오도록 스크롤해 알린다(사용자 요청 2026-10-19).
  // 아래로 스크롤하면 GNB가 로고 줄만 남기고 접히므로(TopNavigation) 로고 줄 높이만 피하고,
  // 위로 스크롤할 때는 탭 줄까지 다시 펼쳐지므로 GNB 전체 높이만큼 더 올려 약도를 가리지 않게 한다.
  useEffect(() => {
    const floorPlan = floorPlanRef.current;
    if (!shouldScrollToFloorPlanRef.current || !floorPlan) return;
    shouldScrollToFloorPlanRef.current = false;

    const header = document.querySelector('header');
    const floorPlanTop = floorPlan.getBoundingClientRect().top + window.scrollY;
    let top = floorPlanTop - FLOOR_PLAN_SCROLL_GAP;
    const isScrollingUp = top - (header?.offsetHeight ?? 0) < window.scrollY;
    const stickyHeight = isScrollingUp
      ? (header?.offsetHeight ?? 0)
      : ((header?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0);
    top -= stickyHeight;
    window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  }, [selectedBooth?.id, shouldReduceMotion]);

  const handleAreaClick = (area: FloorPlanArea) => {
    updateSelection(selectedBooth?.id ?? null, selectedWorkId === area.workId ? null : area.workId);
  };

  // 자리 선택 → 그 작품 1개, 부스 선택 → 부스의 작품들, 선택 없음 → 전체.
  const listedWorks = selectedWorkId
    ? getWorksByIds([selectedWorkId])
    : selectedBooth
      ? getWorksByIds(getBoothWorkIds(selectedBooth))
      : WORKS;

  return (
    <div className="flex flex-1 flex-col pt-6 pb-6">
      {/* 진입 시 배치도가 페이드인된다. OS의 "동작 줄이기"가 켜져 있거나 뒤로 가기로 돌아오면 바로 보여준다. */}
      <motion.div
        initial={shouldSkipEntrance ? false : { opacity: 0 }}
        animate={fadeAnimate}
        transition={FADE_TRANSITION}
      >
        <BoothMap
          booths={BOOTHS}
          selectedBoothId={selectedBooth?.id ?? null}
          onBoothClick={handleBoothClick}
        />
      </motion.div>
      {/* 작품이 여럿인 스튜디오(2·3·4)는 내부 약도를 띄운다. 부스가 바뀌면 key로 다시 마운트되어 다시 페이드인된다.
          아래 WorkList도 key로 재마운트하므로, 형제끼리 key가 겹치지 않게 접두어를 붙인다(겹치면 React가 이전 패널을 못 지운다). */}
      {selectedBooth?.floorPlan && (
        <motion.div
          key={`floor-plan:${selectedBooth.id}`}
          ref={floorPlanRef}
          className="mt-6"
          initial={shouldSkipEntrance ? false : { opacity: 0 }}
          animate={fadeAnimate}
          transition={FADE_TRANSITION}
        >
          <StudioFloorPlan
            floorPlan={selectedBooth.floorPlan}
            selectedWorkId={selectedWorkId}
            onAreaClick={handleAreaClick}
          />
        </motion.div>
      )}
      {/* 선택이 바뀌면 목록을 다시 마운트해 행이 다시 올라오게 한다. */}
      <WorkList
        key={`list:${selectedWorkId ?? selectedBooth?.id ?? 'all'}`}
        works={listedWorks}
        emptyMessage="작품이 없습니다"
        className="mt-10"
      />
    </div>
  );
};

export default Map;
