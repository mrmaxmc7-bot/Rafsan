import React, { useState } from 'react';
import { APP_NAME, APP_EST } from '../assets/logo';
import { X, Share2, Copy, Check, Download, FileText, Globe, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  storyText: string;
  onClose: () => void;
  onDownloadAudioWav: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  storyText,
  onClose,
  onDownloadAudioWav,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanText = storyText.trim() || 'কোনো গল্প লেখা হয়নি।';

  // 1. Copy to clipboard
  const handleCopy = () => {
    const fullContent = `【 ${APP_NAME} • ${APP_EST} 】\n\n${cleanText}\n\n💀 সাইবার-হরর ভয়েস স্টুডিও: https://sksumonxhikder.app`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 2. WhatsApp Share
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`*${APP_NAME} হরর গল্প*\n\n${cleanText.slice(0, 800)}...\n\nশুনুন সম্পূর্ণ ভয়েস সহ!`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  // 3. Facebook Share
  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  // 4. Telegram Share
  const handleTelegram = () => {
    const msg = encodeURIComponent(`【 ${APP_NAME} হরর গল্প 】\n\n${cleanText.slice(0, 500)}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${msg}`, '_blank');
  };

  // 5. Download as Plain Text .TXT
  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([`=====================================\n  ${APP_NAME} - ${APP_EST}\n  তুমি এবার মরবে...\n=====================================\n\n${cleanText}\n\nGenerated on: ${new Date().toLocaleString()}`], {
      type: 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = `sksumonxhikder-story-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 6. Download as Printable Dark Horror Manuscript HTML / PDF
  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<title>${APP_NAME} - ভৌতিক গল্প</title>
<style>
  body {
    background-color: #050505;
    color: #e4e4e7;
    font-family: 'Hind Siliguri', 'Segoe UI', Tahoma, sans-serif;
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
    border-left: 4px solid #b91c1c;
    border-right: 4px solid #b91c1c;
    line-height: 1.8;
  }
  h1 {
    color: #ef4444;
    text-align: center;
    font-size: 2.2rem;
    letter-spacing: 2px;
    margin-bottom: 5px;
  }
  .sub {
    text-align: center;
    color: #991b1b;
    font-weight: bold;
    margin-bottom: 30px;
  }
  .story {
    white-space: pre-wrap;
    font-size: 1.15rem;
    color: #f4f4f5;
  }
  .footer {
    margin-top: 40px;
    text-align: center;
    font-size: 0.85rem;
    color: #71717a;
    border-top: 1px solid #27272a;
    padding-top: 20px;
  }
</style>
</head>
<body>
  <h1>${APP_NAME}</h1>
  <div class="sub">তুমি এবার মরবে • ${APP_EST}</div>
  <div class="story">${cleanText.replace(/\n/g, '<br/>')}</div>
  <div class="footer">Printed from sksumonxhikder Cyber-Horror Studio</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sksumonxhikder-manuscript-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-red-900/80 rounded-2xl p-5 md:p-6 shadow-[0_0_40px_rgba(220,38,38,0.4)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-red-500">
          <Share2 className="w-5 h-5" />
          <h2 className="text-lg font-bold font-bangla text-zinc-100">
            গল্প ও অডিও শেয়ার / ডাউনলোড কেন্দ্র
          </h2>
        </div>

        {/* Story Preview Snippet */}
        <div className="max-h-32 overflow-y-auto p-3 bg-black/70 rounded-lg border border-red-950 text-xs text-zinc-300 font-bangla mb-4 whitespace-pre-wrap">
          {cleanText}
        </div>

        {/* 1. Download Options Grid */}
        <div className="mb-5">
          <h4 className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-red-400" />
            ডাউনলোড অপশন (Download Hub):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-xs font-mono text-zinc-200 transition-all shadow"
            >
              <FileText className="w-4 h-4 text-red-400" />
              টেক্সট (.TXT)
            </button>

            <button
              onClick={handleDownloadHtml}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-xs font-mono text-zinc-200 transition-all shadow"
            >
              <Globe className="w-4 h-4 text-red-400" />
              হরর বই / PDF
            </button>

            <button
              onClick={onDownloadAudioWav}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-600 text-xs font-mono text-white transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)]"
            >
              <Download className="w-4 h-4 text-red-300" />
              ভয়েস (.WAV)
            </button>
          </div>
        </div>

        {/* 2. Direct Social Share Options */}
        <div>
          <h4 className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            সোশ্যাল মিডিয়া শেয়ার (Instant Share):
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-bold text-emerald-200 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp
            </button>

            <button
              onClick={handleFacebook}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-xs font-bold text-blue-200 transition-all"
            >
              Facebook
            </button>

            <button
              onClick={handleTelegram}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-xs font-bold text-sky-200 transition-all"
            >
              Telegram
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-xs font-bold text-red-200 transition-all shadow"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'কপি হয়েছে!' : 'কপি করুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
