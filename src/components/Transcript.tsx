import React, { useEffect, useRef } from 'react';
import { TranscriptChunk } from '../types';
import '../styles/Transcript.css';

interface TranscriptProps {
  chunks: TranscriptChunk[];
  isRecording: boolean;
}

export const Transcript: React.FC<TranscriptProps> = ({ chunks, isRecording }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chunks]);

  const fullText = chunks.map((chunk) => chunk.text).join(' ');

  return (
    <div className="transcript-panel">
      <div className="transcript-header">
        <h2>Transcript</h2>
        {isRecording && <span className="recording-indicator">● Recording</span>}
      </div>
      <div className="transcript-content">
        {chunks.length === 0 ? (
          <div className="empty-state">
            <p>Start recording to begin transcription</p>
          </div>
        ) : (
          <>
            <div className="transcript-text">{fullText}</div>
            <div ref={endRef} />
          </>
        )}
      </div>
    </div>
  );
};
