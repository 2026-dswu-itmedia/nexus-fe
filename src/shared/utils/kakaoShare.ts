const KAKAO_SDK_SCRIPT_ID = 'kakao-js-sdk';
const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
// 2.8.3 배포 파일의 SRI 해시. 버전을 올리면 함께 갱신한다.
const KAKAO_SDK_INTEGRITY =
  'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';

// SDK를 처음 공유할 때 한 번만 로드하고 초기화한다. 로드 중 재호출은 같은 Promise를 돌려준다.
let sdkReady: Promise<void> | null = null;

const loadKakaoSdk = (): Promise<void> => {
  if (sdkReady) return sdkReady;

  sdkReady = new Promise<void>((resolve, reject) => {
    const appKey = import.meta.env.VITE_KAKAO_JS_KEY;
    if (!appKey) {
      reject(new Error('VITE_KAKAO_JS_KEY가 설정되지 않았습니다'));
      return;
    }

    const initialize = () => {
      if (!Kakao.isInitialized()) Kakao.init(appKey);
      resolve();
    };

    if (typeof Kakao !== 'undefined') {
      initialize();
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_URL;
    script.integrity = KAKAO_SDK_INTEGRITY;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.addEventListener('load', initialize, { once: true });
    script.addEventListener('error', () => reject(new Error('카카오 SDK 로드 실패')), {
      once: true,
    });
    document.head.appendChild(script);
  });

  // 실패하면 다음 클릭에서 다시 시도할 수 있게 캐시를 비운다.
  sdkReady.catch(() => {
    sdkReady = null;
  });

  return sdkReady;
};

// 카카오 디벨로퍼스에 등록한 메시지 템플릿으로 카카오톡 공유를 연다.
// 모바일은 카카오톡 앱, 데스크톱은 QR·로그인 팝업이 뜬다. 키 미설정·로드 실패 시 reject.
export const shareKakaoTemplate = async (
  templateId: number,
  templateArgs?: Record<string, string>,
): Promise<void> => {
  await loadKakaoSdk();
  Kakao.Share.sendCustom({ templateId, templateArgs });
};
