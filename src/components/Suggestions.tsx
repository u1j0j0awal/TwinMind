import React from 'react';
import { Suggestion, SuggestionBatch } from '../types';
import '../styles/Suggestions.css';

interface SuggestionsProps {
  batches: SuggestionBatch[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export const Suggestions: React.FC<SuggestionsProps> = ({
  batches,
  isLoading,
  onSuggestionClick,
}) => {
  return (
    <div className="suggestions-panel">
      <div className="suggestions-header">
        <h2>Live Suggestions</h2>
        {isLoading && <span className="loading-indicator">⟳ Generating...</span>}
      </div>
      <div className="suggestions-content">
        {batches.length === 0 ? (
          <div className="empty-state">
            <p>Suggestions will appear here as you talk</p>
          </div>
        ) : (
          <div className="suggestions-list">
            {batches.map((batch) => (
              <div key={batch.id} className="suggestion-batch">
                <div className="batch-timestamp">
                  {new Date(batch.timestamp).toLocaleTimeString()}
                </div>
                <div className="suggestions-in-batch">
                  {batch.suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`suggestion-card suggestion-${suggestion.type}`}
                      onClick={() => onSuggestionClick(suggestion)}
                    >
                      <div className="suggestion-type">
                        <span className="type-badge">{suggestion.type}</span>
                      </div>
                      <div className="suggestion-content">
                        <h4>{suggestion.title}</h4>
                        <p className="preview">{suggestion.preview}</p>
                      </div>
                      <div className="suggestion-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
