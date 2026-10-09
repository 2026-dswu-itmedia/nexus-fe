import SearchIcon from '@/shared/assets/icons/ic-search-24.svg?react';
import type { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="border-navy-100 flex items-center gap-2 border-b-[1.5px] py-2">
      {/* type="search"는 브라우저 기본 지우기 버튼이 생기므로 text + inputMode를 쓴다 */}
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="text-regular-14 placeholder:text-subtext-900 flex-1 bg-transparent text-black outline-none"
      />
      <SearchIcon className="text-navy-100 size-6 shrink-0" aria-hidden="true" />
    </label>
  );
};

export default SearchInput;
