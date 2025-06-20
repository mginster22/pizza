"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AudioTest() {
  const [ready, setReady] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const enableAudio = () => {
      console.log("✅ Клик засчитан, создаём AudioContext");

      audioCtxRef.current = new AudioContext();
      audioCtxRef.current.resume();
      setReady(true);

      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio);
    return () => document.removeEventListener("click", enableAudio);
  }, []);

  const playSound = async () => {
    if (!audioCtxRef.current) {
      console.warn("AudioContext не инициализирован");
      return;
    }

    try {
      const response = await fetch("/notification.mp3");
      const buffer = await response.arrayBuffer();
      const decoded = await audioCtxRef.current.decodeAudioData(buffer);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = decoded;
      source.connect(audioCtxRef.current.destination);
      source.start();
      console.log("🔊 Звук проигран");
    } catch (err) {
      console.error("❌ Ошибка воспроизведения:", err);
    }
  };

  return (
    <div className="p-10">
      <p className="mb-4">Нажмите по странице, затем по кнопке:</p>
      <button
        onClick={playSound}
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={!ready}
      >
        🔊 Проиграть звук
      </button>
    </div>
  );
}
