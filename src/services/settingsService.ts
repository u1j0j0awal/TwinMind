import { AppSettings } from '../types';
import {
  DEFAULT_LIVE_SUGGESTION_PROMPT,
  DEFAULT_DETAILED_ANSWER_PROMPT,
  DEFAULT_CHAT_SYSTEM_PROMPT,
} from './promptService';

const SETTINGS_KEY = 'twinmind_settings';

const DEFAULT_SETTINGS: AppSettings = {
  groqApiKey: '',
  liveSuggestionPrompt: DEFAULT_LIVE_SUGGESTION_PROMPT,
  detailedAnswerPrompt: DEFAULT_DETAILED_ANSWER_PROMPT,
  chatPrompt: DEFAULT_CHAT_SYSTEM_PROMPT,
  liveContextWindow: 1024,
  detailedContextWindow: 2048,
  refreshInterval: 30000, // 30 seconds
};

export class SettingsService {
  static getSettings(): AppSettings {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: Partial<AppSettings>): void {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }

  static resetToDefaults(): void {
    localStorage.removeItem(SETTINGS_KEY);
  }

  static getApiKey(): string {
    return this.getSettings().groqApiKey;
  }

  static setApiKey(key: string): void {
    this.saveSettings({ groqApiKey: key });
  }

  static hasValidApiKey(): boolean {
    return this.getApiKey().length > 0;
  }

  static updatePrompt(
    promptType: 'liveSuggestion' | 'detailedAnswer' | 'chat',
    newPrompt: string
  ): void {
    const settings = this.getSettings();
    switch (promptType) {
      case 'liveSuggestion':
        settings.liveSuggestionPrompt = newPrompt;
        break;
      case 'detailedAnswer':
        settings.detailedAnswerPrompt = newPrompt;
        break;
      case 'chat':
        settings.chatPrompt = newPrompt;
        break;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  static getAlternativeModels(): string[] {
    // List of alternative models available on Groq for testing
    return [
      'mixtral-8x7b-32768',
      'llama2-70b-4096',
      'gemma-7b-it',
    ];
  }
}
