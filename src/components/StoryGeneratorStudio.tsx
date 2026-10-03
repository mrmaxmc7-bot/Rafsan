import React, { useState, useEffect, useRef } from 'react';
import {
  speechEngine,
  VoicePersona,
  SpeechSettings,
  UserVoiceProfile,
  DEFAULT_USER_PROFILE,
} from '../utils/speechEngine';
import { audioEngine } from '../utils/audioEngine';
import { DigitalVisualizerHUD } from './DigitalVisualizerHUD';
import { AmbientSoundboard } from './AmbientSoundboard';
import { AppDownloadModal } from './AppDownloadModal';
import { APP_LOGO_SRC, APP_BANNER_SRC, APP_NAME, APP_EST, MENACING_WARNING } from '../assets/logo';
import {
  Play,
  Square,
  Pause,
  Download,
  Share2,
  Sparkles,
  Flame,
  Volume2,
  Trash2,
  BookOpen,
  Sliders,
  CheckCircle,
  Radio,
  Clock,
  Zap,
  RotateCcw,
  Smartphone,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';

interface StoryGeneratorStudioProps {
  onOpenShareModal: (text: string) => void;
  onTriggerSplatter: () => void;
  isNightmare: boolean;
}

export const StoryGeneratorStudio: React.FC<StoryGeneratorStudioProps> = ({
  onOpenShareModal,
  onTriggerSplatter,
  isNightmare,
}) => {
  // CRITICAL REQUIREMENT: starts completely blank!
  const [storyText, setStoryText] = useState<string>('');

  // Primary Default Persona is the USER's voice clone!
  const [persona, setPersona] = useState<VoicePersona>('UserClone');
  const [userProfile, setUserProfile] = useState<UserVoiceProfile>({ ...DEFAULT_USER_PROFILE });

  const [pitch, setPitch] = useState<number>(0.91);
  const [rate, setRate] = useState<number>(0.93);
  const [echoEnabled, setEchoEnabled] = useState<boolean>(true);
  const [echoIntensity, setEchoIntensity] = useState<number>(0.55);

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechProgress, setSpeechProgress] = useState<number>(0);
  const [currentChunk, setCurrentChunk] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSuccess, setGenerationSuccess] = useState<boolean>(false);

  // App Download Modal & Ambient Mixer Visibility
  const [isAppDownloadOpen, setIsAppDownloadOpen] = useState<boolean>(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState<boolean>(true);

  // Generated Audio State
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [generatedAudioBlob, setGeneratedAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [isAudioPlayerPlaying, setIsAudioPlayerPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ensure dead-quiet background on mount (no unwanted humming/drone)
  useEffect(() => {
    audioEngine.silenceAllAmbients();
  }, []);

  // Subscribe to speech status
  useEffect(() => {
    const unsubscribe = speechEngine.subscribe(({ isSpeaking, progress, currentChunk }) => {
      setIsSpeaking(isSpeaking);
      setSpeechProgress(progress);
      if (currentChunk) setCurrentChunk(currentChunk);
    });
    return () => unsubscribe();
  }, []);

  // Preset stories that users can 1-click load
  const presetStories = [
    {
      id: 'shoshan',
      title: '🌙 শ্মশানের বটগাছ ও নিশি ডাক',
      tag: 'গা ছমছমে ক্লাসিক',
      content: `নিশুতি রাত। আকাশে এক ফালি রক্তিম চাঁদ। গ্রামের মেঠো পথ ধরে হাঁটছিল সজল। চারপাশে ঝিঁঝিঁ পোকার একঘেয়ে শব্দ হঠাৎ যেন থেমে গেল [ক্যাঁচক্যাঁচ শব্দ]...

বাঁশঝাড়ের ওপার থেকে কে যেন তাকে নিচু গলায় ডাকল—"সজল... ফিরে আয়..."
সজল ফিরে তাকাতেই দেখল, বটগাছের ডাল থেকে ঝুলছে এক ছায়ামূর্তি, যার পা দুটি মাটির ওপরে শূন্যে ভাসছে! [বজ্রপাত]
হঠাৎ এক বিকট অট্টহাসিতে ফেটে পড়ল চারপাশ [অট্টহাসি]! তুমি এবার মরবে... [আর্তনাদ]!`,
    },
    {
      id: 'zamindar',
      title: '🏚️ অভিশপ্ত জমিদার বাড়ির অমাবস্যা',
      tag: 'রক্তহিম থ্রিলার',
      content: `অমাবস্যার গভীর রাত। পুরোনো জমিদার বাড়ির লোহার ভারী ফটকটি আপনাআপনি ক্যাঁচক্যাঁচ শব্দে খুলে গেল [ক্যাঁচক্যাঁচ শব্দ]।

ভেতরে ঢুকতেই নাকে এলো চন্দনের তীব্র গন্ধ আর জমাট রক্তের ঘ্রাণ। দোতলার ভাঙা আয়নার সামনে দাঁড়িয়ে ছিল এক অবয়ব, লাল বেনারসি শাড়ি পরা। 
হঠাৎ মুখ ঘুরিয়ে সে তাকাল—তার মুখের জায়গায় কোনো চোখ বা নাক নেই, শুধু রক্তের ধারায় ভেজা দুটি জ্বলন্ত অগ্নিপিণ্ড! [বজ্রপাত]
কঙ্কালের আঙুল বাড়িয়ে সে বলল—"তুমি এবার মরবে!" [আর্তনাদ]`,
    },
    {
      id: 'train',
      title: '🚂 কুয়াশাচ্ছন্ন মধ্যরাতের শেষ ট্রেন',
      tag: 'রহস্যময় সাইকো-হরর',
      content: `কুয়াশায় ঘেরা নির্জন রেলওয়ে প্ল্যাটফর্ম। রাত দুটো বেজে পঁয়তাল্লিশ মিনিট। ধীর গতিতে এসে থামল এক শতাব্দী প্রাচীন কালো ট্রেন [ক্যাঁচক্যাঁচ শব্দ]...

ট্রেনের কোনো কামরায় কোনো আলো নেই, শুধু একটি কামরার জানালায় দেখা যাচ্ছে একটি কঙ্কালসার হাত। কামরার ভেতর থেকে ভেসে আসছে এক আর্তনাদ [আর্তনাদ]। 
কাছে গিয়ে তাকাতেই কাঁচের গায়ে রক্ত দিয়ে ফুটে উঠল একটি বাক্য: "এই ট্রেনের প্রতিটি যাত্রী মৃত... এবং তুমি এবার মরবে!" [বজ্রপাত] [অট্টহাসি]!`,
    },
    {
      id: 'mega_1hr',
      title: '💀 ১-২ ঘণ্টার মেগা হরর কাহিনি',
      tag: 'দীর্ঘ উপন্যাস পর্ব',
      content: `অধ্যায় ১: শতাব্দীর অভিশপ্ত কুয়াশা ও মৃত্যুর ডাক।
রাত দুটো বেজে পঁয়তাল্লিশ মিনিট। গ্রামের শেষ সীমানায় দাঁড়িয়ে থাকা পুরোনো ভাঙা রাজবাড়িটি হঠাৎ যেন জীবন্ত হয়ে উঠল [ক্যাঁচক্যাঁচ শব্দ]...
ঘন কুয়াশার বুক চিরে ভেসে এলো বরফশীতল দীর্ঘশ্বাস। মাটির নিচ থেকে উঠে এলো সহস্র কঙ্কালের ক্রন্দন... [আর্তনাদ]!

বাতাসে ছড়িয়ে পড়ল তাজা রক্তের গন্ধ। আকাশে দেখা গেল এক রক্তলাল চাঁদ।
হঠাৎ এক বিকট বজ্রপাতের সাথে সাথে পাথরের মূর্তির চোখ থেকে ঝরে পড়ল তাজা রক্ত [বজ্রপাত]!
বাতাস কাঁপিয়ে ভেসে এলো সেই অশরীরী গমগমে কণ্ঠ—"আজকের রাতে তুমি এবার মরবে...!" [অট্টহাসি]!`,
    },
  ];

  // Current speech settings bundle
  const currentSettings: SpeechSettings = {
    persona,
    pitch,
    rate,
    echoEnabled,
    echoIntensity,
    userProfile,
  };

  // 1. SEPARATE ACTION: GENERATE VOICE (ভয়েস তৈরি করার বাটন)
  const handleGenerateVoice = async () => {
    const textToSpeak = storyText.trim();
    if (!textToSpeak) {
      alert('দয়া করে প্রথমে উপরের টেক্সট বক্সে আপনার ভৌতিক গল্প লিখুন অথবা প্রস্তুত গল্প থেকে যেকোনো একটি বেছে নিন!');
      return;
    }

    setIsGenerating(true);
    setGenerationSuccess(false);

    try {
      // High-speed chunked procedural audio rendering (handles 1-2 hours text in seconds)
      const result = await speechEngine.generateAudioBuffer(textToSpeak, currentSettings);
      if (result) {
        setGeneratedAudioUrl(result.url);
        setGeneratedAudioBlob(result.blob);
        setAudioDuration(result.duration);
        setAudioCurrentTime(0);
        setGenerationSuccess(true);
      }
    } catch (e) {
      console.warn("Generation error", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. SEPARATE ACTION: PLAY AUDIO (আলাদা প্লে বাটন)
  const handlePlayVoice = async () => {
    if (isSpeaking || isAudioPlayerPlaying) {
      handleStopAllAudio();
      return;
    }

    const textToSpeak =
      storyText.trim() ||
      'দয়া করে প্রথমে উপরে কিছু ভৌতিক গল্প লিখুন অথবা নিচের যেকোনো একটি প্রস্তুত গল্প বেছে নিন।';

    setIsAudioPlayerPlaying(true);
    await speechEngine.speakText(textToSpeak, currentSettings);
    setIsAudioPlayerPlaying(false);
  };

  // 3. SEPARATE ACTION: STOP AUDIO (বন্ধ করুন)
  const handleStopAllAudio = () => {
    speechEngine.stop();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAudioPlayerPlaying(false);
    setIsSpeaking(false);
  };

  // 4. SEPARATE ACTION: DOWNLOAD AUDIO (ডাউনলোড বাটন)
  const handleDownloadWavAudio = async () => {
    const textToSpeak = storyText.trim();
    if (!textToSpeak) {
      alert('দয়া করে প্রথমে কিছু টেক্সট লিখুন অথবা নিচের যেকোনো একটি গল্প বেছে নিন!');
      return;
    }

    if (generatedAudioBlob) {
      const url = URL.createObjectURL(generatedAudioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sksumonxhikder-horror-voice-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 1500);
      return;
    }

    await speechEngine.exportAudioFile(
      textToSpeak,
      currentSettings,
      `sksumonxhikder-horror-voice-${Date.now()}.wav`
    );
  };

  // AI Horror Director actions
  const handleAiAction = async (action: 'escalate' | 'climax' | 'sound_cues') => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStory: storyText || 'নিশুতি রাতে একাকী শ্মশান ঘাট...',
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.story) {
          setStoryText(data.story);
          if (action === 'climax') {
            onTriggerSplatter();
            audioEngine.playSfx('thunder');
          } else if (action === 'escalate') {
            audioEngine.playSfx('laugh');
          }
        }
      }
    } catch (e) {
      console.warn("AI Director request failed", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const wordCount = storyText.trim() ? storyText.trim().split(/\s+/).length : 0;
  const estimatedAudioMinutes = Math.max(1, Math.round(wordCount / 120));

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-6">
      {/* 1. Cinematic Horror Banner with Logo & iOS Liquid Glass */}
      <div className="relative w-full rounded-3xl overflow-hidden glass-iphone-elevated border border-red-500/40 shadow-[0_20px_60px_rgba(220,38,38,0.35)]">
        <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden">
          <img
            src={APP_BANNER_SRC}
            alt="Cyber Horror Banner"
            className="w-full h-full object-cover scale-105 filter brightness-90 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-black/85" />

          {/* Floating Emblems & Typography */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)] flex-shrink-0 floating-elem">
                <img src={APP_LOGO_SRC} alt="logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-4xl font-black font-cyber tracking-widest lighting-red">
                    {APP_NAME}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-mono font-bold bg-red-950/90 border border-red-600 lighting-gold shadow">
                    {APP_EST}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs md:text-sm font-bold font-bangla lighting-rose flicker-text">
                    {MENACING_WARNING}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono hidden sm:inline">•</span>
                  <span className="text-xs font-mono lighting-cyan hidden sm:inline">
                    হুবহু আসল কণ্ঠস্বর ইঞ্জিন সক্রিয়
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Red Alert Banner & App Download Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-950/80 border border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse">
        <div className="flex items-center gap-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
          <AlertTriangle className="w-5 h-5 text-amber-300" />
          <span className="text-sm md:text-base font-black font-bangla text-white tracking-wider">
            🚨 রেড অ্যালার্ট: তুমি এবার মরবে
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAppDownloadOpen(true)}
            className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bangla text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center gap-1.5 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>📲 সম্পূর্ণ অ্যাপ ইনস্টল ও ডাউনলোড</span>
          </button>
        </div>
      </div>

      {/* 3. Real-time LED Frequency Visualizer & Telemetry HUD */}
      <DigitalVisualizerHUD
        isSpeaking={isSpeaking || isAudioPlayerPlaying}
        wordCount={wordCount}
        persona={persona === 'UserClone' ? 'সুমন শিকদার (My Voice)' : persona}
        isNightmare={isNightmare}
      />

      {/* 4. SEPARATE SECTION 1: গল্প লেখার বক্স (STORY TEXT BOX) */}
      <div className="glass-iphone-elevated p-4 md:p-6 border border-red-500/40 shadow-[0_15px_50px_rgba(220,38,38,0.3)] space-y-4">
        {/* Box Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-red-950/80 border border-red-600 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <Flame className="w-5 h-5 lighting-red" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-bold font-bangla lighting-gold">
                ১. গল্প লেখার বক্স (Story Text Area)
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                এখানে আপনার ১ থেকে ২ ঘণ্টার বা ছোট ভৌতিক গল্প লিখুন (সম্পূর্ণ খালি বক্স)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {storyText && (
              <button
                onClick={() => setStoryText('')}
                title="টেক্সট খালি করুন"
                className="p-2 rounded-xl bg-zinc-900/80 hover:bg-red-950 border border-white/10 text-zinc-400 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">খালি করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* The Textarea (Starts completely blank) */}
        <div className="relative">
          <textarea
            value={storyText}
            onChange={(e) => {
              setStoryText(e.target.value);
              setGenerationSuccess(false);
            }}
            placeholder="এখানে আপনার মনের মতো যেকোনো ভৌতিক গল্প বা টেক্সট লিখুন (১ ঘণ্টা বা ২ ঘণ্টার দীর্ঘ গল্পও পেস্ট করতে পারেন)... লেখা শেষ হলে ঠিক নিচের 'ভয়েস তৈরি করুন' বাটনে চাপ দিন! (সাউন্ড এফেক্টের জন্য [বজ্রপাত], [আর্তনাদ], [অট্টহাসি], [ক্যাঁচক্যাঁচ শব্দ] ইত্যাদি ট্যাগ দিতে পারেন)"
            rows={12}
            className="w-full p-4 bg-black/75 border border-white/15 rounded-2xl text-zinc-100 font-bangla text-base md:text-lg leading-relaxed focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 resize-y shadow-inner placeholder:text-zinc-600"
          />

          {/* Character, word count and duration estimate */}
          <div className="absolute bottom-3 right-3 text-[11px] font-mono text-zinc-300 bg-black/80 px-3 py-1 rounded-xl border border-white/15 backdrop-blur-xl shadow flex items-center gap-2">
            <span className="lighting-cyan">{wordCount} শব্দ</span>
            <span>•</span>
            <span className="lighting-emerald">{storyText.length} অক্ষর</span>
            <span>•</span>
            <span className="lighting-gold">আনুমানিক অডিও: ~{estimatedAudioMinutes} মিনিট</span>
          </div>
        </div>

        {/* Horror Enhancement Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={isAiLoading}
            onClick={() => handleAiAction('escalate')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-700 text-xs font-bangla font-semibold text-red-200 transition-all shadow hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 lighting-red" />
            <span className="lighting-red">{isAiLoading ? 'প্রসেসিং...' : '🔥 ভয় দ্বিগুণ করো'}</span>
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAiAction('climax')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700 text-xs font-bangla text-purple-200 hover:text-white transition-all shadow disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 lighting-purple" />
            <span className="lighting-purple">🩸 রক্তিম ক্লাইম্যাক্স</span>
          </button>

          <button
            disabled={isAiLoading}
            onClick={() => handleAiAction('sound_cues')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700 text-xs font-bangla text-cyan-200 hover:text-white transition-all shadow disabled:opacity-50"
          >
            <Volume2 className="w-3.5 h-3.5 lighting-cyan" />
            <span className="lighting-cyan">🔊 সাউন্ড কিউ যোগ করো</span>
          </button>
        </div>
      </div>

      {/* 5. SEPARATE SECTION 2: ভয়েস তৈরি করার বাটন (DISTINCT GENERATE BUTTON) */}
      <div className="glass-iphone p-4 md:p-5 border border-amber-500/50 shadow-[0_10px_35px_rgba(245,158,11,0.2)] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold lighting-gold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            ২. ভয়েস তৈরি করার বাটন (Generate Voice Button - ১ থেকে ২ ঘণ্টার মেগা জেনারেশন):
          </span>
          <span className="text-[11px] font-mono text-zinc-400">সুপারফাস্ট ইঞ্জিন</span>
        </div>

        <button
          disabled={isGenerating}
          onClick={handleGenerateVoice}
          className="w-full py-4 md:py-5 px-6 rounded-2xl font-bangla font-black text-lg md:text-2xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 hover:from-amber-500 hover:to-red-600 text-white shadow-[0_0_35px_rgba(245,158,11,0.7)] transition-all transform active:scale-95 flex items-center justify-center gap-3 border border-amber-400/80"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>১-২ ঘণ্টার ভয়েস দ্রুত তৈরি হচ্ছে... অপেক্ষা করুন</span>
            </>
          ) : (
            <>
              <Zap className="w-7 h-7 text-amber-200 fill-current animate-pulse" />
              <span>⚡ ভয়েস তৈরি করুন (GENERATE 1-2 HOUR HORROR VOICE)</span>
            </>
          )}
        </button>

        {generationSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bangla flex items-center justify-between shadow">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">
                ✓ আপনার কণ্ঠে অডিও সফলভাবে তৈরি হয়েছে! নিচের প্লে বাটন দিয়ে শুনুন বা ডাউনলোড করুন।
              </span>
            </div>
            <span className="font-mono text-[10px] lighting-emerald">READY TO PLAY</span>
          </div>
        )}
      </div>

      {/* 6. SEPARATE SECTION 3: আলাদা প্লে বাটন ও অডিও প্লেয়ার (SEPARATE PLAY BUTTON & CONTROLS) */}
      <div className="glass-iphone-elevated p-4 md:p-6 border border-red-500/40 shadow-[0_15px_40px_rgba(220,38,38,0.25)] space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-mono font-bold lighting-cyan flex items-center gap-2">
            <Play className="w-4 h-4 text-sky-400 fill-current" />
            ৩. আলাদা প্লে বাটন ও অডিও কন্ট্রোল প্যানেল (Audio Play Controls):
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {formatTime(audioCurrentTime)} / {formatTime(audioDuration || (estimatedAudioMinutes * 60))}
          </span>
        </div>

        {/* Progress Bar / Scrubber */}
        <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full transition-all duration-300"
            style={{
              width: `${
                speechProgress > 0
                  ? speechProgress * 100
                  : audioDuration > 0
                  ? (audioCurrentTime / audioDuration) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        {/* Action Control Buttons: Play, Stop, Download, Share */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Button */}
            <button
              onClick={handlePlayVoice}
              className={`py-3.5 px-6 rounded-2xl font-bangla font-bold text-sm md:text-base shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all flex items-center gap-2.5 border ${
                isSpeaking || isAudioPlayerPlaying
                  ? 'bg-red-800 border-red-400 text-white animate-pulse'
                  : 'bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-600 hover:to-rose-500 border-red-400/80 text-white'
              }`}
            >
              {isSpeaking || isAudioPlayerPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current lighting-gold" />
                  <span>পজ করুন (Pause)</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current text-amber-300" />
                  <span>▶️ অডিও প্লে করুন (PLAY AUDIO)</span>
                </>
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStopAllAudio}
              className="py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-red-950 border border-white/15 text-zinc-300 hover:text-white font-bangla text-sm font-semibold transition-all flex items-center gap-2 shadow"
            >
              <Square className="w-4 h-4 fill-current text-red-400" />
              <span>⏹️ বন্ধ করুন (Stop)</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct .WAV Download Button */}
            <button
              onClick={handleDownloadWavAudio}
              className="py-3.5 px-5 rounded-2xl bg-blue-950 hover:bg-blue-900 border border-blue-500 text-white text-xs md:text-sm font-mono font-bold shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 lighting-cyan" />
              <span className="lighting-cyan">অডিও ডাউনলোড (.WAV)</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onOpenShareModal(storyText)}
              className="py-3.5 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 font-bangla text-xs md:text-sm font-semibold shadow flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 lighting-emerald" />
              <span className="lighting-emerald hidden md:inline">শেয়ার</span>
            </button>
          </div>
        </div>

        {/* Live Reading Sentence Tracker */}
        {isSpeaking && currentChunk && (
          <div className="p-3 rounded-2xl bg-black/70 border border-red-500/70 text-xs md:text-sm font-bangla text-zinc-100 flex items-center gap-2.5 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <span className="font-bold lighting-gold">কণ্ঠ পাঠ হচ্ছে:</span>
            <span className="truncate italic">"{currentChunk}"</span>
          </div>
        )}
      </div>

      {/* 7. Voice Persona Selection (৪টি ভৌতিক কণ্ঠের রূপ) */}
      <div className="glass-iphone p-4 md:p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-mono font-bold lighting-gold flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            ভয়েস ক্যারেক্টার নির্বাচন করুন (Select Horror Persona):
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">৪টি বিকল্প</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-bangla">
          {/* User Clone (DEFAULT) */}
          <button
            onClick={() => setPersona('UserClone')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              persona === 'UserClone'
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="font-bold lighting-gold flex items-center justify-between">
              <span>👤 আমার কণ্ঠ (সুমন শিকদার) ★</span>
              {persona === 'UserClone' && <CheckCircle className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">আপনার নিজস্ব কণ্ঠের ভৌতিক মডেল (ডিফল্ট)</div>
          </button>

          {/* Demonic Charon */}
          <button
            onClick={() => setPersona('Charon')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              persona === 'Charon'
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="font-bold lighting-red flex items-center justify-between">
              <span>👹 রক্তহিম দানবীয় পিশাচ (Charon)</span>
              {persona === 'Charon' && <CheckCircle className="w-4 h-4 text-red-400" />}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">অতিলৌকিক পাতালপুরীর দানবীয় রূপ</div>
          </button>

          {/* Ghostly Kore */}
          <button
            onClick={() => setPersona('Kore')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              persona === 'Kore'
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="font-bold lighting-cyan flex items-center justify-between">
              <span>👻 অশরীরী মায়াবী ফিসফিসানি</span>
              {persona === 'Kore' && <CheckCircle className="w-4 h-4 text-sky-400" />}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">হাড় কাঁপানো ঠান্ডা প্রেতাত্মার ফিসফিসানি</div>
          </button>

          {/* Dramatic Puck */}
          <button
            onClick={() => setPersona('Puck')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              persona === 'Puck'
                ? 'bg-red-950/80 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <div className="font-bold lighting-purple flex items-center justify-between">
              <span>🎙️ বাস্তব মানুষের ভৌতিক কথক</span>
              {persona === 'Puck' && <CheckCircle className="w-4 h-4 text-purple-400" />}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">গম্ভীর রেডিও থ্রিলার উপস্থাপক</div>
          </button>
        </div>
      </div>

      {/* 8. Quick 1-Click Horror Stories & 1-2 Hours Mega Stories */}
      <div className="glass-iphone p-4 md:p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-mono font-bold lighting-emerald flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            প্রস্তুত গল্পসমূহ ও মেগা কাহিনি (১-ক্লিকে লোড করুন):
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">ক্লিক করলেই টেক্সট বক্সে লোড হবে</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-bangla">
          {presetStories.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setStoryText(preset.content);
                setGenerationSuccess(false);
              }}
              className="p-3 rounded-2xl bg-black/50 hover:bg-red-950/60 border border-white/10 hover:border-red-500 text-left transition-all group shadow"
            >
              <div className="font-bold text-zinc-200 group-hover:lighting-gold truncate mb-1">
                {preset.title}
              </div>
              <div className="text-[11px] text-zinc-400 line-clamp-2">
                {preset.content.replace(/\[.*?\]/g, '')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 9. Horror Voice Fine-Tuning Sliders (Pitch, Pace & Ghostly Reverb) */}
      <div className="glass-iphone p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <span className="text-xs font-mono font-bold lighting-cyan flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            ভয়েস ফাইন-টিউনিং (Pitch, Speed & Ghostly Reverb):
          </span>
          <button
            onClick={() => {
              setPitch(0.91);
              setRate(0.93);
              setEchoIntensity(0.55);
            }}
            className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            রিসেট
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Pitch */}
          <div>
            <div className="flex justify-between text-zinc-300 mb-1">
              <span>সুর / পিচ (Pitch):</span>
              <span className="lighting-gold font-bold">{pitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.02"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
            />
          </div>

          {/* Speed */}
          <div>
            <div className="flex justify-between text-zinc-300 mb-1">
              <span>পঠন গতি (Speed):</span>
              <span className="lighting-cyan font-bold">{rate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.02"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
            />
          </div>

          {/* Reverb Intensity */}
          <div>
            <div className="flex justify-between text-zinc-300 mb-1">
              <span>ভৌতিক প্রতিধ্বনি (Ghostly Reverb):</span>
              <span className="lighting-red font-bold">{Math.round(echoIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={echoIntensity}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setEchoIntensity(v);
                audioEngine.setEchoEnabled(true, v);
              }}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* 10. Controllable Background Horror Ambient Soundboard & Volume Mixer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold lighting-gold flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" />
            ভৌতিক ব্যাকগ্রাউন্ড অ্যাম্বিয়েন্ট ও সাউন্ড মিক্সার (শব্দ বাড়ানো/কমানোর নিয়ন্ত্রণ):
          </span>
          <button
            onClick={() => setShowAmbientMixer(!showAmbientMixer)}
            className="text-xs font-bangla text-zinc-400 hover:text-white underline"
          >
            {showAmbientMixer ? 'প্যানেল লুকান' : 'প্যানেল দেখান'}
          </button>
        </div>

        {showAmbientMixer && <AmbientSoundboard />}
      </div>

      {/* 11. PWA / App Download Modal */}
      {isAppDownloadOpen && (
        <AppDownloadModal onClose={() => setIsAppDownloadOpen(false)} />
      )}
    </div>
  );
};
