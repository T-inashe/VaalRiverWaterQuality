import React, { ReactNode, CSSProperties } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) => {
  const auroraStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(120deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981)',
    backgroundSize: '300% 300%',
    animation: 'aurora-shift 15s ease infinite',
    opacity: 0.3,
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <style>{`
        @keyframes aurora-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div style={auroraStyle}></div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};
