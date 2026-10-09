import GoLinkIcon from '@/shared/assets/icons/ic-go-link-24.svg?react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface LinkRowProps {
  href: string;
  label: string;
  icon: ReactNode;
  variant?: 'light' | 'dark';
}

const VARIANT_CLASS = {
  light: {
    row: 'border border-border bg-white-100 text-navy-100',
  },
  dark: {
    row: 'bg-white-075 text-black',
  },
} as const;

const LinkRow = ({ href, label, icon, variant = 'light' }: LinkRowProps) => {
  return (
    // 다른 목록 행(WorkListItem 등)처럼 누르는 동안 살짝 줄어드는 피드백을 준다.
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileTap={{ scale: 0.98 }}
      className={`text-regular-14 flex items-center gap-1 px-4 py-2 ${VARIANT_CLASS[variant].row}`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      <GoLinkIcon className={`text-subtext-700 size-5 shrink-0`} aria-hidden="true" />
    </motion.a>
  );
};

export default LinkRow;
