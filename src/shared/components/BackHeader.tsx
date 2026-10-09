import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface BackHeaderProps {
  title?: string;
  variant?: 'light' | 'dark';
  // 앱 안에서 이동해 온 기록이 없을 때(공유 링크·현장 QR로 바로 진입) 보낼 상위 화면.
  fallbackTo?: string;
}

const BackHeader = ({ title, variant = 'light', fallbackTo = '/' }: BackHeaderProps) => {
  const navigate = useNavigate();

  // window.history.length는 사이트 밖(QR 스캐너·인앱 브라우저) 기록까지 세므로, 라우터가 history.state에 두는
  // 앱 내 위치(idx, 첫 진입 0이고 replace로는 그대로)로 앱 안의 이전 화면이 있는지 판단한다.
  // 없으면 상위 화면으로 replace 이동해 브라우저 뒤로가기로 이 화면에 다시 돌아오지 않게 한다.
  // 뒤로가기(-1)는 들어올 때 viewTransition으로 이동했다면 라우터가 전환을 다시 적용한다.
  const handleBackClick = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (historyIndex > 0) {
      navigate(-1);
    } else {
      navigate(fallbackTo, { replace: true, viewTransition: true });
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
