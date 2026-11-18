'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StaffCard } from './cards';
import { CmsImage } from './cms-image';
import type { PublicStaffMember } from '../types';

/** Round photo (or initial) with name and role, the "Circles" team layout. */
function StaffCircle({ member }: { member: PublicStaffMember }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-full border border-glow/30 bg-panel shadow-[0_0_40px_rgba(240,169,75,0.08)]">
        {member.image ? (
          <CmsImage src={member.image} alt={`${member.name} at The Salon`} fill sizes="150px" className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-5xl font-light text-brass" aria-hidden="true">
            {member.name.charAt(0)}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl font-light leading-tight text-plaster">{member.name}</h3>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">{member.role}</p>
    </div>
  );
}

export function StaffCarousel({
  staff,
  tone = 'dark',
  variant = 'cards',
}: {
  staff: PublicStaffMember[];
  tone?: 'light' | 'dark';
  /** 'cards' = large profile cards; 'circles' = round photos, several in view at once. */
  variant?: 'cards' | 'circles';
}) {
  const circles = variant === 'circles';
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>('[data-staff-card]');
    const cardWidth = card?.offsetWidth ?? 360;
    const gap = window.matchMedia('(min-width: 768px)').matches ? 24 : 20;

    container.scrollBy({
      left: direction === 'left' ? -(cardWidth + gap) : cardWidth + gap,
      behavior: 'smooth',
    });
  };

  const arrowClass =
    tone === 'dark'
      ? 'border border-plaster/20 bg-night/90 text-plaster backdrop-blur-sm hover:border-glow/60 hover:text-glow'
      : 'border border-line bg-panel/95 text-plaster backdrop-blur-sm hover:border-brass/60 hover:text-glow';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll('left')}
        aria-label="Previous staff member"
        className={`absolute left-0 ${circles ? 'top-[75px]' : 'top-[calc(50%-3rem)]'} z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center transition-colors duration-300 md:h-11 md:w-11 ${arrowClass}`}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <div
        ref={scrollRef}
        className="-mx-6 flex gap-5 overflow-x-auto px-14 pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 md:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {staff.map((member) => (
          <div
            key={member.id ?? member.name}
            data-staff-card
            className={circles
              ? 'w-[150px] shrink-0 snap-start sm:w-[170px] lg:w-[190px]'
              : 'w-[min(72vw,420px)] shrink-0 snap-start sm:w-[360px] md:w-[400px] lg:w-[420px]'}
          >
            {circles ? <StaffCircle member={member} /> : <StaffCard member={member} variant="profile" tone={tone} layout="scroll" />}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        aria-label="Next staff member"
        className={`absolute right-0 ${circles ? 'top-[75px]' : 'top-[calc(50%-3rem)]'} z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center transition-colors duration-300 md:h-11 md:w-11 ${arrowClass}`}
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
