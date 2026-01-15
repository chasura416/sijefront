import type { Consumption } from "../types/payment";

export type GroupedConsumptions = Record<number, Consumption[]>;

export const groupBySalesOrderId = (
  consumptions: Consumption[],
): GroupedConsumptions => {
  return consumptions.reduce<GroupedConsumptions>((acc, item) => {
    const key = item.salesOrder.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

export const uniqueValues = <T, K extends keyof T>(
  items: T[],
  key: K,
): Array<T[K]> => {
  const set = new Set<T[K]>();
  items.forEach((item) => set.add(item[key]));
  return Array.from(set);
};
