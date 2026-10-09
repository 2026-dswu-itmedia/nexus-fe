import MapPin from '@/pages/map/components/MapPin';
import type { Booth } from '@/pages/map/types/booth';
import MapBackground from '@/shared/assets/images/map/map-background.svg?react';

const VIEW_BOX_WIDTH = 320;
const VIEW_BOX_HEIGHT = 304;
// 라벨 두 줄("스튜디오" 10px·행간 1.3 + 숫자 12px·행간 1 = 25px)을 부스 세로 중앙에 쌓았을 때
// 각 줄의 중심이 부스 중심에서 떨어진 거리. 시안 픽셀 측정값과 일치한다.
const LABEL_OFFSET_Y = -6.5;
const NUMBER_OFFSET_Y = 6;

interface BoothMapProps {
  booths: Booth[];
  selectedBoothId: string | null;
  onBoothClick: (booth: Booth) => void;
}

// 배경(LED·대강당·협찬부스 등 클릭되지 않는 요소)은 Figma에서 export한 SVG를 한 번 깔고,
// 클릭되는 부스만 좌표 상수로 그린다. 전체를 이미지로 쓰지 않는 이유는 선택 상태를 DOM으로 바꾸기 위해서다.
// 부스 <g>에 tabIndex를 주지 않는다: Chrome은 SVG 요소를 :focus-visible이 아닌 :focus 기준으로
// outline을 그려서, 마우스 클릭만 해도 테두리가 남는다(사용자 요청으로 focus 자체를 없앴다).
const BoothMap = ({ booths, selectedBoothId, onBoothClick }: BoothMapProps) => {
  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
      className="bg-white-100 border-navy-010 h-auto w-full border select-none"
      role="group"
      aria-label="부스 배치도"
    >
      <MapBackground aria-hidden="true" />
      {booths.map((booth) => {
        const isSelected = booth.id === selectedBoothId;
        const centerX = booth.x + booth.width / 2;
        const centerY = booth.y + booth.height / 2;

        return (
          <g key={booth.id} className="cursor-pointer" onClick={() => onBoothClick(booth)}>
            <title>{`스튜디오 ${booth.number}`}</title>
            <rect
              x={booth.x}
              y={booth.y}
              width={booth.width}
              height={booth.height}
              rx={4}
              className={`transition-colors duration-200 ${isSelected ? 'fill-navy-100' : 'fill-navy-075'}`}
            />
            {isSelected ? (
              <MapPin x={centerX} y={centerY} className="text-white-100" />
            ) : (
              <>
                <text
                  x={centerX}
                  y={centerY + LABEL_OFFSET_Y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white-100 text-[0.625rem] tracking-tight"
                >
                  스튜디오
                </text>
                <text
                  x={centerX}
                  y={centerY + NUMBER_OFFSET_Y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-semibold-12 fill-white-100"
                >
                  {booth.number}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default BoothMap;
