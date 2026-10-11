interface KeywordChipProps {
  label: string;
}

const KeywordChip = ({ label }: KeywordChipProps) => {
  // 시안은 0.5px지만, 칩 위치가 소수점에 걸리면 iOS Safari(3x)에서 0.5px 선이 사라지는 경우가 있어 1px로 둔다.
  return (
    <span className="bg-white-100 border-navy-025 text-regular-14 text-subtext-700 border px-2 py-1">
      {label}
    </span>
  );
};

export default KeywordChip;
