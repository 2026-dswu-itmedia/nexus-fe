import notFoundGraphic from '@/shared/assets/images/graphic/img-404-graphic.svg';
import Button from '@/shared/components/Button';
import Reveal from '@/shared/components/Reveal';
import { REVEAL_STAGGER } from '@/shared/constants/motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 라우터 `*` 경로와 존재하지 않는 ID의 상세 페이지에서 사용한다. 레이아웃 없이 단독으로 렌더된다.
const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="max-w-mobile bg-ivory-bg shadow-mobile-frame mx-auto flex min-h-dvh flex-col px-5 py-10">
      {/* 다른 페이지처럼 그래픽 → 버튼 순서로 떠오른다 */}
      <div className="flex flex-1 items-center justify-center">
        <Reveal>
          <img src={notFoundGraphic} alt="페이지를 찾을 수 없습니다" className="w-[10.75rem]" />
        </Reveal>
      </div>
      <Reveal delay={REVEAL_STAGGER}>
        <Button onClick={handleHomeClick} icon={<ChevronRight className="size-6" />}>
          NEX:US 홈페이지 바로가기
        </Button>
      </Reveal>
    </div>
  );
};

export default NotFound;
