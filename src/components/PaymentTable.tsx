import React from "react";
import { SearchRow } from "./SearchRow";
import { usePaymentView } from "../hooks/usePaymentView";

const formatNumber = (value: number) => value.toLocaleString("ko-KR");
const formatPrice = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  });
const formatAmount = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const PaymentTable = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    filters,
    setFilters,
    filterOptions,
    groupedData,
    subtotals,
    breakdownsByItemId,
    breakdownsByItemAndPaymentId,
    payments,
  } = usePaymentView();

  const payableTotalQtyByPayment = payments.map((payment) => {
    return Object.values(breakdownsByItemAndPaymentId).reduce(
      (sum, byPayment) => {
        const list = byPayment[payment.id] ?? [];
        return (
          sum + list.reduce((inner, entry) => inner + entry.shippedQuantity, 0)
        );
      },
      0,
    );
  });

  const payableTotalAmountByPayment = payments.map((payment) => {
    return Object.values(breakdownsByItemAndPaymentId).reduce(
      (sum, byPayment) => {
        const list = byPayment[payment.id] ?? [];
        return sum + list.reduce((inner, entry) => inner + entry.amount, 0);
      },
      0,
    );
  });

  const grandTotalQty = Object.values(breakdownsByItemId).reduce(
    (sum, list) => {
      return sum + list.reduce((inner, entry) => inner + entry.shippedQuantity, 0);
    },
    0,
  );

  const grandTotalAmount = Object.values(breakdownsByItemId).reduce(
    (sum, list) => {
      return sum + list.reduce((inner, entry) => inner + entry.amount, 0);
    },
    0,
  );

  const grandOrderedQty = Object.values(groupedData).reduce((sum, items) => {
    return sum + items.reduce((inner, item) => inner + item.orderQuantity, 0);
  }, 0);

  const grandOrderedAmount = Object.values(groupedData).reduce((sum, items) => {
    return sum + items.reduce((inner, item) => inner + item.orderAmount, 0);
  }, 0);

  return (
    <section className="payment-section">
      <header className="payment-header">
        <h1>Payment Table</h1>
        <button
          type="button"
          className="search-toggle"
          onClick={() => setIsSearchOpen((prev) => !prev)}
        >
          Search
        </button>
      </header>
      <div className="table-wrap">
        <table className="payment-table">
          <colgroup>
            <col className="col-style" />
            <col className="col-supplier" />
            <col className="col-fabric" />
            <col className="col-color" />
            <col className="col-qty" />
            <col className="col-unit" />
            <col className="col-currency" />
            <col className="col-price" />
            <col className="col-currency" />
            <col className="col-amount" />
            {payments.flatMap((payment) => [
              <col key={`payable-${payment.id}-qty`} className="col-qty" />,
              <col key={`payable-${payment.id}-price-currency`} className="col-currency" />,
              <col key={`payable-${payment.id}-price`} className="col-price" />,
              <col key={`payable-${payment.id}-amount-currency`} className="col-currency" />,
              <col key={`payable-${payment.id}-amount`} className="col-amount" />,
            ])}
            <col className="col-qty" />
            <col className="col-currency" />
            <col className="col-amount" />
          </colgroup>
          <thead>
            <tr className="group-header-row">
              <th colSpan={10}>Ordered</th>
              <th colSpan={payments.length * 5}>Payable</th>
              <th colSpan={3}>Total</th>
            </tr>
            <tr className="column-header-row">
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              <th className="header-spacer" />
              {payments.map((payment) => (
                <th key={payment.id} colSpan={5} className="payable-header">
                  <div className="payable-meta">
                    <div>
                      <span className="payable-label">Payment Due</span>
                      <span>{payment.paymentDueDate.slice(0, 10)}</span>
                    </div>
                    <div>
                      <span className="payable-label">Payment Date</span>
                      <span>{payment.requestedAt?.slice(0, 10) ?? "-"}</span>
                      <span className="payable-status">
                        {payment.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="payable-label">Attachment</span>
                      <span className="chip">
                        {payment.financeFiles[0] ?? "file"}
                      </span>
                    </div>
                    <div>
                      <span className="payable-label">Memo</span>
                      <span>{payment.memo ?? "-"}</span>
                    </div>
                  </div>
                </th>
              ))}
              <th>Qty</th>
              <th className="currency-head" />
              <th>Amount</th>
            </tr>
            <tr className="column-subheader-row">
              <th className="subheader-cell">Style No.</th>
              <th className="subheader-cell">Supplier Item #</th>
              <th className="subheader-cell">Fabric Name</th>
              <th className="subheader-cell">Fabric Color</th>
              <th className="subheader-cell">Order Qty</th>
              <th className="subheader-cell">Unit</th>
              <th className="subheader-cell currency-cell">$</th>
              <th className="subheader-cell">U/price</th>
              <th className="subheader-cell currency-cell">$</th>
              <th className="subheader-cell">Amount</th>
              {payments.flatMap((payment) => [
                <th key={`payable-${payment.id}-qty`}>Shipped Qty</th>,
                <th key={`payable-${payment.id}-price-currency`}>$</th>,
                <th key={`payable-${payment.id}-price`}>U/price</th>,
                <th key={`payable-${payment.id}-amount-currency`}>$</th>,
                <th key={`payable-${payment.id}-amount`}>Amount</th>,
              ])}
              <th className="subheader-cell" />
              <th className="subheader-cell currency-cell">$</th>
              <th className="subheader-cell" />
            </tr>
            {isSearchOpen && (
              <SearchRow
                filters={filters}
                options={filterOptions}
                onChange={setFilters}
                paymentCount={payments.length}
              />
            )}
          </thead>
          {Object.entries(groupedData).map(([salesOrderId, items]) => (
            <tbody key={salesOrderId} className="group-block">
              <tr className="group-header">
                {/* <td colSpan={10 + payments.length * 5 + 3}>
                  <div className="group-title">
                    <span>Sales Order #{salesOrderId}</span>
                    <span className="group-meta">
                      {items[0]?.salesOrder.styleNumber} /{" "}
                      {items[0]?.salesOrder.styleCode}
                    </span>
                  </div>
                </td> */}
              </tr>
              {items.map((item) => {
                const breakdowns = breakdownsByItemId[item.id] ?? [];
                const breakdownsByPayment =
                  breakdownsByItemAndPaymentId[item.id] ?? {};
                const totalShippedQty = breakdowns.reduce(
                  (sum, entry) => sum + entry.shippedQuantity,
                  0,
                );
                const totalShippedAmount = breakdowns.reduce(
                  (sum, entry) => sum + entry.amount,
                  0,
                );
                return (
                  <tr
                    key={item.id}
                    className={breakdowns.length > 0 ? "row-mapped" : "row-empty"}
                  >
                    <td>{item.salesOrder.styleNumber}</td>
                    <td>{item.supplierItemCode}</td>
                    <td>{item.fabricName}</td>
                    <td>{item.colorName}</td>
                    <td className="number-cell">
                      {formatNumber(item.orderQuantity)}
                    </td>
                    <td>{item.unit}</td>
                    <td className="currency-cell">$</td>
                    <td className="number-cell">{formatPrice(item.unitPrice)}</td>
                    <td className="currency-cell">$</td>
                    <td className="number-cell">
                      {formatAmount(item.orderAmount)}
                    </td>
              {payments.map((payment) => {
                const list = breakdownsByPayment[payment.id] ?? [];
                const shippedQty = list.reduce(
                  (sum, entry) => sum + entry.shippedQuantity,
                  0,
                );
                return (
                        <td
                          key={`payable-${item.id}-${payment.id}-qty`}
                          className="number-cell"
                        >
                          {list.length ? formatNumber(shippedQty) : "-"}
                        </td>
                      );
                    })}
              {payments.map((payment) => {
                const list = breakdownsByPayment[payment.id] ?? [];
                const unitPrice =
                  list.find((entry) => entry.unitPrice > 0)?.unitPrice ??
                  (list[0]?.unitPrice ?? 0);
                return (
                  <React.Fragment key={`payable-${item.id}-${payment.id}-price`}>
                    <td
                      className="currency-cell"
                    >
                      {list.length ? "$" : "-"}
                    </td>
                    <td
                      className="number-cell"
                    >
                      {list.length ? formatPrice(unitPrice) : "-"}
                    </td>
                  </React.Fragment>
                );
              })}
              {payments.map((payment) => {
                const list = breakdownsByPayment[payment.id] ?? [];
                const shippedAmount = list.reduce(
                  (sum, entry) => sum + entry.amount,
                  0,
                );
                return (
                  <React.Fragment key={`payable-${item.id}-${payment.id}-amount`}>
                    <td
                      className="currency-cell"
                    >
                      {list.length ? "$" : "-"}
                    </td>
                    <td
                      className="number-cell"
                    >
                      {list.length ? formatAmount(shippedAmount) : "-"}
                    </td>
                  </React.Fragment>
                );
              })}
                    <td className="number-cell">
                      {breakdowns.length
                        ? formatNumber(totalShippedQty)
                        : "-"}
                    </td>
                    <td className="currency-cell">
                      {breakdowns.length ? "$" : "-"}
                    </td>
                    <td className="number-cell">
                      {breakdowns.length
                        ? formatAmount(totalShippedAmount)
                        : "-"}
                    </td>
                  </tr>
                );
              })}
              <tr className="subtotal-row">
                <td colSpan={8}>Sub.TTL</td>
                <td className="currency-cell">$</td>
                <td className="number-cell">
                  {formatAmount(subtotals[Number(salesOrderId)] ?? 0)}
                </td>
                {payments.flatMap((payment) => {
                  const groupQty = items.reduce((sum, item) => {
                    const list =
                      breakdownsByItemAndPaymentId[item.id]?.[payment.id] ?? [];
                    return (
                      sum +
                      list.reduce(
                        (inner, entry) => inner + entry.shippedQuantity,
                        0,
                      )
                    );
                  }, 0);
                  const groupAmount = items.reduce((sum, item) => {
                    const list =
                      breakdownsByItemAndPaymentId[item.id]?.[payment.id] ?? [];
                    return (
                      sum +
                      list.reduce((inner, entry) => inner + entry.amount, 0)
                    );
                  }, 0);
                  return [
                    <td
                      key={`subtotal-${payment.id}-qty`}
                      className="number-cell"
                    >
                      {groupQty ? formatNumber(groupQty) : "-"}
                    </td>,
                    <td
                      key={`subtotal-${payment.id}-price-currency`}
                      className="currency-cell"
                    >
                      {groupAmount ? "$" : "-"}
                    </td>,
                    <td key={`subtotal-${payment.id}-price`} />,
                    <td
                      key={`subtotal-${payment.id}-amount-currency`}
                      className="currency-cell"
                    >
                      {groupAmount ? "$" : "-"}
                    </td>,
                    <td
                      key={`subtotal-${payment.id}-amount`}
                      className="number-cell"
                    >
                      {groupAmount ? formatAmount(groupAmount) : "-"}
                    </td>,
                  ];
                })}
                <td />
                <td />
                <td />
              </tr>
            </tbody>
          ))}
          <tbody>
            <tr className="grandtotal-row">
              <td colSpan={4}>G.TTL</td>
              <td className="number-cell">{formatNumber(grandOrderedQty)}</td>
              <td />
              <td className="currency-cell" />
              <td />
              <td className="currency-cell">$</td>
              <td className="number-cell">
                {formatAmount(grandOrderedAmount)}
              </td>
              {payments.map((payment, index) => (
                <td key={`grand-${payment.id}-qty`} className="number-cell">
                  {formatNumber(payableTotalQtyByPayment[index])}
                </td>
              ))}
              {payments.flatMap((payment, index) => [
                <td key={`grand-${payment.id}-price-currency`} />,
                <td key={`grand-${payment.id}-price`} />,
                <td key={`grand-${payment.id}-amount-currency`}>$</td>,
                <td key={`grand-${payment.id}-amount`} className="number-cell">
                  {formatAmount(payableTotalAmountByPayment[index])}
                </td>,
              ])}
              <td className="number-cell">{formatNumber(grandTotalQty)}</td>
              <td className="currency-cell">$</td>
              <td className="number-cell">{formatAmount(grandTotalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
