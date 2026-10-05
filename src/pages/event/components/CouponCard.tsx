import CouponActionButton from '@/pages/event/components/CouponActionButton';
import type { Coupon } from '@/pages/event/types/coupon';
import type { Partner } from '@/pages/event/types/event';

// ISO 날짜를 시안 표기 "YYYY/MM/DD"(기기 시간대 기준)로 바꾼다.
const formatCouponDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}/${month}/${day}`;
};

interface CouponCardProps {
  partner: Partner;
  // null이면 아직 QR 인증을 하지 않은 상태. 내용을 흐리게 가리고 가운데에 "QR 스캔하러 가기"를 띄운다.
  coupon: Coupon | null;
}

// 흰 쿠폰 카드. 점선 양끝의 반원 notch는 카드 테두리 위에 올린 네이비 원이다(카드 p-5 바깥 20px 지점이 중심).
// 미인증 상태(시안 Brand=*, Status=Disabled)에서도 점선과 notch는 선명하게 두고 글자·아이콘만 blur-coupon으로 가린다.
const CouponCard = ({ partner, coupon }: CouponCardProps) => {
  const isLocked = coupon === null;
  const isExpired = coupon?.status === 'EXPIRED';
  const lockedClass = isLocked ? 'blur-coupon select-none' : '';

  return (
    <article className="bg-white-100 relative p-5 text-center">
      <div className={lockedClass} aria-hidden={isLocked || undefined}>
        <img src={partner.icon} alt="" className="mx-auto size-14" />
        <p className="text-semibold-16 text-subtext-700 mt-1">{partner.name}</p>
        <p className="text-semibold-24 text-navy-100 mt-1">{partner.benefit}</p>
      </div>
      {/* 점선은 카드 패딩을 상쇄해(-mx-5) 가장자리까지 긋고, 그 위에 올린 notch 원이 양끝을 덮어 원에서 원까지 이어져 보인다. */}
      <div className="relative -mx-5 mt-8" aria-hidden="true">
        <div className="h-0.5 bg-[linear-gradient(to_right,var(--color-navy-100)_50%,transparent_50%)] bg-[length:8px_2px] bg-repeat-x" />
        <span className="bg-navy-100 absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full" />
        <span className="bg-navy-100 absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full" />
      </div>
      <div
        className={`mt-5 flex items-center justify-between gap-2 ${lockedClass}`}
        aria-hidden={isLocked || undefined}
      >
        <p className="text-regular-12 text-subtext-900">
          유효기간
          {coupon ? (
            <time
              dateTime={coupon.expiresAt}
              className="text-semibold-14 text-subtext-500 ml-2 whitespace-nowrap"
            >
              ~ {formatCouponDate(coupon.expiresAt)}
            </time>
          ) : (
            <span className="text-semibold-14 text-subtext-500 ml-2 whitespace-nowrap">
              ~ YYYY/MM/DD
            </span>
          )}
        </p>
        <p className="text-regular-12 text-subtext-900 shrink-0">
          {isExpired ? '기간 만료' : partner.usageNote}
        </p>
      </div>
      {isLocked && (
        // 카드 전체 기준 정중앙에 버튼을 올린다. Step 안내 페이지로 보낸다.
        <div className="absolute inset-0 flex items-center justify-center">
          <CouponActionButton to="/event/partner">QR 스캔하러 가기</CouponActionButton>
        </div>
      )}
    </article>
  );
};

export default CouponCard;
