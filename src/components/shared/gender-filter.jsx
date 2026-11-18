'use client';

import { Check } from 'lucide-react';

export const GENDER_OPTIONS = [
  ['all', 'All'],
  ['men', 'Men'],
  ['women', 'Women'],
];

/** True when a service belongs on the chosen side. Men / Women also show unisex services. */
export function matchesGender(service, gender) {
  const own = service?.gender || 'unisex';
  return gender === 'all' || own === 'unisex' || own === gender;
}

/** "Men" / "Women" tag for a service, or '' for unisex. */
export function genderLabel(service) {
  if (service?.gender === 'men') return 'Men';
  if (service?.gender === 'women') return 'Women';
  return '';
}

/** All / Men / Women segmented control used wherever staff pick services in the POS. */
export function GenderFilter({ value, onChange, className = '' }) {
  return (
    <div role="radiogroup" aria-label="Show services for" className={`inline-flex rounded-xl bg-stone-100 p-1 ${className}`}>
      {GENDER_OPTIONS.map(([option, label]) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-bold transition ${
              active ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {active ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {label}
          </button>
        );
      })}
    </div>
  );
}
