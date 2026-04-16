import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { SettingsService } from '../services/settingsService';
import '../styles/Settings.css';
export const Settings = ({ isOpen, onClose, settings, onSettingsChange, }) => {
    const [localSettings, setLocalSettings] = useState(settings);
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
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "settings-overlay", onClick: onClose, children: _jsxs("div", { className: "settings-modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "settings-header", children: [_jsx("h2", { children: "Settings" }), _jsx("button", { className: "close-btn", onClick: onClose, children: "\u2715" })] }), _jsxs("div", { className: "settings-content", children: [_jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "api-key", children: "Groq API Key" }), _jsx("input", { id: "api-key", type: "password", value: localSettings.groqApiKey, onChange: (e) => setLocalSettings({ ...localSettings, groqApiKey: e.target.value }), placeholder: "Enter your Groq API key" }), _jsx("small", { children: "Get your key from https://console.groq.com/keys" })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "refresh-interval", children: "Refresh Interval (ms)" }), _jsx("input", { id: "refresh-interval", type: "number", value: localSettings.refreshInterval, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        refreshInterval: Math.max(10000, parseInt(e.target.value) || 30000),
                                    }), min: "10000", step: "5000" })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "live-context", children: "Live Suggestions Context Window (tokens)" }), _jsx("input", { id: "live-context", type: "number", value: localSettings.liveContextWindow, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        liveContextWindow: Math.max(256, parseInt(e.target.value) || 1024),
                                    }), min: "256", step: "256" })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "detailed-context", children: "Detailed Answer Context Window (tokens)" }), _jsx("input", { id: "detailed-context", type: "number", value: localSettings.detailedContextWindow, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        detailedContextWindow: Math.max(512, parseInt(e.target.value) || 2048),
                                    }), min: "512", step: "256" })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "live-prompt", children: "Live Suggestion Prompt" }), _jsx("textarea", { id: "live-prompt", value: localSettings.liveSuggestionPrompt, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        liveSuggestionPrompt: e.target.value,
                                    }), rows: 6 })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "detailed-prompt", children: "Detailed Answer Prompt" }), _jsx("textarea", { id: "detailed-prompt", value: localSettings.detailedAnswerPrompt, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        detailedAnswerPrompt: e.target.value,
                                    }), rows: 6 })] }), _jsxs("div", { className: "settings-section", children: [_jsx("label", { htmlFor: "chat-prompt", children: "Chat System Prompt" }), _jsx("textarea", { id: "chat-prompt", value: localSettings.chatPrompt, onChange: (e) => setLocalSettings({
                                        ...localSettings,
                                        chatPrompt: e.target.value,
                                    }), rows: 6 })] })] }), _jsxs("div", { className: "settings-footer", children: [_jsx("button", { className: "btn-danger", onClick: handleReset, children: "Reset to Defaults" }), _jsxs("div", { className: "footer-right", children: [_jsx("button", { className: "btn-secondary", onClick: onClose, children: "Cancel" }), _jsx("button", { className: "btn-primary", onClick: handleSave, children: "Save Settings" })] })] })] }) }));
};
