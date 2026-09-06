import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onCtaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCtaClick }) => {
  const [activeLink, setActiveLink] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ["Home", "Studio", "About", "Journal", "Reach Us"];

  return (
    <header className="w-full relative z-10">
      <nav
        id="main-navigation"
        className="relative z-10 flex flex-row items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        {/* Logo */}
        <a
          id="nav-logo"
          href="#"
          className="text-3xl tracking-tight text-foreground select-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Melozing's Corner<sup className="text-xs">®</sup>
        </a>

        {/* Desktop Nav Links */}
        <div
          id="desktop-nav-links"
          className="hidden md:flex items-center space-x-8"
        >
          {navLinks.map((link) => {
            const isActive = activeLink === link;
            return (
              <button
                key={link}
                id={`nav-link-${link.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveLink(link)}
                className={`text-sm transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link}
              </button>
            );
          })}
        </div>

        {/* Right CTA and Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            id="nav-cta-button"
            onClick={onCtaClick}
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer"
          >
            Let’s go
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="md:hidden relative z-20 mx-6 mb-4 px-6 py-5 rounded-2xl liquid-glass flex flex-col space-y-4"
        >
          {navLinks.map((link) => {
            const isActive = activeLink === link;
            return (
              <button
                key={link}
                onClick={() => {
                  setActiveLink(link);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm py-1 transition-colors cursor-pointer ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
