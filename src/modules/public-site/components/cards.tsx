import { CmsImage } from './cms-image';
import type { PublicPackage, PublicService, PublicStaffMember } from '../types';

export function ServiceCard({
  service,
  variant = 'card',
  compact = false,
  hideCategory = false,
  tone = 'dark',
}: {
  service: PublicService;
  variant?: 'card' | 'menu';
  compact?: boolean;
  hideCategory?: boolean;
  tone?: 'light' | 'dark';
}) {
  if (variant === 'menu') {
    const isLight = tone === 'light';

    return (
      <article
        className={`group grid last:border-b-0 md:grid-cols-[1fr_auto] md:items-center ${
          isLight ? 'border-b border-line' : 'border-b border-plaster/10'
        } ${compact ? 'gap-2 py-3' : 'gap-5 py-7 md:items-start'}`}
      >
        <div className="min-w-0">
          {!hideCategory ? (
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                isLight ? 'text-brass' : 'text-brass'
              }`}
            >
              {service.category}
            </p>
          ) : null}
          <h3
            className={`font-display font-light tracking-tight ${
              isLight ? 'text-plaster' : 'text-plaster'
            } ${
              compact
                ? `${hideCategory ? '' : 'mt-1 '}text-base md:text-lg`
                : 'mt-2 text-xl md:text-2xl'
            }`}
          >
            {service.name}
          </h3>
          {!compact ? (
            <p
              className={`mt-3 max-w-md text-sm font-light leading-relaxed ${
                isLight ? 'text-haze' : 'text-plaster/60'
              }`}
            >
              {service.description}
            </p>
          ) : null}
          {service.duration ? (
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${
                isLight ? 'text-haze' : 'text-plaster/40'
              } ${compact ? 'mt-1' : 'mt-3'}`}
            >
              {service.duration} min
            </p>
          ) : null}
        </div>
        <p
          className={`shrink-0 font-display ${
            isLight ? 'text-brass' : 'text-brass'
          } ${compact ? 'text-sm md:text-right' : 'text-lg md:text-right md:text-xl'}`}
        >
          {service.priceLabel}
        </p>
      </article>
    );
  }

  return (
    <article className="overflow-hidden border border-line bg-panel">
      {service.image ? (
        <div className="relative aspect-[4/3] bg-panel">
          <CmsImage src={service.image} alt={`${service.name} at The Salon`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-haze">{service.category}</p>
            <h3 className="mt-2 font-display text-lg font-light text-plaster">{service.name}</h3>
          </div>
          <p className="shrink-0 border border-line bg-panel-2 px-3 py-1 text-sm font-medium text-plaster">{service.priceLabel}</p>
        </div>
        <p className="mt-4 text-sm leading-6 text-haze">{service.description}</p>
        {service.duration ? <p className="mt-3 text-xs font-semibold text-haze">{service.duration} min</p> : null}
      </div>
    </article>
  );
}

export function PackageCard({
  item,
  variant = 'card',
  featured = false,
}: {
  item: PublicPackage;
  variant?: 'card' | 'tier';
  featured?: boolean;
}) {
  if (variant === 'tier') {
    return (
      <article
        className={`relative flex h-full flex-col border p-7 md:p-8 ${
          featured
            ? 'border-glow bg-panel shadow-[0_8px_30px_rgba(155,116,45,0.08)] ring-1 ring-glow/30'
            : 'border-line bg-panel text-plaster'
        }`}
      >
        <div className={`absolute left-0 top-0 h-1 w-full ${featured ? 'bg-glow' : 'bg-line'}`} />
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${featured ? 'text-brass' : 'text-haze'}`}>
          Package
        </p>
        <h3 className="mt-4 font-display text-2xl font-light tracking-tight text-plaster md:text-3xl">{item.name}</h3>
        <p className={`mt-5 font-display text-4xl font-light tracking-tight ${featured ? 'text-brass' : 'text-plaster'}`}>
          Rs. {item.price}
        </p>
        <p className="mt-4 text-sm font-light leading-relaxed text-haze">{item.description}</p>
        <ul className="mt-8 flex-1 space-y-3 border-t border-line pt-6 text-sm">
          {item.includes.map((service) => (
            <li key={service} className="flex items-start gap-3 text-plaster/85">
              <span className={`mt-2 h-1 w-1 shrink-0 ${featured ? 'bg-glow' : 'bg-brass'}`} />
              <span className="font-light">{service}</span>
            </li>
          ))}
        </ul>
      </article>
    );
  }

  return (
    <article className="border border-line bg-panel p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-haze">Package</p>
      <h3 className="mt-2 font-display text-2xl font-light text-plaster">{item.name}</h3>
      <p className="mt-2 font-display text-3xl font-light text-plaster">Rs. {item.price}</p>
      <p className="mt-3 text-sm leading-6 text-haze">{item.description}</p>
      <ul className="mt-5 grid gap-2 text-sm text-plaster/85">
        {item.includes.map((service) => <li key={service}>- {service}</li>)}
      </ul>
    </article>
  );
}

export function StaffCard({
  member,
  variant = 'card',
  tone = 'light',
  layout = 'grid',
}: {
  member: PublicStaffMember;
  variant?: 'card' | 'profile';
  tone?: 'light' | 'dark';
  layout?: 'grid' | 'scroll';
}) {
  if (variant === 'profile') {
    const imageAspect = layout === 'scroll' ? 'aspect-[3/2]' : 'aspect-[5/6]';
    const imageSizes = layout === 'scroll' ? '420px' : '(min-width: 1024px) 25vw, 50vw';

    if (tone === 'dark') {
      return (
        <article className="group flex h-full flex-col border border-plaster/10 bg-night">
          <div className={`relative ${imageAspect} overflow-hidden bg-panel`}>
            {member.image ? (
              <CmsImage
                src={member.image}
                alt={`${member.name} at The Salon`}
                fill
                sizes={imageSizes}
                className="object-cover opacity-85 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-5xl font-light text-brass">
                {member.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/10 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">{member.role}</p>
            <h3 className="mt-2 font-display text-2xl font-light tracking-tight text-plaster">{member.name}</h3>
            {member.bio ? (
              <p className="mt-3 line-clamp-3 text-sm font-light leading-relaxed text-plaster/60">{member.bio}</p>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {member.specialties.map((item) => (
                <span
                  key={item}
                  className="border border-plaster/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-plaster/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </article>
      );
    }

    return (
      <article className="group flex h-full flex-col overflow-hidden border border-line bg-panel transition-shadow duration-300 hover:shadow-md">
        <div className={`relative ${imageAspect} overflow-hidden bg-panel-2`}>
          {member.image ? (
            <CmsImage
              src={member.image}
              alt={`${member.name} at The Salon`}
              fill
              sizes={imageSizes}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-panel-2 font-display text-5xl font-light text-brass">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brass">{member.role}</p>
          <h3 className="mt-2 font-display text-xl font-light tracking-tight text-plaster md:text-2xl">{member.name}</h3>
          {member.bio ? (
            <p className="mt-3 line-clamp-3 text-sm font-light leading-relaxed text-haze">{member.bio}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {member.specialties.map((item) => (
              <span
                key={item}
                className="border border-line bg-panel-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-haze"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="border border-line bg-panel p-6">
      {member.image ? (
        <div className="relative h-16 w-16 overflow-hidden bg-panel">
          <CmsImage src={member.image} alt={`${member.name} at The Salon`} fill sizes="64px" className="object-cover" />
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center bg-glow font-display text-xl font-light text-cinder">
          {member.name.charAt(0)}
        </div>
      )}
      <h3 className="mt-5 font-display text-xl font-light text-plaster">{member.name}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-haze">{member.role}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {member.specialties.map((item) => (
          <span key={item} className="border border-line bg-panel-2 px-3 py-1 text-xs font-medium text-haze">
            {item}
          </span>
        ))}
      </div>
      {member.bio ? <p className="mt-4 text-sm leading-6 text-haze">{member.bio}</p> : null}
    </article>
  );
}
