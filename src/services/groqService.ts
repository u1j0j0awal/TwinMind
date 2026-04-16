interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface WhisperResponse {
  text: string;
}

export class GroqService {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';
  // Use backend proxy for all deployments (more reliable)
  private proxyUrl = '/api/proxy';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async callAPI(endpoint: string, data: any): Promise<any> {
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
    } catch (error) {
      // Fall back to direct API for local development only
      console.warn('Proxy failed, attempting direct API call:', error);
      return this.directAPICall(endpoint, data);
    }
  }

  private async directAPICall(endpoint: string, data: any): Promise<any> {
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

  async transcribeAudio(audioBlob: Blob): Promise<string> {
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

      const data: WhisperResponse = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async generateLiveSuggestions(
    transcript: string,
    prompt: string,
    contextWindow: number
  ): Promise<string> {
    return this.callLLM(
      prompt,
      transcript,
      contextWindow,
      'live-suggestions'
    );
  }

  async generateDetailedAnswer(
    transcript: string,
    suggestionTitle: string,
    prompt: string,
    contextWindow: number
  ): Promise<string> {
    const context = `Transcript excerpt:\n${transcript}\n\nBased on this suggestion: "${suggestionTitle}"\n\nProvide a detailed answer:`;
    return this.callLLM(
      prompt,
      context,
      contextWindow,
      'detailed-answer'
    );
  }

  async chat(
    messages: GroqMessage[],
    systemPrompt: string,
    contextWindow: number
  ): Promise<string> {
    try {
      const allMessages: GroqMessage[] = [
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
    } catch (error) {
      console.error('Error calling Groq chat API:', error);
      throw error;
    }
  }

  private async callLLM(
    systemPrompt: string,
    userContent: string,
    contextWindow: number,
    label: string
  ): Promise<string> {
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
    } catch (error) {
      console.error(`Error calling Groq API (${label}):`, error);
      throw error;
    }
  }
}
