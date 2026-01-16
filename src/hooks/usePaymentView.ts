import { useMemo, useState } from "react";
import { getPaymentData } from "../services/paymentService";
import {
  applyFilters,
  buildFilterOptions,
  initialFilters,
  type FilterState,
} from "../domain/payment/filters";
import {
  buildBreakdownsByItemAndPaymentId,
  buildBreakdownsByItemId,
  buildGroupedConsumptions,
  buildPaymentsById,
  buildSubtotals,
} from "../domain/payment/selectors";

export const usePaymentView = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const data = useMemo(() => getPaymentData(), []);

  const filterOptions = useMemo(() => {
    return buildFilterOptions(data.consumptions);
  }, [data.consumptions]);

  const groupedData = useMemo(() => {
    const filtered = applyFilters(data.consumptions, filters);
    return buildGroupedConsumptions(filtered);
  }, [data.consumptions, filters]);

  const breakdownsByItemId = useMemo(() => {
    return buildBreakdownsByItemId(data.paymentBreakdowns);
  }, [data.paymentBreakdowns]);

  const breakdownsByItemAndPaymentId = useMemo(() => {
    return buildBreakdownsByItemAndPaymentId(data.paymentBreakdowns);
  }, [data.paymentBreakdowns]);

  const paymentsById = useMemo(() => {
    return buildPaymentsById(data.payments);
  }, [data.payments]);

  const subtotals = useMemo(() => {
    return buildSubtotals(groupedData);
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
    payments: data.payments,
    paymentBreakdowns: data.paymentBreakdowns,
  };
};

export type { FilterState };
