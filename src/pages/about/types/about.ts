// 소개 문단의 한 구간. bold가 true면 <strong>으로 강조한다.
export interface TextSegment {
  text: string;
  bold?: boolean;
}

export interface ScheduleRow {
  date: string;
  time: string;
}

export interface QuickLink {
  label: string;
  url: string;
  icon: 'duksung' | 'instagram';
}

export interface CommitteeMember {
  role: string;
  name: string;
}
