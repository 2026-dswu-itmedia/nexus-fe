interface KeywordChipProps {
  label: string;
}

const KeywordChip = ({ label }: KeywordChipProps) => {
  return (
    <span className="bg-white-100 border-navy-025 text-regular-14 text-subtext-700 border-[0.5px] px-2 py-1">
      {label}
    </span>
  );
};

export default KeywordChip;
