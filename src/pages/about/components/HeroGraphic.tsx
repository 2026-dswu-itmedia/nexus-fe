import homeAnimation from '@/shared/assets/lottie/home-animation.json?url';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// 상단 키비주얼. 애니메이션 원본 크기 1420×2000(71:100)에 맞춰 영역을 잡는다.
// 애셋이 화면 가장자리까지 차는 연출이라 MainLayout main의 px-5를 -mx-5로 상쇄해 좌우 여백 없이 꽉 채운다.
// 포스터가 쌓여 자리잡는 연출을 계속 반복 재생한다.
const HeroGraphic = () => {
  return (
    <div className="-mx-5 aspect-71/100" role="img" aria-label="NEX:US 전시 키비주얼">
      <DotLottieReact src={homeAnimation} autoplay loop />
    </div>
  );
};

export default HeroGraphic;
