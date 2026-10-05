import CouponRow from '@/pages/event/components/CouponRow';
import SectionTitle from '@/pages/event/components/SectionTitle';
import StepCard from '@/pages/event/components/StepCard';
import Toast from '@/pages/event/components/Toast';
import { PARTNERS } from '@/pages/event/constants/partners';
import useIssueCoupon from '@/pages/event/hooks/useIssueCoupon';
import useMyCoupon from '@/pages/event/hooks/useMyCoupon';
import { getCouponErrorMessage } from '@/pages/event/utils/couponError';
import BackHeader from '@/shared/components/BackHeader';
import Reveal from '@/shared/components/Reveal';
import { FADE_TRANSITION, ROW_STAGGER } from '@/shared/constants/motion';
import { LoaderCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// 현장 QR이 여는 URL의 토큰 파라미터명. 백엔드와 확정 전 가정값(docs/work-plan.md 확인 필요).
const QR_TOKEN_PARAM = 'qrToken';

// 제목 → 1단계 → 2단계 카드가 순서대로 떠오르는 간격(초). 다른 페이지의 Reveal stagger와 같다.
const SECTION_STAGGER = 0.1;

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

// 시안(Partner] Step1/Step2/Loading.png) 측정값: 헤더 아래 24px, 설명→카드 40px, 카드 간격 8px.
const Partner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const qrToken = searchParams.get(QR_TOKEN_PARAM);
  const [issueToast, setIssueToast] = useState<ToastState | null>(null);
  // StrictMode의 effect 재실행이나 리렌더로 같은 토큰을 두 번 보내지 않게 한다.
  const issuedTokenRef = useRef<string | null>(null);

  const { mutate: issueCoupon, isPending: isIssuing } = useIssueCoupon();
  // 토큰으로 발급 중일 때는 조회를 멈춘다. 발급이 끝나면 토큰이 URL에서 빠지면서 조회가 켜지는데,
  // 성공 시에는 setQueryData로 넣은 쿠폰이 fresh라 다시 요청하지 않고, 실패 시에만 기존 발급 여부를 조회한다.
  const { data: coupon, isLoading: isCheckingCoupon, error: checkError } = useMyCoupon(!qrToken);

  useEffect(() => {
    if (!qrToken || issuedTokenRef.current === qrToken) return;
    issuedTokenRef.current = qrToken;

    issueCoupon(qrToken, {
      onSuccess: () => setIssueToast({ type: 'success', message: 'QR 인증이 완료되었습니다' }),
      onError: (error) => setIssueToast({ type: 'error', message: getCouponErrorMessage(error) }),
      // 새로고침해도 다시 발급 요청을 보내지 않도록 토큰을 URL에서 지운다.
      onSettled: () =>
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete(QR_TOKEN_PARAM);
            return next;
          },
          { replace: true },
        ),
    });
  }, [qrToken, issueCoupon, setSearchParams]);

  const isChecking = isIssuing || isCheckingCoupon;
  const hasCoupon = coupon != null;
  // 발급·조회 중에는 2단계 카드 안에 스피너를 보여주고(Loading.png), 쿠폰이 있으면 2단계, 없으면 1단계가 활성이다.
  const activeStep = isChecking || hasCoupon ? 2 : 1;

  // 발급 결과 토스트가 우선이고, 없을 때만 조회 실패를 알린다. 토스트는 3초 뒤 스스로 사라진다.
  const toast =
    issueToast ??
    (checkError ? { type: 'error' as const, message: getCouponErrorMessage(checkError) } : null);

  return (
    <>
      <BackHeader />
      {/* 다른 페이지와 같은 진입 애니메이션: 제목·1단계·2단계가 0.1초 간격으로 떠오르고,
          2단계 안의 매장 행은 목록(WorkList)처럼 조회가 끝난 뒤 위에서부터 차례로 올라온다. */}
      <div className="flex flex-1 flex-col pt-6 pb-10">
        <Reveal>
          <SectionTitle
            title="PARTNER"
            subtitle="제휴 매장"
            description={'현장 QR을 스캔하고\n전시장 근처 매장에서 할인받으세요'}
          />
        </Reveal>
        <ol className="mt-10 flex flex-col gap-2">
          <li>
            <Reveal delay={SECTION_STAGGER}>
              <StepCard
                step={1}
                title="제휴부스를 방문해 현장 QR을 스캔해보세요"
                isActive={activeStep === 1}
              />
            </Reveal>
          </li>
          <li>
            <Reveal delay={SECTION_STAGGER * 2}>
              <StepCard step={2} title="사용할 쿠폰을 골라주세요" isActive={activeStep === 2}>
                <div className="mt-5">
                  {isChecking ? (
                    // 목록 3행과 같은 높이를 유지해 카드 크기가 바뀌지 않게 한다.
                    <div className="flex min-h-56.5 items-center justify-center">
                      <LoaderCircle
                        className="text-navy-100 size-8 animate-spin"
                        aria-label="쿠폰 확인 중"
                      />
                    </div>
                  ) : (
                    <ul>
                      {PARTNERS.map((partner, index) =>
                        shouldReduceMotion ? (
                          <li key={partner.id}>
                            <CouponRow partner={partner} isEnabled={hasCoupon} />
                          </li>
                        ) : (
                          <motion.li
                            key={partner.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...FADE_TRANSITION, delay: index * ROW_STAGGER }}
                          >
                            <CouponRow partner={partner} isEnabled={hasCoupon} />
                          </motion.li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              </StepCard>
            </Reveal>
          </li>
        </ol>
      </div>
      {toast && <Toast key={toast.message} type={toast.type} message={toast.message} />}
    </>
  );
};

export default Partner;
