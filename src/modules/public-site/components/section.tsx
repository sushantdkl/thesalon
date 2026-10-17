import type { ReactNode } from 'react';

type SectionTheme = 'light' | 'dark';

// One committed night-time look: "light" sits on the warm black walls, "dark" on the raised panel.
const themeStyles: Record<SectionTheme, string> = {
  light: 'bg-night',
  dark: 'bg-panel',
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  theme = 'light',
  hideHeader = false,
  className = '',
  id,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  theme?: SectionTheme;
  hideHeader?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 text-plaster md:py-24 lg:py-28 ${themeStyles[theme]} ${className}`}>
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-10">
        {!hideHeader ? (
          <div className="mb-10 grid items-end gap-5 md:mb-14 md:grid-cols-2 md:gap-16">
            <div>
              {eyebrow && eyebrow !== title ? <p className="mb-3 text-[0.95rem] tracking-[0.04em] text-brass">{eyebrow}</p> : null}
              <h2 className="text-balance font-display text-[clamp(2.1rem,4.4vw,3.2rem)] font-normal leading-[1.08]">{title}</h2>
            </div>
            {description ? <p className="max-w-[48ch] text-haze">{description}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
