import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import '../styles/Chat.css';
export const Chat = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };
    return (_jsxs("div", { className: "chat-panel", children: [_jsx("div", { className: "chat-header", children: _jsx("h2", { children: "Chat" }) }), _jsx("div", { className: "chat-messages", children: messages.length === 0 ? (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "Click a suggestion or type a question to start chatting" }) })) : (_jsxs(_Fragment, { children: [messages.map((msg) => (_jsxs("div", { className: `chat-message ${msg.role}`, children: [_jsxs("div", { className: "message-header", children: [_jsx("span", { className: "role", children: msg.role === 'user' ? 'You' : 'Assistant' }), _jsx("span", { className: "timestamp", children: new Date(msg.timestamp).toLocaleTimeString() })] }), _jsx("div", { className: "message-content", children: msg.content })] }, msg.id))), isLoading && (_jsx("div", { className: "chat-message assistant loading", children: _jsxs("div", { className: "typing-indicator", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }) })), _jsx("div", { ref: endRef })] })) }), _jsxs("form", { className: "chat-input-area", onSubmit: handleSubmit, children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask a question about the meeting...", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), children: "Send" })] })] }));
};
