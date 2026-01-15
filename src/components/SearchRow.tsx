import type { FilterState } from "../hooks/usePaymentView";

type Option = string;

type Props = {
  filters: FilterState;
  options: {
    fabricName: Option[];
    colorName: Option[];
    sopoNo: Option[];
    garmentSize: Option[];
  };
  onChange: (next: FilterState) => void;
};

const SelectCell = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Option[];
  onChange: (next: string) => void;
}) => {
  return (
    <td className="search-cell">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </td>
  );
};

export const SearchRow = ({ filters, options, onChange }: Props) => {
  return (
    <tr className="search-row">
      <td className="search-cell">검색</td>
      <SelectCell
        value={filters.fabricName}
        options={options.fabricName}
        onChange={(value) => onChange({ ...filters, fabricName: value })}
      />
      <SelectCell
        value={filters.colorName}
        options={options.colorName}
        onChange={(value) => onChange({ ...filters, colorName: value })}
      />
      <SelectCell
        value={filters.sopoNo}
        options={options.sopoNo}
        onChange={(value) => onChange({ ...filters, sopoNo: value })}
      />
      <SelectCell
        value={filters.garmentSize}
        options={options.garmentSize}
        onChange={(value) => onChange({ ...filters, garmentSize: value })}
      />
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
    </tr>
  );
};
