import { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const STORAGE_KEY = 'boheco-installed';

function InstallPrompt() {
  const deferredPromptRef = useRef(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasModalShown, setHasModalShown] = useState(false);
  const [fallbackModalShown, setFallbackModalShown] = useState(false);

  const isIosDevice = useCallback(
    () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()),
    []
  );

  const handleInstall = useCallback(async () => {
    const promptEvent = deferredPromptRef.current;

    if (promptEvent) {
        promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;
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
        deferredPromptRef.current = null;
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
    }, [isIosDevice]);

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
      deferredPromptRef.current = event;

      if (fallbackModalShown && !isInstalled && !isIosDevice()) {
        showInstallModal();
      }
    };

    const appInstalledHandler = () => {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (error) {
        // ignore localStorage failures
      }
      setIsInstalled(true);
      deferredPromptRef.current = null;
      Swal.fire({
        title: 'Installed!',
        text: 'BOHECO II has been added to your device.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      });
    };

    const showInstallModal = async () => {
      if (isInstalled) return;
      if (hasModalShown && !fallbackModalShown) return;

      if (isIosDevice()) {
        setHasModalShown(true);
        setFallbackModalShown(false);

        await Swal.fire({
          title: 'Install BOHECO II',
          html: 'Install BOHECO II from Safari Share > Add to Home Screen.',
          icon: 'info',
          confirmButtonText: 'OK',
          buttonsStyling: false,
          customClass: {
            popup: 'swal2-border-radius swal2-small-popup',
            confirmButton: 'swal2-confirm-custom',
          },
        });
        return;
      }

      let promptEvent = deferredPromptRef.current;

      if (!promptEvent) {
        promptEvent = await new Promise((resolve) => {
          let onPrompt;

          const timer = window.setTimeout(() => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            resolve(null);
          }, 3000);

          onPrompt = (event) => {
            event.preventDefault();
            deferredPromptRef.current = event;
            window.clearTimeout(timer);
            window.removeEventListener('beforeinstallprompt', onPrompt);
            resolve(event);
          };

          window.addEventListener('beforeinstallprompt', onPrompt);
        });
      }

      const canInstall = Boolean(promptEvent);
      setHasModalShown(true);
      setFallbackModalShown(!canInstall);

      const result = await Swal.fire({
        title: 'Install BOHECO II',
        html: canInstall
          ? 'Add BOHECO II to your home screen for faster access and offline support.'
          : 'Your browser does not support the automatic install prompt yet. Please use your browser menu and choose Install when available.',
        icon: 'info',
        showCancelButton: canInstall,
        confirmButtonText: canInstall ? 'Install' : 'OK',
        cancelButtonText: 'Maybe later',
        reverseButtons: true,
        allowOutsideClick: false,
        buttonsStyling: false,
        customClass: {
          popup: 'swal2-border-radius swal2-small-popup',
          confirmButton: 'swal2-confirm-custom',
          cancelButton: 'swal2-cancel-custom',
        },
      });

      if (result.isConfirmed && canInstall) {
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
  }, [hasModalShown, isInstalled, handleInstall, isIosDevice, fallbackModalShown]);

  return null;
}

export default InstallPrompt;
