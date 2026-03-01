"use client"

export function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* ── Animated Book ── */}
      <div style={{ animation: "bookFloat 2.2s ease-in-out infinite" }}>
        <svg
          width="72"
          height="88"
          viewBox="0 0 72 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back cover */}
          <rect x="10" y="4" width="52" height="80" rx="5" fill="#D9D2C7" />

          {/* Pages — each pulses at different delay to fake a turn */}
          <rect
            x="12" y="6" width="48" height="76" rx="4" fill="#FAF9F6"
            style={{ transformOrigin: "12px 44px", animation: "pageTurn 1.8s ease-in-out infinite 0.44s" }}
          />
          <rect
            x="12" y="6" width="48" height="76" rx="4" fill="#F4EFE6"
            style={{ transformOrigin: "12px 44px", animation: "pageTurn 1.8s ease-in-out infinite 0.22s" }}
          />
          <rect
            x="12" y="6" width="48" height="76" rx="4" fill="#EDE8DF"
            style={{ transformOrigin: "12px 44px", animation: "pageTurn 1.8s ease-in-out infinite 0s" }}
          />

          {/* Spine */}
          <rect x="10" y="4" width="7" height="80" rx="3" fill="#C07B5A" />

          {/* Cover lines */}
          <rect x="24" y="24" width="30" height="3"   rx="1.5"  fill="#C07B5A" opacity="0.55" />
          <rect x="24" y="32" width="22" height="2.5" rx="1.25" fill="#C07B5A" opacity="0.35" />
          <rect x="24" y="40" width="26" height="2"   rx="1"    fill="#C07B5A" opacity="0.22" />

          {/* Bookmark — Sage green */}
          <rect x="52" y="4" width="6" height="20" rx="1" fill="#9CAF88" opacity="0.8" />
          <polygon points="52,24 58,24 55,29" fill="#9CAF88" opacity="0.8" />
        </svg>
      </div>

      {/* ── Pulsing dots ── */}
      <div className="flex items-center gap-2.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#C07B5A",
              animation: `dotPulse 1.4s ease-in-out infinite ${delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Logo lockup — matches spec exactly ── */}
      <div className="flex flex-col items-center gap-1">
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', 'IBM Plex Sans Thai', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.06em",
            color: "#5C4033",
          }}
        >
          My Library
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', 'IBM Plex Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: "9px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#8B6F5E",
          }}
        >
          Reading Tracker
        </span>
      </div>

      {/* ── Keyframes injected inline (client component = works) ── */}
      <style>{`
        @keyframes bookFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }
        @keyframes pageTurn {
          0%   { transform: rotateY(0deg);   opacity: 1;   }
          50%  { transform: rotateY(-75deg); opacity: 0.15; }
          100% { transform: rotateY(0deg);   opacity: 1;   }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2;  transform: scale(0.75); }
          40%            { opacity: 1;    transform: scale(1);    }
        }
      `}</style>
    </div>
  )
}