import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SectionTitleProps {
  title: string; // 예: "SPONSOR"
  subtitle: string; // 예: "협찬 물품". 제목과 baseline을 맞춘다
  description: string; // 두 줄 설명. 줄바꿈 \n 포함
  to?: string; // 있으면 제목 행 전체가 링크가 되고 우측에 chevron이 붙는다 (EVENT 홈 PARTNER → /event/partner)
}

const SectionTitle = ({ title, subtitle, description, to }: SectionTitleProps) => {
  const heading = (
    <>
      <h2 className="text-semibold-24 text-black">{title}</h2>
      <span className="text-regular-14 text-subtext-700">{subtitle}</span>
    </>
  );

  return (
    <div>
      {to ? (
        <Link to={to} viewTransition className="flex items-center gap-3">
          {heading}
          <ChevronRight
            className="text-subtext-900 ml-auto size-6 shrink-0 self-center"
            aria-hidden="true"
          />
        </Link>
      ) : (
        <div className="flex items-center gap-3">{heading}</div>
      )}
      <p className="text-regular-14 text-subtext-500 mt-3 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default SectionTitle;
