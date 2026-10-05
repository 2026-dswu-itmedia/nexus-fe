// <a download>로 브라우저 다운로드를 건다. 데스크톱과 안드로이드 Chrome은 파일로 저장된다.
const downloadByAnchor = (url: string, fileName: string) => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
};

// 터치 기기(휴대폰·태블릿)인지. 데스크톱 Chrome도 Web Share를 지원하지만 OS 공유창이 떠서 저장과 거리가 멀다.
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

// 쿠폰 이미지를 기기에 저장한다.
// iOS Safari는 download 속성을 무시하고 이미지를 새 탭에 열기 때문에, 터치 기기에서 파일 공유가 가능하면
// 공유 시트(사진에 저장)를 먼저 띄우고, 그 밖에는 앵커 다운로드로 처리한다. 사용자가 공유 시트를 닫으면 아무것도 하지 않는다.
export const saveCouponImage = async (url: string, fileName: string) => {
  if (isTouchDevice() && typeof navigator.canShare === 'function') {
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], fileName, { type: blob.type || 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      // 공유에 실패하면 아래 다운로드로 넘어간다.
    }
  }
  downloadByAnchor(url, fileName);
};
