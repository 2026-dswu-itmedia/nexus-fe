import homeAnimation from '@/shared/assets/lottie/home-animation.json?url';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// 상단 키비주얼. 애니메이션 원본 크기 1420×2000(71:100)에 맞춰 영역을 잡는다.
// 포스터가 쌓여 자리잡는 연출을 계속 반복 재생한다.
const HeroGraphic = () => {
  return (
    <div className="aspect-71/100 w-full" role="img" aria-label="NEX:US 전시 키비주얼">
      <DotLottieReact src={homeAnimation} autoplay loop />
    </div>
  );
};

export default HeroGraphic;
