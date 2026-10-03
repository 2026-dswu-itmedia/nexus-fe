import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const VARIANT_CLASS = {
  primary: 'bg-navy-100 text-white-100',
  outline: 'bg-white-100 text-navy-100',
} as const;

const Button = ({
  children,
  onClick,
  variant = 'primary',
  icon,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    // 누르는 동안 살짝 줄었다가 떼면 스프링으로 돌아온다. disabled일 때는 반응하지 않는다.
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className={`text-semibold-14 disabled:bg-subtext-900 shadow-card flex w-full items-center justify-center gap-2 py-3 ${VARIANT_CLASS[variant]}`}
    >
      {children}
      {icon}
    </motion.button>
  );
};

export default Button;
