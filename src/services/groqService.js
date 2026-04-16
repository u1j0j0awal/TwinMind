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
        // Use backend proxy for all deployments (more reliable)
        Object.defineProperty(this, "proxyUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/api/proxy'
        });
        this.apiKey = apiKey;
    }
    async callAPI(endpoint, data) {
        try {
            // Try using proxy first (works on Vercel and localhost)
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey: this.apiKey,
                    endpoint,
                    data,
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `API Error: ${response.statusText}`);
            }
            return response.json();
        }
        catch (error) {
            // Fall back to direct API for local development only
            console.warn('Proxy failed, attempting direct API call:', error);
            return this.directAPICall(endpoint, data);
        }
    }
    async directAPICall(endpoint, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
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
            const data = {
                model: 'mixtral-8x7b-32768',
                messages: allMessages,
                max_tokens: Math.min(contextWindow, 2000),
                temperature: 0.7,
            };
            const response = await this.callAPI('/chat/completions', data);
            return response.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error('Error calling Groq chat API:', error);
            throw error;
        }
    }
    async callLLM(systemPrompt, userContent, contextWindow, label) {
        try {
            const data = {
                model: 'mixtral-8x7b-32768',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent },
                ],
                max_tokens: Math.min(contextWindow, 2000),
                temperature: 0.7,
            };
            const response = await this.callAPI('/chat/completions', data);
            return response.choices[0]?.message?.content || '';
        }
        catch (error) {
            console.error(`Error calling Groq API (${label}):`, error);
            throw error;
        }
    }
}
