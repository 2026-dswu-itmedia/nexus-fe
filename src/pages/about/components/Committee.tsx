import Reveal from '@/shared/components/Reveal';
import { COMMITTEE_MEMBERS } from '@/pages/about/constants/about';

// 제목 바 다음부터 행마다 순서대로 떠오르는 간격(초)
const ROW_STAGGER = 0.1;

// 시안처럼 위 행이 아래 행의 모서리를 덮도록 앞 행일수록 z-index가 높다.
// Reveal의 transform이 행마다 쌓임 맥락을 만들어, 지정하지 않으면 뒤 행이 위에 그려진다.
const ROW_Z_CLASSES = ['z-30', 'z-20', 'z-10'] as const;

const Committee = () => {
  return (
    <section className="flex flex-col gap-5">
      <Reveal>
        <h2 className="bg-navy-100 text-regular-14 text-white-100 flex items-center justify-center py-2">
          졸업준비위원회
        </h2>
      </Reveal>
      <ul className="flex flex-col gap-1">
        {COMMITTEE_MEMBERS.map(({ role, name }, index) => (
          <li key={`${role}-${name}`} className={ROW_Z_CLASSES[index]}>
            <Reveal
              delay={(index + 1) * ROW_STAGGER}
              // 시안처럼 가운데 행만 살짝 기울여 카드가 겹쳐 쌓인 느낌을 낸다.
              className={`border-border bg-white-100 shadow-card flex items-center justify-center gap-2 border py-2 ${
                index === 1 ? '-rotate-2' : ''
              }`}
            >
              <span className="text-regular-12 text-subtext-700">{role}</span>
              <span className="text-regular-14 text-subtext-500">{name}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Committee;
