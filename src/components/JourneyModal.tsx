import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "journey" | "studio";
}

export const JourneyModal: React.FC<JourneyModalProps> = ({
  isOpen,
  onClose,
  mode = "journey",
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
    >
      <div
        id="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass w-full max-w-md rounded-3xl p-8 relative shadow-2xl border border-white/10 text-center"
      >
        {/* Close Button */}
        <button
          id="modal-close-button"
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <h2
              className="text-3xl sm:text-4xl text-foreground font-normal tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {mode === "journey" ? "Begin The Journey" : "Connect With Me"}
            </h2>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Reach out to collaborate on events, 3D environment art, and creative visual editing.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full liquid-glass rounded-full py-3.5 px-6 text-sm text-foreground flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 cursor-pointer font-medium"
              >
                <span>Request Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-white/90 mx-auto" />
            <h3
              className="text-2xl text-foreground font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Welcome to the inner circle
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              We have reserved your invitation. Keep an eye on{" "}
              <span className="text-foreground">{email}</span> for your personal
              access key.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
                onClose();
              }}
              className="mt-6 liquid-glass rounded-full px-8 py-2.5 text-xs text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
            >
              Return to View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
