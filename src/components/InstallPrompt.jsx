import { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const STORAGE_KEY = 'boheco-installed';

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasModalShown, setHasModalShown] = useState(false);

  const isIosDevice = useCallback(
    () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()),
    []
  );

  const handleInstall = useCallback(async () => {
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
          try {
            localStorage.setItem(STORAGE_KEY, 'true');
          } catch (error) {
            // ignore localStorage failures
          }
          setIsInstalled(true);
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
          popup: 'swal2-border-radius swal2-small-popup',
          confirmButton: 'swal2-confirm-custom',
        },
      });
    }, [deferredPrompt, isIosDevice]);

  useEffect(() => {
    const installed = localStorage.getItem(STORAGE_KEY) === 'true';
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (installed || standaloneMode) {
      setIsInstalled(true);
      return;
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
      setDeferredPrompt(null);
      Swal.fire({
        title: 'Installed!',
        text: 'BOHECO II has been added to your device.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      });
    };

    const showInstallModal = async () => {
      if (hasModalShown || isInstalled) return;
      setHasModalShown(true);

      const result = await Swal.fire({
        title: 'Install BOHECO II',
        html: isIosDevice()
          ? 'Install BOHECO II from Safari Share > Add to Home Screen.'
          : 'Add BOHECO II to your home screen for faster access and offline support.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Install',
        cancelButtonText: 'Maybe later',
        reverseButtons: true,
        allowOutsideClick: false,
        customClass: {
          popup: 'swal2-border-radius swal2-small-popup',
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom',
        },
      });

      if (result.isConfirmed) {
        await handleInstall();
      }
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    showInstallModal();

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, [hasModalShown, isInstalled, handleInstall, isIosDevice]);

  return null;
}

export default InstallPrompt;
