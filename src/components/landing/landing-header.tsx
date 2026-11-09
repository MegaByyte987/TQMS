"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    setScrolled(window.scrollY > 60);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "data-s" : ""}`} id="nav">
      <div className="pill">
        <Link className="brand" href="/">TQMS-Pulse</Link>
        <nav className="links" aria-label="Primary">
          <Link href="#flow">How it works</Link>
          <Link href="#features">Features</Link>
          <Link href="#faq">FAQ</Link>
        </nav>
        <Link className="btn btn--primary" href="/login">
          <span className="label label--primary">Open dashboard</span>
          <span className="label label--duplicate" aria-hidden="true">Open dashboard</span>
        </Link>
      </div>
    </header>
  );
}