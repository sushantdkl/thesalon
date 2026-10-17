import Link from 'next/link';
import { SiteShell } from '@/modules/public-site/components/site-shell';
import { PageHero } from '@/modules/public-site/components/page-hero';
import { Section } from '@/modules/public-site/components/section';
import { StaffCard } from '@/modules/public-site/components/cards';
import { getSiteContext, staticPageMetadata } from '@/modules/public-site/services/seo';
import type { PublicStaffMember } from '@/modules/public-site/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return staticPageMetadata(await getSiteContext(), '/staff');
}

export default async function StaffPage() {
  const context = await getSiteContext();
  const { cms } = context;
  const section = cms.sections.staff;
  return (
    <SiteShell>
      <PageHero
        breadcrumbs={[{ name: 'Team', href: '/staff' }]}
        eyebrow={section.subtitle || 'Team'}
        title="Meet the team"
        description={section.description || 'The stylists, barbers and makeup artists at The Salon & Glam Studio.'}
        imageUrl={section.imageUrl || context.info.assets.about}
      />
      <Section hideHeader className="!py-10 md:!py-14">
        {!cms.staff.length ? (
          <p className="max-w-[48ch] text-haze">Team profiles are coming soon. Book a visit and we will match you with the right stylist or makeup artist.</p>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cms.staff.map((member: PublicStaffMember) => (
            <StaffCard key={member.name} member={member} variant="profile" tone="light" />
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center bg-glow min-h-11 rounded-full px-6 py-3.5 text-[0.95rem] font-medium text-cinder transition-colors duration-300 hover:bg-glow-hi"
          >
            Book with our team
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
