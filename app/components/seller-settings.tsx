"use client";

import { useState } from "react";
import { useSeller, SellerUser } from "@/lib/seller-context";

export const SellerSettings = () => {
  const { seller, updateSellerProfile } = useSeller();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIconEditing, setIsIconEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [sellerIcon, setSellerIcon] = useState(seller?.icon || "🏪");
  const [tempIcon, setTempIcon] = useState(sellerIcon);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: seller?.name || "",
    shopName: seller?.shopName || "",
    email: seller?.email || "",
    phone: seller?.phone || "",
    description: seller?.description || "",
  });

  const [shopSettings, setShopSettings] = useState({
    acceptOrders: true,
    emailNotifications: true,
    showOnMarketplace: true,
    vacationMode: false,
  });

  const presetIcons = ["🏪", "🛍️", "🏬", "💼", "🎯", "⭐", "👨‍💼", "📱"];

  const handleIconChange = (icon: string) => {
    setTempIcon(icon);
  };

  const handleSaveIcon = () => {
    setSellerIcon(tempIcon);
    if (updateSellerProfile && seller) {
      updateSellerProfile({ ...seller, icon: tempIcon } as SellerUser);
    }
    setIsIconEditing(false);
    showSuccess("Shop icon updated successfully!");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (!formData.name || !formData.shopName || !formData.email || !formData.phone) {
      showError("Please fill in all required fields");
      return;
    }
    if (updateSellerProfile && seller) {
      updateSellerProfile({
        ...seller,
        name: formData.name,
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
      } as SellerUser);
    }
    setIsProfileEditing(false);
    showSuccess("Shop information updated successfully!");
  };

  const handleShopSettingChange = (key: string, value: boolean) => {
    setShopSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    showSuccess("Shop setting updated!");
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  return (
    <div className="settings-section">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="settings-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          padding: "1rem 1.5rem",
          backgroundColor: "#f8f6f3",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "none",
          borderRadius: "8px",
          width: "100%",
          fontSize: "1rem",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        <span>🏪 Shop Settings</span>
        <span>{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="settings-content" style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e0d5cc" }}>
          {/* Success/Error Messages */}
          {successMessage && (
            <div style={{ padding: "1rem", backgroundColor: "#d4edda", color: "#155724", borderRadius: "4px", marginBottom: "1rem" }}>
              ✅ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div style={{ padding: "1rem", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "1rem" }}>
              ❌ {errorMessage}
            </div>
          )}

          {/* Icon Settings */}
          <div className="settings-group" style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e0d5cc" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem", color: "#5e584d" }}>Shop Icon</h3>
            <div className="icon-display" style={{ fontSize: "2rem", marginBottom: "1rem", padding: "0.5rem" }}>
              {sellerIcon}
            </div>

            {!isIconEditing ? (
              <button
                onClick={() => setIsIconEditing(true)}
                className="btn btn-secondary"
                style={{ cursor: "pointer" }}
              >
                Change Icon
              </button>
            ) : (
              <div className="icon-selector" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
                  {presetIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => handleIconChange(icon)}
                      style={{
                        fontSize: "1.5rem",
                        padding: "0.75rem",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: tempIcon === icon ? "2px solid var(--accent)" : "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor: tempIcon === icon ? "#f0e8e0" : "#fff",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleSaveIcon}
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Save Icon
                  </button>
                  <button
                    onClick={() => {
                      setIsIconEditing(false);
                      setTempIcon(sellerIcon);
                    }}
                    className="btn btn-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shop Profile Settings */}
          <div className="settings-group" style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e0d5cc" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Shop Information</h3>
            {!isProfileEditing ? (
              <>
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Owner Name</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.name}</p>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Shop Name</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.shopName}</p>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Email</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.email}</p>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Phone</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.phone}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Description</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.description || "N/A"}</p>
                </div>
                <button
                  onClick={() => setIsProfileEditing(true)}
                  className="btn btn-secondary"
                  style={{ cursor: "pointer" }}
                >
                  Edit Shop Information
                </button>
              </>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Owner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Owner Name"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Shop Name *</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleFormChange}
                    placeholder="Shop Name"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Shop Email"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Contact Number"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Shop Description"
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      fontSize: "0.95rem",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsProfileEditing(false)}
                    className="btn btn-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shop Preferences */}
          <div className="settings-group">
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Shop Settings</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={shopSettings.acceptOrders}
                onChange={(e) => handleShopSettingChange("acceptOrders", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>{shopSettings.acceptOrders ? "✅ Accept new orders" : "❌ Accept new orders"}</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={shopSettings.emailNotifications}
                onChange={(e) => handleShopSettingChange("emailNotifications", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>📧 Email notifications for orders</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={shopSettings.showOnMarketplace}
                onChange={(e) => handleShopSettingChange("showOnMarketplace", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>🌐 Show shop on marketplace</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={shopSettings.vacationMode}
                onChange={(e) => handleShopSettingChange("vacationMode", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>{shopSettings.vacationMode ? "🏖️ Vacation mode (ON)" : "🏖️ Vacation mode"}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
