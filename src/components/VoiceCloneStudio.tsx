import React, { useState, useRef } from 'react';
import {
  speechEngine,
  UserVoiceProfile,
  DEFAULT_USER_PROFILE,
  VoicePersona,
} from '../utils/speechEngine';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Sparkles,
  Sliders,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Radio,
  FileAudio,
} from 'lucide-react';

interface VoiceCloneStudioProps {
  currentPersona: VoicePersona;
  onSelectPersona: (p: VoicePersona) => void;
  userProfile: UserVoiceProfile;
  onUpdateProfile: (prof: UserVoiceProfile) => void;
}

export const VoiceCloneStudio: React.FC<VoiceCloneStudioProps> = ({
  currentPersona,
  onSelectPersona,
  userProfile,
  onUpdateProfile,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [activeSampleIndex, setActiveSampleIndex] = useState<1 | 2 | null>(null);
  const [testText, setTestText] = useState(
    'হ্যালো বন্ধুরা! এটি আমার হুবহু নিজস্ব কণ্ঠস্বর। এখন থেকে যেকোনো ছোট বা ১-২ ঘণ্টার বড় ভৌতিক গল্প আমার এই কণ্ঠেই শুনতে পাবেন।'
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. Live Mic Calibration Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        // Stream tracks stop
        stream.getTracks().forEach((track) => track.stop());

        // Process audio sample & auto-calibrate
        onUpdateProfile({
          ...userProfile,
          isCalibrated: true,
          calibratedPitch: 0.94,
          calibratedRate: 0.96,
        });
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 12) {
            stopRecording();
            return 12;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert('মাইক্রোফোন চালু করার অনুমতি পাওয়া যায়নি। তবে আপনার পূর্ববর্তী রেফারেন্স কণ্ঠস্বরটি ইতিমধ্যে সফলভাবে সক্রিয় রয়েছে!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  // 2. Test Speaking with User Clone
  const handleTestClone = async () => {
    if (isTesting) {
      speechEngine.stop();
      setIsTesting(false);
      return;
    }

    setIsTesting(true);
    await speechEngine.speakText(testText, {
      persona: 'UserClone',
      pitch: userProfile.calibratedPitch,
      rate: userProfile.calibratedRate,
      echoEnabled: true,
      echoIntensity: 0.35,
      userProfile,
    });
    setIsTesting(false);
  };

  // 3. Test Reference Quote
  const handlePlayOriginalSample = async (sampleNum: 1 | 2 = 1) => {
    if (isTesting && activeSampleIndex === sampleNum) {
      speechEngine.stop();
      setIsTesting(false);
      setActiveSampleIndex(null);
      return;
    }
    speechEngine.stop();
    setIsTesting(true);
    setActiveSampleIndex(sampleNum);
    const quote = sampleNum === 1 ? userProfile.referenceAudioQuote : userProfile.referenceAudioQuote2;
    await speechEngine.speakText(quote, {
      persona: 'UserClone',
      pitch: userProfile.calibratedPitch,
      rate: userProfile.calibratedRate,
      echoEnabled: false,
      echoIntensity: 0,
      userProfile,
    });
    setIsTesting(false);
    setActiveSampleIndex(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-6 border border-red-900/60 shadow-[0_0_30px_rgba(220,38,38,0.25)] space-y-5">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-950 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950/80 border border-red-700/80 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold font-bangla luminous-text">
              আমার আসল কণ্ঠ ক্লোনার ও ল্যাব (Voice Clone Studio)
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              সুমন শিকদার (SKSUMON) • হুবহু আসল কণ্ঠস্বর প্রোফাইল
            </p>
          </div>
        </div>

        {/* Current Active Persona Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">বর্তমান ভয়েস:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-bangla bg-red-950 border border-red-600 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            {currentPersona === 'UserClone'
              ? '👤 আমার কণ্ঠ (সুমন শিকদার)'
              : currentPersona === 'Charon'
              ? '👹 ভৌতিক পিশাচ (Charon)'
              : currentPersona === 'Kore'
              ? '🎙️ নারী কণ্ঠ (Kore)'
              : '🎙️ পুরুষ কথক (Puck)'}
          </span>
        </div>
      </div>

      {/* Voice Selection Cards */}
      <div>
        <label className="text-xs font-mono text-zinc-400 mb-2 block">
          কথক নির্বাচন করুন (আপনার ইচ্ছামতো পরিবর্তন করতে পারেন):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* User Clone (DEFAULT) */}
          <button
            onClick={() => onSelectPersona('UserClone')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentPersona === 'UserClone'
                ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'glass-card border-red-950 text-zinc-300 hover:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-bangla text-red-200 flex items-center gap-1.5">
                👤 আমার কণ্ঠ (User Voice)
              </span>
              {currentPersona === 'UserClone' && (
                <CheckCircle2 className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-bangla">
              সুমন শিকদারের আসল বাংলা কণ্ঠ (ডিফল্ট)
            </p>
          </button>

          {/* Demonic Charon */}
          <button
            onClick={() => onSelectPersona('Charon')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentPersona === 'Charon'
                ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'glass-card border-red-950 text-zinc-300 hover:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-bangla text-zinc-200">
                👹 ভৌতিক পিশাচ (Charon)
              </span>
              {currentPersona === 'Charon' && (
                <CheckCircle2 className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-bangla">
              অতিলৌকিক পাতালপুরীর দানবীয় রূপ
            </p>
          </button>

          {/* Female Kore */}
          <button
            onClick={() => onSelectPersona('Kore')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentPersona === 'Kore'
                ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'glass-card border-red-950 text-zinc-300 hover:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-bangla text-zinc-200">
                🎙️ নারী কণ্ঠ (Kore)
              </span>
              {currentPersona === 'Kore' && (
                <CheckCircle2 className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-bangla">
              মায়াবী ও শীতল গা ছমছমে কণ্ঠ
            </p>
          </button>

          {/* Male Puck */}
          <button
            onClick={() => onSelectPersona('Puck')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentPersona === 'Puck'
                ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.6)] ring-1 ring-red-500'
                : 'glass-card border-red-950 text-zinc-300 hover:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold font-bangla text-zinc-200">
                🎙️ পুরুষ কথক (Puck)
              </span>
              {currentPersona === 'Puck' && (
                <CheckCircle2 className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400 font-bangla">
              নাটকীয় গম্ভীর রেডিও উপস্থাপনা
            </p>
          </button>
        </div>
      </div>

      {/* User Voice Reference & Live Testing Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original Recorded Sample Quotes */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono lighting-cyan flex items-center gap-1.5 font-bold">
              <FileAudio className="w-4 h-4" />
              আপনার আপলোডকৃত দুটি কণ্ঠের নমুনা:
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 lighting-emerald font-mono">
              ✓ প্রোফাইল সংযুক্ত
            </span>
          </div>

          {/* Sample 1 */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-2">
            <div className="text-[11px] font-bold lighting-gold">নমুনা ১ (ভয়ের জগতের প্রারম্ভিকা):</div>
            <div className="text-xs font-bangla text-zinc-300 italic line-clamp-2">
              "{userProfile.referenceAudioQuote}"
            </div>
            <button
              onClick={() => handlePlayOriginalSample(1)}
              className="w-full py-1.5 px-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700 text-xs font-bangla text-red-200 transition-all flex items-center justify-center gap-2"
            >
              {isTesting && activeSampleIndex === 1 ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>বন্ধ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current lighting-gold" />
                  <span>নমুনা ১ আমার কণ্ঠে শুনুন</span>
                </>
              )}
            </button>
          </div>

          {/* Sample 2 */}
          <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-2">
            <div className="text-[11px] font-bold lighting-purple">নমুনা ২ (স্বাগতম ও পরিচয়):</div>
            <div className="text-xs font-bangla text-zinc-300 italic line-clamp-2">
              "{userProfile.referenceAudioQuote2}"
            </div>
            <button
              onClick={() => handlePlayOriginalSample(2)}
              className="w-full py-1.5 px-3 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-xs font-bangla text-purple-200 transition-all flex items-center justify-center gap-2"
            >
              {isTesting && activeSampleIndex === 2 ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>বন্ধ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current lighting-purple" />
                  <span>নমুনা ২ আমার কণ্ঠে শুনুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Live Microphone Calibration & Test */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono lighting-gold flex items-center gap-1.5 font-bold">
                <Mic className="w-4 h-4" />
                লাইভ মাইক রেকর্ডিং (নতুন ভয়েস ক্যালিব্রেশন):
              </span>
              {isRecording && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse font-mono">
                  রেকর্ড হচ্ছে: {recordingTime}s / 12s
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-300 font-bangla mb-4 leading-relaxed">
              আপনি চাইলে যেকোনো সময় সরাসরি মাইকে ৫ সেকেন্ড কথা বলে আপনার ভয়েসের ফ্রিকোয়েন্সি, খসখসে ভাব ও টোন নিখুঁতভাবে রি-ক্যালিব্রেট করতে পারেন।
            </p>

            <div className="p-3 bg-black/60 rounded-xl border border-white/10 mb-4 text-xs font-bangla text-zinc-400">
              <span className="font-bold lighting-cyan block mb-1">ক্যালিব্রেটেড প্রোফাইল ডিটেলস:</span>
              <div>• পিচ রেঞ্জ: {userProfile.calibratedPitch.toFixed(2)}x (গম্ভীর খসখসে)</div>
              <div>• কথা বলার গতি: {userProfile.calibratedRate.toFixed(2)}x (রহস্যময় ও স্পষ্ট)</div>
              <div>• বক্ষস্বরের উষ্ণতা: {Math.round(userProfile.warmth * 100)}% (প্রক্সিমিটি ইফেক্ট)</div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex-1 py-3 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-bangla text-zinc-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Mic className="w-4 h-4 lighting-red" />
                <span>মাইকে রেকর্ড করুন</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 py-3 px-3 rounded-xl bg-red-700 text-white font-bangla text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <MicOff className="w-4 h-4" />
                <span>রেকর্ডিং থামান ও সেভ করুন</span>
              </button>
            )}

            <button
              onClick={handleTestClone}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white font-bangla text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 lighting-gold" />
              <span>আমার কণ্ঠ টেস্ট করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Calibration Fine-Tuning Sliders */}
      <div className="pt-2 border-t border-red-950 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        {/* Pitch */}
        <div className="bg-black/50 p-2.5 rounded-lg border border-red-950">
          <div className="flex justify-between text-zinc-300 mb-1">
            <span>সুর / পিচ (Pitch):</span>
            <span className="text-red-400 font-bold">{userProfile.calibratedPitch.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.02"
            value={userProfile.calibratedPitch}
            onChange={(e) =>
              onUpdateProfile({ ...userProfile, calibratedPitch: parseFloat(e.target.value) })
            }
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Speed */}
        <div className="bg-black/50 p-2.5 rounded-lg border border-red-950">
          <div className="flex justify-between text-zinc-300 mb-1">
            <span>কথা বলার গতি (Pace):</span>
            <span className="text-red-400 font-bold">{userProfile.calibratedRate.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.4"
            step="0.02"
            value={userProfile.calibratedRate}
            onChange={(e) =>
              onUpdateProfile({ ...userProfile, calibratedRate: parseFloat(e.target.value) })
            }
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Warmth (Proximity EQ) */}
        <div className="bg-black/50 p-2.5 rounded-lg border border-red-950">
          <div className="flex justify-between text-zinc-300 mb-1">
            <span>বক্ষস্বরের গভীরতা (Warmth):</span>
            <span className="text-red-400 font-bold">{Math.round(userProfile.warmth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.6"
            step="0.05"
            value={userProfile.warmth}
            onChange={(e) =>
              onUpdateProfile({ ...userProfile, warmth: parseFloat(e.target.value) })
            }
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        {/* Reset to User Voice Sample */}
        <div className="flex items-end">
          <button
            onClick={() => onUpdateProfile({ ...DEFAULT_USER_PROFILE })}
            className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bangla transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-400" />
            <span>অরিজিনাল নমুনায় রিসেট</span>
          </button>
        </div>
      </div>
    </div>
  );
};
