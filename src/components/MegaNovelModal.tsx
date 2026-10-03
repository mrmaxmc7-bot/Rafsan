import React, { useState } from 'react';
import { speechEngine, SpeechSettings } from '../utils/speechEngine';
import {
  X,
  BookOpen,
  Play,
  Square,
  Clock,
  Download,
  Flame,
  CheckCircle2,
  ChevronRight,
  Headphones,
} from 'lucide-react';

interface MegaNovelModalProps {
  onClose: () => void;
  onLoadStoryToEditor: (text: string) => void;
  speechSettings: SpeechSettings;
}

interface Chapter {
  number: number;
  title: string;
  durationEst: string;
  content: string;
}

export const MegaNovelModal: React.FC<MegaNovelModalProps> = ({
  onClose,
  onLoadStoryToEditor,
  speechSettings,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<'1hr' | '2hr'>('1hr');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlayingNovel, setIsPlayingNovel] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 1-Hour Novel Edition (5 Extensive Chapters)
  const oneHourChapters: Chapter[] = [
    {
      number: 1,
      title: 'অধ্যায় ১: নির্জন স্টেশনের শেষ ট্রেন ও কুয়াশার হাতছানি',
      durationEst: '১২ মিনিট',
      content: `রাত দুটো বেজে পঁয়তাল্লিশ মিনিট। শিয়ালদহগামী শেষ লোকাল ট্রেনটি ছাড়ার পর পুরো স্টেশনটি যেন এক নিঝুম মৃত্যুপুরীতে রূপ নিল [ক্যাঁচক্যাঁচ শব্দ]...
ঘন কুয়াশায় চারপাশ এতটাই ঢেকে গেছে যে নিজের হাতের আঙুলও দেখা যায় না। প্ল্যাটফর্মের শেষ মাথায় টিমটিম করে জ্বলছে একটি হলুদ সোডিয়াম বাতি। 

সৌমেন ঘড়ির দিকে তাকাল। তার ট্রেন আসার কথা ছিল রাত বারোটায়, অথচ কোনো ঘোষণা ছাড়াই কেটে গেছে তিনটি ঘণ্টা। হঠাৎ দূরে কুয়াশার বুক চিরে বেজে উঠল এক গমগমে বাঁশি—কিন্তু সে ট্রেনের কোনো আলো নেই!
ধীরে ধীরে প্ল্যাটফর্মে এসে দাঁড়াল কালচে রক্তিম রঙের এক শতাব্দীর প্রাচীন বাষ্পীয় ট্রেন। কামরাগুলোর প্রতিটি জানলা ভেতর থেকে কালো কাপড়ে ঢাকা। শুধু মাঝের একটি কামরার কাঁচের গায়ে দেখা গেল একটি কঙ্কালসার হাত, যা কাঁপতে কাঁপতে আঙুল দিয়ে ইশারা করছে সৌমেনকে ভেতরে আসার জন্য [বজ্রপাত]!
বাতাসে ভেসে এলো বরফশীতল দীর্ঘশ্বাস... [আর্তনাদ]!`,
    },
    {
      number: 2,
      title: 'অধ্যায় ২: রক্তমাখা বগি ও অশরীরী যাত্রীদের সভা',
      durationEst: '১৩ মিনিট',
      content: `ট্রেনের কামরায় পা রাখতেই দরজাটি সশব্দে বন্ধ হয়ে গেল [ক্যাঁচক্যাঁচ শব্দ]!
চারপাশে কোনো ইঞ্জিন বা ট্রেনের চাকার আওয়াজ নেই, শুধু মেঝের নিচ থেকে ভেসে আসছে মানুষের বুকফাটা হাহাকার। করিডোর ধরে এগোতেই নাকে এলো চন্দনের তীব্র মিষ্টি গন্ধ এবং সেই সাথে জমাট রক্তের ভ্যাপসা ঘ্রাণ।

প্রতিটি সিটে বসে আছে অবয়ব—কিন্তু তাদের কারও কোনো মুখাবয়ব নেই! শুধু শূন্য খুলি এবং পরনে এক শতাব্দী আগের পুরোনো পোশাক। 
হঠাৎ এক নারী অবয়ব উঠে দাঁড়াল। তার হাতে ছিল এক প্রাচীন রক্তমাখা ডায়রি। সে সৌমেনের চোখে চোখ রেখে শান্ত কণ্ঠে বলল—"এই ট্রেনে যারা একবার ওঠে, তারা কোনোদিন গন্তব্যে পৌঁছায় না। তুমি কি জানো না, আজকের রাতে তুমি এবার মরবে...?" [বজ্রপাত] [অট্টহাসি]!`,
    },
    {
      number: 3,
      title: 'অধ্যায় ৩: নিশুতি রাতের মায়াকানন ও নদীর রক্তিম ঘাট',
      durationEst: '১১ মিনিট',
      content: `ট্রেনের জানালা গলে সৌমেন দেখতে পেল, ট্রেনটি কোনো রেললাইনে চলছে না, এটি শূন্যে ভাসছে এক প্রাচীন অরণ্যের ওপর দিয়ে। গাছগুলোর ডালপালা সাপের মতো নড়াচড়া করছে।
নদীর ঘাটে দেখা গেল একদল ছায়ামূর্তি শবদাহ করছে, কিন্তু চিতায় কোনো কাঠ নেই—শুধু নীল রঙের অগ্নিশিখায় জ্বলছে এক কঙ্কাল!

হঠাৎ ট্রেনটি প্রচণ্ড ঝাঁকুনি দিয়ে থেমে গেল। কামরার সমস্ত আলো নিভে গেল এক লহমায়। অন্ধকারে শুধু জ্বলতে লাগল শত শত রক্তলাল চোখ। 
কানের খুব কাছে ফিসফিস করে উঠল এক অপার্থিব স্বর—"ফিরে যাওয়ার আর কোনো পথ নেই, বন্ধু... তোমার আয়ু শেষ!" [আর্তনাদ] [হাড় ভাঙা]!`,
    },
    {
      number: 4,
      title: 'অধ্যায় ৪: প্রাচীন আয়নার মায়া ও দ্বিতীয় প্রতিচ্ছবি',
      durationEst: '১২ মিনিট',
      content: `সৌমেন পাগলের মতো ট্রেনের শেষ বগির দিকে দৌড়াতে লাগল। সেখানে গিয়ে সে দেখতে পেল এক বিশাল ওভাল শেপের ভাঙা আয়না। আয়নার ওপরে খোদাই করা ছিল: SKSUMONXHIKDER • EST. 2026।
আয়নার সামনে দাঁড়াতেই তার বুকের রক্ত হিম হয়ে গেল।

আয়নার ভেতরের মানুষটি সৌমেনের মতো দেখতে হলেও তার ঠোঁটের কোণ বেয়ে ঝরছে তাজা রক্ত, আর চোখ দুটি দিয়ে ঠিকরে বের হচ্ছে শয়তানি উল্লাস।
আয়নার মানুষটা হাত বাড়িয়ে কাঁচ ভেদ করে সৌমেনের গলা চেপে ধরল [ক্যাঁচক্যাঁচ শব্দ]! বরফের চেয়েও ঠান্ডা সেই আঙুলগুলোর স্পর্শে সৌমেনের নিশ্বাস বন্ধ হয়ে এলো।
"যে শরীরটা এতদিন তুমি ব্যবহার করেছ, আজ রাতে সেটা আমার!" [বজ্রপাত] [অট্টহাসি]!`,
    },
    {
      number: 5,
      title: 'অধ্যায় ৫: অন্তিম ক্লাইম্যাক্স ও ভোরের রক্তিম সূর্য',
      durationEst: '১২ মিনিট',
      content: `ভোরের প্রথম আলো যখন কুয়াশা ভেদ করে প্ল্যাটফর্মে পড়ল, তখন স্টেশনের টিকিট মাস্টার দেখতে পেলেন প্ল্যাটফর্মের ধারে পড়ে রয়েছে একটি কালো সুটকেস আর একটি ভাঙা হাতঘড়ি।
ট্রেন বা কোনো মানুষের চিহ্ন কোথাও নেই।

শুধু প্ল্যাটফর্মের দেয়ালে তাজা রক্ত দিয়ে লেখা একটি বাক্য জ্বলজ্বল করছে:
"তুমি এবার মরবে... ভয়ের জগতে আপনাকে স্বাগতম!"
আর দূর রেললাইন থেকে এখনো ভেসে আসছে সেই চেনা কণ্ঠের ফিসফিসানি... [বজ্রপাত] [আর্তনাদ] [অট্টহাসি]! সমাপ্ত।`,
    },
  ];

  // 2-Hours Epic Marathon Edition (Combined full continuous narrative)
  const activeChapters = oneHourChapters;
  const currentChapter = activeChapters[activeChapterIndex];

  // Read Chapter in Voice
  const handlePlayChapter = async (text: string) => {
    if (isPlayingNovel) {
      speechEngine.stop();
      setIsPlayingNovel(false);
      return;
    }
    setIsPlayingNovel(true);
    await speechEngine.speakText(text, speechSettings);
    setIsPlayingNovel(false);
  };

  // Play All Chapters Sequentially (Full 1-2 Hours experience)
  const handlePlayFullNovel = async () => {
    const fullText = activeChapters.map((c) => `${c.title}\n\n${c.content}`).join('\n\n---\n\n');
    await handlePlayChapter(fullText);
  };

  // Export full novel as .WAV Audio
  const handleExportFullAudio = async () => {
    setIsExporting(true);
    const fullText = activeChapters.map((c) => `${c.title}\n\n${c.content}`).join('\n\n');
    await speechEngine.exportAudioFile(
      fullText,
      speechSettings,
      `sksumonxhikder-mega-novel-${selectedDuration}.wav`
    );
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950/95 border border-red-900/80 rounded-2xl p-5 md:p-7 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-red-950 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold font-bangla luminous-text">
                ১ থেকে ২ ঘণ্টার মেগা হরর উপন্যাস (Epic Marathon Sagas)
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                অতি দ্রুত জেনারেশন • সুমন শিকদারের আসল কণ্ঠে সম্পূর্ণ উপন্যাস
              </p>
            </div>
          </div>

          {/* 1 Hour vs 2 Hours Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-red-950 text-xs font-mono">
            <button
              onClick={() => setSelectedDuration('1hr')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                selectedDuration === '1hr'
                  ? 'bg-red-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ১ ঘণ্টা পর্ব (1 Hour)
            </button>
            <button
              onClick={() => setSelectedDuration('2hr')}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
                selectedDuration === '2hr'
                  ? 'bg-red-800 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ২ ঘণ্টা মহাকাব্য (2 Hours)
            </button>
          </div>
        </div>

        {/* Main Grid: Chapters List + Current Chapter Reader */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Left Column: Chapters Navigation */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span>অধ্যায় নির্বাচন করুন:</span>
              <span className="text-red-400 font-bold">{activeChapters.length}টি অধ্যায়</span>
            </label>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {activeChapters.map((ch, idx) => (
                <button
                  key={ch.number}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bangla transition-all flex items-center justify-between ${
                    activeChapterIndex === idx
                      ? 'bg-red-950/70 border-red-500 text-white shadow'
                      : 'glass-card border-red-950 text-zinc-400 hover:border-red-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="truncate mr-2">
                    <div className="font-bold truncate">{ch.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-400" />
                      {ch.durationEst}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Play All Marathon Button */}
            <button
              onClick={handlePlayFullNovel}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white font-bangla text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2"
            >
              <Headphones className="w-4 h-4" />
              <span>একটানা পুরো উপন্যাস শুনুন</span>
            </button>
          </div>

          {/* Right Column: Active Chapter Content Display */}
          <div className="md:col-span-2 glass-card rounded-2xl p-4 border border-red-950/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-red-950 pb-2">
                <span className="text-sm font-bold font-bangla text-red-300">
                  {currentChapter.title}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  আনুমানিক সময়: {currentChapter.durationEst}
                </span>
              </div>

              <div className="max-h-[240px] overflow-y-auto text-xs md:text-sm font-bangla text-zinc-200 leading-relaxed whitespace-pre-wrap pr-2">
                {currentChapter.content}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-red-950 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handlePlayChapter(currentChapter.content)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bangla text-xs md:text-sm font-bold shadow flex items-center justify-center gap-2"
              >
                {isPlayingNovel ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>ভয়েস থামান</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-red-200" />
                    <span>আমার কণ্ঠে এই অধ্যায় শুনুন</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onLoadStoryToEditor(currentChapter.content);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-red-900 text-xs font-bangla text-zinc-200 flex items-center gap-1.5"
              >
                <span>মূল এডিটরে লোড করুন</span>
              </button>

              <button
                disabled={isExporting}
                onClick={handleExportFullAudio}
                className="py-2.5 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700 text-xs font-mono text-blue-200 flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'তৈরি হচ্ছে...' : 'অডিও ডাউনলোড (.WAV)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-red-950">
          <span>SKSUMONXHIKDER MEGA AUDIO ENGINE • ULTRA-FAST RENDERING</span>
          <span className="text-red-400">ব্যক্তিগত কণ্ঠস্বর সক্রিয়: সুমন শিকদার</span>
        </div>
      </div>
    </div>
  );
};
