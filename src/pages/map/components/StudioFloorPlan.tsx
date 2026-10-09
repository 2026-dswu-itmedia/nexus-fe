import MapPin from '@/pages/map/components/MapPin';
import type { FloorPlan, FloorPlanArea } from '@/pages/map/types/booth';
import { getWorkById } from '@/shared/utils/exhibition';

const VIEW_BOX_WIDTH = 320;
const VIEW_BOX_HEIGHT = 160;

interface StudioFloorPlanProps {
  floorPlan: FloorPlan;
  selectedWorkId: string | null;
  onAreaClick: (area: FloorPlanArea) => void;
}

// 스튜디오 내부 약도. 배경·자리는 토큰 색으로 직접 그리고, 입구·화살표·라벨은 Figma export(틀)를 깐다.
// BoothMap과 같은 이유로 자리에 tabIndex를 주지 않는다(Chrome이 SVG 요소의 마우스 focus에도 outline을 그린다).
const StudioFloorPlan = ({ floorPlan, selectedWorkId, onAreaClick }: StudioFloorPlanProps) => {
  const Background = floorPlan.background;

  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
      className="h-auto w-full select-none"
      role="group"
      aria-label="스튜디오 내부 약도"
    >
      <rect width={VIEW_BOX_WIDTH} height={VIEW_BOX_HEIGHT} className="fill-navy-075" />
      <Background aria-hidden="true" />
      {floorPlan.areas.map((area) => {
        const isSelected = area.workId === selectedWorkId;
        const shapeClassName = `transition-colors duration-200 ${isSelected ? 'fill-white-100' : 'fill-white-075'}`;

        // 클릭은 자리와 그 위의 핀을 함께 감싸는 g에서 받는다(핀을 눌러도 해제되게).
        return (
          <g key={area.workId} className="cursor-pointer" onClick={() => onAreaClick(area)}>
            <title>{getWorkById(area.workId)?.title ?? area.workId}</title>
            {area.shape.type === 'rect' ? (
              <rect
                x={area.shape.x}
                y={area.shape.y}
                width={area.shape.width}
                height={area.shape.height}
                rx={4}
                className={shapeClassName}
              />
            ) : (
              <path d={area.shape.d} className={shapeClassName} />
            )}
            {isSelected && <MapPin x={area.pin.x} y={area.pin.y} className="text-navy-100" />}
          </g>
        );
      })}
    </svg>
  );
};

export default StudioFloorPlan;
