"use client";

import { Order, OrderStatus } from "@/lib/order-context";

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending: { label: "Order Placed", color: "#999", icon: "📋" },
  confirmed: { label: "Confirmed", color: "#2196F3", icon: "✓" },
  shipped: { label: "Shipped", color: "#FF9800", icon: "📦" },
  out_for_delivery: { label: "Out for Delivery", color: "#4CAF50", icon: "🚚" },
  delivered: { label: "Delivered", color: "#4CAF50", icon: "✓" },
  cancelled: { label: "Cancelled", color: "#F44336", icon: "✗" },
};

export function DeliveryTimeline({ order }: { order: Order }) {
  const allStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "out_for_delivery", "delivered"];
  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";

  return (
    <div style={{ padding: "1.5rem", background: "#f9f9f9", borderRadius: "8px", marginTop: "1.5rem" }}>
      <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.1rem", fontWeight: "600" }}>
        📍 Delivery Status
      </h3>

      {/* Current Status Badge */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          background: statusConfig[order.status].color,
          color: "white",
          borderRadius: "6px",
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {statusConfig[order.status].icon} {statusConfig[order.status].label}
        {order.estimatedDeliveryDate && order.status !== "delivered" && (
          <div style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.9 }}>
            Est. Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", paddingLeft: "2rem" }}>
            {allStatuses.map((status, index) => {
              const isCompleted = order.statusHistory.some((s) => s.status === status);
              const isCurrentStatus = order.status === status;

              return (
                <div key={status} style={{ marginBottom: index !== allStatuses.length - 1 ? "1.5rem" : 0 }}>
                  {/* Timeline line */}
                  {index !== allStatuses.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "0.3rem",
                        top: "1.8rem",
                        width: "2px",
                        height: "calc(100% + 0.5rem)",
                        background: isCompleted ? statusConfig[status].color : "#ddd",
                      }}
                    />
                  )}

                  {/* Timeline dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: "0.75rem",
                      height: "0.75rem",
                      borderRadius: "50%",
                      background: isCompleted ? statusConfig[status].color : "#ddd",
                      border: isCurrentStatus ? `3px solid ${statusConfig[status].color}` : "none",
                      marginTop: "0.3rem",
                    }}
                  />

                  {/* Status info */}
                  <div style={{ opacity: isCompleted ? 1 : 0.5 }}>
                    <div style={{ fontWeight: "600", color: statusConfig[status].color, marginBottom: "0.25rem" }}>
                      {statusConfig[status].label}
                    </div>
                    {isCompleted &&
                      order.statusHistory.find((s) => s.status === status) &&
                      (() => {
                        const update = order.statusHistory.find((s) => s.status === status);
                        return (
                          <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
                            <div>{new Date(update!.timestamp).toLocaleString()}</div>
                            {update!.notes && <div style={{ marginTop: "0.25rem", fontStyle: "italic" }}>{update!.notes}</div>}
                          </div>
                        );
                      })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Details */}
      {isDelivered && (
        <div style={{ padding: "1rem", background: "#e8f5e9", borderRadius: "6px", borderLeft: "4px solid #4CAF50" }}>
          <div style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#2e7d32" }}>✓ Delivered</div>
          {order.actualDeliveryDate && (
            <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
              Delivered on: {new Date(order.actualDeliveryDate).toLocaleString()}
            </div>
          )}
          {order.deliveryPersonName && (
            <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
              Delivered by: {order.deliveryPersonName}
            </div>
          )}
          {order.deliveryPersonPhone && (
            <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
              Contact: {order.deliveryPersonPhone}
            </div>
          )}
          {order.deliveryNotes && (
            <div style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem", fontStyle: "italic" }}>
              Notes: {order.deliveryNotes}
            </div>
          )}
        </div>
      )}

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f0f0", borderRadius: "6px" }}>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Tracking #: <strong>{order.trackingNumber}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
