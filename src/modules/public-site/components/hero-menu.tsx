'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type HeroMenuRow = { name: string; note: string; href: string; action: string };
export type HeroMenuTab = { id: string; label: string; rows: HeroMenuRow[]; more: { label: string; href: string } };

/**
 * The home page menu card: one switch between the men's and women's menus, each row one tap
 * from booking (men) or the service's detail page (women).
 */
export function HeroMenu({ tabs }: { tabs: HeroMenuTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((item) => item.id === active) || tabs[0];
  const index = tabs.indexOf(tab);

  return (
    <section aria-label="Services menu" className="relative min-w-0 rounded-[24px] border border-glow/20 bg-panel/85 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div role="tablist" aria-label="Choose a menu" className="relative grid grid-cols-2 rounded-[18px] bg-night/70 p-1">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[14px] bg-glow transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`menu-tab-${item.id}`}
            aria-selected={item.id === tab.id}
            aria-controls={`menu-panel-${item.id}`}
            onClick={() => setActive(item.id)}
            className={`relative z-10 min-h-11 rounded-[14px] text-[0.8rem] font-medium uppercase tracking-[0.2em] transition-colors ${item.id === tab.id ? 'text-cinder' : 'text-haze hover:text-plaster'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`menu-panel-${tab.id}`} aria-labelledby={`menu-tab-${tab.id}`} className="px-3 pb-2 pt-3 sm:px-4">
        <ul>
          {tab.rows.map((row) => (
            <li key={row.name} className="border-b border-line/70 last:border-b-0">
              <Link href={row.href} className="group flex min-h-[58px] items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[1.15rem] leading-tight text-plaster">{row.name}</span>
                  <span className="block truncate text-[0.82rem] tabular-nums text-brass">{row.note}</span>
                </span>
                <span className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-glow/40 px-3.5 text-[0.78rem] font-medium uppercase tracking-[0.12em] text-plaster transition group-hover:border-glow group-hover:bg-glow group-hover:text-cinder">
                  {row.action}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={tab.more.href} className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-[14px] text-[0.9rem] text-brass transition hover:text-glow">
          {tab.more.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
