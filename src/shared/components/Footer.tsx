// ABOUT 페이지에서만 렌더한다. 레이아웃 main의 px-5 안에 들어가므로 -mx-5로 화면 전체 너비를 쓴다.
const Footer = () => {
  return (
    <footer className="bg-subtext-500 -mx-5 px-5 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <p className="text-semibold-14 text-white-075">2026 덕성여자대학교 IT미디어공학전공</p>
      <p className="text-semibold-14 text-white-075">제14회 졸업전시회 웹사이트</p>
      <p className="text-regular-12 text-white-025 mt-1">
        © 2026. IT Media Engineering all rights reserved.
      </p>
      <p className="text-regular-12 text-white-050 mt-4">Developed by 김시연 목소연 송은지</p>
    </footer>
  );
};

export default Footer;
