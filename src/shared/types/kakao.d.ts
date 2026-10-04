// Kakao JavaScript SDK v2 전역 객체 중 이 프로젝트가 쓰는 부분만 선언한다.
// @types/kakao-js-sdk는 v1(Kakao.Link) 기준이라 쓰지 않는다.
interface KakaoShareCustomSettings {
  templateId: number;
  templateArgs?: Record<string, string>;
  installTalk?: boolean;
  serverCallbackArgs?: Record<string, string> | string;
}

interface KakaoSdk {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendCustom: (settings: KakaoShareCustomSettings) => void;
  };
}

declare const Kakao: KakaoSdk;
