'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show install button after a delay so it doesn't appear immediately
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isStandalone) return null;

  // iOS instructions (Safari doesn't support beforeinstallprompt)
  if (isIOS && !isStandalone) {
    const dismissed = localStorage.getItem('pwa-ios-dismissed');
    if (dismissed) return null;

    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-sl-dark/95 backdrop-blur-sm border-2 border-sl-purple rounded-xl p-4 shadow-xl z-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <h3 className="text-sl-gold font-bold text-sm mb-1">Install App</h3>
            <p className="text-sl-light text-xs leading-relaxed">
              Tap the share button <span className="inline-block">⬆️</span> then &quot;Add to Home Screen&quot; to install.
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('pwa-ios-dismissed', 'true');
              window.location.reload();
            }}
            className="text-sl-light/50 hover:text-sl-light text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Standard install prompt for Chrome, Edge, etc.
  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-sl-dark/95 backdrop-blur-sm border-2 border-sl-purple rounded-xl p-4 shadow-xl z-50 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚔️</span>
        <div className="flex-1">
          <h3 className="text-sl-gold font-bold text-sm mb-1">Install Hunter App</h3>
          <p className="text-sl-light text-xs mb-3">
            Install for quick access and offline tracking!
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-sl-purple hover:bg-purple-700 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-sl-gray hover:bg-sl-gray/80 text-sl-light text-xs font-bold py-2 px-3 rounded-lg transition-all"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-sl-light/50 hover:text-sl-light text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
