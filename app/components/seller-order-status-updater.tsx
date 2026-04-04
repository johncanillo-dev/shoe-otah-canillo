"use client";

import { useState } from "react";
import { Order, OrderStatus, useOrder } from "@/lib/order-context";

const statusOptions: OrderStatus[] = ["confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"];

const statusColors: Record<OrderStatus, string> = {
  pending: "#999",
  confirmed: "#2196F3",
  shipped: "#FF9800",
  out_for_delivery: "#4CAF50",
  delivered: "#4CAF50",
  cancelled: "#F44336",
};

export function SellerOrderStatusUpdater({ order }: { order: Order }) {
  const { updateOrderStatus } = useOrder();
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [deliveryDate, setDeliveryDate] = useState(order.estimatedDeliveryDate?.split("T")[0] || "");
  const [personName, setPersonName] = useState(order.deliveryPersonName || "");
  const [personPhone, setPersonPhone] = useState(order.deliveryPersonPhone || "");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedOrder: Order = {
      ...order,
      status: selectedStatus,
      trackingNumber: trackingNumber || undefined,
      estimatedDeliveryDate: deliveryDate ? new Date(deliveryDate).toISOString() : undefined,
      deliveryPersonName: personName || undefined,
      deliveryPersonPhone: personPhone || undefined,
    };

    updateOrderStatus(order.id, selectedStatus, notes);
    setShowForm(false);
    alert("Order status updated successfully!");
  };

  return (
    <div style={{ marginTop: "1rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "0.5rem 1rem",
            background: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          📦 Update Delivery Status
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <h4 style={{ marginTop: 0 }}>Update Order Status</h4>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Tracking Number:
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., TRK-123456"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Estimated Delivery Date:
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {selectedStatus === "delivered" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Delivery Person Name:
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Delivery person's name"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Delivery Person Phone:
                </label>
                <input
                  type="tel"
                  value={personPhone}
                  onChange={(e) => setPersonPhone(e.target.value)}
                  placeholder="+63-9XX-XXX-XXXX"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Update
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "0.5rem 1rem",
                background: "#999",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
