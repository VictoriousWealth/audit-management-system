export default function FourSquareServer() {
  return (
    <div className="inline-block text-4xl" aria-label="Loading" role="status">
      <style>{`
        .fs-box { display: inline-block; position: relative; width: 5.3033em; height: 5.3033em; }
        .fs-inner { position: absolute; inset: 0; margin: auto; width: 2.5em; height: 2.5em; transform: rotate(45deg); will-change: width, height; animation: fs-pulse 1s cubic-bezier(0.05, 0.28, 0.79, 0.98) infinite; }
        .fs-square { position: absolute; width: 1.25em; height: 1.25em; border-radius: 0.1875em; animation: fs-rotate 1s cubic-bezier(0.05, 0.28, 0.79, 0.98) both infinite, fs-color-a 2s ease-in-out infinite; background-color: var(--color-primary); border: 2px var(--color-background) solid;}
        .fs-1 { top: 0; left: 0; }
        .fs-2 { top: 0; right: 0; animation-name: fs-rotate, fs-color-b; }
        .fs-3 { bottom: 0; left: 0; animation-name: fs-rotate, fs-color-b; }
        .fs-4 { bottom: 0; right: 0; }
        @keyframes fs-pulse { 0%,10%,90%,100% { width: 2.5em; height: 2.5em; } 50% { width: 3.75em; height: 3.75em; } }
        @keyframes fs-rotate { 0%,10% { transform: rotateZ(0deg); } 50%,90%,100% { transform: rotateZ(90deg); } }
        @keyframes fs-color-a {
          0%, 50% { background-color: var(--color-primary); }
          50.01%, 100% { background-color: var(--color-accent); }
        }
        @keyframes fs-color-b {
          0%, 50% { background-color: var(--color-accent); }
          50.01%, 100% { background-color: var(--color-primary); }
        }
      `}</style>
      <span className="fs-box">
        <span className="fs-inner">
          <span className="fs-square fs-1" />
          <span className="fs-square fs-2" />
          <span className="fs-square fs-3" />
          <span className="fs-square fs-4" />
        </span>
      </span>
    </div>
  );
}
