import { EXHIBITION_LOCATION } from '@/pages/about/constants/about';
import { useEffect, useRef } from 'react';

const NAVER_MAPS_SCRIPT_ID = 'naver-maps-script';
const MAP_ZOOM = 16;

// 네이버 지도 SDK는 ABOUT에서만 쓰므로 index.html이 아니라 여기서 필요할 때 로드한다.
// 이미 로드됐거나 로드 중인 script 태그가 있으면 재사용한다.
const loadNaverMaps = (clientId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof naver !== 'undefined' && naver.maps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(NAVER_MAPS_SCRIPT_ID);
    const script = existingScript ?? document.createElement('script');
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('네이버 지도 로드 실패')), {
      once: true,
    });

    if (!existingScript && script instanceof HTMLScriptElement) {
      script.id = NAVER_MAPS_SCRIPT_ID;
      script.async = true;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      document.head.appendChild(script);
    }
  });
};

const NaverMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    const container = containerRef.current;
    // 키가 없거나 로드에 실패하면 회색 영역만 남긴다(레이아웃은 유지).
    if (!clientId || !container) return;

    let isCancelled = false;
    let map: naver.maps.Map | undefined;

    loadNaverMaps(clientId)
      .then(() => {
        if (isCancelled) return;
        const position = new naver.maps.LatLng(EXHIBITION_LOCATION.lat, EXHIBITION_LOCATION.lng);
        // 시안에는 지도 컨트롤이 없으므로 숨긴다. 로고·저작권 표기는 약관상 유지한다.
        map = new naver.maps.Map(container, {
          center: position,
          zoom: MAP_ZOOM,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          mapDataControl: false,
        });
        new naver.maps.Marker({ position, map });
      })
      .catch(() => {
        // 실패 시 placeholder 유지
      });

    return () => {
      isCancelled = true;
      map?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="전시장 위치 지도"
      className="bg-border isolate aspect-4/3 w-full"
    />
  );
};

export default NaverMap;
