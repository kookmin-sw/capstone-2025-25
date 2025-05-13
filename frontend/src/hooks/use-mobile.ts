import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const COMPACT_BREAKPOINT = 375;

export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCompact, setIsCompact] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsCompact(width < COMPACT_BREAKPOINT);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isCompact };
}
