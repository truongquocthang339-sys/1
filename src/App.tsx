import React, { useRef, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { JourneyModal } from "./components/JourneyModal";
import { BackgroundModal } from "./components/BackgroundModal";
import { Volume2, VolumeX, Play, Pause, Image as ImageIcon, Video, UploadCloud } from "lucide-react";

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  // Background state with local persistence
  const [bgType, setBgType] = useState<"video" | "image">(() => {
    return (localStorage.getItem("mz_bg_type") as "video" | "image") || "video";
  });
  const [bgSrc, setBgSrc] = useState<string>(() => {
    return localStorage.getItem("mz_bg_src") || DEFAULT_VIDEO_URL;
  });

  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "journey" | "studio";
  }>({
    isOpen: false,
    mode: "journey",
  });

  useEffect(() => {
    if (bgType === "video" && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay prevented:", err);
        setIsPlaying(false);
      });
    }
  }, [bgType, bgSrc]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const updateBackground = (type: "video" | "image", src: string) => {
    setBgType(type);
    setBgSrc(src);
    try {
      localStorage.setItem("mz_bg_type", type);
      localStorage.setItem("mz_bg_src", src);
    } catch {
      // storage limit handler if large dataURI
    }
  };

  const resetToDefaultVideo = () => {
    setBgType("video");
    setBgSrc(DEFAULT_VIDEO_URL);
    localStorage.removeItem("mz_bg_type");
    localStorage.removeItem("mz_bg_src");
  };

  // Global Drag and drop listener for instant artwork drops
  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsGlobalDragging(true);
  };

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    // Only disable if leaving window
    if (e.relatedTarget === null) {
      setIsGlobalDragging(false);
    }
  };

  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsGlobalDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const isVideo = file.type.startsWith("video/");
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = ev.target?.result as string;
          if (res) {
            updateBackground(isVideo ? "video" : "image", res);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <main
      id="app-root"
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-background text-foreground select-none"
    >
      {/* Background Media: Video or High-Res Artwork Image */}
      {bgType === "video" ? (
        <video
          key={bgSrc}
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src={bgSrc}
        />
      ) : (
        <img
          key={bgSrc}
          src={bgSrc}
          alt="3D Artist Environment Artwork"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Global Drag & Drop Overlay Feedback */}
      {isGlobalDragging && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 border-4 border-dashed border-white/60 m-4 rounded-3xl pointer-events-none">
          <UploadCloud className="w-16 h-16 text-white mb-4 animate-bounce" />
          <h3
            className="text-4xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Drop Your 3D Artwork Here
          </h3>
          <p className="text-muted-foreground text-sm mt-2">
            Release to set as your cinematic fullscreen background
          </p>
        </div>
      )}

      {/* Glassmorphic Navigation Bar */}
      <Navbar
        onCtaClick={() => setModalState({ isOpen: true, mode: "studio" })}
      />

      {/* Cinematic Hero Section */}
      <Hero
        onBeginJourney={() => setModalState({ isOpen: true, mode: "journey" })}
      />

      {/* Minimalist Ambient Footer Controls */}
      <footer
        id="app-footer-controls"
        className="relative z-10 w-full max-w-7xl mx-auto px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-3">
          <span className="tracking-widest uppercase text-[10px] opacity-70">
            Melozing Portfolio
          </span>
          <span className="opacity-30">•</span>
          <button
            id="change-background-button"
            onClick={() => setIsBgModalOpen(true)}
            className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-foreground flex items-center gap-1.5 hover:scale-[1.03] transition-transform cursor-pointer"
            title="Change background media or upload your artwork"
          >
            {bgType === "video" ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5" />
            )}
            <span>Change Background</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {bgType === "video" && (
            <>
              <button
                id="video-play-toggle"
                onClick={togglePlayPause}
                className="p-2 rounded-full liquid-glass text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label={isPlaying ? "Pause background video" : "Play background video"}
                title={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                id="video-mute-toggle"
                onClick={toggleMute}
                className="p-2 rounded-full liquid-glass text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
                title={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Interactive Contact / Studio Modal */}
      <JourneyModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Background Media Management Modal */}
      <BackgroundModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        currentBgType={bgType}
        currentBgSrc={bgSrc}
        onUpdateBackground={updateBackground}
        onResetDefault={resetToDefaultVideo}
      />
    </main>
  );
}
