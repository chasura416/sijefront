import { SearchRow } from "./SearchRow";
import { usePaymentView } from "../hooks/usePaymentView";

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

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
    paymentsById,
  } = usePaymentView();

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
          <thead>
            <tr>
              <th>Item</th>
              <th>Fabric</th>
              <th>Color</th>
              <th>SO/PO</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Payment</th>
            </tr>
            {isSearchOpen && (
              <SearchRow
                filters={filters}
                options={filterOptions}
                onChange={setFilters}
              />
            )}
          </thead>
          {Object.entries(groupedData).map(([salesOrderId, items]) => (
            <tbody key={salesOrderId} className="group-block">
              <tr className="group-header">
                <td colSpan={8}>
                  <div className="group-title">
                    <span>Sales Order #{salesOrderId}</span>
                    <span className="group-meta">
                      {items[0]?.salesOrder.styleNumber} /{" "}
                      {items[0]?.salesOrder.styleCode}
                    </span>
                  </div>
                </td>
              </tr>
              {items.map((item) => {
                const breakdowns = breakdownsByItemId[item.id] ?? [];
                const breakdownsByPayment =
                  breakdownsByItemAndPaymentId[item.id] ?? {};
                return (
                  <tr
                    key={item.id}
                    className={breakdowns.length > 0 ? "row-mapped" : "row-empty"}
                  >
                    <td>{item.id}</td>
                    <td>{item.fabricName}</td>
                    <td>{item.colorName}</td>
                    <td>{item.sopoNo}</td>
                    <td>{item.garmentSize.name}</td>
                    <td>{formatNumber(item.orderQuantity)}</td>
                    <td>{formatNumber(item.orderAmount)}</td>
                    <td>
                      {breakdowns.length === 0 ? (
                        <span className="badge badge-muted">미매핑</span>
                      ) : (
                        <div className="payment-meta">
                          {Object.entries(breakdownsByPayment).map(
                            ([paymentId, list]) => {
                              const payment = paymentsById[Number(paymentId)];
                              const shippedQty = list.reduce(
                                (sum, entry) => sum + entry.shippedQuantity,
                                0,
                              );
                              const shippedAmount = list.reduce(
                                (sum, entry) => sum + entry.amount,
                                0,
                              );
                              return (
                                <div key={paymentId} className="payment-line">
                                  <span className="badge">
                                    Payment #{paymentId}
                                  </span>
                                  <span className="status">
                                    {payment?.paymentStatus ?? "UNKNOWN"}
                                  </span>
                                  <span>
                                    Shipped {formatNumber(shippedQty)}
                                  </span>
                                  <span>
                                    Amount {formatNumber(shippedAmount)}
                                  </span>
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="subtotal-row">
                <td colSpan={6}>Sub Total</td>
                <td>{formatNumber(subtotals[Number(salesOrderId)] ?? 0)}</td>
                <td />
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
};
