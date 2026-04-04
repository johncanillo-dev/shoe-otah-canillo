"use client";

import { useState, useEffect } from "react";
import { useAuth, User } from "@/lib/auth-context";

export const UserSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIconEditing, setIsIconEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [userIcon, setUserIcon] = useState(user?.icon || "👤");
  const [tempIcon, setTempIcon] = useState(userIcon);
  const [activeSection, setActiveSection] = useState<"profile" | "email" | "password" | "dashboard">("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [emailData, setEmailData] = useState({
    currentEmail: user?.email || "",
    newEmail: "",
    confirmEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [dashboardSettings, setDashboardSettings] = useState({
    showDeliveryInfo: true,
    showRecentOrders: true,
    showCart: true,
    showMap: true,
    displayLayout: "grid" as "grid" | "list",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    promotions: true,
    marketing: false,
  });

  const presetIcons = ["👤", "👨", "👩", "🙂", "😊", "⭐", "🎯", "👥"];

  // Sync form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setUserIcon(user.icon || "👤");
      setEmailData((prev) => ({
        ...prev,
        currentEmail: user.email || "",
      }));
      
      // Load dashboard settings from user profile
      if (user.dashboardSettings) {
        setDashboardSettings(user.dashboardSettings);
      }
      
      // Load preferences from user profile
      if (user.preferences) {
        setPreferences(user.preferences);
      }
    }
  }, [user]);

  const handleIconChange = (icon: string) => {
    setTempIcon(icon);
  };

  const handleSaveIcon = () => {
    setUserIcon(tempIcon);
    if (updateUserProfile && user) {
      updateUserProfile({ ...user, icon: tempIcon } as User);
    }
    setIsIconEditing(false);
    showSuccess("Avatar updated successfully!");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      } as User);
    }
    setIsProfileEditing(false);
    showSuccess("Profile updated successfully!");
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
      showError("Please fill in all email fields");
      return;
    }
    if (emailData.newEmail !== emailData.confirmEmail) {
      showError("Email addresses do not match");
      return;
    }
    if (emailData.newEmail === emailData.currentEmail) {
      showError("New email must be different from current email");
      return;
    }
    
    // Here you would typically send this to your backend
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        email: emailData.newEmail,
      } as User);
    }
    
    setEmailData({
      currentEmail: emailData.newEmail,
      newEmail: "",
      confirmEmail: "",
    });
    setIsEmailEditing(false);
    showSuccess("Email changed successfully! A verification link has been sent to your new email.");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showError("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }
    
    // Update password in user context
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        password: passwordData.newPassword,
      } as User);
    }
    
    showSuccess("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDashboardSettingChange = (key: string, value: any) => {
    const updatedSettings = {
      ...dashboardSettings,
      [key]: value,
    };
    setDashboardSettings(updatedSettings);
    
    // Save dashboard settings to user profile
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        dashboardSettings: updatedSettings,
      } as User);
    }
    
    showSuccess("Dashboard setting updated!");
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };
    setPreferences(updatedPreferences);
    
    // Save preferences to user profile
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        preferences: updatedPreferences,
      } as User);
    }
    
    showSuccess("Preference updated!");
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
        <span>👤 My Settings</span>
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

          {/* Settings Navigation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {["profile", "email", "password", "dashboard"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                style={{
                  padding: "0.75rem",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: activeSection === section ? "3px solid var(--accent)" : "1px solid #ddd",
                  backgroundColor: activeSection === section ? "#f0e8e0" : "#fff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: activeSection === section ? "600" : "400",
                  color: activeSection === section ? "var(--accent)" : "#5e584d",
                  textTransform: "capitalize",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                {section === "profile" && "👤"}
                {section === "email" && "📧"}
                {section === "password" && "🔐"}
                {section === "dashboard" && "📊"}
                {" " + section}
              </button>
            ))}
          </div>

          {/* Profile Section */}
          {activeSection === "profile" && (
            <>
              {/* Icon Settings */}
              <div className="settings-group" style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e0d5cc" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem", color: "#5e584d" }}>Profile Avatar</h3>
                <div className="icon-display" style={{ fontSize: "2rem", marginBottom: "1rem", padding: "0.5rem" }}>
                  {userIcon}
                </div>

                {!isIconEditing ? (
                  <button
                    onClick={() => setIsIconEditing(true)}
                    className="btn btn-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Change Avatar
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
                        Save Avatar
                      </button>
                      <button
                        onClick={() => {
                          setIsIconEditing(false);
                          setTempIcon(userIcon);
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

              {/* Profile Settings */}
              <div className="settings-group" style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid #e0d5cc" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Personal Information</h3>
                {!isProfileEditing ? (
                  <>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Name</p>
                      <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.name || "Not set"}</p>
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Email</p>
                      <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.email || "Not set"}</p>
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Phone</p>
                      <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.phone || "Not set"}</p>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Delivery Address</p>
                      <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.address || "Not set"}</p>
                    </div>
                    <button
                      onClick={() => setIsProfileEditing(true)}
                      className="btn btn-secondary"
                      style={{ cursor: "pointer" }}
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Full Name"
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
                      <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="Phone Number"
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
                      <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Delivery Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder="Delivery Address"
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

              {/* Preferences */}
              <div className="settings-group">
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Preferences</h3>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>📧 Email notifications for orders</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={preferences.promotions}
                    onChange={(e) => handlePreferenceChange("promotions", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>🎁 Promotions & special offers</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => handlePreferenceChange("marketing", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>💌 Marketing emails</span>
                </label>
              </div>
            </>
          )}

          {/* Email Section */}
          {activeSection === "email" && (
            <div className="settings-group">
              <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Email Address</h3>
              {!isEmailEditing ? (
                <>
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Current Email</p>
                    <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{emailData.currentEmail}</p>
                  </div>
                  <button
                    onClick={() => setIsEmailEditing(true)}
                    className="btn btn-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Change Email
                  </button>
                </>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#5e584d" }}>New Email Address</label>
                    <input
                      type="email"
                      name="newEmail"
                      value={emailData.newEmail}
                      onChange={handleEmailChange}
                      placeholder="Enter new email address"
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
                    <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#5e584d" }}>Confirm New Email</label>
                    <input
                      type="email"
                      name="confirmEmail"
                      value={emailData.confirmEmail}
                      onChange={handleEmailChange}
                      placeholder="Confirm new email address"
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
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={handleSaveEmail}
                      className="btn btn-primary"
                      style={{ cursor: "pointer" }}
                    >
                      Save Email
                    </button>
                    <button
                      onClick={() => {
                        setIsEmailEditing(false);
                        setEmailData((prev) => ({
                          ...prev,
                          newEmail: "",
                          confirmEmail: "",
                        }));
                      }}
                      className="btn btn-secondary"
                      style={{ cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#666" }}>
                    📧 A verification link will be sent to your new email address. Please verify it to complete the change.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Password Section */}
          {activeSection === "password" && (
            <div className="settings-group">
              <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Change Password</h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#5e584d" }}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    style={{
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
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#5e584d" }}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    style={{
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
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.5rem", color: "#5e584d" }}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    style={{
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
                <button
                  onClick={handleChangePassword}
                  className="btn btn-primary"
                  style={{ cursor: "pointer" }}
                >
                  Change Password
                </button>
                <p style={{ fontSize: "0.85rem", color: "#666" }}>
                  🔐 Password must be at least 6 characters long. Use a mix of letters, numbers, and symbols for better security.
                </p>
              </div>
            </div>
          )}

          {/* Dashboard Settings Section */}
          {activeSection === "dashboard" && (
            <div className="settings-group">
              <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Customize Dashboard</h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: "#5e584d" }}>Dashboard Widgets</h4>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dashboardSettings.showDeliveryInfo}
                      onChange={(e) => handleDashboardSettingChange("showDeliveryInfo", e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>📦 Show Recent Delivery Info</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dashboardSettings.showRecentOrders}
                      onChange={(e) => handleDashboardSettingChange("showRecentOrders", e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>📋 Show Recent Orders</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dashboardSettings.showCart}
                      onChange={(e) => handleDashboardSettingChange("showCart", e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>🛒 Show Shopping Cart</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dashboardSettings.showMap}
                      onChange={(e) => handleDashboardSettingChange("showMap", e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span>📍 Show Store Location Map</span>
                  </label>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: "#5e584d" }}>Display Layout</h4>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="layout"
                        value="grid"
                        checked={dashboardSettings.displayLayout === "grid"}
                        onChange={(e) => handleDashboardSettingChange("displayLayout", e.target.value)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <span>📊 Grid View</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="layout"
                        value="list"
                        checked={dashboardSettings.displayLayout === "list"}
                        onChange={(e) => handleDashboardSettingChange("displayLayout", e.target.value)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                      <span>📝 List View</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
