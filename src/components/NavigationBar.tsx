import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Workspace', href: '#workspace' },
  { label: 'Topology', href: '#topology' },
  { label: 'Isolation', href: '#isolation' },
  { label: 'Audit', href: '#audit' },
];

export function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-[hsl(210_20%_4%_/_0.85)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[hsl(185_85%_50%_/_0.3)] bg-[hsl(185_85%_50%_/_0.05)]">
            <span className="font-mono text-sm font-bold text-[hsl(185_85%_50%)]">
              H
            </span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-white">
              HRIDAY
            </span>
            <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
              Sovereign Intelligence
            </span>
          </div>
        </a>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[hsl(160_70%_42%)] animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            System Active
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
