import React, { useState } from 'react';
import { AppSettings } from '../types';
import { SettingsService } from '../services/settingsService';
import '../styles/Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    SettingsService.saveSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      SettingsService.resetToDefaults();
      const defaults = SettingsService.getSettings();
      setLocalSettings(defaults);
      onSettingsChange(defaults);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <label htmlFor="api-key">Groq API Key</label>
            <input
              id="api-key"
              type="password"
              value={localSettings.groqApiKey}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, groqApiKey: e.target.value })
              }
              placeholder="Enter your Groq API key"
            />
            <small>Get your key from https://console.groq.com/keys</small>
          </div>

          <div className="settings-section">
            <label htmlFor="refresh-interval">Refresh Interval (ms)</label>
            <input
              id="refresh-interval"
              type="number"
              value={localSettings.refreshInterval}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  refreshInterval: Math.max(10000, parseInt(e.target.value) || 30000),
                })
              }
              min="10000"
              step="5000"
            />
          </div>

          <div className="settings-section">
            <label htmlFor="live-context">Live Suggestions Context Window (tokens)</label>
            <input
              id="live-context"
              type="number"
              value={localSettings.liveContextWindow}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  liveContextWindow: Math.max(256, parseInt(e.target.value) || 1024),
                })
              }
              min="256"
              step="256"
            />
          </div>

          <div className="settings-section">
            <label htmlFor="detailed-context">Detailed Answer Context Window (tokens)</label>
            <input
              id="detailed-context"
              type="number"
              value={localSettings.detailedContextWindow}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  detailedContextWindow: Math.max(512, parseInt(e.target.value) || 2048),
                })
              }
              min="512"
              step="256"
            />
          </div>

          <div className="settings-section">
            <label htmlFor="live-prompt">Live Suggestion Prompt</label>
            <textarea
              id="live-prompt"
              value={localSettings.liveSuggestionPrompt}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  liveSuggestionPrompt: e.target.value,
                })
              }
              rows={6}
            />
          </div>

          <div className="settings-section">
            <label htmlFor="detailed-prompt">Detailed Answer Prompt</label>
            <textarea
              id="detailed-prompt"
              value={localSettings.detailedAnswerPrompt}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  detailedAnswerPrompt: e.target.value,
                })
              }
              rows={6}
            />
          </div>

          <div className="settings-section">
            <label htmlFor="chat-prompt">Chat System Prompt</label>
            <textarea
              id="chat-prompt"
              value={localSettings.chatPrompt}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  chatPrompt: e.target.value,
                })
              }
              rows={6}
            />
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-danger" onClick={handleReset}>
            Reset to Defaults
          </button>
          <div className="footer-right">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
