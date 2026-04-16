import React from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onSettings: () => void;
  isRefreshing: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onRefresh,
  onExport,
  onSettings,
  isRefreshing,
}) => {
  return (
    <div className="controls-bar">
      <div className="controls-left">
        {!isRecording ? (
          <button
            className="btn btn-primary btn-large"
            onClick={onStartRecording}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            className="btn btn-danger btn-large"
            onClick={onStopRecording}
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>

      <div className="controls-center">
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={isRefreshing || !isRecording}
          title="Manually refresh transcript and suggestions"
        >
          {isRefreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      <div className="controls-right">
        <button
          className="btn btn-secondary"
          onClick={onExport}
          title="Export session as JSON"
        >
          📥 Export
        </button>
        <button
          className="btn btn-secondary"
          onClick={onSettings}
          title="Settings"
        >
          ⚙ Settings
        </button>
      </div>
    </div>
  );
};
