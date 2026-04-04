"use client";

import { useAuth } from "@/lib/auth-context";
import { useOrder } from "@/lib/order-context";
import { useCart } from "@/lib/cart-context";
import Map from "@/app/components/map";
import ShopCard from "@/app/components/shop-card";
import { DeliveryTimeline } from "@/app/components/delivery-timeline";
import { UserSettings } from "@/app/components/user-settings";
import { QuickUserSettings } from "@/app/components/quick-user-settings";
import { DashboardHeader } from "@/app/components/dashboard-header";
import { fetchProducts, subscribeToProducts } from "@/lib/product-helpers";
import { useEffect, useState, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  created_at?: string;
};

const DEFAULT_CATEGORIES = ["Shoes", "Shirts", "Slippers", "Socks", "Necklace", "Beauty Product", "Pants"];

export default function DashboardContent() {
  const { user } = useAuth();
  const { orders } = useOrder();
  const { items } = useCart();
  const { addItem } = useCart();
  const [deliveryInfoMap, setDeliveryInfoMap] = useState<Record<string, any>>({});
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");
  const [shopLocation, setShopLocation] = useState({
    name: "👟 Shoe Otah Boutique",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop",
    latitude: 8.81975,
    longitude: 125.69423,
    zoom: 18,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load products from Supabase on mount and subscribe to real-time updates
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      const productsData = await fetchProducts();
      console.log("✅ Dashboard: Fetched products from Supabase:", productsData.length, productsData);
      setProducts(productsData);
      setIsLoadingProducts(false);
    };

    loadProducts();

    // Subscribe to real-time product changes
    const unsubscribe = subscribeToProducts(
      (updatedProducts) => {
        console.log("🔄 Dashboard: Real-time update received:", updatedProducts.length, updatedProducts);
        setProducts(updatedProducts);
      },
      (error) => console.error("Dashboard: Real-time subscription error:", error)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load shop location from localStorage (set by admin)
    const loadShopLocation = () => {
      const savedLocation = localStorage.getItem("shop-location");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setShopLocation({
            name: parsed.name || "👟 Shoe Otah Boutique",
            image: parsed.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop",
            latitude: parsed.latitude || 8.81975,
            longitude: parsed.longitude || 125.69423,
            zoom: parsed.zoom || 18,
          });
        } catch (e) {
          console.error("Failed to load shop location:", e);
        }
      }
    };

    // Load initially
    loadShopLocation();
    
    // Listen for storage changes (when admin updates location in another tab)
    window.addEventListener("storage", loadShopLocation);
    return () => window.removeEventListener("storage", loadShopLocation);
  }, []);

  useEffect(() => {
    // Load delivery info for all orders from localStorage
    const infoMap: Record<string, any> = {};
    orders.forEach((order) => {
      const deliveryInfo = localStorage.getItem(`delivery-${order.id}`);
      if (deliveryInfo) {
        try {
          infoMap[order.id] = JSON.parse(deliveryInfo);
        } catch (e) {
          console.error("Failed to parse delivery info:", e);
        }
      }
    });
    setDeliveryInfoMap(infoMap);
  }, [orders]);

  // Filter orders placed by the current user
  const userOrders = orders.filter((order) => order.customerDetails.email === user?.email);

  // Calculate statistics
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = userOrders.filter((order) => order.status === "pending" || order.status === "confirmed").length;
  const deliveredOrders = userOrders.filter((order) => order.status === "delivered").length;

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category as string,
      quantity: 1,
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "confirmed":
        return "#2196f3";
      case "shipped":
        return "#9c27b0";
      case "out_for_delivery":
        return "#4caf50";
      case "delivered":
        return "#4caf50";
      case "cancelled":
        return "#f44336";
      default:
        return "#666";
    }
  };

  // Get status badge text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Pending";
      case "confirmed":
        return "✅ Confirmed";
      case "shipped":
        return "📦 Shipped";
      case "out_for_delivery":
        return "🚚 Out for Delivery";
      case "delivered":
        return "✓ Delivered";
      case "cancelled":
        return "✗ Cancelled";
      default:
        return status;
    }
  };

  return (
    <section className="user-dashboard-shell container">
      <DashboardHeader 
        title="My Dashboard"
        subtitle="Welcome Back"
        email={user?.name}
        badge="Customer Account"
      />

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "2px solid #e0d5cc" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "1rem 1.5rem",
            borderBottom: activeTab === "overview" ? "3px solid var(--accent)" : "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "overview" ? "600" : "400",
            color: activeTab === "overview" ? "var(--accent)" : "#5e584d",
          }}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "1rem 1.5rem",
            borderBottom: activeTab === "orders" ? "3px solid var(--accent)" : "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "orders" ? "600" : "400",
            color: activeTab === "orders" ? "var(--accent)" : "#5e584d",
          }}
        >
          📦 Orders
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          style={{
            padding: "1rem 1.5rem",
            borderBottom: activeTab === "settings" ? "3px solid var(--accent)" : "none",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: activeTab === "settings" ? "600" : "400",
            color: activeTab === "settings" ? "var(--accent)" : "#5e584d",
          }}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* User Stats Cards */}
          <div className="dashboard-cards">
            <article>
              <h2>Total Orders</h2>
              <p style={{ fontSize: "1.8rem", fontWeight: "600", color: "var(--accent)" }}>
                {totalOrders}
              </p>
            </article>
            <article>
              <h2>In Progress</h2>
              <p style={{ fontSize: "1.8rem", fontWeight: "600", color: "#ff9800" }}>
                {pendingOrders}
              </p>
            </article>
            <article>
              <h2>Delivered</h2>
              <p style={{ fontSize: "1.8rem", fontWeight: "600", color: "#4caf50" }}>
                {deliveredOrders}
              </p>
            </article>
            <article>
              <h2>Total Spent</h2>
              <p style={{ fontSize: "1.8rem", fontWeight: "600", color: "#2196f3" }}>
                ₱{totalSpent.toFixed(2)}
              </p>
            </article>
          </div>

          {/* Cart Section */}
          {items.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Shopping Cart</h3>
                <span className="badge" style={{ background: "var(--accent)", color: "white" }}>
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="cart-preview">
                {items.map((item) => (
                  <div key={item.id} className="cart-item-preview">
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p className="item-meta">
                        Qty: {item.quantity} × ₱{item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="item-price">₱{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="section-footer">
                <a href="/checkout" className="btn btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                  Proceed to Checkout →
                </a>
              </div>
            </div>
          )}

          {userOrders.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Recent Delivery Info</h3>
              </div>
              <div className="delivery-cards">
                {userOrders
                  .slice()
                  .reverse()
                  .slice(0, 3)
                  .map((order) => {
                    const deliveryInfo = deliveryInfoMap[order.id];
                    return (
                      <div key={order.id} className="delivery-card">
                        <div className="delivery-status">
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              backgroundColor: getStatusColor(order.status) + "20",
                              color: getStatusColor(order.status),
                              fontWeight: "600",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {getStatusBadge(order.status)}
                          </span>
                        </div>
                        <p>
                          <strong>Order:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Address:</strong> {order.address?.street}, {order.address?.barangay},{" "}
                          {order.address?.city}, {order.address?.province}
                        </p>
                        <p>
                          <strong>Payment:</strong> {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                        </p>
                        {deliveryInfo && (
                          <>
                            <p>
                              <strong>Delivered:</strong> {deliveryInfo.date} at {deliveryInfo.time}
                            </p>
                            {deliveryInfo.notes && (
                              <p>
                                <strong>Notes:</strong> {deliveryInfo.notes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Shop Search Section */}
          <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>🔍 Search Shop Products</h3>
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid var(--line)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Search Results */}
            {isLoadingProducts ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                <p>Loading products from Supabase...</p>
              </div>
            ) : searchQuery.trim() ? (
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "8px",
                          padding: "1rem",
                          backgroundColor: "#fafafa",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {product.image && (
                          <div style={{ width: "100%", height: "150px", marginBottom: "0.75rem", borderRadius: "4px", overflow: "hidden" }}>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                        )}
                        <div>
                          <h4 style={{ margin: "0.5rem 0", fontSize: "0.95rem", lineHeight: "1.3" }}>
                            {product.name}
                          </h4>
                          <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.25rem 0", lineHeight: "1.3" }}>
                            {product.description}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                            <span style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--accent)" }}>
                              ₱{product.price.toFixed(2)}
                            </span>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                backgroundColor: "var(--line)",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                color: "#666",
                              }}
                            >
                              {product.category}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            style={{
                              width: "100%",
                              marginTop: "0.75rem",
                              padding: "0.5rem",
                              border: "none",
                              borderRadius: "4px",
                              backgroundColor: addedToCart === product.id ? "#4caf50" : "var(--accent)",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              transition: "background-color 0.2s",
                            }}
                          >
                            {addedToCart === product.id ? "✓ Added!" : "Add to Cart"}
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#999" }}>
                      <p>No products found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <ShopCard 
              shopName={shopLocation.name}
              shopImage={shopLocation.image}
              latitude={shopLocation.latitude}
              longitude={shopLocation.longitude}
              zoom={shopLocation.zoom}
            />
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="dashboard-section">
          <div className="section-header">
            <h3>My Orders</h3>
            <span className="badge">{totalOrders} order{totalOrders !== 1 ? "s" : ""}</span>
          </div>

          {userOrders.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1rem" }}>
                No orders yet
              </p>
              <p style={{ color: "#999", marginBottom: "1.5rem" }}>
                Start shopping to place your first order
              </p>
              <a href="/" className="btn btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
                Continue Shopping
              </a>
            </div>
          ) : (
            <div>
              <div className="orders-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id}</strong>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.items.length} item(s)</td>
                        <td>
                          <strong>₱{order.total.toFixed(2)}</strong>
                        </td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.4rem 0.8rem",
                              borderRadius: "6px",
                              backgroundColor: getStatusColor(order.status) + "20",
                              color: getStatusColor(order.status),
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {getStatusBadge(order.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              border: "1px solid var(--line)",
                              borderRadius: "4px",
                              background: "white",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                            }}
                          >
                            {selectedOrderId === order.id ? "Hide Details" : "Track"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Expanded Order Details */}
              {selectedOrderId && (
                <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#f9f9f9", borderRadius: "8px" }}>
                  {userOrders
                    .filter((order) => order.id === selectedOrderId)
                    .map((order) => (
                      <div key={order.id}>
                        <h3 style={{ marginTop: 0 }}>Order {order.id} - Details</h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                          <div>
                            <h4 style={{ margin: "0 0 1rem 0" }}>Items</h4>
                            {order.items.map((item) => (
                              <div key={item.id} style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid #eee" }}>
                                <div style={{ fontWeight: "600" }}>{item.name}</div>
                                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                                  {item.quantity} × ₱{item.price.toFixed(2)} = ₱{(item.quantity * item.price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid var(--line)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span>Subtotal:</span>
                                <strong>₱{order.subtotal.toFixed(2)}</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <span>Tax:</span>
                                <strong>₱{order.tax.toFixed(2)}</strong>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                                <span>Total:</span>
                                <strong>₱{order.total.toFixed(2)}</strong>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 style={{ margin: "0 0 1rem 0" }}>Delivery Address</h4>
                            <div style={{ lineHeight: "1.6" }}>
                              <p style={{ margin: "0.5rem 0" }}>{order.address.street}</p>
                              <p style={{ margin: "0.5rem 0" }}>{order.address.barangay}</p>
                              <p style={{ margin: "0.5rem 0" }}>
                                {order.address.city}, {order.address.province} {order.address.postalCode}
                              </p>
                            </div>

                            <h4 style={{ margin: "1.5rem 0 0.5rem 0" }}>Customer Contact</h4>
                            <div style={{ fontSize: "0.9rem", color: "#666" }}>
                              <p style={{ margin: "0.25rem 0" }}>
                                <strong>Name:</strong> {order.customerDetails.firstName} {order.customerDetails.lastName}
                              </p>
                              <p style={{ margin: "0.25rem 0" }}>
                                <strong>Email:</strong> {order.customerDetails.email}
                              </p>
                              <p style={{ margin: "0.25rem 0" }}>
                                <strong>Phone:</strong> {order.customerDetails.phone}
                              </p>
                            </div>

                            <h4 style={{ margin: "1.5rem 0 0.5rem 0" }}>Payment</h4>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                              {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1).replace(/([A-Z])/g, " $1")}
                            </p>
                          </div>
                        </div>

                        {/* Delivery Timeline */}
                        <DeliveryTimeline order={order} />

                        <div style={{ marginTop: "1rem" }}>
                          <button
                            onClick={() => setSelectedOrderId(null)}
                            style={{
                              padding: "0.5rem 1rem",
                              border: "1px solid var(--line)",
                              borderRadius: "4px",
                              background: "white",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            Close Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ marginBottom: "2rem" }}>
          <UserSettings />
        </div>
      )}
    </section>
  );
}
