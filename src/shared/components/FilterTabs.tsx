interface FilterTabsProps<T> {
  items: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

const FilterTabs = <T,>({ items, value, onChange }: FilterTabsProps<T>) => {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
      {items.map((item) => {
        const isSelected = item.value === value;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onChange(item.value)}
            className={`shrink-0 transition-colors duration-200 ${isSelected ? 'text-semibold-14 text-navy-100' : 'text-regular-14 text-subtext-700'}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
