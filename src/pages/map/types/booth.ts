import type { ComponentType, SVGProps } from 'react';

// 내부 약도의 자리 모양(패널 좌표 320×160 기준). 직사각형은 rx 4로 그리고, L자는 Figma path를 그대로 쓴다.
export type FloorPlanShape =
  | { type: 'rect'; x: number; y: number; width: number; height: number }
  | { type: 'path'; d: string };

export interface FloorPlanArea {
  workId: string; // Work.id
  shape: FloorPlanShape;
  pin: { x: number; y: number }; // 선택 시 핀 중심(패널 좌표)
}

export interface FloorPlan {
  // 입구·화살표·라벨만 남긴 틀(studio-N.svg?react). 배경과 자리는 컴포넌트가 토큰 색으로 그린다.
  background: ComponentType<SVGProps<SVGSVGElement>>;
  areas: FloorPlanArea[];
}

// 부스 배치도의 클릭 가능한 부스(스튜디오) 한 칸.
// 좌표는 BoothMap의 viewBox(320×304) 기준 px 값이다(Figma 1rem = 16px 환산).
interface BoothBase {
  id: string;
  // 라벨의 숫자 줄("스튜디오" 아래 줄)에 쓴다.
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// 작품 데이터는 exhibition.json에 있고 부스 정보는 명세에 없어서(docs/api-spec.md 1장) 작품 ↔ 부스 연결을 여기서만 관리한다.
// 연결은 한 곳에만 둔다: 내부 약도가 있는 부스는 자리(areas)가, 없는 부스는 workIds가 기준이다.
export interface SimpleBooth extends BoothBase {
  workIds: string[]; // Work.id[]
  floorPlan?: never;
}

export interface FloorPlanBooth extends BoothBase {
  floorPlan: FloorPlan;
  workIds?: never;
}

export type Booth = SimpleBooth | FloorPlanBooth;
