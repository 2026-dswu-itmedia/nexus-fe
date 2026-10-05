import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface BackHeaderProps {
  title?: string;
  variant?: 'light' | 'dark';
}

const BackHeader = ({ title, variant = 'light' }: BackHeaderProps) => {
  const navigate = useNavigate();

  // 공유 링크로 상세에 바로 들어온 경우 돌아갈 곳이 없으므로 홈으로 보낸다.
  // 뒤로가기(-1)는 들어올 때 viewTransition으로 이동했다면 라우터가 전환을 다시 적용한다.
  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { viewTransition: true });
    }
  };

  return (
    <header
      className={`flex h-14 items-center gap-3 ${variant === 'dark' ? 'text-white-100' : 'text-navy-100'}`}
    >
      <motion.button
        type="button"
        onClick={handleBackClick}
        whileTap={{ scale: 0.85 }}
        aria-label="뒤로가기"
        className="-ml-1 p-1"
      >
        <ArrowLeft className="size-6" />
      </motion.button>
      {title && <h1 className="text-semibold-16">{title}</h1>}
    </header>
  );
};

export default BackHeader;
