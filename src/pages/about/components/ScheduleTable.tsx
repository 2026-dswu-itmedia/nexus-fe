import Reveal from '@/shared/components/Reveal';
import { SCHEDULE } from '@/pages/about/constants/about';
import { Fragment } from 'react';

// 행마다 순서대로 떠오르는 간격(초)
const ROW_STAGGER = 0.1;

const ScheduleTable = () => {
  return (
    <section aria-label="전시 일정" className="grid grid-cols-2 gap-x-4 gap-y-2">
      {SCHEDULE.map(({ date, time }, rowIndex) => (
        <Fragment key={date}>
          <Reveal
            delay={rowIndex * ROW_STAGGER}
            className="bg-navy-100 text-regular-14 text-white-100 flex items-center justify-center py-2"
          >
            {date}
          </Reveal>
          <Reveal
            delay={rowIndex * ROW_STAGGER}
            className="border-border bg-white-100 text-regular-14 flex items-center justify-center border py-2 text-black"
          >
            {time}
          </Reveal>
        </Fragment>
      ))}
    </section>
  );
};

export default ScheduleTable;
