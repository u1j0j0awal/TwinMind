export interface AudioChunk {
  blob: Blob;
  duration: number;
}

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recordingStartTime: number = 0;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Initialize audio context for browser compatibility
      void new (window.AudioContext || (window as any).webkitAudioContext)();

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.chunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.chunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  getRecordingBlob(): Blob {
    return new Blob(this.chunks, { type: 'audio/webm;codecs=opus' });
  }

  getRecordingDuration(): number {
    return Date.now() - this.recordingStartTime;
  }

  // Get audio chunks every ~30 seconds
  setupPeriodicCapture(
    onChunk: (chunk: AudioChunk) => void,
    intervalMs: number = 30000
  ): () => void {
    const interval = setInterval(() => {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        const blob = this.getRecordingBlob();
        const duration = this.getRecordingDuration();
        onChunk({ blob, duration });
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }

  async convertWebMToWav(webmBlob: Blob): Promise<Blob> {
    // For now, return as-is. In production, might need conversion
    // Groq's Whisper API should handle WebM format
    return webmBlob;
  }
}
