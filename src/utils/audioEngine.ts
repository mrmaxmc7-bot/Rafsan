/**
 * Audio Engine for sksumonxhikder Cyber-Horror Studio
 * Handles procedural ambient soundscapes, instant horror effects,
 * ghostly echo filter, real-time frequency analysis, and WAV/WebM recording.
 */

class HorrorAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private echoDelay: DelayNode | null = null;
  private echoFeedback: GainNode | null = null;
  private echoFilter: BiquadFilterNode | null = null;
  private echoWetGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaDest: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // Ambient channels
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;

  private stormGain: GainNode | null = null;
  private stormFilter: BiquadFilterNode | null = null;
  private stormSource: AudioBufferSourceNode | null = null;

  private whisperGain: GainNode | null = null;
  private whisperSource: AudioBufferSourceNode | null = null;

  private heartbeatGain: GainNode | null = null;
  private heartbeatInterval: number | null = null;

  private clockGain: GainNode | null = null;
  private clockInterval: number | null = null;

  private isInitialized = false;
  private isNightmareWhisperActive = false;

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Live Analyser for Waveform
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;

    // Stream Destination for recording combined audio
    this.mediaDest = this.ctx.createMediaStreamDestination();

    // Spectral Echo / Ghostly Reverb Chain
    this.echoDelay = this.ctx.createDelay(2.0);
    this.echoDelay.delayTime.setValueAtTime(0.32, this.ctx.currentTime);

    this.echoFeedback = this.ctx.createGain();
    this.echoFeedback.gain.setValueAtTime(0.48, this.ctx.currentTime);

    this.echoFilter = this.ctx.createBiquadFilter();
    this.echoFilter.type = 'lowpass';
    this.echoFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    this.echoWetGain = this.ctx.createGain();
    this.echoWetGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    // Connect Echo loop
    this.echoDelay.connect(this.echoFilter);
    this.echoFilter.connect(this.echoFeedback);
    this.echoFeedback.connect(this.echoDelay);
    this.echoDelay.connect(this.echoWetGain);

    // Master connections
    this.masterGain.connect(this.analyser);
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.mediaDest);

    this.echoWetGain.connect(this.masterGain);

    this.setupAmbients();
    this.isInitialized = true;
  }

  private setupAmbients() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Sub-bass Drone
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(46.25, this.ctx.currentTime); // F#1

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(43.65, this.ctx.currentTime); // Detuned F1 for dark beating

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.droneOsc1.connect(droneFilter);
    this.droneOsc2.connect(droneFilter);
    droneFilter.connect(this.droneGain);

    this.droneOsc1.start();
    this.droneOsc2.start();

    // 2. Storm Wind Generator (Pink/Brown noise buffer)
    this.stormGain = this.ctx.createGain();
    this.stormGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.stormGain.connect(this.masterGain);

    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      output[i] = (b0 + b1 + b2) * 0.5;
    }

    this.stormSource = this.ctx.createBufferSource();
    this.stormSource.buffer = noiseBuffer;
    this.stormSource.loop = true;

    this.stormFilter = this.ctx.createBiquadFilter();
    this.stormFilter.type = 'bandpass';
    this.stormFilter.frequency.setValueAtTime(280, this.ctx.currentTime);
    this.stormFilter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    this.stormSource.connect(this.stormFilter);
    this.stormFilter.connect(this.stormGain);
    this.stormSource.start();

    // 3. Creepy Whispers Buffer
    this.whisperGain = this.ctx.createGain();
    this.whisperGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.whisperGain.connect(this.masterGain);
    this.whisperGain.connect(this.echoDelay!);

    const whisperBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = whisperBuffer.getChannelData(0);
    const right = whisperBuffer.getChannelData(1);
    for (let i = 0; i < bufferSize; i++) {
      const mod = Math.sin((i / this.ctx.sampleRate) * 1.5) * 0.5 + 0.5;
      const shiver = (Math.random() * 2 - 1) * mod;
      left[i] = shiver * 0.35;
      right[i] = (Math.random() * 2 - 1) * (1 - mod) * 0.35;
    }

    this.whisperSource = this.ctx.createBufferSource();
    this.whisperSource.buffer = whisperBuffer;
    this.whisperSource.loop = true;

    const whisperFilter = this.ctx.createBiquadFilter();
    whisperFilter.type = 'bandpass';
    whisperFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    whisperFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.whisperSource.connect(whisperFilter);
    whisperFilter.connect(this.whisperGain);
    this.whisperSource.start();

    // 4. Heartbeat Pulse
    this.heartbeatGain = this.ctx.createGain();
    this.heartbeatGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.heartbeatGain.connect(this.masterGain);

    // 5. Death Clock Ticking
    this.clockGain = this.ctx.createGain();
    this.clockGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.clockGain.connect(this.masterGain);
  }

  // Volume Controls for Ambients (0.0 to 1.0)
  public setDroneVolume(val: number) {
    this.init();
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setTargetAtTime(val * 0.7, this.ctx.currentTime, 0.1);
    }
  }

  public setStormVolume(val: number) {
    this.init();
    if (this.stormGain && this.ctx) {
      this.stormGain.gain.setTargetAtTime(val * 0.6, this.ctx.currentTime, 0.1);
    }
  }

  public setWhisperVolume(val: number) {
    this.init();
    if (this.whisperGain && this.ctx) {
      this.whisperGain.gain.setTargetAtTime(val * 0.5, this.ctx.currentTime, 0.1);
    }
  }

  public setHeartbeatVolume(val: number) {
    this.init();
    if (!this.heartbeatGain || !this.ctx) return;
    this.heartbeatGain.gain.setTargetAtTime(val * 0.8, this.ctx.currentTime, 0.05);

    if (val > 0.05 && !this.heartbeatInterval) {
      this.startHeartbeatLoop();
    } else if (val <= 0.05 && this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private startHeartbeatLoop() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = window.setInterval(() => {
      this.triggerHeartThump();
      setTimeout(() => this.triggerHeartThump(), 260); // Double thump (lub-dub)
    }, 1100);
  }

  private triggerHeartThump() {
    if (!this.ctx || !this.heartbeatGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.15);

    thumpGain.gain.setValueAtTime(0.9, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(thumpGain);
    thumpGain.connect(this.heartbeatGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  public setClockVolume(val: number) {
    this.init();
    if (!this.clockGain || !this.ctx) return;
    this.clockGain.gain.setTargetAtTime(val * 0.6, this.ctx.currentTime, 0.05);

    if (val > 0.05 && !this.clockInterval) {
      this.clockInterval = window.setInterval(() => {
        this.triggerClockTick();
      }, 1000);
    } else if (val <= 0.05 && this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  private triggerClockTick() {
    if (!this.ctx || !this.clockGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const tickGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, now);

    tickGain.gain.setValueAtTime(0.7, now);
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(tickGain);
    tickGain.connect(this.clockGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Nightmare Mode Whispering toggle
  public setNightmareMode(active: boolean) {
    this.init();
    this.isNightmareWhisperActive = active;
    if (active) {
      this.setWhisperVolume(0.45);
      this.setDroneVolume(0.5);
    } else {
      this.setWhisperVolume(0);
      this.setDroneVolume(0.2);
    }
  }

  // Ghostly Echo Control
  public setEchoEnabled(enabled: boolean, intensity: number = 0.5) {
    this.init();
    if (!this.echoWetGain || !this.ctx) return;
    const wet = enabled ? intensity * 0.65 : 0;
    this.echoWetGain.gain.setTargetAtTime(wet, this.ctx.currentTime, 0.05);
  }

  // Connect External Audio (e.g., from Gemini TTS or Speech) to Echo & Visualizer
  public connectToEchoAndOutput(sourceNode: AudioNode) {
    this.init();
    if (!this.masterGain || !this.echoDelay) return;
    sourceNode.connect(this.masterGain);
    sourceNode.connect(this.echoDelay);
  }

  // One-Shot Instant Horror SFX
  public playSfx(type: 'scream' | 'laugh' | 'thunder' | 'creak' | 'bone' | 'sigh') {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    switch (type) {
      case 'thunder': {
        // Deep explosive rumble
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 3.5, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + 3.0);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.0, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        break;
      }

      case 'scream': {
        // Spectral banshee screech
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1550, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(420, now + 1.8);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now);
        filter.Q.setValueAtTime(5.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.65, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        if (this.echoDelay) gain.connect(this.echoDelay);

        osc.start(now);
        osc.stop(now + 2.0);
        break;
      }

      case 'laugh': {
        // Terrifying stepped demonic giggle
        const notes = [440, 392, 349, 311, 277, 246, 220, 196];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + idx * 0.16;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.14);

          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

          osc.connect(gain);
          gain.connect(this.masterGain);
          if (this.echoDelay) gain.connect(this.echoDelay);

          osc.start(t);
          osc.stop(t + 0.16);
        });
        break;
      }

      case 'creak': {
        // Creaking old door
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(320, now + 0.7);
        osc.frequency.linearRampToValueAtTime(95, now + 1.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.65);
        break;
      }

      case 'bone': {
        // Snap/crackle
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'sigh': {
        // Ghostly breath
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2.0, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, now);
        filter.frequency.linearRampToValueAtTime(350, now + 1.8);
        filter.Q.setValueAtTime(4.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        if (this.echoDelay) gain.connect(this.echoDelay);

        noise.start(now);
        break;
      }
    }
  }

  public silenceAllAmbients() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.droneGain) this.droneGain.gain.setValueAtTime(0, now);
    if (this.stormGain) this.stormGain.gain.setValueAtTime(0, now);
    if (this.whisperGain) this.whisperGain.gain.setValueAtTime(0, now);
    if (this.heartbeatGain) this.heartbeatGain.gain.setValueAtTime(0, now);
    if (this.clockGain) this.clockGain.gain.setValueAtTime(0, now);
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  // Realistic & Terrifying Entrance Cinematic Audio (Silent Background afterward)
  public playEntranceExperience(): Promise<void> {
    this.init();
    this.silenceAllAmbients();
    return new Promise((resolve) => {
      if (!this.ctx) {
        resolve();
        return;
      }
      const now = this.ctx.currentTime;

      // 1. Earth-shattering Sub-bass Quake Shockwave (Quick 1.8s decay)
      const quakeOsc = this.ctx.createOscillator();
      const quakeGain = this.ctx.createGain();
      quakeOsc.type = 'sawtooth';
      quakeOsc.frequency.setValueAtTime(90, now);
      quakeOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
      quakeGain.gain.setValueAtTime(0.85, now);
      quakeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      const quakeFilter = this.ctx.createBiquadFilter();
      quakeFilter.type = 'lowpass';
      quakeFilter.frequency.setValueAtTime(160, now);

      quakeOsc.connect(quakeFilter);
      quakeFilter.connect(quakeGain);
      if (this.masterGain) quakeGain.connect(this.masterGain);
      quakeOsc.start(now);
      quakeOsc.stop(now + 1.9);

      // 2. Heavy Thunder & lightning explosion
      this.playSfx('thunder');

      // 3. Bone snap & eerie exhale, then complete silence
      setTimeout(() => {
        this.playSfx('bone');
        this.silenceAllAmbients();
        resolve();
      }, 700);
    });
  }

  // Visualizer Analyser Frequency Reader
  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  public getAudioContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public getMasterDestination(): MediaStreamAudioDestinationNode | null {
    return this.mediaDest;
  }

  // Record Master Audio to Blob (.WebM or .WAV)
  public startRecording() {
    this.init();
    if (!this.mediaDest) return;
    this.recordedChunks = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaDest.stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      this.mediaRecorder.start(100);
    } catch {
      console.warn("MediaRecorder not supported on this browser context");
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }
}

export const audioEngine = new HorrorAudioEngine();

// Helper to convert AudioBuffer to WAV Blob
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  let sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out.buffer], { type: 'audio/wav' });
}
