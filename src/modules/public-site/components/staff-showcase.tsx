import { StaffCarousel } from './staff-carousel';
import { StaffCard } from './cards';
import type { PublicStaffMember } from '../types';

/** Home-page team layouts, chosen in Website CMS → Staff → "Team layout". */
export const TEAM_LAYOUTS = ['carousel', 'grid', 'circles'] as const;
export type TeamLayout = (typeof TEAM_LAYOUTS)[number];

export function teamLayoutOf(value: unknown): TeamLayout {
  return TEAM_LAYOUTS.includes(value as TeamLayout) ? (value as TeamLayout) : 'carousel';
}

export function StaffShowcase({ staff, layout }: { staff: PublicStaffMember[]; layout: TeamLayout }) {
  if (layout === 'grid') {
    return (
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {staff.map((member) => (
          <li key={member.id ?? member.name}>
            <StaffCard member={member} variant="profile" tone="dark" layout="grid" />
          </li>
        ))}
      </ul>
    );
  }

  if (layout === 'circles') return <StaffCarousel staff={staff} tone="dark" variant="circles" />;

  return <StaffCarousel staff={staff} tone="dark" />;
}
