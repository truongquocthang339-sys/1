import React from "react";

interface HeroProps {
  onBeginJourney?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBeginJourney }) => {
  return (
    <section
      id="hero-section"
      className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 py-[90px] flex-1 my-auto"
    >
      {/* Cinematic Heading */}
      <h1
        id="hero-heading"
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Make <em className="not-italic text-muted-foreground">every moment</em>{" "}
        priceless
      </h1>

      {/* Subtext */}
      <p
        id="hero-subtext"
        className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-normal"
      >
        I am a mid-level 3D artist and editor specializing in events and
        environment art. Reach out to me if you want to enjoy the results of a
        well-crafted process.
      </p>

      {/* Hero Action Button */}
      <button
        id="hero-cta-button"
        onClick={onBeginJourney}
        className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-foreground mt-12 hover:scale-[1.03] transition-transform duration-200 cursor-pointer select-none"
      >
        Begin Journey
      </button>
    </section>
  );
};
