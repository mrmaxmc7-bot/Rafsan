import React, { useState, useEffect } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { NightmareHeader } from './components/NightmareHeader';
import { StoryGeneratorStudio } from './components/StoryGeneratorStudio';
import { InteractiveHorrorCanvas } from './components/InteractiveHorrorCanvas';
import { BloodSplatterOverlay } from './components/BloodSplatterOverlay';
import { ShareModal } from './components/ShareModal';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { audioEngine } from './utils/audioEngine';
import { speechEngine } from './utils/speechEngine';
import { APP_NAME, APP_EST } from './assets/logo';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [visitorName, setVisitorName] = useState<string>('');
  const [isNightmare, setIsNightmare] = useState<boolean>(false);
  const [showSplatter, setShowSplatter] = useState<boolean>(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareStoryText, setShareStoryText] = useState<string>('');

  // Handle Entrance from Intro Screen
  const handleEnter = (name: string) => {
    setVisitorName(name);
    setHasEntered(true);
  };

  // Toggle Global Nightmare Mode
  const handleToggleNightmare = () => {
    const nextState = !isNightmare;
    setIsNightmare(nextState);
    audioEngine.setNightmareMode(nextState);
    if (nextState) {
      // Trigger momentary blood splatter on entering Nightmare Mode
      triggerSplatter();
      audioEngine.playSfx('laugh');
    }
  };

  // Trigger Blood Splatter
  const triggerSplatter = () => {
    setShowSplatter(true);
    setTimeout(() => {
      setShowSplatter(false);
    }, 4500);
  };

  // Open Share Center
  const handleOpenShare = (text: string) => {
    setShareStoryText(text);
    setIsShareModalOpen(true);
  };

  // Direct Audio Download from Share Modal
  const handleDownloadAudioFromShare = async () => {
    if (!shareStoryText.trim()) return;
    await speechEngine.exportAudioFile(
      shareStoryText,
      {
        persona: 'Puck',
        pitch: 1.0,
        rate: 0.95,
        echoEnabled: true,
        echoIntensity: 0.55,
      },
      `sksumonxhikder-audio-${Date.now()}.wav`
    );
  };

  return (
    <div
      className={`min-h-screen bg-black text-slate-100 flex flex-col relative transition-colors duration-1000 ${
        isNightmare ? 'nightmare-pulse' : ''
      }`}
    >
      {/* Interactive Background Particle & Mist Parallax */}
      <InteractiveHorrorCanvas isNightmare={isNightmare} />

      {/* Visceral Blood Splatter Animation Overlay */}
      <BloodSplatterOverlay
        showClimaxSplatter={showSplatter}
        onDismiss={() => setShowSplatter(false)}
      />

      {/* 1. Intro Screen / Gate */}
      {!hasEntered && <IntroScreen onEnter={handleEnter} />}

      {/* 2. Main Cyber-Horror Studio (Revealed after entering) */}
      {hasEntered && (
        <>
          <NightmareHeader
            isNightmare={isNightmare}
            onToggleNightmare={handleToggleNightmare}
            onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
            onTriggerSplatter={triggerSplatter}
          />

          <main className="flex-1 relative z-10 pb-12">
            <StoryGeneratorStudio
              onOpenShareModal={handleOpenShare}
              onTriggerSplatter={triggerSplatter}
              isNightmare={isNightmare}
            />
          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-red-950/80 bg-black/95 py-6 px-4 text-center">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold">{APP_NAME}</span>
                <span>•</span>
                <span>{APP_EST}</span>
                <span>•</span>
                <span className="text-red-400 font-bangla">তুমি এবার মরবে</span>
              </div>
              <div className="text-zinc-600">
                স্বাগতম, <strong className="text-zinc-400">{visitorName || 'পরিদর্শক'}</strong> | Cyber-Horror Speech Studio
              </div>
            </div>
          </footer>
        </>
      )}

      {/* 3. Share & Download Modal */}
      {isShareModalOpen && (
        <ShareModal
          storyText={shareStoryText}
          onClose={() => setIsShareModalOpen(false)}
          onDownloadAudioWav={handleDownloadAudioFromShare}
        />
      )}

      {/* 4. Owner Portal Modal */}
      {isOwnerPortalOpen && (
        <OwnerPortalModal onClose={() => setIsOwnerPortalOpen(false)} />
      )}
    </div>
  );
}
