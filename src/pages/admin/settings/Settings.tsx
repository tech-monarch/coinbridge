import React, { useState, useEffect } from "react";
import "./Settings.css";
import {
  getSettings,
  updateSettings,
  listNetworks,
  createNetwork,
  updateNetwork,
} from "../../../services/admin.api";
import type {
  AdminSettings as AdminSettingsType,
  Network,
  CreateNetworkParams,
  UpdateNetworkParams,
} from "../../../services/admin.api";

/* ─────────────────────────────────────────────
   Draft type for the modal form
───────────────────────────────────────────── */
type NetworkDraft = CreateNetworkParams;

const BLANK_NETWORK: NetworkDraft = {
  name: "",
  slug: "",
  symbol: "",
  color: "#627EEA",
  confirmations: 12,
  min_deposit: 0.001,
  fee: 5.0,
  deposit_address: "",
  is_active: true,
};

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */
const IcoSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IcoClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─────────────────────────────────────────────
   NetworkCard
───────────────────────────────────────────── */
interface NetworkCardProps {
  network: Network;
  onEdit: (n: Network) => void;
  onToggle: (id: number, active: boolean) => void;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ network, onEdit, onToggle }) => (
  <div className={`net-card ${network.is_active ? "net-card--active" : "net-card--inactive"}`}>
    <div className="net-card-accent" style={{ background: network.color }} />
    <div className="net-card-body">
      <div className="net-card-head">
        <div className="net-card-identity">
          <div className="net-card-dot" style={{ background: network.color }} />
          <div>
            <span className="net-card-name">{network.name}</span>
            <span className="net-card-symbol">{network.symbol}</span>
          </div>
        </div>
        <div className="net-card-actions">
          <label className="adm-toggle-switch adm-toggle-switch--sm">
            <input
              type="checkbox"
              checked={network.is_active}
              onChange={(e) => onToggle(network.id, e.target.checked)}
            />
            <span className="adm-toggle-slider" />
          </label>
          <button className="net-card-edit-btn" onClick={() => onEdit(network)} title="Edit">
            <IcoEdit />
          </button>
        </div>
      </div>

      <div className="net-card-stats">
        <div className="net-stat">
          <span className="net-stat-label">Min Deposit</span>
          <span className="net-stat-value">{network.min_deposit} {network.symbol}</span>
        </div>
        <div className="net-stat">
          <span className="net-stat-label">Fee</span>
          <span className="net-stat-value">{network.fee} {network.symbol}</span>
        </div>
        <div className="net-stat">
          <span className="net-stat-label">Confirmations</span>
          <span className="net-stat-value">{network.confirmations}</span>
        </div>
      </div>

      <div className="net-card-address">
        <span className="net-stat-label">Deposit Address</span>
        <code className="net-address-code">
          {network.deposit_address || <em style={{ opacity: 0.45 }}>Not set</em>}
        </code>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   NetworkModal  (create + edit)
───────────────────────────────────────────── */
interface NetworkModalProps {
  initial: Network | null; // null = create mode
  onClose: () => void;
  onSave: (draft: NetworkDraft, id?: number) => Promise<void>;
}

const NetworkModal: React.FC<NetworkModalProps> = ({ initial, onClose, onSave }) => {
  const [draft, setDraft] = useState<NetworkDraft>(
    initial
      ? {
          name: initial.name,
          slug: initial.slug,
          symbol: initial.symbol,
          color: initial.color,
          confirmations: initial.confirmations,
          min_deposit: initial.min_deposit,
          fee: initial.fee,
          deposit_address: initial.deposit_address,
          is_active: initial.is_active,
        }
      : { ...BLANK_NETWORK }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof NetworkDraft, v: unknown) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const handleSubmit = async () => {
    if (!draft.name.trim() || !draft.slug.trim() || !draft.symbol.trim()) {
      setErr("Name, slug, and symbol are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await onSave(draft, initial?.id);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="net-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="net-modal">
        <div className="net-modal-header">
          <h3>{initial ? "Edit Network" : "Add Network"}</h3>
          <button className="net-modal-close" onClick={onClose}><IcoClose /></button>
        </div>

        {err && <div className="net-modal-err">{err}</div>}

        <div className="net-modal-body">
          {/* Name + Symbol */}
          <div className="net-modal-row net-modal-row--2">
            <label className="net-modal-field">
              <span>Name</span>
              <input
                className="adm-settings-input"
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ethereum"
              />
            </label>
            <label className="net-modal-field">
              <span>Symbol</span>
              <input
                className="adm-settings-input"
                value={draft.symbol}
                onChange={(e) => set("symbol", e.target.value)}
                placeholder="ETH"
              />
            </label>
          </div>

          {/* Slug + Color */}
          <div className="net-modal-row net-modal-row--2">
            <label className="net-modal-field">
              <span>
                Slug{" "}
                {initial && (
                  <em className="net-modal-hint">(locked after creation)</em>
                )}
              </span>
              <input
                className="adm-settings-input"
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="ethereum"
                disabled={!!initial}
              />
            </label>
            <label className="net-modal-field">
              <span>Color</span>
              <div className="net-color-row">
                <input
                  type="color"
                  className="net-color-picker"
                  value={draft.color}
                  onChange={(e) => set("color", e.target.value)}
                />
                <input
                  className="adm-settings-input"
                  value={draft.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="#627EEA"
                />
              </div>
            </label>
          </div>

          {/* Min Deposit + Fee + Confirmations */}
          <div className="net-modal-row net-modal-row--3">
            <label className="net-modal-field">
              <span>Min Deposit</span>
              <input
                type="number"
                className="adm-settings-input"
                value={draft.min_deposit}
                step="0.0001"
                min="0"
                onChange={(e) => set("min_deposit", parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="net-modal-field">
              <span>Fee</span>
              <input
                type="number"
                className="adm-settings-input"
                value={draft.fee}
                step="0.0001"
                min="0"
                onChange={(e) => set("fee", parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="net-modal-field">
              <span>Confirmations</span>
              <input
                type="number"
                className="adm-settings-input"
                value={draft.confirmations}
                min="1"
                onChange={(e) => set("confirmations", parseInt(e.target.value) || 1)}
              />
            </label>
          </div>

          {/* Deposit Address */}
          <label className="net-modal-field">
            <span>Deposit Address</span>
            <input
              className="adm-settings-input"
              value={draft.deposit_address}
              onChange={(e) => set("deposit_address", e.target.value)}
              placeholder="0x… / bc1… / T…"
            />
          </label>

          {/* Active toggle */}
          <div className="net-modal-toggle-row">
            <span>Active</span>
            <label className="adm-toggle-switch">
              <input
                type="checkbox"
                checked={draft.is_active ?? true}
                onChange={(e) => set("is_active", e.target.checked)}
              />
              <span className="adm-toggle-slider" />
            </label>
          </div>
        </div>

        <div className="net-modal-footer">
          <button className="net-modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="adm-settings-save-btn"
            onClick={handleSubmit}
            disabled={saving}
          >
            <IcoCheck /> {saving ? "Saving…" : initial ? "Update Network" : "Add Network"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const AdminSettings: React.FC = () => {
  /* ── General settings ── */
  const [settings, setSettings]               = useState<AdminSettingsType | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings]   = useState(false);
  const [savedSettings, setSavedSettings]     = useState(false);
  const [settingsError, setSettingsError]     = useState("");

  /* ── Networks ── */
  const [networks, setNetworks]               = useState<Network[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(true); // true on mount = no setState needed in effect
  const [networksError, setNetworksError]     = useState("");
  const [modalOpen, setModalOpen]             = useState(false);
  const [editTarget, setEditTarget]           = useState<Network | null>(null);

  /* ── Load settings ── */
  useEffect(() => {
    (async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (e) {
        setSettingsError(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  /* ── Load networks (no setState in effect body — starts as true) ── */
  useEffect(() => {
    const controller = new AbortController();
    listNetworks()
      .then((data) => { setNetworks(data); setNetworksError(""); })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setNetworksError(e instanceof Error ? e.message : "Failed to load networks");
        }
      })
      .finally(() => { setLoadingNetworks(false); });
    return () => controller.abort();
  }, []);

  /* ── Re-fetch after mutations (event handler, never an effect) ── */
  const refreshNetworks = async () => {
    try {
      const data = await listNetworks();
      setNetworks(data);
    } catch (e) {
      setNetworksError(e instanceof Error ? e.message : "Failed to refresh networks");
    }
  };

  /* ── Save general settings ── */
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    try {
      await updateSettings(settings);
      setSavedSettings(true);
      setTimeout(() => setSavedSettings(false), 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  /* ── Create / update network ── */
  const handleNetworkSave = async (draft: NetworkDraft, id?: number) => {
    if (id !== undefined) {
      // Edit: only pass fields the backend UpdateNetworkParams accepts
      const payload: UpdateNetworkParams = {
        name:            draft.name,
        deposit_address: draft.deposit_address,
        fee:             draft.fee,
        min_deposit:     draft.min_deposit,
        confirmations:   draft.confirmations,
        is_active:       draft.is_active,
      };
      await updateNetwork(id, payload);
    } else {
      // Create: full payload
      await createNetwork(draft);
    }
    await refreshNetworks();
  };

  /* ── Toggle active inline (optimistic) ── */
  const handleToggle = async (id: number, active: boolean) => {
    setNetworks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_active: active } : n))
    );
    try {
      await updateNetwork(id, { is_active: active });
    } catch {
      // Revert on failure
      setNetworks((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_active: !active } : n))
      );
    }
  };

  const openAdd    = ()            => { setEditTarget(null); setModalOpen(true); };
  const openEdit   = (n: Network)  => { setEditTarget(n);   setModalOpen(true); };
  const closeModal = ()            => { setModalOpen(false); setEditTarget(null); };

  /* ─────── Render ─────── */
  return (
    <div className="adm-settings page-enter">

      {/* ══════════════════════════════════════
          NETWORKS — main section
      ══════════════════════════════════════ */}
      <div className="adm-page-hd">
        <div>
          <h1>Networks</h1>
          <p>Manage blockchain networks, fees and deposit addresses</p>
        </div>
        <button className="adm-settings-save-btn" onClick={openAdd}>
          <IcoPlus /> Add Network
        </button>
      </div>

      {networksError && (
        <div className="adm-alert adm-alert--error">{networksError}</div>
      )}

      {loadingNetworks ? (
        <div className="net-skeleton-grid">
          {[1, 2, 3].map((i) => <div key={i} className="net-skeleton" />)}
        </div>
      ) : networks.length === 0 ? (
        <div className="net-empty">
          <span>No networks configured yet.</span>
          <button className="net-empty-add" onClick={openAdd}>
            <IcoPlus /> Add your first network
          </button>
        </div>
      ) : (
        <div className="net-grid">
          {networks.map((n) => (
            <NetworkCard
              key={n.id}
              network={n}
              onEdit={openEdit}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════
          GENERAL SETTINGS
      ══════════════════════════════════════ */}
      <div className="adm-settings-divider" />

      <div className="adm-page-hd adm-page-hd--sub">
        <div>
          <h2>Admin Settings</h2>
          <p>Configure system preferences and features</p>
        </div>
      </div>

      {settingsError && (
        <div className="adm-alert adm-alert--error">{settingsError}</div>
      )}

      {loadingSettings ? (
        <div style={{ padding: "24px 0", color: "var(--text-tertiary)", fontSize: "0.875rem" }}>
          Loading settings…
        </div>
      ) : (
        <>
          {/* Notifications */}
          <div className="adm-settings-section">
            <h2 className="adm-settings-section-title">Notifications</h2>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">Email Notifications</span>
                <p className="adm-settings-desc">Receive alerts via email</p>
              </div>
              <label className="adm-toggle-switch">
                <input
                  type="checkbox"
                  checked={settings?.email_notifications ?? false}
                  onChange={(e) =>
                    setSettings({ ...settings!, email_notifications: e.target.checked })
                  }
                />
                <span className="adm-toggle-slider" />
              </label>
            </div>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">Push Notifications</span>
                <p className="adm-settings-desc">Enable browser push alerts</p>
              </div>
              <label className="adm-toggle-switch">
                <input
                  type="checkbox"
                  checked={settings?.push_notifications ?? false}
                  onChange={(e) =>
                    setSettings({ ...settings!, push_notifications: e.target.checked })
                  }
                />
                <span className="adm-toggle-slider" />
              </label>
            </div>
          </div>

          {/* System */}
          <div className="adm-settings-section">
            <h2 className="adm-settings-section-title">System</h2>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">Maintenance Mode</span>
                <p className="adm-settings-desc">Temporarily disable user access</p>
              </div>
              <label className="adm-toggle-switch">
                <input
                  type="checkbox"
                  checked={settings?.maintenance_mode ?? false}
                  onChange={(e) =>
                    setSettings({ ...settings!, maintenance_mode: e.target.checked })
                  }
                />
                <span className="adm-toggle-slider" />
              </label>
            </div>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">System Status</span>
                <p className="adm-settings-desc">Current operational status</p>
              </div>
              <div className="adm-status-badge adm-status-badge--ok">● Operational</div>
            </div>
          </div>

          {/* API */}
          <div className="adm-settings-section">
            <h2 className="adm-settings-section-title">API Configuration</h2>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">API Rate Limit</span>
                <p className="adm-settings-desc">Requests per minute</p>
              </div>
              <input
                type="number"
                className="adm-settings-input"
                value={settings?.api_rate_limit ?? 0}
                onChange={(e) =>
                  setSettings({ ...settings!, api_rate_limit: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="adm-settings-item">
              <div className="adm-settings-label">
                <span className="adm-settings-name">Webhook URL</span>
                <p className="adm-settings-desc">For transaction notifications</p>
              </div>
              <input
                type="text"
                className="adm-settings-input"
                value={settings?.webhook_url ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings!, webhook_url: e.target.value })
                }
                placeholder="https://api.example.com/webhook"
              />
            </div>
          </div>

          <div className="adm-settings-actions">
            <button
              className="adm-settings-save-btn"
              onClick={handleSaveSettings}
              disabled={savingSettings}
            >
              <IcoSave /> {savingSettings ? "Saving…" : "Save Changes"}
            </button>
            {savedSettings && (
              <span className="adm-settings-saved">✓ Saved successfully</span>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <NetworkModal
          initial={editTarget}
          onClose={closeModal}
          onSave={handleNetworkSave}
        />
      )}
    </div>
  );
};

export default AdminSettings;