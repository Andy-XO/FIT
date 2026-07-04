import React, { useCallback, useEffect, useRef, useState } from 'react';
import World from './three/World';
import Overlay from './Overlay';
import Tracker from './components/tracker/Tracker';
import { SECTIONS } from './data/sections';
import { useChecklist } from './hooks/useChecklist';

/* Keeps a WebGL failure from blanking the whole page - the content still works. */
class WorldBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return <div className="fixed inset-0 -z-0" style={{ background: 'radial-gradient(circle at 50% 30%, #0c2a20, #05100c 70%)' }} />;
    }
    return this.props.children;
  }
}

export default function App() {
  const scrollRef = useRef({ progress: 0, mx: 0, my: 0 });
  const barRef = useRef(null);
  const sectionEls = useRef([]);
  const [active, setActive] = useState(0);
  const checklistApi = useChecklist();

  const setRef = useCallback(
    (i) => (el) => {
      sectionEls.current[i] = el;
    },
    []
  );

  // scroll → progress (for 3D + progress bar) and active section (for nav)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      // Progress bar tracks raw scroll distance.
      const rawP = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${rawP})`;

      // Camera is driven by a CONTINUOUS section index, computed from the real
      // section centers - robust to sections having different heights.
      const mid = window.scrollY + window.innerHeight / 2;
      const centers = sectionEls.current.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : null));
      const last = centers.length - 1;
      let coord = 0;
      if (centers[0] == null || mid <= centers[0]) {
        coord = 0;
      } else if (mid >= centers[last]) {
        coord = last;
      } else {
        for (let i = 0; i < last; i++) {
          if (centers[i] != null && centers[i + 1] != null && mid >= centers[i] && mid <= centers[i + 1]) {
            coord = i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
        }
      }
      scrollRef.current.coord = coord;
      scrollRef.current.progress = last > 0 ? coord / last : 0;

      const idx = Math.round(coord);
      setActive((a) => (a === idx ? a : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onMove = (e) => {
      scrollRef.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
      scrollRef.current.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onMove, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i) => sectionEls.current[i]?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <WorldBoundary>
        <World scrollRef={scrollRef} completion={checklistApi.completion} />
      </WorldBoundary>

      {/* top scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-20 h-[3px] bg-transparent">
        <div
          ref={barRef}
          className="h-full origin-left"
          style={{ background: 'linear-gradient(90deg,#2f5d50,#3ddc97,#5eead4)', transform: 'scaleX(0)' }}
        />
      </div>

      {/* side navigation dots */}
      <nav className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={s.label}
            className="group flex items-center gap-2 justify-end"
          >
            <span
              className={`mono text-[10px] uppercase tracking-wider transition-all ${
                active === i ? 'text-emerald2 opacity-100' : 'text-ink/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              {s.label}
            </span>
            <span
              className="rounded-full transition-all"
              style={{
                width: active === i ? 11 : 7,
                height: active === i ? 11 : 7,
                background: active === i ? '#3ddc97' : 'rgba(223,238,230,0.35)',
                boxShadow: active === i ? '0 0 12px #3ddc97' : 'none',
              }}
            />
          </button>
        ))}
      </nav>

      <Overlay setRef={setRef} checklistApi={checklistApi} />

      <Tracker />
    </>
  );
}
