import { useState, useEffect } from 'react';

/** Returns true when the browser is in print mode (Ctrl+P / window.print). */
export function usePrintMode() {
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('print');
    const handler = (e: MediaQueryListEvent) => setPrinting(e.matches);

    // Set initial value
    setPrinting(mql.matches);
    mql.addEventListener('change', handler);

    // Also listen for beforeprint/afterprint for broader browser support
    const onBefore = () => setPrinting(true);
    const onAfter = () => setPrinting(false);
    window.addEventListener('beforeprint', onBefore);
    window.addEventListener('afterprint', onAfter);

    return () => {
      mql.removeEventListener('change', handler);
      window.removeEventListener('beforeprint', onBefore);
      window.removeEventListener('afterprint', onAfter);
    };
  }, []);

  return printing;
}
