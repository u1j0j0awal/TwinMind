import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { GroqService } from './services/groqService';
import { AudioService } from './services/audioService';
import { SettingsService } from './services/settingsService';
import { PromptService } from './services/promptService';
import { Controls } from './components/Controls';
import { Transcript } from './components/Transcript';
import { Suggestions } from './components/Suggestions';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import './styles/global.css';
// UUID v4 implementation without external library
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
export const App = () => {
    // Settings and initialization
    const [settings, setSettings] = useState(SettingsService.getSettings());
    const [isSettingsOpen, setIsSettingsOpen] = useState(!SettingsService.hasValidApiKey());
    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const audioServiceRef = useRef(new AudioService());
    const groqServiceRef = useRef(null);
    // Transcript state
    const [transcriptChunks, setTranscriptChunks] = useState([]);
    // Suggestions state
    const [suggestionBatches, setSuggestionBatches] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    // Chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    // Session metadata
    const sessionStartTimeRef = useRef(0);
    // Update Groq service when API key changes
    useEffect(() => {
        if (settings.groqApiKey) {
            groqServiceRef.current = new GroqService(settings.groqApiKey);
        }
    }, [settings.groqApiKey]);
    // Handle recording start
    const handleStartRecording = useCallback(async () => {
        if (!settings.groqApiKey) {
            alert('Please enter your Groq API key in settings first');
            setIsSettingsOpen(true);
            return;
        }
        try {
            await audioServiceRef.current.startRecording();
            setIsRecording(true);
            sessionStartTimeRef.current = Date.now();
            setTranscriptChunks([]);
            setSuggestionBatches([]);
            setChatMessages([]);
            // Set up periodic transcription and suggestions
            const stopCapture = audioServiceRef.current.setupPeriodicCapture((chunk) => {
                handleAudioChunk(chunk);
            }, settings.refreshInterval);
            // Store cleanup function somewhere (for now just keep it)
            window.__stopCapture = stopCapture;
        }
        catch (error) {
            alert('Error starting recording: ' + error.message);
            setIsRecording(false);
        }
    }, [settings]);
    // Handle recording stop
    const handleStopRecording = useCallback(() => {
        audioServiceRef.current.stopRecording();
        setIsRecording(false);
        if (window.__stopCapture) {
            window.__stopCapture();
        }
    }, []);
    // Handle audio chunk (transcription + suggestions)
    const handleAudioChunk = useCallback(async (chunk) => {
        if (!groqServiceRef.current)
            return;
        try {
            // Transcribe audio
            const audioBlob = await audioServiceRef.current.convertWebMToWav(chunk.blob);
            const transcript = await groqServiceRef.current.transcribeAudio(audioBlob);
            if (transcript.trim()) {
                // Add new chunk
                const newChunk = {
                    id: generateUUID(),
                    text: transcript,
                    timestamp: Date.now(),
                };
                setTranscriptChunks((prev) => [...prev, newChunk]);
                // Generate suggestions
                await generateLiveSuggestions();
            }
        }
        catch (error) {
            console.error('Error processing audio chunk:', error);
        }
    }, [settings]);
    // Generate live suggestions
    const generateLiveSuggestions = useCallback(async () => {
        if (!groqServiceRef.current || transcriptChunks.length === 0)
            return;
        setIsGeneratingSuggestions(true);
        try {
            // Get recent transcript (limit context window)
            const recentTranscript = transcriptChunks
                .slice(-Math.ceil(settings.liveContextWindow / 50)) // rough estimate
                .map((c) => c.text)
                .join(' ');
            if (!recentTranscript.trim())
                return;
            // Call Groq to generate suggestions
            const response = await groqServiceRef.current.generateLiveSuggestions(recentTranscript, settings.liveSuggestionPrompt, settings.liveContextWindow);
            // Parse suggestions
            const parsedSuggestions = PromptService.parseSuggestionsResponse(response);
            if (parsedSuggestions.length > 0) {
                const suggestions = parsedSuggestions.map((s) => ({
                    id: generateUUID(),
                    batchId: generateUUID(),
                    title: s.title,
                    preview: s.preview,
                    timestamp: Date.now(),
                    type: s.type || 'question',
                }));
                const batch = {
                    id: generateUUID(),
                    timestamp: Date.now(),
                    suggestions,
                };
                setSuggestionBatches((prev) => [batch, ...prev]);
            }
        }
        catch (error) {
            console.error('Error generating suggestions:', error);
        }
        finally {
            setIsGeneratingSuggestions(false);
        }
    }, [transcriptChunks, settings]);
    // Handle manual refresh
    const handleRefresh = useCallback(async () => {
        // For manual refresh, capture current audio and regenerate
        await generateLiveSuggestions();
    }, [generateLiveSuggestions]);
    // Handle suggestion click
    const handleSuggestionClick = useCallback(async (suggestion) => {
        if (!groqServiceRef.current)
            return;
        // Add suggestion to chat as user message
        const userMessage = {
            id: generateUUID(),
            role: 'user',
            content: `${suggestion.title}: ${suggestion.preview}`,
            timestamp: Date.now(),
            source: 'suggestion',
        };
        setChatMessages((prev) => [...prev, userMessage]);
        // Generate detailed answer
        setIsChatLoading(true);
        try {
            const fullTranscript = transcriptChunks.map((c) => c.text).join(' ');
            const answer = await groqServiceRef.current.generateDetailedAnswer(fullTranscript, suggestion.title, settings.detailedAnswerPrompt, settings.detailedContextWindow);
            const assistantMessage = {
                id: generateUUID(),
                role: 'assistant',
                content: answer,
                timestamp: Date.now(),
            };
            setChatMessages((prev) => [...prev, assistantMessage]);
        }
        catch (error) {
            console.error('Error generating detailed answer:', error);
            const errorMessage = {
                id: generateUUID(),
                role: 'assistant',
                content: 'Error generating answer. Please check your API key and try again.',
                timestamp: Date.now(),
            };
            setChatMessages((prev) => [...prev, errorMessage]);
        }
        finally {
            setIsChatLoading(false);
        }
    }, [transcriptChunks, settings]);
    // Handle chat message
    const handleSendMessage = useCallback(async (content) => {
        // Add user message
        const userMessage = {
            id: generateUUID(),
            role: 'user',
            content,
            timestamp: Date.now(),
            source: 'direct',
        };
        setChatMessages((prev) => [...prev, userMessage]);
        // Generate response
        setIsChatLoading(true);
        try {
            if (!groqServiceRef.current)
                throw new Error('Groq service not initialized');
            const fullTranscript = transcriptChunks.map((c) => c.text).join(' ');
            const messagesForAPI = [
                ...chatMessages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
                { role: 'user', content },
            ];
            const response = await groqServiceRef.current.chat(messagesForAPI, settings.chatPrompt + `\n\nMeeting Transcript:\n${fullTranscript}`, settings.detailedContextWindow);
            const assistantMessage = {
                id: generateUUID(),
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            };
            setChatMessages((prev) => [...prev, assistantMessage]);
        }
        catch (error) {
            console.error('Error sending chat message:', error);
            const errorMessage = {
                id: generateUUID(),
                role: 'assistant',
                content: 'Error processing your message. Please try again.',
                timestamp: Date.now(),
            };
            setChatMessages((prev) => [...prev, errorMessage]);
        }
        finally {
            setIsChatLoading(false);
        }
    }, [transcriptChunks, chatMessages, settings]);
    // Handle export
    const handleExport = useCallback(() => {
        const sessionExport = {
            transcript: transcriptChunks,
            suggestionBatches,
            chatHistory: chatMessages,
            startTime: sessionStartTimeRef.current,
            endTime: Date.now(),
        };
        const dataStr = JSON.stringify(sessionExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `twinmind-session-${new Date().toISOString()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }, [transcriptChunks, suggestionBatches, chatMessages]);
    // Handle settings save
    const handleSettingsSave = useCallback((newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
        SettingsService.saveSettings(newSettings);
    }, []);
    return (_jsxs("div", { className: "app-container", children: [_jsx(Controls, { isRecording: isRecording, onStartRecording: handleStartRecording, onStopRecording: handleStopRecording, onRefresh: handleRefresh, onExport: handleExport, onSettings: () => setIsSettingsOpen(true), isRefreshing: isGeneratingSuggestions }), _jsxs("div", { className: "main-content", children: [_jsx(Transcript, { chunks: transcriptChunks, isRecording: isRecording }), _jsx(Suggestions, { batches: suggestionBatches, isLoading: isGeneratingSuggestions, onSuggestionClick: handleSuggestionClick }), _jsx(Chat, { messages: chatMessages, onSendMessage: handleSendMessage, isLoading: isChatLoading })] }), _jsx(Settings, { isOpen: isSettingsOpen, onClose: () => setIsSettingsOpen(false), settings: settings, onSettingsChange: handleSettingsSave })] }));
};
