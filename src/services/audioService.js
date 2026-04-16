export class AudioService {
    constructor() {
        Object.defineProperty(this, "mediaRecorder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "chunks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "recordingStartTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Initialize audio context for browser compatibility
            void new (window.AudioContext || window.webkitAudioContext)();
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });
            this.chunks = [];
            this.recordingStartTime = Date.now();
            this.mediaRecorder.ondataavailable = (event) => {
                this.chunks.push(event.data);
            };
            this.mediaRecorder.start();
        }
        catch (error) {
            console.error('Error starting recording:', error);
            throw error;
        }
    }
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
    }
    getRecordingBlob() {
        return new Blob(this.chunks, { type: 'audio/webm;codecs=opus' });
    }
    getRecordingDuration() {
        return Date.now() - this.recordingStartTime;
    }
    // Get audio chunks every ~30 seconds
    setupPeriodicCapture(onChunk, intervalMs = 30000) {
        const interval = setInterval(() => {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                const blob = this.getRecordingBlob();
                const duration = this.getRecordingDuration();
                onChunk({ blob, duration });
            }
        }, intervalMs);
        return () => clearInterval(interval);
    }
    async convertWebMToWav(webmBlob) {
        // For now, return as-is. In production, might need conversion
        // Groq's Whisper API should handle WebM format
        return webmBlob;
    }
}
