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
    if (deferredPrompt && !promptShown) {
      const timer = window.setTimeout(() => {
        setPromptShown(true);
        promptInstall();
      }, 800);

      return () => window.clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredPrompt]);

  useEffect(() => {
    if (!deferredPrompt && !promptShown) {
      const fallbackTimer = window.setTimeout(() => {
        setPromptShown(true);
        Swal.fire({
          title: 'Install BOHECO II',
          text: 'If the browser install prompt is not available, use your browser menu and choose Add to Home Screen.',
          icon: 'info',
          confirmButtonText: 'Install',
          cancelButtonText: 'Later',
          showCancelButton: true,
          buttonsStyling: false,
          background: '#f8fafc',
          color: '#111827',
          customClass: {
            container: 'swal2-bottom-right',
            popup: 'swal2-border-radius swal2-small-popup',
            confirmButton: 'swal2-confirm-custom',
            cancelButton: 'swal2-cancel-custom',
          },
        });
      }, 5000);

      return () => window.clearTimeout(fallbackTimer);
    }
  }, [deferredPrompt, promptShown]);

  const promptInstall = async () => {
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
