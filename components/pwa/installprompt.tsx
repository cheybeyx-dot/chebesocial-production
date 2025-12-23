"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border rounded-lg p-4 shadow z-50">
      <p className="font-semibold">Install ChebeSocial App</p>
      <p className="text-sm text-gray-600">
        Fast access, secure & works offline.
      </p>

      <button
        onClick={installApp}
        className="mt-3 w-full bg-black text-white rounded p-2"
      >
        Install App
      </button>

      <p className="mt-2 text-xs text-gray-500">
        If Android warns “unknown source”, it’s safe — this app comes directly
        from ChebeSocial.
      </p>
    </div>
  );
}
