import GoLinkIcon from '@/shared/assets/icons/ic-go-link-24.svg?react';
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-regular-14 flex items-center gap-1 px-4 py-2 ${VARIANT_CLASS[variant].row}`}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      <GoLinkIcon className={`text-subtext-700 size-5 shrink-0`} aria-hidden="true" />
    </a>
  );
};

export default LinkRow;
