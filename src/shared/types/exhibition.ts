// docs/api-spec.md 1장(정적 데이터 exhibition.json) 구조
export interface Team {
  id: string;
  name: string;
  memberIds: string[]; // Student.id[]
  workIds: string[]; // Work.id[]
}

export interface Student {
  id: string;
  name: string;
  teamId: string; // Team.id
  image: string; // 파일명. 경로는 shared/utils/image.ts에서 조합
  role: string;
  workIds: string[]; // Work.id[]
}

export interface Work {
  id: string;
  category: string; // "웹/앱" | "게임" | "VR" (복수일 때 "웹/앱, VR"처럼 쉼표 구분)
  title: string;
  teamId: string; // Team.id
  image: string; // 파일명
  summary: string;
  keywords: string[];
  description: string; // 줄바꿈 \n 포함
  purpose: string; // 줄바꿈 \n 포함
  memberIds: string[]; // Student.id[]
}

export interface Exhibition {
  version: number;
  teams: Team[];
  students: Student[];
  works: Work[];
}
