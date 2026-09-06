import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, RotateCcw, Link as LinkIcon, Info } from "lucide-react";

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBgType: "video" | "image";
  currentBgSrc: string;
  onUpdateBackground: (type: "video" | "image", src: string) => void;
  onResetDefault: () => void;
}

export const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  currentBgType,
  currentBgSrc,
  onUpdateBackground,
  onResetDefault,
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setErrorMsg("");
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setErrorMsg("Please upload a valid image (JPG, PNG, WebP) or video (MP4, WebM) file.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUpdateBackground(isVideo ? "video" : "image", result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (trimmed.includes("facebook.com") || trimmed.includes("fb.com") || trimmed.includes("instagram.com")) {
      setErrorMsg(
        "Facebook and social media post links require account authentication and block direct browser embedding. Please download the photo from Facebook and upload or drag & drop it above!"
      );
      return;
    }

    // Check if video or image
    const isVideo = trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.includes("video");
    onUpdateBackground(isVideo ? "video" : "image", trimmed);
    setUrlInput("");
    onClose();
  };

  return (
    <div
      id="bg-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300 select-none"
    >
      <div
        id="bg-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass w-full max-w-lg rounded-3xl p-8 relative shadow-2xl border border-white/10"
      >
        {/* Close Button */}
        <button
          id="bg-modal-close"
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
          aria-label="Close background settings"
        >
          <X className="w-5 h-5" />
        </button>

        <h2
          className="text-3xl text-foreground font-normal tracking-tight"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Change Background Media
        </h2>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          Showcase your 3D environment art or event visuals in full cinematic resolution.
        </p>

        {/* Facebook notice card */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
          <Info className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
          <span>
            <strong>Note on Facebook Links:</strong> Facebook protects post URLs with login barriers. To display your Facebook artwork, simply save the photo to your device and drop it in below!
          </span>
        </div>

        {/* Drag & Drop / File Selection Zone */}
        <div
          id="upload-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-white bg-white/10 scale-[1.01]"
              : "border-white/20 hover:border-white/40 hover:bg-white/[0.03]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Click to upload or drag & drop your 3D artwork
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports High-Res JPG, PNG, WebP, or MP4 video
          </p>
        </div>

        {/* Direct Link Form */}
        <form onSubmit={handleUrlSubmit} className="mt-6 space-y-3">
          <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Or paste a direct image / video URL:</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setErrorMsg("");
              }}
              placeholder="https://example.com/artwork.jpg"
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="liquid-glass rounded-full px-5 py-2.5 text-xs text-foreground hover:scale-[1.02] cursor-pointer font-medium whitespace-nowrap"
            >
              Apply
            </button>
          </div>
        </form>

        {errorMsg && (
          <p className="text-red-400 text-xs mt-3 bg-red-950/40 p-2.5 rounded-lg border border-red-800/40">
            {errorMsg}
          </p>
        )}

        {/* Bottom options: Reset default */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Current mode: <span className="text-foreground capitalize">{currentBgType}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onResetDefault();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to default video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
