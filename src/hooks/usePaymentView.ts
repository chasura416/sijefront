import { useMemo, useState } from "react";
import { mockData } from "../data/mock";
import type { Consumption } from "../types/payment";
import { groupBySalesOrderId, uniqueValues } from "../utils/group";
import type { Payment, PaymentBreakdown } from "../types/payment";

export type FilterState = {
  fabricName: string;
  colorName: string;
  sopoNo: string;
  garmentSize: string;
};

const ALL = "All";

const initialFilters: FilterState = {
  fabricName: ALL,
  colorName: ALL,
  sopoNo: ALL,
  garmentSize: ALL,
};

const matchFilter = (value: string, filterValue: string) =>
  filterValue === ALL || value === filterValue;

const filterConsumptions = (items: Consumption[], filters: FilterState) => {
  return items.filter(
    (item) =>
      matchFilter(item.fabricName, filters.fabricName) &&
      matchFilter(item.colorName, filters.colorName) &&
      matchFilter(item.sopoNo, filters.sopoNo) &&
      matchFilter(item.garmentSize.name, filters.garmentSize),
  );
};

export const usePaymentView = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filterOptions = useMemo(() => {
    const { consumptions } = mockData;
    return {
      fabricName: [ALL, ...uniqueValues(consumptions, "fabricName")],
      colorName: [ALL, ...uniqueValues(consumptions, "colorName")],
      sopoNo: [ALL, ...uniqueValues(consumptions, "sopoNo")],
      garmentSize: [
        ALL,
        ...Array.from(new Set(consumptions.map((c) => c.garmentSize.name))),
      ],
    };
  }, []);

  const groupedData = useMemo(() => {
    const filtered = filterConsumptions(mockData.consumptions, filters);
    return groupBySalesOrderId(filtered);
  }, [filters]);

  const breakdownsByItemId = useMemo(() => {
    return mockData.paymentBreakdowns.reduce<
      Record<number, PaymentBreakdown[]>
    >((acc, item) => {
      if (!acc[item.itemId]) acc[item.itemId] = [];
      acc[item.itemId].push(item);
      return acc;
    }, {});
  }, []);

  const breakdownsByItemAndPaymentId = useMemo(() => {
    return mockData.paymentBreakdowns.reduce<
      Record<number, Record<number, PaymentBreakdown[]>>
    >((acc, item) => {
      if (!acc[item.itemId]) acc[item.itemId] = {};
      if (!acc[item.itemId][item.paymentId])
        acc[item.itemId][item.paymentId] = [];
      acc[item.itemId][item.paymentId].push(item);
      return acc;
    }, {});
  }, []);

  const paymentsById = useMemo(() => {
    return mockData.payments.reduce<Record<number, Payment>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, []);

  const subtotals = useMemo(() => {
    const entries = Object.entries(groupedData).map(([key, items]) => {
      const total = items.reduce((sum, item) => sum + item.orderAmount, 0);
      return [Number(key), total] as const;
    });
    return Object.fromEntries(entries);
  }, [groupedData]);

  return {
    isSearchOpen,
    setIsSearchOpen,
    filters,
    setFilters,
    filterOptions,
    groupedData,
    subtotals,
    breakdownsByItemId,
    breakdownsByItemAndPaymentId,
    paymentsById,
    payments: mockData.payments,
    paymentBreakdowns: mockData.paymentBreakdowns,
  };
};
