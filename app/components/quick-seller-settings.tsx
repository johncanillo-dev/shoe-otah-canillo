"use client";

import { useState, useEffect } from "react";
import { useSeller, SellerUser } from "@/lib/seller-context";

export const QuickSellerSettings = () => {
  const { seller, updateSellerProfile } = useSeller();
  const [isOpen, setIsOpen] = useState(false);
  const [sellerIcon, setSellerIcon] = useState(seller?.icon || "🏪");
  const [tempIcon, setTempIcon] = useState(sellerIcon);
  const [isChangingIcon, setIsChangingIcon] = useState(false);
  const [activeTab, setActiveTab] = useState<"icon" | "shop" | "email" | "password">("icon");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: seller?.name || "",
    shopName: seller?.shopName || "",
    phone: seller?.phone || "",
  });

  const [emailData, setEmailData] = useState({
    currentEmail: seller?.email || "",
    newEmail: "",
    confirmEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const presetIcons = ["🏪", "🛍️", "🏬", "💼", "🎯", "⭐", "👨‍💼", "📱"];

  useEffect(() => {
    if (seller) {
      setSellerIcon(seller.icon || "🏪");
      setFormData({
        name: seller.name || "",
        shopName: seller.shopName || "",
        phone: seller.phone || "",
      });
      setEmailData((prev) => ({
        ...prev,
        currentEmail: seller.email || "",
      }));
    }
  }, [seller]);

  const handleIconChange = (icon: string) => {
    setTempIcon(icon);
  };

  const handleSaveIcon = () => {
    setSellerIcon(tempIcon);
    if (updateSellerProfile && seller) {
      updateSellerProfile({ ...seller, icon: tempIcon } as SellerUser);
    }
    setIsChangingIcon(false);
    showSuccess("Icon updated!");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveShop = () => {
    if (!formData.name || !formData.shopName || !formData.phone) {
      showSuccess("Fill all fields");
      return;
    }
    if (updateSellerProfile && seller) {
      updateSellerProfile({
        ...seller,
        name: formData.name,
        shopName: formData.shopName,
        phone: formData.phone,
      } as SellerUser);
    }
    showSuccess("Shop info updated!");
    setActiveTab("icon");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEmail = () => {
    if (!emailData.newEmail || !emailData.confirmEmail) {
      showSuccess("Fill email fields");
      return;
    }
    if (emailData.newEmail !== emailData.confirmEmail) {
      showSuccess("Emails don't match");
      return;
    }
    if (updateSellerProfile && seller) {
      updateSellerProfile({
        ...seller,
        email: emailData.newEmail,
      } as SellerUser);
    }
    setEmailData({
      currentEmail: emailData.newEmail,
      newEmail: "",
      confirmEmail: "",
    });
    showSuccess("Email changed!");
    setActiveTab("icon");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePassword = () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      showSuccess("Fill password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSuccess("Passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showSuccess("Min 6 characters");
      return;
    }
    if (updateSellerProfile && seller) {
      updateSellerProfile({
        ...seller,
      } as SellerUser);
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showSuccess("Password changed!");
    setActiveTab("icon");
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Settings Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "none",
          borderRadius: "50%",
          backgroundColor: isOpen ? "var(--accent)" : "#f0e8e0",
          color: isOpen ? "#fff" : "#5e584d",
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          marginLeft: "0.5rem",
        }}
        title="Quick Settings"
      >
        ⚙️
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: "0",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0d5cc",
            borderLeft: "1px solid #e0d5cc",
            borderRight: "1px solid #e0d5cc",
            borderBottom: "1px solid #e0d5cc",
            borderRadius: "8px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
            padding: "1rem",
            minWidth: "300px",
            zIndex: 10000,
          }}
        >
          {/* Shop Icon Section */}
          <div style={{ marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: "1px solid #e0d5cc" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h4 style={{ margin: "0", fontSize: "0.95rem", fontWeight: "600", color: "#5e584d" }}>Shop Icon</h4>
              <span style={{ fontSize: "1.8rem" }}>{sellerIcon}</span>
            </div>

            {!isChangingIcon ? (
              <button
                onClick={() => setIsChangingIcon(true)}
                style={{
                  width: "100%",
                  padding: "0.65rem",
                  borderTop: "1px solid #d4ccc3",
                  borderLeft: "1px solid #d4ccc3",
                  borderRight: "1px solid #d4ccc3",
                  borderBottom: "1px solid #d4ccc3",
                  borderRadius: "6px",
                  backgroundColor: "#f8f6f3",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#5e584d",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0e8e0";
                  e.currentTarget.style.borderColor = "#c4b8ae";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f6f3";
                  e.currentTarget.style.borderColor = "#d4ccc3";
                }}
              >
                Change Icon
              </button>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem", marginBottom: "0.5rem" }}>
                  {presetIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => handleIconChange(icon)}
                      style={{
                        fontSize: "1.2rem",
                        padding: "0.5rem",
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
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={handleSaveIcon}
                    style={{
                      flex: 1,
                      padding: "0.4rem",
                      borderTop: "1px solid var(--accent)",
                      borderLeft: "1px solid var(--accent)",
                      borderRight: "1px solid var(--accent)",
                      borderBottom: "1px solid var(--accent)",
                      borderRadius: "4px",
                      backgroundColor: "var(--accent)",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingIcon(false);
                      setTempIcon(sellerIcon);
                    }}
                    style={{
                      flex: 1,
                      padding: "0.4rem",
                      borderTop: "1px solid #d4ccc3",
                      borderLeft: "1px solid #d4ccc3",
                      borderRight: "1px solid #d4ccc3",
                      borderBottom: "1px solid #d4ccc3",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "#5e584d",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          {successMsg && (
            <div style={{ padding: "0.6rem", backgroundColor: "#d4edda", color: "#155724", borderRadius: "4px", marginBottom: "0.8rem", fontSize: "0.85rem", textAlign: "center" }}>
              ✅ {successMsg}
            </div>
          )}

          {/* Settings Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem", marginBottom: "0.8rem" }}>
            {[
              { id: "icon", label: "🏪", name: "Icon" },
              { id: "shop", label: "🏢", name: "Shop" },
              { id: "email", label: "📧", name: "Email" },
              { id: "password", label: "🔐", name: "Pass" },
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "icon") setIsChangingIcon(true);
                }}
                style={{
                  padding: "0.5rem",
                  borderTop: activeTab === tab.id ? "2px solid var(--accent)" : "1px solid #ddd",
                  borderLeft: "1px solid #ddd",
                  borderRight: "1px solid #ddd",
                  borderBottom: activeTab === tab.id ? "2px solid var(--accent)" : "1px solid #ddd",
                  backgroundColor: activeTab === tab.id ? "#f0e8e0" : "#fff",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "var(--accent)" : "#5e584d",
                  borderRadius: "4px",
                }}
                title={tab.name}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Icon Selection */}
          {activeTab === "icon" && (
            <div style={{ display: "grid", gap: "0.5rem", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
              <div style={{ fontSize: "2.5rem", textAlign: "center" }}>{tempIcon || "🏪"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem" }}>
                {["🏪", "🏬", "🏢", "🛍️", "📦", "🎯", "⭐", "✨"].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => {
                      setTempIcon(icon);
                    }}
                    style={{
                      padding: "0.5rem",
                      fontSize: "1.3rem",
                      backgroundColor: tempIcon === icon ? "#f0e8e0" : "#fff",
                      border: tempIcon === icon ? "2px solid var(--accent)" : "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (updateSellerProfile && seller) {
                    updateSellerProfile({ ...seller, icon: tempIcon } as SellerUser);
                    setSellerIcon(tempIcon);
                    setIsChangingIcon(false);
                    showSuccess("Icon updated!");
                  }
                }}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginTop: "0.3rem",
                }}
              >
                Save Icon
              </button>
            </div>
          )}

          {/* Shop Info Edit Form */}
          {activeTab === "shop" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Your name"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleFormChange}
                  placeholder="Shop name"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={handleSaveShop}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Save Shop Info
              </button>
            </div>
          )}

          {/* Email Edit Form */}
          {activeTab === "email" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>New Email</label>
                <input
                  type="email"
                  name="newEmail"
                  value={emailData.newEmail}
                  onChange={handleEmailChange}
                  placeholder="New email"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Confirm Email</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={emailData.confirmEmail}
                  onChange={handleEmailChange}
                  placeholder="Confirm email"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={handleSaveEmail}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Change Email
              </button>
            </div>
          )}

          {/* Password Edit Form */}
          {activeTab === "password" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm password"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={handleSavePassword}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Change Password
              </button>
            </div>
          )}

          {/* Email Edit Form */}
          {activeTab === "email" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>New Email</label>
                <input
                  type="email"
                  name="newEmail"
                  value={emailData.newEmail}
                  onChange={handleEmailChange}
                  placeholder="New email"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Confirm Email</label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={emailData.confirmEmail}
                  onChange={handleEmailChange}
                  placeholder="Confirm email"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={handleSaveEmail}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Change Email
              </button>
            </div>
          )}

          {/* Password Edit Form */}
          {activeTab === "password" && (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#5e584d", display: "block", marginBottom: "0.2rem" }}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm password"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.85rem",
                    borderTop: "1px solid #d4ccc3",
                    borderLeft: "1px solid #d4ccc3",
                    borderRight: "1px solid #d4ccc3",
                    borderBottom: "1px solid #d4ccc3",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                onClick={handleSavePassword}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
