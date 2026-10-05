import type { Booth } from '@/pages/map/types/booth';
import Studio2Background from '@/shared/assets/images/map/studio-2.svg?react';
import Studio3Background from '@/shared/assets/images/map/studio-3.svg?react';
import Studio4Background from '@/shared/assets/images/map/studio-4.svg?react';

// 배치도 좌표는 시안(360px 기준, 카드 폭 320)을 1:1로 옮긴 값이다.
// 내부 약도의 자리 좌표는 Figma export(studio-N.svg)의 블록 좌표이고, L자는 path를 그대로 가져왔다.
// 핀은 직사각형이면 중심, L자면 모서리 정사각형의 중심(시안 Click ver. 기준).
// 작품 배치는 사용자 제공 확정본(2026-10-05): 스튜디오 2 = 1~3번 부스(뭉게구름·아자·여학교의 별), 3 = 4~5번(괄호·플로우),
// 4 = 6~7번(개구락찌·Synaction), 5 = 8번(Soundspace), 6 = 9번(흰).
// 자리 위치도 사용자 확인: 2 = 아래 뭉게구름·왼쪽 여학교의 별·오른쪽 아자 / 3 = 왼쪽 플로우·오른쪽 괄호 / 4 = 아래 Synaction·오른쪽 개구락찌.
// 바꿀 때는 스튜디오 5·6은 workIds, 2·3·4는 floorPlan.areas[].workId만 고치면 된다(getBoothWorkIds가 합친다).
export const BOOTHS: Booth[] = [
  { id: 'studio-6', number: 6, x: 154, y: 8, width: 50, height: 40, workIds: ['noroon-노른'] },
  { id: 'studio-5', number: 5, x: 208, y: 8, width: 50, height: 40, workIds: ['저승명부록'] },
  {
    id: 'studio-4',
    number: 4,
    x: 262,
    y: 8,
    width: 50,
    height: 90,
    floorPlan: {
      background: Studio4Background,
      areas: [
        {
          workId: 'sync-0',
          shape: {
            type: 'path',
            d: 'M308 8C308.069 8 308.138 8.00142 308.206 8.00488C310.251 8.10865 311.891 9.7488 311.995 11.7939C311.999 11.8622 312 11.9309 312 12V92C312 94.2091 310.209 96 308 96H268C265.791 96 264 94.2091 264 92V56H184C181.791 56 180 54.2091 180 52V12C180 9.79086 181.791 8 184 8H308Z',
          },
          pin: { x: 288, y: 32 },
        },
        {
          workId: 'signbridge',
          shape: {
            type: 'path',
            d: 'M12 152C11.9309 152 11.8622 151.999 11.7939 151.995C9.74881 151.891 8.10866 150.251 8.00488 148.206C8.00142 148.138 8 148.069 8 148V68C8 65.7909 9.79086 64 12 64H52C54.2091 64 56 65.7909 56 68V104H136C138.209 104 140 105.791 140 108V148C140 150.209 138.209 152 136 152H12Z',
          },
          pin: { x: 32, y: 128 },
        },
      ],
    },
  },
  {
    id: 'studio-3',
    number: 3,
    x: 262,
    y: 102,
    width: 50,
    height: 90,
    floorPlan: {
      background: Studio3Background,
      areas: [
        {
          workId: 'hearing',
          shape: {
            type: 'path',
            d: 'M12 8C11.9309 8 11.8622 8.00142 11.7939 8.00488C9.74881 8.10865 8.10866 9.7488 8.00488 11.7939C8.00142 11.8622 8 11.9309 8 12V92C8 94.2091 9.79086 96 12 96H52C54.2091 96 56 94.2091 56 92V56H136C138.209 56 140 54.2091 140 52V12C140 9.79086 138.209 8 136 8H12Z',
          },
          pin: { x: 32, y: 32 },
        },
        {
          workId: '마음',
          shape: {
            type: 'path',
            d: 'M308 152C308.069 152 308.138 151.999 308.206 151.995C310.251 151.891 311.891 150.251 311.995 148.206C311.999 148.138 312 148.069 312 148V68C312 65.7909 310.209 64 308 64H268C265.791 64 264 65.7909 264 68V104H184C181.791 104 180 105.791 180 108V148C180 150.209 181.791 152 184 152H308Z',
          },
          pin: { x: 288, y: 128 },
        },
      ],
    },
  },
  {
    id: 'studio-2',
    number: 2,
    x: 262,
    y: 206,
    width: 50,
    height: 90,
    floorPlan: {
      background: Studio2Background,
      areas: [
        {
          workId: 'poco',
          shape: { type: 'rect', x: 8, y: 8, width: 156, height: 48 },
          pin: { x: 86, y: 32 },
        },
        {
          workId: 'blue-room',
          shape: { type: 'rect', x: 94, y: 106, width: 156, height: 48 },
          pin: { x: 172, y: 130 },
        },
        {
          workId: 'v-o',
          shape: {
            type: 'path',
            // studio2.svg는 패널이 y 10에서 시작하므로 원본 path에서 y를 10 뺐다.
            d: 'M308 8C308.069 8 308.138 8.00142 308.206 8.00488C310.251 8.10865 311.891 9.7488 311.995 11.7939C311.999 11.8622 312 11.9309 312 12V92C312 94.2091 310.209 96 308 96H268C265.791 96 264 94.2091 264 92V56H184C181.791 56 180 54.2091 180 52V12C180 9.79086 181.791 8 184 8H308Z',
          },
          pin: { x: 288, y: 32 },
        },
      ],
    },
  },
];

// 부스의 작품 목록. 내부 약도가 있으면 자리에서, 없으면 workIds에서 가져와 연결을 한 곳에만 둔다.
export const getBoothWorkIds = (booth: Booth) =>
  booth.floorPlan ? booth.floorPlan.areas.map((area) => area.workId) : booth.workIds;
