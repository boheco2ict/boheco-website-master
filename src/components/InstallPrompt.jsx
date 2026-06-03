import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [promptShown, setPromptShown] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    try {
      return localStorage.getItem('boheco-installed') === 'true';
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      if (isInstalled) {
        return;
      }
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const appInstalledHandler = () => {
      setIsInstalled(true);
      setPromptShown(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('boheco-installed', 'true');
      } catch (error) {
        // ignore localStorage failures
      }
      Swal.fire({
        title: 'Installed!',
        text: 'BOHECO II has been added to your device.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      });
    };

    const standaloneCheck = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (isStandaloneMode) {
        setIsInstalled(true);
        setPromptShown(true);
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

  useEffect(() => {
    if (deferredPrompt && !promptShown && !isInstalled) {
      const timer = window.setTimeout(() => {
        setPromptShown(true);
        promptInstall();
      }, 800);

      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredPrompt, isInstalled]);

  const isIosDevice = () => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  };

  useEffect(() => {
    if (!deferredPrompt && !promptShown && !isInstalled && isIosDevice()) {
      const fallbackTimer = window.setTimeout(() => {
        setPromptShown(true);
        Swal.fire({
          title: 'Install BOHECO II',
          text: 'Safari on iOS does not show the PWA install prompt. Use Share > Add to Home Screen to install it as an app.',
          icon: 'info',
          confirmButtonText: 'OK',
          buttonsStyling: false,
          background: '#f8fafc',
          color: '#111827',
          customClass: {
            container: 'swal2-bottom-right',
            popup: 'swal2-border-radius swal2-small-popup',
            confirmButton: 'swal2-confirm-custom',
          },
        });
      }, 5000);

      return () => window.clearTimeout(fallbackTimer);
    }
  }, [deferredPrompt, promptShown, isInstalled]);

  const promptInstall = async () => {
    const result = await Swal.fire({
      title: 'Install BOHECO II as an app?',
      text: 'Add this app to your device for faster access and offline support.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Install',
      cancelButtonText: 'Maybe later',
      buttonsStyling: false,
      background: '#f8fafc',
      color: '#111827',
      customClass: {
        container: 'swal2-bottom-right',
        popup: 'swal2-border-radius swal2-small-popup',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
      allowOutsideClick: false,
    });

    if (!deferredPrompt) {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Install Instructions',
          html: 'Open your browser menu and choose <strong>Add to Home Screen</strong>.',
          icon: 'info',
          confirmButtonText: 'OK',
          buttonsStyling: false,
          customClass: {
            container: 'swal2-bottom-right',
            popup: 'swal2-border-radius swal2-small-popup',
            confirmButton: 'swal2-confirm-custom',
          },
        });
      }
      return;
    }

    if (result.isConfirmed) {
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
          title: 'No worries',
          text: 'You can install the app later from your browser menu.',
          icon: 'info',
          timer: 2200,
          showConfirmButton: false,
        });
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return null;
  }

  return deferredPrompt ? (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-700 px-4 py-3 text-white shadow-xl transition hover:bg-blue-800"
      onClick={promptInstall}
    >
      Install BOHECO II
    </button>
  ) : null;
}

export default InstallPrompt;
