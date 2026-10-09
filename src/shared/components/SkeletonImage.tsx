import { useEffect, useRef, useState } from 'react';

interface SkeletonImageProps {
  // getStudentImage / getWorkImage 결과. undefined면 파일이 없는 것이라 회색 placeholder만 보여준다.
  src?: string;
  alt: string;
  // 크기·비율 클래스(aspect-3/2 w-full, h-25 w-17 shrink-0 등)는 래퍼에 적용된다.
  className?: string;
  // 기본은 lazy. 첫 화면에 바로 보이는 상세 히어로·프로필은 eager로 넘긴다.
  loading?: 'lazy' | 'eager';
}

// 이미지가 로드될 때까지 회색 박스가 깜빡이고(skeleton), 로드되면 페이드인한다.
const SkeletonImage = ({ src, alt, className = '', loading = 'lazy' }: SkeletonImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 캐시된 이미지는 onLoad 핸들러가 붙기 전에 이미 완료되어 이벤트가 오지 않을 수 있으므로 직접 확인한다.
  // src가 바뀌면(같은 컴포넌트가 다른 항목을 그릴 때) 로드 상태를 다시 계산한다.
  useEffect(() => {
    const image = imageRef.current;
    setIsLoaded(image !== null && image.complete && image.naturalWidth > 0);
  }, [src]);

  const handleSettled = () => setIsLoaded(true);
  const isPending = src !== undefined && !isLoaded;

  return (
    <div
      className={`bg-navy-010 relative overflow-hidden ${isPending ? 'motion-safe:animate-pulse' : ''} ${className}`}
    >
      {src && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={handleSettled}
          onError={handleSettled}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default SkeletonImage;
