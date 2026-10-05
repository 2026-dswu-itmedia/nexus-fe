import Reveal from '@/shared/components/Reveal';
import { QUICK_LINKS } from '@/pages/about/constants/about';
import LogoDuksung from '@/shared/assets/logos/logo-duksung-24.svg?react';
import LogoInstagram from '@/shared/assets/logos/logo-instagram-24.svg?react';
import LinkRow from '@/shared/components/LinkRow';

const LINK_ICONS = {
  duksung: LogoDuksung,
  instagram: LogoInstagram,
} as const;

// 행마다 순서대로 떠오르는 간격(초)
const ROW_STAGGER = 0.1;

const QuickLinks = () => {
  return (
    <section aria-label="바로가기" className="flex flex-col gap-2">
      {QUICK_LINKS.map(({ label, url, icon }, index) => {
        const Icon = LINK_ICONS[icon];
        return (
          <Reveal key={url} delay={index * ROW_STAGGER}>
            <LinkRow
              href={url}
              label={label}
              icon={<Icon className="size-6 shrink-0" aria-hidden="true" />}
            />
          </Reveal>
        );
      })}
    </section>
  );
};

export default QuickLinks;
