import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import '../styles/Transcript.css';
export const Transcript = ({ chunks, isRecording }) => {
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chunks]);
    const fullText = chunks.map((chunk) => chunk.text).join(' ');
    return (_jsxs("div", { className: "transcript-panel", children: [_jsxs("div", { className: "transcript-header", children: [_jsx("h2", { children: "Transcript" }), isRecording && _jsx("span", { className: "recording-indicator", children: "\u25CF Recording" })] }), _jsx("div", { className: "transcript-content", children: chunks.length === 0 ? (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "Start recording to begin transcription" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "transcript-text", children: fullText }), _jsx("div", { ref: endRef })] })) })] }));
};
