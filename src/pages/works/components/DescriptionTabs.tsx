import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

type DescriptionTabKey = 'description' | 'purpose';

const TABS: { key: DescriptionTabKey; label: string }[] = [
  { key: 'description', label: '작품 소개' },
  { key: 'purpose', label: '기획 의도' },
];

const PANEL_CLASS = 'text-regular-14 text-subtext-500 mt-5 whitespace-pre-line';

interface DescriptionTabsProps {
  description: string;
  purpose: string;
}

const DescriptionTabs = ({ description, purpose }: DescriptionTabsProps) => {
  const [activeTab, setActiveTab] = useState<DescriptionTabKey>('description');
  const shouldReduceMotion = useReducedMotion();
  const content = activeTab === 'description' ? description : purpose;

  return (
    <section>
      <div role="tablist" className="border-navy-025 grid h-10 grid-cols-2 border-[0.5px]">
        {TABS.map(({ key, label }) => {
          const isActive = key === activeTab;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(key)}
              className={`text-semibold-16 transition-colors ${isActive ? 'bg-navy-100 text-white-100' : 'bg-white-100 text-navy-075'}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {shouldReduceMotion ? (
        <p role="tabpanel" className={PANEL_CLASS}>
          {content}
        </p>
      ) : (
        // 탭을 바꾸면 이전 본문이 흐려진 뒤(mode="wait") 새 본문이 살짝 떠오르며 나타난다.
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={activeTab}
            role="tabpanel"
            className={PANEL_CLASS}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {content}
          </motion.p>
        </AnimatePresence>
      )}
    </section>
  );
};

export default DescriptionTabs;
