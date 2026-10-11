interface KeywordChipProps {
  label: string;
}

const KeywordChip = ({ label }: KeywordChipProps) => {
  // 3x 아이폰(12 Pro·14 Pro)에서 칩 위치에 따라 0.5px border의 왼쪽 선이 그려지지 않는 경우가 있어
  // 선은 안쪽 ring(box-shadow)으로 그린다. border 0.5px 자리를 padding에 더해 크기·선 위치를 border일 때와 같게 맞춘다.
  return (
    <span className="bg-white-100 ring-navy-025 text-regular-14 text-subtext-700 px-[calc(0.5rem+0.5px)] py-[calc(0.25rem+0.5px)] ring-[0.5px] ring-inset">
      {label}
    </span>
  );
};

export default KeywordChip;
