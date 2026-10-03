import homeAnimation from '@/shared/assets/lottie/home-animation.lottie?url';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// 상단 키비주얼. 애니메이션 원본 크기 600×840(5:7)에 맞춰 영역을 잡는다.
// 포스터가 떨어져 자리잡는 연출이라 manifest의 loop: false를 그대로 두고 한 번만 재생한다.
const HeroGraphic = () => {
  return (
    <div className="aspect-5/7 w-full" role="img" aria-label="NEX:US 전시 키비주얼">
      <DotLottieReact src={homeAnimation} autoplay />
    </div>
  );
};

export default HeroGraphic;
