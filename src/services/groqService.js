export class GroqService {
    constructor(apiKey) {
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://api.groq.com/openai/v1'
        });
        this.apiKey = apiKey;
    }
    async transcribeAudio(audioBlob) {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.wav');
            formData.append('model', 'whisper-large-v3');
            const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Transcription failed: ${response.statusText}`);
            }
            const data = await response.json();
            return data.text;
        }
        catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
    async generateLiveSuggestions(transcript, prompt, contextWindow) {
        return this.callLLM(prompt, transcript, contextWindow, 'live-suggestions');
    }
    async generateDetailedAnswer(transcript, suggestionTitle, prompt, contextWindow) {
        const context = `Transcript excerpt:\n${transcript}\n\nBased on this suggestion: "${suggestionTitle}"\n\nProvide a detailed answer:`;
        return this.callLLM(prompt, context, contextWindow, 'detailed-answer');
    }
    async chat(messages, systemPrompt, contextWindow) {
        try {
            const allMessages = [
                { role: 'system', content: systemPrompt },
                ...messages,
            ];
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mixtral-8x7b-32768',
                    messages: allMessages,
                    max_tokens: Math.min(contextWindow, 2000),
                    temperature: 0.7,
                }),
            });
            if (!response.ok) {
                throw new Error(`Chat API failed: ${response.statusText}`);
            }
            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Error calling Groq chat API:', error);
            throw error;
        }
    }
    async callLLM(systemPrompt, userContent, contextWindow, label) {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'mixtral-8x7b-32768',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userContent },
                    ],
                    max_tokens: Math.min(contextWindow, 2000),
                    temperature: 0.7,
                }),
            });
            if (!response.ok) {
                throw new Error(`API call failed (${label}): ${response.statusText}`);
            }
            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error(`Error calling Groq API (${label}):`, error);
            throw error;
        }
    }
}
