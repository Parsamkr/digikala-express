const OrderStatuses = {
  Pending: "pending",
  Ordered: "ordered",
  InProcess: "in_process",
  Packed: "packed",
  InTransit: "in_transit",
  Delivered: "delivered",
  Canceled: "canceled",
} as const;

export { OrderStatuses };
