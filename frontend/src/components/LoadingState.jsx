import { useState, useEffect } from 'react';

const STEPS = [
  { id: 'init', label: 'Initializing headless browsers…' },
  { id: 'lazada', label: 'Searching Lazada Philippines…' },
  { id: 'shopee', label: 'Searching Shopee Philippines…' },
  { id: 'parse', label: 'Parsing and sorting results…' },
];

export default function LoadingState({ query }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    const timings = [1200, 2800, 4500];
    const timers = timings.map((t, i) =>
      setTimeout(() => setStepIndex(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, [query]);

  return (
    <div className="loading-wrap">
      <div className="loading-orbs">
        <div className="loading-orb" />
        <div className="loading-orb" />
        <div className="loading-orb" />
      </div>
      <p className="loading-text">
        Comparing prices for &quot;<strong>{query}</strong>&quot;
      </p>
      <div className="loading-steps">
        {STEPS.map((step, i) => {
          const state = i < stepIndex ? 'done' : i === stepIndex ? 'active' : '';
          return (
            <div key={step.id} className={`loading-step ${state}`}>
              <div className="loading-step-dot" />
              {i < stepIndex ? '✓ ' : ''}{step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
