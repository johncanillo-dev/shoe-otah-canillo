"use client";

import { useState } from "react";
import { useAuth, User } from "@/lib/auth-context";

export const SettingsManager = () => {
  const { user, updateUserProfile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIconEditing, setIsIconEditing] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [adminIcon, setAdminIcon] = useState(user?.icon || "⚙️");
  const [tempIcon, setTempIcon] = useState(adminIcon);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [systemSettings, setSystemSettings] = useState({
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
  });

  const presetIcons = ["⚙️", "👨‍💼", "🔐", "👨‍💻", "🌟", "📊", "🎯"];

  const handleIconChange = (icon: string) => {
    setTempIcon(icon);
  };

  const handleSaveIcon = () => {
    setAdminIcon(tempIcon);
    if (updateUserProfile && user) {
      updateUserProfile({ ...user, icon: tempIcon } as User);
    }
    setIsIconEditing(false);
    showSuccess("Admin icon updated successfully!");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (!formData.name || !formData.email) {
      showError("Please fill in all fields");
      return;
    }
    if (updateUserProfile && user) {
      updateUserProfile({
        ...user,
        name: formData.name,
        email: formData.email,
      } as User);
    }
    setIsProfileEditing(false);
    showSuccess("Profile updated successfully!");
  };

  const handleSystemSettingChange = (key: string, value: boolean) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    showSuccess("System setting updated!");
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
        <span>⚙️ Admin Settings</span>
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
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "0.75rem", color: "#5e584d" }}>Admin Icon</h3>
            <div className="icon-display" style={{ fontSize: "2rem", marginBottom: "1rem", padding: "0.5rem" }}>
              {adminIcon}
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
                      setTempIcon(adminIcon);
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
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>Profile Information</h3>
            {!isProfileEditing ? (
              <>
                <div style={{ marginBottom: "0.75rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Name</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.name}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.85rem", color: "#666" }}>Email</p>
                  <p style={{ margin: "0", fontSize: "0.95rem", color: "#5e584d", fontWeight: "600" }}>{formData.email}</p>
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
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Admin Name"
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
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem", color: "#5e584d" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Admin Email"
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

          {/* System Settings */}
          <div className="settings-group">
            <h3 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem", color: "#5e584d" }}>System Settings</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={systemSettings.enableNotifications}
                onChange={(e) => handleSystemSettingChange("enableNotifications", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>🔔 Enable notifications</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={systemSettings.enableEmailAlerts}
                onChange={(e) => handleSystemSettingChange("enableEmailAlerts", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>📧 Email alerts</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={systemSettings.maintenanceMode}
                onChange={(e) => handleSystemSettingChange("maintenanceMode", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>{systemSettings.maintenanceMode ? "🔧 Maintenance mode (ON)" : "🔧 Maintenance mode"}</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
