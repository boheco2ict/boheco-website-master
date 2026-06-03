import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [promptShown, setPromptShown] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const appInstalledHandler = () => {
      Swal.fire({
        title: 'Installed!',
        text: 'BOHECO II has been added to your device.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      });
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  useEffect(() => {
    if (!promptShown) {
      const fallbackTimer = window.setTimeout(() => {
        if (!deferredPrompt) {
          setPromptShown(true);
          Swal.fire({
            title: 'Install BOHECO II',
            text: 'To install this app, use your browser menu and select Add to Home Screen. If this prompt appears again, tap Install.',
            icon: 'info',
            confirmButtonText: 'Install',
            cancelButtonText: 'Later',
            showCancelButton: true,
            buttonsStyling: false,
            background: '#f8fafc',
            color: '#111827',
            customClass: {
              popup: 'swal2-border-radius',
              confirmButton: 'swal2-confirm-custom',
              cancelButton: 'swal2-cancel-custom',
            },
          });
        }
      }, 3500);

      return () => window.clearTimeout(fallbackTimer);
    }
  }, [deferredPrompt, promptShown]);

  useEffect(() => {
    if (deferredPrompt && !promptShown) {
      const timer = window.setTimeout(() => {
        setPromptShown(true);
        promptInstall();
      }, 800);

      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredPrompt]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    const result = await Swal.fire({
      title: 'Install BOHECO II?',
      text: 'Add this app to your home screen for faster access and offline support.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Install',
      cancelButtonText: 'Maybe later',
      buttonsStyling: false,
      background: '#f8fafc',
      color: '#111827',
      customClass: {
        popup: 'swal2-border-radius',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
      allowOutsideClick: false,
    });

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
