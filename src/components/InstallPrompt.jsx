import { useCallback, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const SESSION_KEY = 'boheco-install-prompt-shown';

function InstallPrompt() {
  const deferredPromptRef = useRef(null);
  const modalShownRef = useRef(false);

  const isIosDevice = useCallback(() => {
    return /iphone|ipad|ipod/.test(
      window.navigator.userAgent.toLowerCase()
    );
  }, []);

  const isStandalone = () => {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  };

  const handleInstall = useCallback(async () => {
    const promptEvent = deferredPromptRef.current;

    if (!promptEvent) {
      return;
    }

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
    }

    deferredPromptRef.current = null;
  }, []);

  const showInstallModal = useCallback(async () => {
    // Prevent multiple executions
    if (modalShownRef.current) return;

    // Already shown during this browser session
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      return;
    }

    // Already installed
    if (isStandalone()) {
      return;
    }

    // Mark as shown BEFORE displaying the modal.
    // This prevents it from appearing again even if
    // React re-renders or the user navigates.
    sessionStorage.setItem(SESSION_KEY, 'true');
    modalShownRef.current = true;

    // iOS
    if (isIosDevice()) {
      await Swal.fire({
        title: 'Install BOHECO II',
        html: `
          Install BOHECO II from Safari:
          <br><br>
          <b>Share → Add to Home Screen</b>
        `,
        icon: 'info',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false,
        customClass: {
          popup: 'swal2-border-radius swal2-small-popup',
          confirmButton: 'swal2-confirm-custom',
        },
      });

      return;
    }

    // Android / Chrome / Edge / supported browsers
    const promptEvent = deferredPromptRef.current;

    const result = await Swal.fire({
      title: 'Install BOHECO II',
      html: promptEvent
        ? 'Add BOHECO II to your home screen for faster access and offline support.'
        : 'You can install BOHECO II from your browser menu by choosing <b>Install</b> or <b>Add to Home screen</b>.',
      icon: 'info',

      showCancelButton: Boolean(promptEvent),

      confirmButtonText: promptEvent
        ? 'Install'
        : 'OK',

      cancelButtonText: 'Maybe later',

      reverseButtons: true,

      allowOutsideClick: false,
      allowEscapeKey: false,

      buttonsStyling: false,

      customClass: {
        popup: 'swal2-border-radius swal2-small-popup',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      },
    });

    if (result.isConfirmed && promptEvent) {
      await handleInstall();
    }
  }, [handleInstall, isIosDevice]);

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) {
      return;
    }

    // Capture browser's install prompt
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();

      deferredPromptRef.current = event;
    };

    window.addEventListener(
      'beforeinstallprompt',
      beforeInstallPromptHandler
    );

    // Wait a little for beforeinstallprompt to fire.
    // This allows Chrome/Edge to provide the install button.
    const timer = setTimeout(() => {
      showInstallModal();
    }, 1000);

    return () => {
      clearTimeout(timer);

      window.removeEventListener(
        'beforeinstallprompt',
        beforeInstallPromptHandler
      );
    };
  }, [showInstallModal]);

  return null;
}

export default InstallPrompt;