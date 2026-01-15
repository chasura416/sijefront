export type PaymentStatus = "NOT_YET" | "PENDING" | "PAID";

export type User = {
  id: number;
  name: string;
  engName: string;
  profileImage: string;
};

export type SalesOrder = {
  id: number;
  styleNumber: string;
  styleCode: string;
  createUser: User;
};

export type GarmentSize = {
  id: number;
  name: string;
  orderNum: number;
};

export type Consumption = {
  id: number;
  unitPrice: number;
  orderQuantity: number;
  orderAmount: number;
  fabricName: string;
  fabricClass: string;
  fabricDetail: string;
  supplierItemCode: string;
  brandItemCode: string | null;
  colorName: string;
  sopoNo: string;
  unit: string;
  garmentColorName: string;
  garmentSize: GarmentSize;
  salesOrder: SalesOrder;
};

export type Payment = {
  id: number;
  paymentStatus: PaymentStatus;
  paymentDueDate: string;
  requestedAt: string | null;
  pendingAt: string | null;
  paidAt: string | null;
  memo: string | null;
  sourcingFiles: string[];
  financeFiles: string[];
};

export type PaymentBreakdown = {
  id: string;
  type: "ITEM";
  shippedQuantity: number;
  unitPrice: number;
  amount: number;
  itemId: number;
  paymentId: number;
};

export type MockData = {
  payments: Payment[];
  consumptions: Consumption[];
  paymentBreakdowns: PaymentBreakdown[];
};
