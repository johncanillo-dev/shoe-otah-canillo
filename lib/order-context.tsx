"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type PaymentMethod = "cash" | "gcash" | "paymaya" | "bankTransfer" | "cod";

export type CustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type Address = {
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

export type StatusUpdate = {
  status: OrderStatus;
  timestamp: string;
  notes?: string;
};

export type Order = {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    sellerId?: string;
  }>;
  customerDetails: CustomerDetails;
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  statusHistory: StatusUpdate[];
  deliveryNotes?: string;
  deliveryPersonName?: string;
  deliveryPersonPhone?: string;
};

type OrderContextType = {
  currentOrder: Order | null;
  orders: Order[];
  createOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => void;
  clearCurrentOrder: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "orders";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  React.useEffect(() => {
    // Load orders from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse orders:", e);
      }
    }
  }, []);

  const createOrder = (order: Omit<Order, "id" | "createdAt" | "status" | "statusHistory">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          notes: "Order created",
        },
      ],
    };

    setCurrentOrder(newOrder);
    addOrder(newOrder);
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const addOrder = (order: Order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const statusUpdate: StatusUpdate = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          notes,
        };

        const updatedOrder: Order = {
          ...order,
          status: newStatus,
          statusHistory: [...order.statusHistory, statusUpdate],
          ...(newStatus === "delivered" && { actualDeliveryDate: new Date().toISOString() }),
        };

        if (order.id === currentOrder?.id) {
          setCurrentOrder(updatedOrder);
        }

        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{ currentOrder, orders, createOrder, clearCurrentOrder, addOrder, updateOrderStatus, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
}
