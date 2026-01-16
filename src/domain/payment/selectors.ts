import type { Payment, PaymentBreakdown, Consumption } from "../../types/payment";
import { groupBySalesOrderId } from "../../utils/group";

export const buildGroupedConsumptions = (items: Consumption[]) => {
  return groupBySalesOrderId(items);
};

export const buildSubtotals = (
  grouped: Record<number, Consumption[]>,
): Record<number, number> => {
  const entries = Object.entries(grouped).map(([key, items]) => {
    const total = items.reduce((sum, item) => sum + item.orderAmount, 0);
    return [Number(key), total] as const;
  });
  return Object.fromEntries(entries);
};

export const buildBreakdownsByItemId = (items: PaymentBreakdown[]) => {
  return items.reduce<Record<number, PaymentBreakdown[]>>((acc, item) => {
    if (!acc[item.itemId]) acc[item.itemId] = [];
    acc[item.itemId].push(item);
    return acc;
  }, {});
};

export const buildBreakdownsByItemAndPaymentId = (
  items: PaymentBreakdown[],
) => {
  return items.reduce<Record<number, Record<number, PaymentBreakdown[]>>>(
    (acc, item) => {
      if (!acc[item.itemId]) acc[item.itemId] = {};
      if (!acc[item.itemId][item.paymentId])
        acc[item.itemId][item.paymentId] = [];
      acc[item.itemId][item.paymentId].push(item);
      return acc;
    },
    {},
  );
};

export const buildPaymentsById = (items: Payment[]) => {
  return items.reduce<Record<number, Payment>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};
