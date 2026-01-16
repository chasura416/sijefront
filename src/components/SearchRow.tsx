import type { FilterState } from "../hooks/usePaymentView";

type Option = string;

type Props = {
  filters: FilterState;
  options: {
    styleNumber: Option[];
    supplierItemCode: Option[];
    fabricName: Option[];
    fabricColor: Option[];
  };
  onChange: (next: FilterState) => void;
  paymentCount: number;
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

export const SearchRow = ({
  filters,
  options,
  onChange,
  paymentCount,
}: Props) => {
  const payableCells = Array.from({ length: paymentCount * 5 }, (_, index) => (
    <td key={`payable-${index}`} className="search-cell" />
  ));

  return (
    <tr className="search-row">
      <SelectCell
        value={filters.styleNumber}
        options={options.styleNumber}
        onChange={(value) => onChange({ ...filters, styleNumber: value })}
      />
      <SelectCell
        value={filters.supplierItemCode}
        options={options.supplierItemCode}
        onChange={(value) =>
          onChange({ ...filters, supplierItemCode: value })
        }
      />
      <SelectCell
        value={filters.fabricName}
        options={options.fabricName}
        onChange={(value) => onChange({ ...filters, fabricName: value })}
      />
      <SelectCell
        value={filters.fabricColor}
        options={options.fabricColor}
        onChange={(value) => onChange({ ...filters, fabricColor: value })}
      />
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
      {payableCells}
      <td className="search-cell" />
      <td className="search-cell" />
      <td className="search-cell" />
    </tr>
  );
};
