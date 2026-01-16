import type { Consumption } from "../../types/payment";

export type FilterState = {
  styleNumber: string;
  supplierItemCode: string;
  fabricName: string;
  fabricColor: string;
};

export const ALL = "All";

export const initialFilters: FilterState = {
  styleNumber: ALL,
  supplierItemCode: ALL,
  fabricName: ALL,
  fabricColor: ALL,
};

const matchFilter = (value: string, filterValue: string) =>
  filterValue === ALL || value === filterValue;

export const applyFilters = (
  items: Consumption[],
  filters: FilterState,
): Consumption[] => {
  return items.filter(
    (item) =>
      matchFilter(item.salesOrder.styleNumber, filters.styleNumber) &&
      matchFilter(item.supplierItemCode, filters.supplierItemCode) &&
      matchFilter(item.fabricName, filters.fabricName) &&
      matchFilter(item.colorName, filters.fabricColor),
  );
};

export const buildFilterOptions = (items: Consumption[]) => {
  return {
    styleNumber: [
      ALL,
      ...Array.from(new Set(items.map((c) => c.salesOrder.styleNumber))),
    ],
    supplierItemCode: [
      ALL,
      ...Array.from(new Set(items.map((c) => c.supplierItemCode))),
    ],
    fabricName: [ALL, ...Array.from(new Set(items.map((c) => c.fabricName)))],
    fabricColor: [ALL, ...Array.from(new Set(items.map((c) => c.colorName)))],
  };
};
