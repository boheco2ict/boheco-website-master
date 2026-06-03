import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const STORAGE_KEY = 'boheco-installed';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const installed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (installed) {
      setIsInstalled(true);
      setShowPrompt(false);
    }

    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const appInstalledHandler = () => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (error) {
        // ignore localStorage failures
      }
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      Swal.fire({
        title: 'Installed!',
        text: 'BOHECO II has been added to your device.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      });
    };

    const standaloneCheck = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      if (isStandaloneMode) {
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch (error) {
          // ignore localStorage failures
        }
        setIsInstalled(true);
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    };

    standaloneCheck();
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const isIosDevice = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        Swal.fire({
          title: 'Great!',
          text: 'The app install prompt was accepted.',
          icon: 'success',
          timer: 2200,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: 'Maybe later',
          text: 'You can install the app later from your browser menu.',
          icon: 'info',
          timer: 2200,
          showConfirmButton: false,
        });
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
      return;
    }

    const message = isIosDevice()
      ? 'Safari on iOS does not show the standard PWA prompt. Use Share > Add to Home Screen to install it as an app.'
      : 'Your browser does not support the automatic install prompt. Use the browser menu and choose Install or Add to home screen.';

    await Swal.fire({
      title: 'Install BOHECO II',
      html: message,
      icon: 'info',
      confirmButtonText: 'OK',
      buttonsStyling: false,
      customClass: {
        container: 'swal2-bottom-right',
        popup: 'swal2-border-radius swal2-small-popup',
        confirmButton: 'swal2-confirm-custom',
      },
    });
    setShowPrompt(false);
  };

  const handleLater = () => {
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:w-auto">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Install BOHECO II
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Add BOHECO II to your device for faster access and offline support. 
            If you want to install later, the prompt will return on refresh.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleLater}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
